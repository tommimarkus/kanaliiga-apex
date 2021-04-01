import { ReactElement } from 'react';

import { RouteComponentProps } from '@reach/router';

import './NotFoundPage.scss';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotFoundPage = (props: RouteComponentProps): ReactElement => (
  <div className="error">404: Not found!</div>
);

export default NotFoundPage;
