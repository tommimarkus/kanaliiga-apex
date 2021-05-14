import { ReactElement } from 'react';

import classNames from 'classnames';

import './Table.scss';

export type Column<T, K extends keyof T> = {
  key: K;
  header: string | ReactElement;
  width?: number;
};

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<Column<T, K>>;
};

const Table = <T, K extends keyof T>(props: TableProps<T, K>): ReactElement => {
  const { columns, data } = props;
  return (
    <div className="match-table-container">
      <table className="match-table">
        <thead className="match-table-header">
          <tr className="match-table-header-row">
            {columns.map((column, columnIndex) => (
              <th
                className="match-table-column-header"
                key={`MatchTableColumnHeader${
                  column.header
                }${columnIndex.toString()}`}
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
              key={`MatchTableRow${rowIndex.toString()}`}
            >
              {columns.map((column, columnIndex) => (
                <td
                  className="match-table-column-data"
                  key={`MatchTableColumn${
                    column.header
                  }${columnIndex.toString()}`}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="table-footer" />
      </table>
    </div>
  );
};

export default Table;
