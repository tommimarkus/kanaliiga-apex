import { ReactElement } from 'react';

import classNames from 'classnames';

import './MatchTable.scss';

export interface MatchTableColumn {
  title: string | ReactElement;
  field: string;
}

export interface MatchTableData {
  id: number;
  name: string;
  points: number;
  kills: number;
  damage: number;
  placement?: number;
}

export interface MatchTableProps {
  columns: MatchTableColumn[];
  data: MatchTableData[];
}

const MatchTable = (props: MatchTableProps): ReactElement => {
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
              <td className="table-column-data">{rowIndex + 1}</td>
              <td className="table-column-data">{d.name}</td>
              {d.placement && (
                <td className="table-column-data">{d.placement}</td>
              )}
              <td className="table-column-data">{d.kills}</td>
              <td className="table-column-data">{d.points}</td>
              <td className="table-column-data">{d.damage}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-footer" />
      </table>
    </div>
  );
};

export default MatchTable;
