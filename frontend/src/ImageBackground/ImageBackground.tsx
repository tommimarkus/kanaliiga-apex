import React, { type ReactElement } from 'react'

import './ImageBackground.scss'

export interface ImageBackgroundProps {
  imageSources: string[]
}

function ImageBackground (props: ImageBackgroundProps): ReactElement {
  const { imageSources } = props

  const image = imageSources[Math.floor(Math.random() * imageSources.length)]

  return (
    <div className="video-background-container">
      <img alt="background" className="poster-background" src={image} />
    </div>
  )
}

export default ImageBackground
