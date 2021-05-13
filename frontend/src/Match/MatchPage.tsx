import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps, useLocation } from '@reach/router';
import axios from 'axios';

import BasePage from '../Base/BasePage';
import { MatchOutputOneData } from '../interface/match/match-output-one.interface';
import { MatchResultOutputData } from '../interface/match/match-result-output.interface';
import { MatchResultTeamMemberOutputData } from '../interface/match/match-result-team-member-output.interface';
import { TournamentOutputOneData } from '../interface/tournament/tournament-output-one.interface';
import Table, { Column } from '../Table/Table';
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

  const [tournamentData, setTournamentData] = useState<
    TournamentOutputOneData | undefined
  >();
  const groupsMatches = tournamentData?.groups?.flatMap(
    (group) => group.matches
  );

  const dataValidMatches = groupsMatches
    ?.filter(
      (match): match is MatchOutputOneData =>
        match.results !== undefined &&
        match.results !== null &&
        match.results.length > 0
    )
    ?.sort((a: MatchOutputOneData, b: MatchOutputOneData) => {
      if (a?.start && b?.start) {
        return a.start > b.start ? 1 : -1;
      }
      return 0;
    });

  useEffect(() => {
    if (data?.group?.tournament.id) {
      const entrypoint = `${Utils.baseUrl}/tournament/${data?.group?.tournament.id}`;
      axios.get<TournamentOutputOneData>(entrypoint).then((response) => {
        setTournamentData(response.data);
      });
    }
    return () => {};
  }, [data?.group?.tournament.id]);

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
      key: 'teamPlacement',
      header: 'Placement',
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

  const startMatch = data?.start;
  const dataMatch = data?.results
    ?.sort((a: MatchResultOutputData, b: MatchResultOutputData) => {
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
    ?.map((value, index) => ({ ...value, order: index + 1 } as ColumnData));

  const top = 5;

  const dataPlayer = data?.results?.flatMap((result) => result.teamMembers);

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

  const currentMatchIndex = dataValidMatches?.findIndex(
    (value) => String(value.id) === id
  );
  return (
    <BasePage
      subtitles={
        startMatch ? [Utils.localDateTimeString(startMatch)] : undefined
      }
      title="Match Started"
    >
      {dataMatch && (
        <div className="column-content">
          <div className={`title-container ${stream ? 'stream' : ''}`}>
            <h1>
              {data?.group?.tournament.name}
              {currentMatchIndex !== undefined &&
                `, Match ${currentMatchIndex + 1}`}
            </h1>
          </div>
          <div>
            <Table columns={columnsMatch} data={dataMatch} />
          </div>
          {dataPlayerKills && dataPlayerDamage && dataPlayerAssists && (
            <div className="player-tables">
              <Table columns={columnsPlayerKills} data={dataPlayerKills} />
              <Table columns={columnsPlayerDamage} data={dataPlayerDamage} />
              <Table columns={columnsPlayerAssists} data={dataPlayerAssists} />
            </div>
          )}
          {stream !== true && data?.group?.tournament?.id && (
            <div className="subset-navigation-links">
              <div className="item">
                <a href={`/tournament/${data?.group?.tournament.id}`}>
                  Back to Tournament
                </a>
              </div>
              <div className="item">
                <div>Matches:</div>
                {dataValidMatches?.map((match, index) => (
                  <div className="list" key={`match${match?.id || index}`}>
                    {match?.id && match?.id !== data.id && (
                      <a href={`/match/${match.id}`}>{index + 1}</a>
                    )}
                    {match?.id && match?.id === data.id && (
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
  );
};

export default MatchPage;
