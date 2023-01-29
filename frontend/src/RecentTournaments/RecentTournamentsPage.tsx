import React, { type ReactElement, useEffect, useState } from 'react'

import axios from 'axios'
import { DateTime } from 'luxon'

import './RecentTournamentsPage.scss'
import BasePage from '../Base/BasePage'
import { type TournamentOutputListData } from '../interface/tournament/tournament-output-list.interface'
import LinkTable, { type LinkTableData } from '../Table/LinkTable'
import { baseUrl, sortDateStrings, dateAndTimeFormat } from '../utils'

function RecentTournamentsPage (): ReactElement {
  const entryPoint = '/tournament'

  const [data, setData] = useState<TournamentOutputListData[] | undefined>()

  useEffect(() => {
    axios
      .get<TournamentOutputListData[]>(`${baseUrl}${entryPoint}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((reason: any) => {
        console.error('Failed to fetch tournament data\n\n%s', reason)
      })
    return () => { }
  }, [])

  const columnsRecentTournaments = [
    { title: 'Date', field: '' },
    { title: 'Name', field: '' }
  ]

  const dataRecentTournaments: LinkTableData[] | undefined = data
    ?.sort((a: TournamentOutputListData, b: TournamentOutputListData) =>
      sortDateStrings(b.start, a.start)
    )
    .map(
      (recentTournamentsData) =>
        ({
          name:
          typeof recentTournamentsData.start === 'string'
            ? DateTime
              .fromISO(recentTournamentsData.start)
              .toLocaleString(dateAndTimeFormat)
            : '',
          value: typeof recentTournamentsData.name === 'string' ? recentTournamentsData.name : 'Unnamed',
          link: `${entryPoint}/${recentTournamentsData.id}`
        })
    )

  return (
    <BasePage title="Recent Tournaments">
      {(dataRecentTournaments != null) && (
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
  )
}

export default RecentTournamentsPage
