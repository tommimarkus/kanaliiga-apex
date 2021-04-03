import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { formatISO } from 'date-fns';

import './TournamentPage.scss';
import BasePage from '../Base/BasePage';
import {
  MatchOutputData,
  MatchResultTeamMemberOutputData,
} from '../interface/match.interface';
import { TournamentOutputData } from '../interface/tournament.interface';
import MatchTable, { MatchTableData } from '../Table/MatchTable';
import PlayerTable from '../Table/PlayerTable';
import Utils from '../utils';

export interface TournamentPageProps extends RouteComponentProps {
  id?: string;
}

const TournamentPage = (props: TournamentPageProps): ReactElement => {
  const { id } = props;

  const [data, setData] = useState<TournamentOutputData | undefined>();
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  useEffect(() => {
    if (id) {
      const entrypoint = `${Utils.baseUrl}/tournament/${id}`;
      // eslint-disable-next-line no-console
      console.log(entrypoint);
      axios.get<TournamentOutputData>(entrypoint).then((response) => {
        setData(response.data);
        setLastFetched(new Date());
      });
    }
    return () => {};
  }, [id]);

  const columnsMatch = [
    { title: '#', field: '' },
    { title: 'Name', field: '' },
    { title: 'Kills', field: '' },
    { title: 'Points', field: '' },
    { title: 'Damage', field: '' },
  ];

  const name = data?.name;
  const start = data && data.start && Utils.localDateTimeString(data.start);

  const dataValidMatches = data?.matches?.filter(
    (match): match is MatchOutputData =>
      match.results !== undefined &&
      match.results !== null &&
      match.results.length > 0
  );
  const dataMatches =
    dataValidMatches && dataValidMatches.length > 0
      ? dataValidMatches
          .map((match) =>
            match.results?.map(
              (result) =>
                ({
                  id: result.teamNum,
                  name: result.teamName,
                  points: result.teamPoints,
                  kills: result.teamKills,
                  damage: result.teamDamage,
                } as MatchTableData)
            )
          )
          .reduce((prev: MatchTableData[], curr) =>
            curr.map((currData) => {
              const prevData = prev.find((s) => s.id === currData.id);
              return {
                id: prevData?.id || currData.id,
                name: prevData?.name || currData.name,
                damage: (prevData?.damage || 0) + currData.damage,
                kills: (prevData?.kills || 0) + currData.kills,
                points: (prevData?.points || 0) + currData.points,
              } as MatchTableData;
            })
          )
          .sort((a: MatchTableData, b: MatchTableData) => {
            const points = b.points - a.points;
            if (points === 0) {
              const kills = b.kills - a.kills;
              if (kills === 0) {
                return b.damage - a.damage;
              }
              return kills;
            }
            return points;
          })
      : undefined;

  const top = 5;

  const dataValidPlayer = data?.matches?.filter(
    (match): match is MatchOutputData =>
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
            curr.map((currData) => {
              const prevData = prev.find((s) => s.name === currData.name);
              return {
                name: prevData?.name || currData.name,
                damage: (prevData?.damage || 0) + currData.damage,
                kills: (prevData?.kills || 0) + currData.kills,
                assists: (prevData?.assists || 0) + currData.assists,
                survivalTime:
                  (prevData?.survivalTime || 0) + currData.survivalTime,
              } as MatchResultTeamMemberOutputData;
            })
          )
      : undefined;

  const columnsPlayerKills = [
    { title: 'Name', field: '' },
    { title: 'Kills', field: '' },
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
    .slice(0, top)
    ?.map((playerData) => ({
      name: playerData.name,
      value: playerData.kills,
    }));

  const columnsPlayerDamage = [
    { title: 'Name', field: '' },
    { title: 'Damage', field: '' },
  ];
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
    ?.slice(0, top)
    ?.map((playerData) => ({
      name: playerData.name,
      value: playerData.damage,
    }));

  const columnsPlayerAssists = [
    { title: 'Name', field: '' },
    { title: 'Assists', field: '' },
  ];
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
    ?.slice(0, top)
    ?.map((playerData) => ({
      name: playerData.name,
      value: playerData.assists,
    }));

  const subtitles = [name, start].filter(
    (v): v is string => typeof v === 'string'
  );

  return (
    <BasePage subtitles={subtitles} title="Tournament">
      {dataMatches && (
        <div className="right-column">
          <div className="column-content">
            <MatchTable columns={columnsMatch} data={dataMatches} />
            {dataPlayerKills && dataPlayerDamage && dataPlayerAssists && (
              <div className="player-tables">
                <PlayerTable
                  columns={columnsPlayerKills}
                  data={dataPlayerKills}
                />
                <PlayerTable
                  columns={columnsPlayerDamage}
                  data={dataPlayerDamage}
                />
                <PlayerTable
                  columns={columnsPlayerAssists}
                  data={dataPlayerAssists}
                />
              </div>
            )}
            {lastFetched && (
              <div className="last-fetched">
                Last fetched: {formatISO(lastFetched)}
              </div>
            )}
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default TournamentPage;
