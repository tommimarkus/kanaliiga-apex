import React, { type ReactElement, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'

import axios from 'axios'
import { DateTime } from 'luxon'

import BasePage from '../Base/BasePage'
import { type MatchOutputOneData } from '../interface/match/match-output-one.interface'
import { type MatchResultOutputData } from '../interface/match/match-result-output.interface'
import { type MatchResultTeamMemberOutputData } from '../interface/match/match-result-team-member-output.interface'
import { type TournamentOutputOneData } from '../interface/tournament/tournament-output-one.interface'
import Table, { type Column } from '../Table/Table'
import { baseUrl, sortDateStrings } from '../utils'
import './MatchPage.scss'

function MatchPage (): ReactElement {
  const { id } = useParams()

  const query = new URLSearchParams(useLocation().search)
  const stream = query.has('stream')

  const [data, setData] = useState<MatchOutputOneData | undefined>()

  const [tournamentData, setTournamentData] =
    useState<TournamentOutputOneData | undefined>()
  const groupsMatches = tournamentData?.groups?.flatMap(
    (group) => group.matches
  )

  const dataValidMatches = groupsMatches
    ?.filter(
      (match): match is MatchOutputOneData =>
        match.results !== undefined &&
        match.results !== null &&
        match.results.length > 0
    )
    ?.sort((a: MatchOutputOneData, b: MatchOutputOneData) =>
      sortDateStrings(a.start, b.start)
    )

  useEffect(() => {
    const id = data?.group?.tournament?.id
    if (typeof id === 'number') {
      const entrypoint = `${baseUrl}/tournament/${id}`
      axios.get<TournamentOutputOneData>(entrypoint)
        .then((response) => {
          setTournamentData(response.data)
        })
        .catch((reason: any) => {
          console.error('Failed to fetch tournament data\n\n%s', reason)
        })
    }
    return () => {}
  }, [data?.group?.tournament?.id])

  useEffect(() => {
    if (typeof id === 'string') {
      axios
        .get<MatchOutputOneData>(`${baseUrl}/match/${id}`)
        .then((response) => {
          setData(response.data)
        })
        .catch((reason: any) => {
          console.error('Failed to fetch match data\n\n%s', reason)
        })
    }
    return () => {}
  }, [id])

  type ColumnData = MatchResultOutputData & { order: number }

  const columnsMatch: Array<Column<ColumnData, keyof ColumnData>> = [
    {
      key: 'order',
      header: '#'
    },
    {
      key: 'teamName',
      header: 'Name'
    },
    {
      key: 'teamPlacement',
      header: 'Placement'
    },
    {
      key: 'teamKills',
      header: 'Kills'
    },
    {
      key: 'teamPoints',
      header: 'Points'
    },
    {
      key: 'teamDamage',
      header: 'Damage'
    }
  ]

  const startMatch = data?.start
  const dataMatch: ColumnData[] | undefined = data?.results
    ?.sort((a: MatchResultOutputData, b: MatchResultOutputData) => {
      const points = b.teamPoints - a.teamPoints
      if (points === 0) {
        const kills = b.teamKills - a.teamKills
        if (kills === 0) {
          return b.teamDamage - a.teamDamage
        }
        return kills
      }
      return points
    })
    ?.map((value, index) => ({ ...value, order: index + 1 }))

  const top = 5

  const dataPlayer = data?.results?.flatMap((result) => result.teamMembers)

  const columnsPlayerKills: Array<
  Column<
  MatchResultTeamMemberOutputData,
  keyof MatchResultTeamMemberOutputData
  >
  > = [
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'kills',
      header: 'Kills'
    }
  ]

  const columnsPlayerDamage: Array<
  Column<
  MatchResultTeamMemberOutputData,
  keyof MatchResultTeamMemberOutputData
  >
  > = [
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'damage',
      header: 'Damage'
    }
  ]

  const columnsPlayerAssists: Array<
  Column<
  MatchResultTeamMemberOutputData,
  keyof MatchResultTeamMemberOutputData
  >
  > = [
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'assists',
      header: 'Assists'
    }
  ]

  const dataPlayerKills = dataPlayer
    ?.sort(
      (
        a: MatchResultTeamMemberOutputData,
        b: MatchResultTeamMemberOutputData
      ) => {
        const kills = b.kills - a.kills
        if (kills === 0) {
          return b.damage - a.damage
        }
        return kills
      }
    )
    ?.slice(0, top)

  const dataPlayerDamage = dataPlayer
    ?.sort(
      (
        a: MatchResultTeamMemberOutputData,
        b: MatchResultTeamMemberOutputData
      ) => {
        const damage = b.damage - a.damage
        if (damage === 0) {
          return b.kills - a.kills
        }
        return damage
      }
    )
    ?.slice(0, top)

  const dataPlayerAssists = dataPlayer
    ?.sort(
      (
        a: MatchResultTeamMemberOutputData,
        b: MatchResultTeamMemberOutputData
      ) => {
        const assists = b.assists - a.assists
        if (assists === 0) {
          return b.damage - a.damage
        }
        return assists
      }
    )
    ?.slice(0, top)

  const currentMatchIndex = dataValidMatches?.findIndex(
    (value) => String(value.id) === id
  )
  const timeSubtitle = typeof startMatch === 'string'
    ? `Started ${DateTime.fromISO(startMatch).toLocaleString(
        DateTime.TIME_24_SIMPLE
      )}`
    : ''
  return (
    <BasePage
      subtitles={[typeof tournamentData?.name === 'string' ? tournamentData?.name : '', timeSubtitle]}
      title={
        currentMatchIndex !== undefined && currentMatchIndex >= 0
          ? `Match ${currentMatchIndex + 1}`
          : 'Match'
      }
    >
      {(dataMatch != null) && (
        <div className="column-content">
          <div className={`title-container ${stream ? 'stream' : ''}`}>
            <h1>
              {tournamentData?.name}
              {currentMatchIndex !== undefined &&
                `, Match ${currentMatchIndex + 1}`}
            </h1>
          </div>
          <div>
            <Table columns={columnsMatch} data={dataMatch} />
          </div>
          {(dataPlayerKills != null) && (dataPlayerDamage != null) && (dataPlayerAssists != null) && (
            <div className="player-tables">
              <Table columns={columnsPlayerKills} data={dataPlayerKills} />
              <Table columns={columnsPlayerDamage} data={dataPlayerDamage} />
              <Table columns={columnsPlayerAssists} data={dataPlayerAssists} />
            </div>
          )}
          {!stream && typeof data?.group?.tournament?.id === 'number' && (
            <div className="subset-navigation-links">
              <div className="item">
                <a href={`/tournament/${data?.group?.tournament.id}`}>
                  Back to Tournament
                </a>
              </div>
              <div className="item">
                <div>Matches:</div>
                {dataValidMatches?.map((match, index) => (
                  <div className="list" key={`match${typeof match?.id === 'number' ? match?.id : index}`}>
                    {typeof match?.id === 'number' && match?.id !== data.id && (
                      <a href={`/match/${match.id}`}>{index + 1}</a>
                    )}
                    {typeof match?.id === 'number' && match?.id === data.id && (
                      <span className="current-match">{index + 1}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="item end">
                <a href="/match/">Recent Matches</a>
              </div>
            </div>
          )}
        </div>
      )}
    </BasePage>
  )
}

export default MatchPage
