import React, { PropsWithChildren, ReactElement } from 'react';

// import VideoKingsCanyon11 from '../images/apex-video-background-download-kings-canyon-11.mp4';
// import VideoWorldsEdge1 from '../images/apex-video-background-download-worlds-edge-1.mp4';
import VideoWorldsEdge6 from '../images/apex-video-background-download-worlds-edge-6.mp4';
import SponsorCGI from '../images/cgi_600px.webp';
import SponsorEtteplan from '../images/Etteplan_logo_rgb_300.png';
import KanaliigaLogo from '../images/kanaliiga-logo-250px.png';
import VideoBackground from '../VideoBackground/VideoBackground';
import './BasePage.scss';

export interface BasePageProps {
  title?: string;
  subtitles?: string[];
  showSponsors?: boolean;
}

const BasePage = (props: PropsWithChildren<BasePageProps>): ReactElement => {
  const { title, subtitles, showSponsors, children } = props;

  return (
    <div className="container">
      <VideoBackground videoSources={[VideoWorldsEdge6]} />
      <div className="left-column">
        <div className="column-content">
          {title && (
            <div className="title-info">
              {title}
              {subtitles && (
                <div className="subtitle-info">
                  {subtitles.map((subtitleItem) => (
                    <div>{subtitleItem}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="kanaliiga-logo">
            <img alt="Kanaliiga Logo" src={KanaliigaLogo} />
          </div>
          {showSponsors === true && (
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
