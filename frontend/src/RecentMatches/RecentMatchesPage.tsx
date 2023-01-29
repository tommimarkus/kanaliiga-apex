import React, { type ReactElement, useEffect, useState } from 'react'

import axios from 'axios'
import { DateTime } from 'luxon'

import './RecentMatchesPage.scss'

import BasePage from '../Base/BasePage'
import { type MatchOutputListData } from '../interface/match/match-output-list.interface'
import LinkTable, { type LinkTableData } from '../Table/LinkTable'
import { baseUrl, dateAndTimeFormat } from '../utils'

function RecentMatchesPage (): ReactElement {
  const entryPoint = '/match'

  const [data, setData] = useState<MatchOutputListData[] | undefined>()

  useEffect(() => {
    axios
      .get<MatchOutputListData[]>(`${baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((reason: any) => {
        console.error('Failed to fetch match data\n\n%s', reason)
      })
    return () => { }
  }, [])

  const columnsRecentMatches = [
    { title: 'Date', field: '' },
    { title: 'Tournament', field: '' }
  ]

  const dataRecentMatches: LinkTableData[] | undefined = data?.map(
    (recentMatchesData) =>
      ({
        name:
        typeof recentMatchesData.start === 'string'
          ? DateTime
            .fromISO(recentMatchesData.start)
            .toLocaleString(dateAndTimeFormat)
          : '',
        value: typeof recentMatchesData.group?.tournament?.name === 'string' ? recentMatchesData.group?.tournament?.name : 'Unnamed',
        link: `${entryPoint}/${recentMatchesData.id}`
      })
  )

  return (
    <BasePage title="Recent Matches">
      {(dataRecentMatches != null) && (
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
  )
}

export default RecentMatchesPage
