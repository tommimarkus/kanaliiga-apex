import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps, useLocation } from '@reach/router';
import axios from 'axios';

import BasePage from '../Base/BasePage';
import { MatchOutputOneData } from '../interface/match/match-output-one.interface';
import { MatchResultTeamMemberOutputData } from '../interface/match/match-result-team-member-output.interface';
import MatchTable, { MatchTableData } from '../Table/MatchTable';
import PlayerTable from '../Table/PlayerTable';
import Utils from '../utils';
import './MatchPage.scss';

export interface MatchPageProps extends RouteComponentProps {
  id?: string;
}

const MatchPage = (props: MatchPageProps): ReactElement => {
  const { id } = props;

  const query = new URLSearchParams(useLocation().search);
  const stream = query.has('stream');

  const [data, setData] = useState<MatchOutputOneData | undefined>();

  useEffect(() => {
    if (id) {
      axios
        .get<MatchOutputOneData>(`${Utils.baseUrl}/match/${id}`)
        .then((response) => {
          setData(response.data);
        });
    }
    return () => {};
  }, [id]);

  const columnsMatch = [
    { title: '#', field: '' },
    { title: 'Name', field: '' },
    { title: 'Placement', field: '' },
    { title: 'Kills', field: '' },
    { title: 'Points', field: '' },
    { title: 'Damage', field: '' },
  ];

  const startMatch = data?.start;
  const dataMatch = data?.results
    ?.map(
      (result) =>
        ({
          id: result.teamNum,
          name: result.teamName,
          points: result.teamPoints,
          kills: result.teamKills,
          damage: result.teamDamage,
          placement: result.teamPlacement,
        } as MatchTableData)
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
    });

  const top = 5;

  const dataPlayer = data?.results?.flatMap((result) => result.teamMembers);

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

  return (
    <BasePage
      subtitles={
        startMatch ? [Utils.localDateTimeString(startMatch)] : undefined
      }
      title="Match Started"
    >
      {dataMatch && (
        <div className="column-content">
          <MatchTable columns={columnsMatch} data={dataMatch} />
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
          {stream !== true && data?.group?.tournament?.id && (
            <div className="subset-navigation-links">
              <div className="item">
                <a href={`/tournament/${data?.group?.tournament.id}`}>
                  Back to Tournament
                </a>
              </div>
              <div className="item end">
                <a href="/match/">Recent Matches</a>
              </div>
            </div>
          )}
        </div>
      )}
    </BasePage>
  );
};

export default MatchPage;
