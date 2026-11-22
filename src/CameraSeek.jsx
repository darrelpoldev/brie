import { useEffect, useRef, useState } from 'react'
import { BlueyArt } from './Bluey'
import useCameraHunt from './useCameraHunt'
import './camera-seek.css'

const pups = ['Bluey', 'Bingo']
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
  const [found, setFound] = useState(0)
  const [round, setRound] = useState(0)
  const [lastObject, setLastObject] = useState(null)
  const [celebration, setCelebration] = useState(null)
  const playing = status === 'playing'
  const complete = found === pups.length
  const turn = round * pups.length + found
  const { peek, status: huntStatus } = useCameraHunt({
    playing: playing && !complete && !celebration,
    turn,
    videoRef,
    previousObject: lastObject,
  })

  useEffect(() => {
    if (!celebration) return
    const timer = window.setTimeout(() => setCelebration(null), 800)
    return () => window.clearTimeout(timer)
  }, [celebration])

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

  const activePup = celebration ?? (peek && { ...peek, name: pups[(round + found) % pups.length] })
  const hint = {
    loading: 'Getting the hiding spots ready…',
    searching: 'Slowly look around the room.',
    hint: 'Try a chair, couch, or a plant. Hold the camera still for a moment.',
    unavailable: 'Object detection couldn’t start. Check your connection and restart the game.',
  }[huntStatus]

  return (
    <main className="camera-seek">
      <video ref={videoRef} className="camera-seek-video" aria-hidden="true" autoPlay muted playsInline />
      <header className="camera-seek-header">
        <button type="button" onClick={onBack} aria-label="Back to playroom">‹ Playroom</button>
        {playing && <strong role="status">{complete ? 'You found both!' : `${found} of 2 found`}</strong>}
      </header>

      {playing ? (
        <>
          {activePup && (!complete || celebration) && (
            <div key={activePup.name} className="camera-seek-perch"
              style={{ '--x': `${activePup.position.x}px`, '--y': `${activePup.position.y}px`, '--size': `${activePup.position.size}px` }}>
              <button type="button" className="camera-seek-pup" aria-label={`Find ${activePup.name}`}
                disabled={Boolean(celebration)} onClick={() => {
                  setCelebration(activePup)
                  setLastObject(activePup.object)
                  setFound(current => current + 1)
                  onFound()
                }}>
                <span className="camera-seek-art"><BlueyArt bingo={activePup.name === 'Bingo'} size={140} /></span>
              </button>
              {celebration && <strong className="camera-seek-name">{activePup.name}!</strong>}
            </div>
          )}
          <div className="camera-seek-footer">
            {complete ? <button type="button" onClick={() => {
              setRound(current => current + 1)
              setFound(0)
              setLastObject(null)
              setCelebration(null)
            }}>Play again</button> : <p>{celebration ? `You found ${celebration.name}!` : peek ? 'Quick, tap the pup!' : hint}</p>}
          </div>
        </>
      ) : (
        <section className="camera-seek-intro">
          <div className="camera-seek-duo"><BlueyArt size={108} /><BlueyArt bingo size={108} /></div>
          <h1>Camera Hide &amp; Seek</h1>
          <p>Look around with your camera. Bluey and Bingo are hiding behind things in your room.</p>
          {error && <p role="alert">{error}</p>}
          <button type="button" onClick={startCamera} disabled={status === 'starting'}>
            {status === 'starting' ? 'Opening camera…' : 'Turn on camera'}
          </button>
        </section>
      )}
    </main>
  )
}
