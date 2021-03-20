import React, { ReactElement, useEffect, useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import { formatISO } from 'date-fns';

import './TournamentListPage.scss';
import SponsorCGI from '../images/cgi_600px.webp';
import SponsorEtteplan from '../images/Etteplan_logo_rgb_300.png';
import { TournamentOutputListData } from '../interface/tournament.interface';
import Utils from '../utils';

export interface TournamentListPageProps extends RouteComponentProps {
  showSponsors?: boolean;
}

const TournamentListPage = (props: TournamentListPageProps): ReactElement => {
  const { showSponsors } = props;

  const [data, setData] = useState<TournamentOutputListData[] | undefined>();
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  useEffect(() => {
    axios
      .get<TournamentOutputListData[]>(`${Utils.baseUrl}/tournament`)
      .then((response) => {
        setData(response.data);
        setLastFetched(new Date());
      });
    return () => {};
  }, []);

  return (
    <div className="container">
      <div className="left-column">
        <div className="column-content">
          <div className="match-info">
            <div>Tournaments</div>
          </div>
          {showSponsors === true && (
            <div className="sponsors">
              <img alt="CGI" src={SponsorCGI} />
              <img alt="Etteplan" src={SponsorEtteplan} />
            </div>
          )}
        </div>
      </div>
      {data && (
        <div className="right-column">
          <div
            className="column-content"
            style={{ justifyContent: 'flex-start' }}
          >
            {data.map((tournamentListData) => (
              <div>
                <a
                  href={`http://localhost:3000/tournament/${tournamentListData.id}`}
                >
                  {tournamentListData.name}
                </a>
              </div>
            ))}
            {lastFetched && (
              <div className="last-fetched">
                Last fetched: {formatISO(lastFetched)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentListPage;
