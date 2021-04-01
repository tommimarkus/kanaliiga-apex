import React, { PropsWithChildren, ReactElement } from 'react';

import { useLocation } from '@reach/router';
import classNames from 'classnames';

import SponsorCGI from '../images/cgi_600px.webp';
import SponsorEtteplan from '../images/Etteplan_logo_rgb_300.png';
import KanaliigaLogo from '../images/kanaliiga-logo-250px.png';
import Utils from '../utils';
import VideoBackground from '../VideoBackground/VideoBackground';
import './BasePage.scss';

export interface BasePageProps {
  title?: string;
  subtitles?: string[];
}

const BasePage = (props: PropsWithChildren<BasePageProps>): ReactElement => {
  const { title, subtitles, children } = props;

  const query = new URLSearchParams(useLocation().search);
  const stream = query.has('stream');
  const nosponsors = query.has('nosponsors');

  return (
    <div className={classNames('container', { stream })}>
      {!stream && (
        <VideoBackground
          videoSources={[
            `${Utils.videoUrl}/apex-video-background-download-worlds-edge-6.mp4`,
          ]}
        />
      )}
      <div className="left-column">
        <div className="column-content">
          {title && (
            <div className="title-info">
              {title}
              {subtitles &&
                subtitles.map((subtitleItem) => (
                  <div className="subtitle-info">
                    <div key={subtitleItem}>{subtitleItem}</div>
                  </div>
                ))}
            </div>
          )}
          <div className="kanaliiga-logo">
            <img alt="Kanaliiga Logo" src={KanaliigaLogo} />
          </div>
          {nosponsors !== true && (
            <>
              <div className="sponsors">
                <img alt="CGI" src={SponsorCGI} />
              </div>
              <div className="sponsors">
                <img alt="Etteplan" src={SponsorEtteplan} />
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default BasePage;
