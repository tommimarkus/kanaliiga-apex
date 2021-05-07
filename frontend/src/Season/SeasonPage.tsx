import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps, useLocation } from '@reach/router';
import axios from 'axios';

import './SeasonPage.scss';
import BasePage from '../Base/BasePage';
import { MatchOutputOneData } from '../interface/match/match-output-one.interface';
import { MatchResultTeamMemberOutputData } from '../interface/match/match-result-team-member-output.interface';
import { SeasonOutputOneData } from '../interface/season/season-output-one.interface';
import { TournamentOutputOneData } from '../interface/tournament/tournament-output-one.interface';
import MatchTable, { MatchTableData } from '../Table/MatchTable';
import PlayerTable from '../Table/PlayerTable';
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

  const columnsMatch = [
    { title: '#', field: '' },
    { title: 'Name', field: '' },
    { title: 'Kills', field: '' },
    { title: 'Points', field: '' },
    { title: 'Damage', field: '' },
  ];

  const name = data?.name;
  const start = data && data.start && Utils.localDateTimeString(data.start);
  const end = data && data.end && Utils.localDateTimeString(data.end);

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
            prev.map((prevData) => {
              const currData = curr.find(
                (existingData) => existingData.id === prevData.id
              );
              return {
                id: prevData.id,
                name: prevData.name,
                damage: prevData.damage + (currData?.damage || 0),
                kills: prevData.kills + (currData?.kills || 0),
                points: prevData.points + (currData?.points || 0),
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

  const subtitles = [name, start, end].filter(
    (v): v is string => typeof v === 'string'
  );

  return (
    <BasePage subtitles={subtitles} title="Season">
      {dataMatches && (
        <div className="right-column">
          <div className="column-content">
            <div className={`title-container ${stream ? 'stream' : ''}`}>
              <h1>{data?.name}</h1>
            </div>
            <div>
              <MatchTable columns={columnsMatch} data={dataMatches} />
            </div>
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
            {stream !== true && (
              <div className="subset-navigation-links">
                <div className="item">
                  <div>Tournaments:</div>
                  {data?.tournaments
                    ?.sort(
                      (
                        a: TournamentOutputOneData,
                        b: TournamentOutputOneData
                      ) => a.id - b.id
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
