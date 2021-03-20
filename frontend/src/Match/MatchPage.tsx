import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { formatISO } from 'date-fns';

import BasePage from '../Base/BasePage';
import {
  MatchOutputData,
  MatchResultTeamMemberOutputData,
} from '../interface/match.interface';
import Utils from '../utils';
import MatchTable, { MatchTableData } from './MatchTable';
import PlayerTable from './PlayerTable';
import './MatchPage.scss';

export interface MatchPageProps extends RouteComponentProps {
  id?: string;
  showSponsors?: boolean;
}

const MatchPage = (props: MatchPageProps): ReactElement => {
  const { id, showSponsors } = props;

  const [data, setData] = useState<MatchOutputData | undefined>();
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  useEffect(() => {
    if (id) {
      axios
        .get<MatchOutputData>(`${Utils.baseUrl}/match/${id}`)
        .then((response) => {
          setData(response.data);
          setLastFetched(new Date());
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
      showSponsors={showSponsors}
      subtitles={startMatch ? [new Date(startMatch).toUTCString()] : undefined}
      title="Match Started"
    >
      {dataMatch && (
        <div className="right-column">
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

MatchPage.defaultProps = {
  showSponsors: true,
};

export default MatchPage;
