import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { DateTime } from 'luxon';

import './RecentSeasonsPage.scss';
import BasePage from '../Base/BasePage';
import { SeasonOutputListData } from '../interface/season/season-output-list.interface';
import LinkTable, { LinkTableData } from '../Table/LinkTable';
import Utils from '../utils';

export interface RecentSeasonsPageProps extends RouteComponentProps {}

const RecentSeasonsPage = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RecentSeasonsPageProps
): ReactElement => {
  const entryPoint = '/season';

  const [data, setData] = useState<SeasonOutputListData[] | undefined>();

  useEffect(() => {
    axios
      .get<SeasonOutputListData[]>(`${Utils.baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data);
      });
    return () => {};
  }, []);

  const columnsRecentSeasons = [
    { title: 'Dates', field: '' },
    { title: 'Name', field: '' },
  ];

  const dataRecentSeasons = data
    ?.filter((season) => season.active)
    ?.sort((a: SeasonOutputListData, b: SeasonOutputListData) =>
      Utils.sortDateStrings(b.end, a.end)
    )
    .map((recentSeasonsData) => {
      let dateString = '';
      const start = recentSeasonsData.start &&
        DateTime.fromISO(recentSeasonsData.start).toLocaleString({ month: '2-digit', day: '2-digit' });
      const end = recentSeasonsData.end &&
        DateTime.fromISO(recentSeasonsData.end).toLocaleString();
      if (start) {
        dateString = start;
        if (end && start !== end) {
          dateString = `${start} to ${end}`;
        }
      }
      return {
        name: dateString,
        value: recentSeasonsData.name || 'Unnamed',
        link: `${entryPoint}/${recentSeasonsData.id}`,
      } as LinkTableData;
    });

  return (
    <BasePage title="Recent Seasons">
      {dataRecentSeasons && (
        <div className="right-column">
          <div className="column-content">
            <LinkTable
              columns={columnsRecentSeasons}
              data={dataRecentSeasons}
            />
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default RecentSeasonsPage;
