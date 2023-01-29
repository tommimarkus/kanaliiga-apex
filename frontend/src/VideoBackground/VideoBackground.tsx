import React, { type ReactElement } from 'react'

import './VideoBackground.scss'

export interface VideoBackgroundProps {
  videoSources: string[]
  poster?: string
}

function VideoBackground (props: VideoBackgroundProps): ReactElement {
  const { videoSources, poster } = props

  return (
    <div className="video-background-container">
      <video autoPlay className="video-background" loop muted poster={poster}>
        <source
          src={videoSources[Math.floor(Math.random() * videoSources.length)]}
          type="video/mp4"
        />
      </video>
    </div>
  )
}

export default VideoBackground
