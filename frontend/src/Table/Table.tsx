import React, { type ReactElement } from 'react'

import classNames from 'classnames'

import './Table.scss'

export interface Column<T, K extends keyof T> {
  key: K
  header: string | ReactElement
  width?: number
}

interface TableProps<T, K extends keyof T> {
  data: T[]
  columns: Array<Column<T, K>>
}

function Table<T, K extends keyof T> (props: TableProps<T, K>): ReactElement {
  const { columns, data } = props
  return (
    <div className="match-table-container">
      <table className="match-table">
        <thead className="match-table-header">
          <tr className="match-table-header-row">
            {columns.map((column, columnIndex) => (
              <th
                className="match-table-column-header"
                key={`MatchTableColumnHeader${columnIndex}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="match-table-body">
          {data.map((row, rowIndex) => (
            <tr
              className={classNames(
                'match-table-data-row',
                { odd: rowIndex % 2 !== 0 },
                { even: rowIndex % 2 === 0 }
              )}
              key={`MatchTableRow${rowIndex}`}
            >
              {columns.map((column, columnIndex) => (
                <td
                  className="match-table-column-data"
                  key={`MatchTableColumn${columnIndex}`}
                >
                  {row[column.key] as string}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="table-footer" />
      </table>
    </div>
  )
}

export default Table
