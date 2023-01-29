import React, { type PropsWithChildren, type ReactElement } from 'react'
import { useLocation } from 'react-router'

import classNames from 'classnames'

import ImageBackground from '../ImageBackground/ImageBackground'
import Poster from '../images/background.jpg'
import KanaliigaLogo from '../images/kanaliiga-logo-250px.png'
import { videoUrl } from '../utils'
import VideoBackground from '../VideoBackground/VideoBackground'
import './BasePage.scss'

export interface BasePageProps {
  title?: string
  subtitles?: string[]
}

function BasePage (props: PropsWithChildren<BasePageProps>): ReactElement {
  const { title, subtitles, children } = props

  const query = new URLSearchParams(useLocation().search)
  const stream = query.has('stream')
  const videobackground = query.has('videobackground')

  return (
    <div className={classNames('container', { stream })}>
      {!stream && (
        <>
          {videobackground && (
            <VideoBackground
              poster={Poster}
              videoSources={[
                `${videoUrl}/apex-video-background-download-worlds-edge-6.mp4`
              ]}
            />
          )}
          {!videobackground && <ImageBackground imageSources={[Poster]} />}
        </>
      )}
      <div className="left-column">
        <div className="column-content">
          {typeof title === 'string' && (
            <div className="title-info">
              {title}
              {Array.isArray(subtitles) &&
                subtitles.map((subtitleItem, index) => (
                  <div className="subtitle-info" key={`${subtitleItem}${index}`}>
                    {subtitleItem}
                  </div>
                ))}
            </div>
          )}
          <div className="kanaliiga-logo">
            <img alt="Kanaliiga Logo" src={KanaliigaLogo} />
          </div>
        </div>
      </div>
      <div className="right-column">
        {children}
        <div className="authors">
          <div className="author">
            Tommi &ldquo;SourOldGeezer&ldquo; Leikomaa
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasePage
