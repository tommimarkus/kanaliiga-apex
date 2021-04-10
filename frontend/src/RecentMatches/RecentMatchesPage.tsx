import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { formatISO } from 'date-fns';

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
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  useEffect(() => {
    axios
      .get<MatchOutputListData[]>(`${Utils.baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data);
        setLastFetched(new Date());
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
          Utils.localDateTimeString(recentMatchesData.start),
        value: recentMatchesData.tournament?.name || 'Unnamed',
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

export default RecentMatchesPage;
