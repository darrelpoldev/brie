import { useEffect, useRef, useState } from 'react'

function sameObject(a, b) {
  if (a.label !== b.label) return false
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
  return width > 0 && height > 0 && width * height > .25 * Math.max(a.width * a.height, b.width * b.height)
}

function project(video, object) {
  const { clientWidth, clientHeight, videoWidth, videoHeight } = video
  const scale = Math.max(clientWidth / videoWidth, clientHeight / videoHeight)
  const width = videoWidth * scale
  const height = videoHeight * scale
  const left = (clientWidth - width) / 2
  const top = (clientHeight - height) / 2
  const x = left + (object.x + object.width * .55) * width
  const y = top + (object.y + object.height * .18) * height

  if (x < 55 || x > clientWidth - 55 || y < 110 || y > clientHeight - 100) return null
  return { x, y, size: Math.min(138, Math.max(84, object.width * width * .75)) }
}

export default function useCameraHunt({ playing, turn, videoRef, previousObject }) {
  const [peek, setPeek] = useState(null)
  const [status, setStatus] = useState('loading')
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!playing) return
    let stopped = false
    let timer
    let pending
    let visible
    let misses = 0
    let started
    setPeek(null)
    setStatus('loading')

    async function scan() {
      if (stopped) return
      const video = videoRef.current

      try {
        if (video.readyState >= 2 && video.videoWidth) {
          const objects = (await scannerRef.current(video))
            .map(object => ({ object, position: project(video, object) }))
            .filter(item => item.position)
          if (stopped) return

          if (visible) {
            const match = objects.find(item => sameObject(item.object, visible.object))
            if (match) {
              visible = match
              misses = 0
              setPeek({ ...match, turn })
            } else if (++misses >= 2) {
              visible = pending = null
              setPeek(null)
            }
          } else {
            const candidates = objects.filter(item => !previousObject || !sameObject(item.object, previousObject))
            const match = pending && candidates.find(item => sameObject(item.object, pending.object))
            if (match && performance.now() - pending.since >= 650) {
              visible = match
              misses = 0
              setPeek({ ...match, turn })
            } else if (!match) {
              pending = candidates[0] && { ...candidates[0], since: performance.now() }
            }
          }
        }
        if (!visible && performance.now() - started > 9000) setStatus('hint')
        timer = window.setTimeout(scan, 350)
      } catch {
        if (!stopped) {
          setPeek(null)
          setStatus('unavailable')
        }
      }
    }

    async function start() {
      try {
        const { createObjectScanner } = await import('./cameraObjects')
        scannerRef.current ??= await createObjectScanner()
        if (stopped) return
        setStatus('searching')
        started = performance.now()
        timer = window.setTimeout(scan, 500)
      } catch {
        if (!stopped) setStatus('unavailable')
      }
    }

    start()
    return () => {
      stopped = true
      window.clearTimeout(timer)
    }
  }, [playing, turn, videoRef, previousObject])

  return { peek: playing && peek?.turn === turn ? peek : null, status }
}
