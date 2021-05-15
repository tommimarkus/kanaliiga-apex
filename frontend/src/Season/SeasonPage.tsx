import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps, useLocation } from '@reach/router';
import axios from 'axios';
import { DateTime } from 'luxon';

import './SeasonPage.scss';
import BasePage from '../Base/BasePage';
import { MatchOutputOneData } from '../interface/match/match-output-one.interface';
import { MatchResultOutputData } from '../interface/match/match-result-output.interface';
import { MatchResultTeamMemberOutputData } from '../interface/match/match-result-team-member-output.interface';
import { SeasonOutputOneData } from '../interface/season/season-output-one.interface';
import { TournamentOutputOneData } from '../interface/tournament/tournament-output-one.interface';
import Table, { Column } from '../Table/Table';
import Utils from '../utils';

export interface SeasonPageProps extends RouteComponentProps {
  id?: string;
}

const SeasonPage = (props: SeasonPageProps): ReactElement => {
  const { id } = props;

  const query = new URLSearchParams(useLocation().search);
  const stream = query.has('stream');

  const [data, setData] = useState<SeasonOutputOneData | undefined>();

  useEffect(() => {
    if (id) {
      const entrypoint = `${Utils.baseUrl}/season/${id}`;
      // eslint-disable-next-line no-console
      console.log(entrypoint);
      axios.get<SeasonOutputOneData>(entrypoint).then((response) => {
        setData(response.data);
      });
    }
    return () => {};
  }, [id]);

  type ColumnData = MatchResultOutputData & { order: number };

  const columnsMatch: Array<Column<ColumnData, keyof ColumnData>> = [
    {
      key: 'order',
      header: '#',
    },
    {
      key: 'teamName',
      header: 'Name',
    },
    {
      key: 'teamKills',
      header: 'Kills',
    },
    {
      key: 'teamPoints',
      header: 'Points',
    },
    {
      key: 'teamDamage',
      header: 'Damage',
    },
  ];

  const name = data?.name;
  const start = data?.start && DateTime.fromISO(data.start).toLocaleString({ month: '2-digit', day: '2-digit' }) || '';
  const end = data?.end && DateTime.fromISO(data.end).toLocaleString() || '';

  const dataValidMatches = data?.tournaments
    ?.flatMap((tournament) =>
      tournament.groups.flatMap((group) => group.matches)
    )
    ?.filter(
      (match): match is MatchOutputOneData =>
        match.results !== undefined &&
        match.results !== null &&
        match.results.length > 0
    );
  const dataMatches =
    dataValidMatches && dataValidMatches.length > 0
      ? dataValidMatches
          .map((value) => value.results)
          .reduce((prev: MatchResultOutputData[], curr) =>
            prev.map((prevData) => {
              const currData = curr.find(
                (existingData) => existingData.teamNum === prevData.teamNum
              );
              return {
                teamNum: prevData.teamNum,
                teamName: prevData.teamName,
                teamDamage: prevData.teamDamage + (currData?.teamDamage || 0),
                teamKills: prevData.teamKills + (currData?.teamKills || 0),
                teamPoints: prevData.teamPoints + (currData?.teamPoints || 0),
              } as MatchResultOutputData;
            })
          )
          .sort((a: MatchResultOutputData, b: MatchResultOutputData) => {
            const points = b.teamPoints - a.teamPoints;
            if (points === 0) {
              const kills = b.teamKills - a.teamKills;
              if (kills === 0) {
                return b.teamDamage - a.teamDamage;
              }
              return kills;
            }
            return points;
          })
          .map((value, index) => ({ ...value, order: index + 1 } as ColumnData))
      : undefined;

  const top = 5;

  const dataValidPlayer = data?.tournaments
    ?.flatMap((tournament) =>
      tournament.groups.flatMap((group) => group.matches)
    )
    ?.filter(
      (match): match is MatchOutputOneData =>
        match.results !== undefined &&
        match.results !== null &&
        match.results.length > 0
    );
  const dataPlayer =
    dataValidPlayer && dataValidPlayer.length > 0
      ? dataValidPlayer
          .map((match) =>
            match.results?.flatMap((result) => result.teamMembers)
          )
          .reduce((prev: MatchResultTeamMemberOutputData[], curr) =>
            prev.map((prevData) => {
              const currData = curr.find(
                (existingData) => existingData.name === prevData.name
              );
              return {
                name: prevData.name,
                damage: prevData.damage + (currData?.damage || 0),
                kills: prevData.kills + (currData?.kills || 0),
                assists: prevData.assists + (currData?.assists || 0),
                survivalTime:
                  prevData.survivalTime + (currData?.survivalTime || 0),
              } as MatchResultTeamMemberOutputData;
            })
          )
      : undefined;

  const columnsPlayerKills: Array<
    Column<
      MatchResultTeamMemberOutputData,
      keyof MatchResultTeamMemberOutputData
    >
  > = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'kills',
      header: 'Kills',
    },
  ];

  const columnsPlayerDamage: Array<
    Column<
      MatchResultTeamMemberOutputData,
      keyof MatchResultTeamMemberOutputData
    >
  > = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'damage',
      header: 'Damage',
    },
  ];

  const columnsPlayerAssists: Array<
    Column<
      MatchResultTeamMemberOutputData,
      keyof MatchResultTeamMemberOutputData
    >
  > = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'assists',
      header: 'Assists',
    },
  ];

  const dataPlayerKills = dataPlayer
    ?.sort(
      (
        a: MatchResultTeamMemberOutputData,
        b: MatchResultTeamMemberOutputData
      ) => {
        const kills = b.kills - a.kills;
        if (kills === 0) {
          return b.damage - a.damage;
        }
        return kills;
      }
    )
    ?.slice(0, top);

  const dataPlayerDamage = dataPlayer
    ?.sort(
      (
        a: MatchResultTeamMemberOutputData,
        b: MatchResultTeamMemberOutputData
      ) => {
        const damage = b.damage - a.damage;
        if (damage === 0) {
          return b.kills - a.kills;
        }
        return damage;
      }
    )
    ?.slice(0, top);

  const dataPlayerAssists = dataPlayer
    ?.sort(
      (
        a: MatchResultTeamMemberOutputData,
        b: MatchResultTeamMemberOutputData
      ) => {
        const assists = b.assists - a.assists;
        if (assists === 0) {
          return b.damage - a.damage;
        }
        return assists;
      }
    )
    ?.slice(0, top);

  const subtitles = [
    name,
    `${start}${end && ` - ${end}` || ''}`,
  ].filter(
    (v): v is string => typeof v === 'string'
  );

  return (
    <BasePage subtitles={subtitles} title="Season">
      {dataMatches && (
        <div className="right-column">
          <div className="column-content">
            <div>
              <Table columns={columnsMatch} data={dataMatches} />
            </div>
            {dataPlayerKills && dataPlayerDamage && dataPlayerAssists && (
              <div className="player-tables">
                <Table columns={columnsPlayerKills} data={dataPlayerKills} />
                <Table columns={columnsPlayerDamage} data={dataPlayerDamage} />
                <Table
                  columns={columnsPlayerAssists}
                  data={dataPlayerAssists}
                />
              </div>
            )}
            {stream !== true && (
              <div className="subset-navigation-links">
                <div className="item">
                  <div>Tournaments:</div>
                  {data?.tournaments
                    ?.sort(
                      (
                        a: TournamentOutputOneData,
                        b: TournamentOutputOneData
                      ) => Utils.sortDateStrings(a.start, b.start)
                    )
                    ?.map((tournament, index) => (
                      <div
                        className="list"
                        key={`tournament${tournament?.id || index}`}
                      >
                        {tournament?.id && (
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
      )}
    </BasePage>
  );
};

export default SeasonPage;
