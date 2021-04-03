import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { formatISO } from 'date-fns';

import './RecentSeasonsPage.scss';
import BasePage from '../Base/BasePage';
import { SeasonOutputListData } from '../interface/season.interface';
import LinkTable, { LinkTableData } from '../Table/LinkTable';
import Utils from '../utils';

export interface RecentSeasonsPageProps extends RouteComponentProps {}

const RecentSeasonsPage = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RecentSeasonsPageProps
): ReactElement => {
  const entryPoint = '/season';

  const [data, setData] = useState<SeasonOutputListData[] | undefined>();
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  useEffect(() => {
    axios
      .get<SeasonOutputListData[]>(`${Utils.baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data);
        setLastFetched(new Date());
      });
    return () => {};
  }, []);

  const columnsRecentSeasons = [
    { title: 'Date', field: '' },
    { title: 'Name', field: '' },
  ];

  const dataRecentSeasons = data
    ?.sort((a: SeasonOutputListData, b: SeasonOutputListData) =>
      Utils.sortDateStrings(b.start || '', a.start || '')
    )
    .map(
      (recentSeasonsData) =>
        ({
          name:
            recentSeasonsData.start &&
            Utils.localDateTimeString(recentSeasonsData.start),
          value: recentSeasonsData.name || 'Unnamed',
          link: `${entryPoint}/${recentSeasonsData.id}`,
        } as LinkTableData)
    );

  return (
    <BasePage title="Recent Seasons">
      {dataRecentSeasons && (
        <div className="right-column">
          <div className="column-content">
            <LinkTable
              columns={columnsRecentSeasons}
              data={dataRecentSeasons}
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

export default RecentSeasonsPage;
