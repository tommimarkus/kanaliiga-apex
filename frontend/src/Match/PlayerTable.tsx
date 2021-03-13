import { ReactElement } from 'react';

import classNames from 'classnames';

import './PlayerTable.scss';

export interface PlayerTableColumn {
  title: string | ReactElement;
  field: string;
}

export interface PlayerTableData {
  name: string;
  value: number;
}

export interface PlayerTableProps {
  columns: PlayerTableColumn[];
  data: PlayerTableData[];
}

const PlayerTable = (props: PlayerTableProps): ReactElement => {
  const { columns, data } = props;
  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr className="table-header-row">
            {columns.map((c, columnIndex) => (
              <th className="table-column-header" key={columnIndex.toString()}>
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((d, rowIndex) => (
            <tr
              className={classNames(
                'table-data-row',
                { odd: rowIndex % 2 !== 0 },
                { even: rowIndex % 2 === 0 }
              )}
              key={rowIndex.toString()}
            >
              <td className="table-column-data">{d.name}</td>
              <td className="table-column-data">{d.value}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-footer" />
      </table>
    </div>
  );
};

export default PlayerTable;
