import { useEffect, useRef, useState } from 'react'
import { BlueyArt } from './Bluey'
import './camera-seek.css'

const pups = ['Bluey', 'Bingo']
const hidingSpots = [
  [[25, 32], [73, 70]],
  [[72, 34], [28, 69]],
  [[28, 64], [68, 28]],
  [[74, 65], [27, 31]],
]

function cameraError(error) {
  if (error.name === 'NotAllowedError') return 'Allow camera access in your browser settings, then try again.'
  if (error.name === 'NotFoundError') return 'No camera was found. Try opening this game on your phone.'
  return 'The camera could not start. Close other apps using it, then try again.'
}

export default function CameraSeek({ onBack, onFound }) {
  const videoRef = useRef(null)
  const requestRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('ready')
  const [error, setError] = useState('')
  const [found, setFound] = useState([])
  const [round, setRound] = useState(0)

  useEffect(() => {
    function stopCamera() {
      requestRef.current = null
      streamRef.current?.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    function pauseCamera() {
      if (!requestRef.current) return
      stopCamera()
      if (videoRef.current) videoRef.current.srcObject = null
      setStatus('ready')
    }

    function handleVisibility() {
      if (document.hidden) pauseCamera()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', pauseCamera)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', pauseCamera)
      stopCamera()
    }
  }, [])

  async function startCamera() {
    if (requestRef.current) return
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Open Brie over HTTPS in a browser with camera access.')
      return
    }

    const request = Symbol()
    requestRef.current = request
    setStatus('starting')
    setError('')
    const video = videoRef.current

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      if (requestRef.current !== request) {
        stream.getTracks().forEach(track => track.stop())
        return
      }

      streamRef.current = stream
      video.srcObject = stream
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        if (requestRef.current !== request) return
        requestRef.current = null
        streamRef.current = null
        video.srcObject = null
        setError('The camera stopped. Turn it on to keep playing.')
        setStatus('ready')
      }, { once: true })

      await video.play()
      if (requestRef.current === request) setStatus('playing')
    } catch (failure) {
      if (requestRef.current !== request) return
      requestRef.current = null
      streamRef.current?.getTracks().forEach(track => track.stop())
      streamRef.current = null
      video.srcObject = null
      setError(cameraError(failure))
      setStatus('ready')
    }
  }

  const playing = status === 'playing'
  const complete = found.length === pups.length

  return (
    <main className="camera-seek">
      <video ref={videoRef} className="camera-seek-video" aria-hidden="true" autoPlay muted playsInline />
      <header className="camera-seek-header">
        <button type="button" onClick={onBack} aria-label="Back to playroom">‹ Playroom</button>
        {playing && <strong role="status">{complete ? 'You found both!' : `${found.length} of 2 found`}</strong>}
      </header>

      {playing ? (
        <>
          <div className="camera-seek-field" key={round}>
            {pups.map((name, index) => {
              const [x, y] = hidingSpots[round % hidingSpots.length][index]
              const caught = found.includes(name)

              return (
                <button type="button" key={name} className="camera-seek-pup" aria-label={`Find ${name}`}
                  style={{ '--x': `${x}%`, '--y': `${y}%`, '--delay': `${index * .65}s` }}
                  disabled={caught} onClick={() => {
                    setFound(current => current.includes(name) ? current : [...current, name])
                    onFound()
                  }}>
                  <span className="camera-seek-art"><BlueyArt bingo={index === 1} size={112} /></span>
                  <span className="camera-seek-name">{caught ? `✓ ${name}` : name}</span>
                </button>
              )
            })}
          </div>
          <div className="camera-seek-footer">
            {complete ? <button type="button" onClick={() => {
              setRound(current => current + 1)
              setFound([])
            }}>Play again</button> : <p>Look around and tap the pups!</p>}
          </div>
        </>
      ) : (
        <section className="camera-seek-intro">
          <div className="camera-seek-duo"><BlueyArt size={108} /><BlueyArt bingo size={108} /></div>
          <h1>Camera Hide &amp; Seek</h1>
          <p>Point your camera around the room. Can you find Bluey and Bingo?</p>
          {error && <p role="alert">{error}</p>}
          <button type="button" onClick={startCamera} disabled={status === 'starting'}>
            {status === 'starting' ? 'Opening camera…' : 'Turn on camera'}
          </button>
        </section>
      )}
    </main>
  )
}
