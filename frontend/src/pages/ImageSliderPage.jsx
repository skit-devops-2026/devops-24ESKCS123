import { useState } from 'react'
import '../styles/ImageSliderPage.css'

function ImageSliderPage() {
  const [position, setPosition] = useState(50)
  return <main className="slider-page"><div className="slider-container" style={{ '--position': `${position}%` }}><div className="slider-image-wrap"><div className="slider-before"><img src="/assets/before.png" alt="Suspicious recruitment message" /></div><img src="/assets/after.png" alt="Analyzed recruitment message" /><div className="slider-line" /><div className="slider-button" aria-hidden="true">↔</div></div><input aria-label="Compare images" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(event.target.value)} /></div></main>
}

export default ImageSliderPage
