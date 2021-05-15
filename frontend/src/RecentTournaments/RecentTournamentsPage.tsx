import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { DateTime } from 'luxon';

import './RecentTournamentsPage.scss';
import BasePage from '../Base/BasePage';
import { TournamentOutputListData } from '../interface/tournament/tournament-output-list.interface';
import LinkTable, { LinkTableData } from '../Table/LinkTable';
import Utils from '../utils';

export interface RecentTournamentsPageProps extends RouteComponentProps {}

const RecentTournamentsPage = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RecentTournamentsPageProps
): ReactElement => {
  const entryPoint = '/tournament';

  const [data, setData] = useState<TournamentOutputListData[] | undefined>();

  useEffect(() => {
    axios
      .get<TournamentOutputListData[]>(`${Utils.baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data);
      });
    return () => {};
  }, []);

  const columnsRecentTournaments = [
    { title: 'Date', field: '' },
    { title: 'Name', field: '' },
  ];

  const dataRecentTournaments = data
    ?.sort((a: TournamentOutputListData, b: TournamentOutputListData) =>
      Utils.sortDateStrings(b.start, a.start)
    )
    .map(
      (recentTournamentsData) =>
        ({
          name:
            recentTournamentsData.start &&
            DateTime
              .fromISO(recentTournamentsData.start)
              .toLocaleString(Utils.dateAndTimeFormat),
          value: recentTournamentsData.name || 'Unnamed',
          link: `${entryPoint}/${recentTournamentsData.id}`,
        } as LinkTableData)
    );

  return (
    <BasePage title="Recent Tournaments">
      {dataRecentTournaments && (
        <div className="right-column">
          <div className="column-content">
            <LinkTable
              columns={columnsRecentTournaments}
              data={dataRecentTournaments}
            />
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default RecentTournamentsPage;
