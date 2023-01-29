import React, { type ReactElement } from 'react'
import { useNavigate } from 'react-router'

import classNames from 'classnames'

import './LinkTable.scss'

export interface LinkTableColumn {
  title: string
  field: string
}

export interface LinkTableData {
  name: string
  value: string
  link: string
}

export interface LinkTableProps {
  columns: LinkTableColumn[]
  data: LinkTableData[]
}

function LinkTable (props: LinkTableProps): ReactElement {
  const { columns, data } = props
  const navigate = useNavigate()
  return (
    <div className="link-table-container">
      <table className="link-table">
        <thead className="link-table-header">
          <tr className="link-table-header-row">
            {columns.map((c, columnIndex) => (
              <th
                className="link-table-column-header"
                key={columnIndex}
              >
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="link-table-body">
          {data.map((d, rowIndex) => (
            <tr
              className={classNames(
                'link-table-data-row',
                { odd: rowIndex % 2 !== 0 },
                { even: rowIndex % 2 === 0 }
              )}
              key={rowIndex}
              onClick={() => { navigate(d.link) }}
            >
              <td className="link-table-column-data">{d.name}</td>
              <td className="link-table-column-data">{d.value}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="link-table-footer" />
      </table>
    </div>
  )
}

export default LinkTable
