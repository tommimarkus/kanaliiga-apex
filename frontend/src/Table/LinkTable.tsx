import { ReactElement } from 'react';

import { navigate } from '@reach/router';
import classNames from 'classnames';

import './LinkTable.scss';

export interface LinkTableColumn {
  title: string;
  field: string;
}

export interface LinkTableData {
  name: string;
  value: string;
  link: string;
}

export interface LinkTableProps {
  columns: LinkTableColumn[];
  data: LinkTableData[];
}

const LinkTable = (props: LinkTableProps): ReactElement => {
  const { columns, data } = props;
  return (
    <div className="link-table-container">
      <table className="link-table">
        <thead className="link-table-header">
          <tr className="link-table-header-row">
            {columns.map((c, columnIndex) => (
              <th
                className="link-table-column-header"
                key={columnIndex.toString()}
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
              key={rowIndex.toString()}
              onClick={() => navigate(d.link)}
            >
              <td className="link-table-column-data">{d.name}</td>
              <td className="link-table-column-data">{d.value}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="link-table-footer" />
      </table>
    </div>
  );
};

export default LinkTable;
