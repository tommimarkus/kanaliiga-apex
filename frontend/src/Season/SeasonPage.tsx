import React, { type ReactElement, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'

import axios from 'axios'
import { DateTime } from 'luxon'

import './SeasonPage.scss'
import BasePage from '../Base/BasePage'
import { type MatchOutputOneData } from '../interface/match/match-output-one.interface'
import { type MatchResultOutputData } from '../interface/match/match-result-output.interface'
import { type MatchResultTeamMemberOutputData } from '../interface/match/match-result-team-member-output.interface'
import { type SeasonOutputOneData } from '../interface/season/season-output-one.interface'
import { type TournamentOutputOneData } from '../interface/tournament/tournament-output-one.interface'
import Table, { type Column } from '../Table/Table'
import { baseUrl, sortDateStrings } from '../utils'

function SeasonPage (): ReactElement {
  const { id } = useParams()

  const query = new URLSearchParams(useLocation().search)
  const stream = query.has('stream')

  const [data, setData] = useState<SeasonOutputOneData | undefined>()

  useEffect(() => {
    if (typeof id === 'string') {
      const entrypoint = `${baseUrl}/season/${id}`
      axios.get<SeasonOutputOneData>(entrypoint)
        .then((response) => {
          setData(response.data)
        })
        .catch((reason: any) => {
          console.error('Failed to fetch season data\n\n%s', reason)
        })
    }
    return () => { }
  }, [id])

  type ColumnData = Omit<MatchResultOutputData, 'teamMembers'> & {
    order: number
  }

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

  const name = data?.name
  const start =
    typeof data?.start === 'string'
      ? DateTime.fromISO(data.start).toLocaleString({
        month: '2-digit',
        day: '2-digit'
      })
      : ''
  const end = typeof data?.end === 'string'
    ? DateTime.fromISO(data.end).toLocaleString({
      month: '2-digit',
      day: '2-digit'
    })
    : undefined

  const dataValidMatches = data?.tournaments
    ?.flatMap((tournament) =>
      tournament.groups.flatMap((group) => group.matches)
    )
    ?.filter(
      (match): match is MatchOutputOneData =>
        match.results !== undefined &&
        match.results !== null &&
        match.results.length > 0
    )

  const matchResults: MatchResultOutputData[] = []

  if ((dataValidMatches != null) && dataValidMatches.length > 0) {
    dataValidMatches.forEach((value) => {
      value.results.forEach((currData) => {
        const prevDataIndex = matchResults.findIndex(
          (existingResult) => existingResult.teamNum === currData.teamNum
        )
        if (prevDataIndex === -1) {
          matchResults.push({ ...currData })
        } else {
          const prevData = matchResults[prevDataIndex]
          prevData.teamDamage += currData.teamDamage
          prevData.teamKills += currData.teamKills
          prevData.teamPoints += currData.teamPoints
          prevData.teamPlacement = Math.min(
            prevData.teamPlacement,
            currData.teamPlacement
          )
        }
      })
    })
  }

  matchResults.sort((a: MatchResultOutputData, b: MatchResultOutputData) => {
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

  const dataMatches = matchResults.map((value, index) => {
    const columnData: ColumnData = {
      teamDamage: value.teamDamage,
      teamKills: value.teamKills,
      teamName: value.teamName,
      teamNum: value.teamNum,
      teamPlacement: value.teamPlacement,
      teamPoints: value.teamPoints,
      order: index + 1
    }
    return columnData
  })

  const top = 5

  const dataValidPlayer = data?.tournaments
    ?.flatMap((tournament) =>
      tournament.groups.flatMap((group) => group.matches)
    )
    ?.filter(
      (match): match is MatchOutputOneData =>
        match.results !== undefined &&
        match.results !== null &&
        match.results.length > 0
    )
  const dataPlayer: MatchResultTeamMemberOutputData[] | undefined =
    (dataValidPlayer != null) && dataValidPlayer.length > 0
      ? dataValidPlayer
        .map((match) =>
          match.results?.flatMap((result) => result.teamMembers)
        )
        .reduce((prev: MatchResultTeamMemberOutputData[], curr) =>
          prev.map((prevData) => {
            const currData = curr.find(
              (existingData) => existingData.name === prevData.name
            )
            return {
              name: prevData.name,
              damage: prevData.damage + (typeof currData?.damage === 'number' ? currData?.damage : 0),
              kills: prevData.kills + (typeof currData?.kills === 'number' ? currData?.kills : 0),
              assists: prevData.assists + (typeof currData?.assists === 'number' ? currData?.assists : 0),
              survivalTime:
                prevData.survivalTime + (typeof currData?.survivalTime === 'number' ? currData?.survivalTime : 0)
            }
          })
        )
      : undefined

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

  const subtitles = [name, `${start}${typeof end === 'string' ? ` - ${end}` : ''}`].filter(
    (v): v is string => typeof v === 'string'
  )

  return (
    <BasePage subtitles={subtitles} title="Season">
      <div className="right-column">
        <div className="column-content">
          <div>
            <Table columns={columnsMatch} data={dataMatches} />
          </div>
          {(dataPlayerKills != null) && (dataPlayerDamage != null) && (dataPlayerAssists != null) && (
            <div className="player-tables">
              <Table columns={columnsPlayerKills} data={dataPlayerKills} />
              <Table columns={columnsPlayerDamage} data={dataPlayerDamage} />
              <Table
                columns={columnsPlayerAssists}
                data={dataPlayerAssists}
              />
            </div>
          )}
          {!stream && (
            <div className="subset-navigation-links">
              <div className="item">
                <div>Tournaments:</div>
                {data?.tournaments
                  ?.sort(
                    (
                      a: TournamentOutputOneData,
                      b: TournamentOutputOneData
                    ) => sortDateStrings(a.start, b.start)
                  )
                  ?.map((tournament, index) => (
                    <div
                      className="list"
                      key={`tournament${typeof tournament?.id === 'number' ? tournament?.id : index}`}
                    >
                      {typeof tournament?.id === 'number' && (
                        <a href={`/tournament/${tournament.id}`}>
                          {index + 1}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
              <div className="item end">
                <a href="/season/">Recent Seasons</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </BasePage>
  )
}

export default SeasonPage
