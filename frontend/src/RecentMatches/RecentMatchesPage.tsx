import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { DateTime } from 'luxon';

import './RecentMatchesPage.scss';

import BasePage from '../Base/BasePage';
import { MatchOutputListData } from '../interface/match/match-output-list.interface';
import LinkTable, { LinkTableData } from '../Table/LinkTable';
import Utils from '../utils';

export interface RecentMatchesPageProps extends RouteComponentProps {}

const RecentMatchesPage = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RecentMatchesPageProps
): ReactElement => {
  const entryPoint = '/match';

  const [data, setData] = useState<MatchOutputListData[] | undefined>();

  useEffect(() => {
    axios
      .get<MatchOutputListData[]>(`${Utils.baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data);
      });
    return () => {};
  }, []);

  const columnsRecentMatches = [
    { title: 'Date', field: '' },
    { title: 'Tournament', field: '' },
  ];

  const dataRecentMatches = data?.map(
    (recentMatchesData) =>
      ({
        name:
          recentMatchesData.start &&
          `${DateTime
            .fromISO(recentMatchesData.start)
            .toLocaleString()}, ${DateTime
            .fromISO(recentMatchesData.start)
            .toLocaleString(DateTime.TIME_24_SIMPLE)}`,
        value: recentMatchesData.group?.tournament?.name || 'Unnamed',
        link: `${entryPoint}/${recentMatchesData.id}`,
      } as LinkTableData)
  );

  return (
    <BasePage title="Recent Matches">
      {dataRecentMatches && (
        <div className="right-column">
          <div className="column-content">
            <LinkTable
              columns={columnsRecentMatches}
              data={dataRecentMatches}
            />
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default RecentMatchesPage;
