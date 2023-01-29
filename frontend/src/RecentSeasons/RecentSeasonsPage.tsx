import React, { type ReactElement, useEffect, useState } from 'react'

import axios from 'axios'
import { DateTime } from 'luxon'

import './RecentSeasonsPage.scss'
import BasePage from '../Base/BasePage'
import { type SeasonOutputListData } from '../interface/season/season-output-list.interface'
import LinkTable, { type LinkTableData } from '../Table/LinkTable'
import { baseUrl, sortDateStrings } from '../utils'

function RecentSeasonsPage (): ReactElement {
  const entryPoint = '/season'

  const [data, setData] = useState<SeasonOutputListData[] | undefined>()

  useEffect(() => {
    axios
      .get<SeasonOutputListData[]>(`${baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((reason: any) => {
        console.error('Failed to fetch season data\n\n%s', reason)
      })
    return () => { }
  }, [])

  const columnsRecentSeasons = [
    { title: 'Dates', field: '' },
    { title: 'Name', field: '' }
  ]

  const dataRecentSeasons: LinkTableData[] | undefined = data
    ?.filter((season) => season.active)
    ?.sort((a: SeasonOutputListData, b: SeasonOutputListData) =>
      sortDateStrings(b.end, a.end)
    )
    .map((recentSeasonsData) => {
      let dateString = ''
      const start = typeof recentSeasonsData.start === 'string'
        ? DateTime.fromISO(recentSeasonsData.start).toLocaleString({ month: '2-digit', day: '2-digit' })
        : undefined
      const end = typeof recentSeasonsData.end === 'string'
        ? DateTime.fromISO(recentSeasonsData.end).toLocaleString()
        : undefined
      if (start !== undefined) {
        dateString = start
        if (end !== undefined && start !== end) {
          dateString = `${start} to ${end}`
        }
      }
      return {
        name: dateString,
        value: typeof recentSeasonsData.name === 'string' ? recentSeasonsData.name : 'Unnamed',
        link: `${entryPoint}/${recentSeasonsData.id}`
      }
    })

  return (
    <BasePage title="Recent Seasons">
      {(dataRecentSeasons != null) && (
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
  )
}

export default RecentSeasonsPage
