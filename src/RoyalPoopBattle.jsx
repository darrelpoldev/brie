import BattleScene from './BattleScene'
import { RenderedToy } from './ToyArt'
import { characterModel } from './toyModels'
import { useEffect, useRef, useState } from 'react'

const PRINCES = ['Beast', 'Olaf', 'Shrek'].map(name => ({ name }))
const PRINCESSES = ['Elsa', 'Anna', 'Snow White', 'Cinderella', 'Rapunzel', 'Ariel', 'Belle'].map(name => ({ name }))
const LOOKS = {
  Elsa: { hair: '#f8e9ad', dress: '#8bd9ed', skin: '#f8d9c7', style: 'braid', bg: '#e4f8ff' },
  Anna: { hair: '#a34f27', dress: '#344f9c', skin: '#f4c8ad', style: 'braids', bg: '#fce7ee' },
  'Snow White': { hair: '#24232d', dress: '#f9d751', skin: '#f5d4bd', style: 'bob', bg: '#fff0d5' },
  Cinderella: { hair: '#e5ba61', dress: '#90c9f2', skin: '#f3d3b7', style: 'bun', bg: '#e6f2ff' },
  Rapunzel: { hair: '#e8bd49', dress: '#bd8bd6', skin: '#f5d1b5', style: 'long', bg: '#f4e7ff' },
  Ariel: { hair: '#c84935', dress: '#a87bc5', skin: '#f6c9aa', style: 'long', bg: '#e3f9f4' },
  Belle: { hair: '#75442d', dress: '#f4ca4d', skin: '#eec8a7', style: 'bun', bg: '#fff6d9' },
}
function Portrait({ name, size }) {
  return <RenderedToy artKey={`character:${name}`} makeModel={() => characterModel(name, LOOKS[name])} size={size} fallback={name[0]} />
}

const W = 360, GROUND = 198, GRAVITY = 420
const POSITIONS = [{ x: 54, y: GROUND }, { x: 306, y: GROUND }]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const initialScores = () => [0, 0]

// One deterministic flight model is used by both the aim preview and the throw.
// Sampling at 120 Hz prevents a fast projectile from skipping past a character.
function simulateThrow(origin, target, velocity) {
  const start = { x: origin.x, y: origin.y - 27 }
  const points = [start]
  for (let i = 1; i <= 480; i++) {
    const t = i / 120
    const x = start.x + velocity.vx * t
    const y = start.y + velocity.vy * t + GRAVITY * t * t / 2
    const point = { x, y, t }
    points.push(point)
    const hit = Math.hypot(x - target.x, y - (target.y - 22)) <= 44
    if (hit || y >= GROUND - 6 || x < -15 || x > W + 15) {
      return { points, impact: { ...point, hit } }
    }
  }
  return { points, impact: { ...points[points.length - 1], hit: false } }
}

export default function RoyalPoopBattle({ onBack }) {
  const [setup, setSetup] = useState(true)
  const [prince, setPrince] = useState(0)
  const [princess, setPrincess] = useState(0)
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState(initialScores)
  const [aim, setAim] = useState(null)
  const [shot, setShot] = useState(null)
  const [impactCamera, setImpactCamera] = useState(null)
  const [splat, setSplat] = useState(null)
  const [winner, setWinner] = useState(null)
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const animationRef = useRef(null)
  const timeoutRef = useRef(null)
  const audioRef = useRef(null)
  const [reaction, setReaction] = useState(null)
  const [hitPlayer, setHitPlayer] = useState(null)
  const [isThrowing, setIsThrowing] = useState(false)
  const [camera, setCamera] = useState({ x: 95, y: 105 })
  const cameraRef = useRef({ x: 95, y: 105 })
  const cameraTargetRef = useRef({ x: 95, y: 105 })
  const current = POSITIONS[turn]
  const target = POSITIONS[1 - turn]

  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current)
    clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    // Stop scheduling frames when the camera reaches its target.
    let raf
    let last = performance.now()
    const tick = now => {
      const delta = Math.min((now - last) / 1000, 0.05)
      last = now
      const target = cameraTargetRef.current
      const previous = cameraRef.current
      const alpha = 1 - Math.exp(-9 * delta)
      const next = { x: previous.x + (target.x - previous.x) * alpha, y: previous.y + (target.y - previous.y) * alpha }
      if (Math.abs(target.x - next.x) + Math.abs(target.y - next.y) < 0.08) {
        cameraRef.current = target
        setCamera(target)
        return
      }
      cameraRef.current = next
      setCamera(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [turn, shot, impactCamera, setup])

  function coordinates(event) {
    const rect = stageRef.current.getBoundingClientRect()
    return { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height }
  }

  function vector(point) {
    const start = dragRef.current || point
    const dx = (point.x - start.x) * 190 / point.width
    const dy = (point.y - start.y) * 320 / point.height
    const direction = turn === 0 ? 1 : -1
    // Pull back in any direction. Distance controls power, and vertical pull
    // adds loft. The default throw is deliberately generous for young players.
    const distance = clamp(Math.hypot(dx, dy), 0, 145)
    const power = clamp(65 + distance * 0.48, 65, 135)
    const vx = direction * (125 + power * 0.8)
    const vy = -(205 + clamp(dy, -60, 90) * 0.35)
    return { vx, vy, power }
  }

  function startDrag(event) {
    if (setup || winner !== null || shot || splat || isThrowing) return
    event.preventDefault()
    stageRef.current.setPointerCapture(event.pointerId)
    const point = coordinates(event)
    dragRef.current = point
    setAim(vector(point))
  }

  function moveDrag(event) {
    if (!dragRef.current) return
    setAim(vector(coordinates(event)))
  }

  function finishDrag(event) {
    if (!dragRef.current) return
    const point = coordinates(event)
    const distance = Math.hypot(point.x - dragRef.current.x, point.y - dragRef.current.y)
    const v = vector(point)
    dragRef.current = null
    setAim(null)
    if (distance < 12) return // A tap should not accidentally fire.
    launch(v)
  }

  function sound(success) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      const ctx = audioRef.current || (audioRef.current = new Ctx())
      if (ctx.state === 'suspended') ctx.resume()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = success ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(success ? 520 : 210, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(success ? 850 : 100, ctx.currentTime + 0.2)
      gain.gain.setValueAtTime(0.07, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.25)
    } catch { /* Audio is optional */ }
  }

  function launch(velocity) {
    const shooter = turn
    const flight = simulateThrow(current, target, velocity)
    const startTime = performance.now()
    setIsThrowing(true)
    setImpactCamera(null)
    setHitPlayer(null)
    const frame = now => {
      const t = Math.min((now - startTime) / 1000, flight.impact.t)
      const index = Math.min(Math.floor(t * 120), flight.points.length - 1)
      const point = flight.points[index]
      if (t >= flight.impact.t) {
        const impact = flight.impact
        const hit = impact.hit
        sound(hit)
        setReaction(hit ? 'SPLAT! 🎉' : 'PLOP!')
        setHitPlayer(hit ? 1 - shooter : null)
        setShot(null)
        setImpactCamera({ x: clamp(impact.x, 0, W), y: clamp(impact.y, -75, GROUND) })
        setSplat({ x: clamp(impact.x, 15, W - 15), y: clamp(impact.y, 25, GROUND), hit })
        const winningShot = hit && scores[shooter] + 1 >= 3
        if (hit) setScores(prev => prev.map((value, i) => i === shooter ? value + 1 : value))
        if (winningShot) setWinner(shooter)
        timeoutRef.current = setTimeout(() => {
          setSplat(null)
          setReaction(null)
          setHitPlayer(null)
          setImpactCamera(null)
          setIsThrowing(false)
          if (!winningShot) setTurn(1 - shooter)
        }, 1100)
        return
      }
      setShot(point)
      animationRef.current = requestAnimationFrame(frame)
    }
    setShot(flight.points[0])
    animationRef.current = requestAnimationFrame(frame)
  }

  function reset() {
    cancelAnimationFrame(animationRef.current)
    clearTimeout(timeoutRef.current)
    dragRef.current = null
    setIsThrowing(false)
    setHitPlayer(null)
    setAim(null)
    setShot(null)
    setImpactCamera(null)
    setSplat(null)
    setReaction(null)
    setScores(initialScores())
    setTurn(0)
    setWinner(null)
  }

  const preview = aim ? simulateThrow(current, target, aim) : null
  const trajectory = preview ? preview.points.filter((_, i) => i % 8 === 0) : []
  const landing = preview ? preview.impact : null

  // Follow the active player while aiming, the projectile in flight, then the impact.
  // Camera coordinates affect presentation only; projectile physics remain in world space.
  const focus = shot || impactCamera || { x: current.x, y: current.y - 32 }
  cameraTargetRef.current = {
    x: clamp(focus.x, 95, W - 95),
    y: shot ? clamp(focus.y + 35, 80, 125) : impactCamera ? 110 : 105
  }
  const button = { border: 0, borderRadius: 18, padding: '13px 18px', background: '#fff', color: '#65456d', fontWeight: 800, fontSize: 16, cursor: 'pointer' }
  return <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(#faf0fb,#e5f2ee)', fontFamily: 'Nunito, sans-serif', color: '#65456d', padding: '16px', boxSizing: 'border-box', textAlign: 'center' }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 600, width: '100%', margin: '0 auto', flexShrink: 0 }}>
      <button onClick={onBack} style={button} aria-label="Back to games">←</button>
      <strong style={{ fontSize: 'clamp(19px, 5vw, 27px)' }}>💩 Royal Poop Battle</strong>
      <button onClick={() => { reset(); setSetup(true) }} style={button} aria-label="Choose characters again">↻</button>
    </header>
    {setup ? <div style={{ width: '100%', maxWidth: 540, margin: '6px auto 0', minHeight: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowY: 'auto', minHeight: 0, flex: 1, padding: '0 2px 6px', WebkitOverflowScrolling: 'touch' }}>
        <h2 style={{ fontSize: 18, margin: '5px 0 7px' }}>Choose your team!</h2>
        <h3 style={{ fontSize: 15, margin: '7px 0 5px' }}>Daddy's character</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
          {PRINCES.map((p, i) => <button key={p.name} onClick={() => setPrince(i)} aria-pressed={prince === i} style={{ ...button, minWidth: 0, padding: '6px 2px', borderRadius: 12, border: prince === i ? '3px solid #9c67cc' : '3px solid transparent', fontSize: 12 }}>
            <Portrait name={p.name} size={46}/><div>{p.name}</div>
          </button>)}
        </div>
        <h3 style={{ fontSize: 15, margin: '9px 0 5px' }}>Aubrielle's princess</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
          {PRINCESSES.map((p, i) => <button key={p.name} onClick={() => setPrincess(i)} aria-pressed={princess === i} style={{ ...button, minWidth: 0, padding: '6px 1px', borderRadius: 12, border: princess === i ? '3px solid #e97fae' : '3px solid transparent', fontSize: 10, overflowWrap: 'anywhere' }}>
            <Portrait name={p.name} size={43}/><div>{p.name}</div>
          </button>)}
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '8px 2px max(8px, env(safe-area-inset-bottom))' }}>
        <button onClick={() => { reset(); setSetup(false) }} style={{ ...button, background: '#a76bca', color: 'white', width: '100%', padding: '12px 20px' }}>Let's play! ✨</button>
      </div>
    </div> : <div style={{ width: '100%', maxWidth: 650, margin: '6px auto 0', minHeight: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: '8px 0' }}>{winner !== null ? (winner === 0 ? 'Daddy wins! 🎉' : 'Aubrielle wins! 🎉') : (turn === 0 ? "Daddy's turn!" : "Aubrielle's turn!")}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 15, fontWeight: 800, marginBottom: 9 }}>
        <span>Daddy {Array.from({ length: 3 }, (_, i) => i < scores[0] ? '💩' : '☆').join(' ')}</span>
        <span>Aubrielle {Array.from({ length: 3 }, (_, i) => i < scores[1] ? '💩' : '☆').join(' ')}</span>
      </div>
      <div ref={stageRef} className="battle-stage" role="img"
        aria-label="Royal Poop Battle playfield. Drag to aim and release to throw."
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag}
        onPointerCancel={() => { dragRef.current = null; setAim(null) }}>
        <BattleScene focus={camera} ground={GROUND}
          players={[PRINCES[prince], { ...PRINCESSES[princess], look: LOOKS[PRINCESSES[princess].name] }]}
          positions={POSITIONS} turn={turn} hitPlayer={hitPlayer}
          trajectory={trajectory} landing={landing} shot={shot} splat={splat} aim={aim} />
        {aim && <div className="battle-indicator">
          <span>Power</span><progress max={145} value={aim.power} />
        </div>}
        {splat && <div className="battle-indicator">{splat.hit ? 'Splat!' : 'Plop!'}</div>}
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, margin: '8px 0', flexShrink: 0 }}>{winner !== null ? 'Hooray! Another round?' : reaction || (shot ? 'Here it comes!' : aim ? 'Release to throw! 💩' : 'Drag to aim • Release to throw 💩')}</p>
      {winner !== null && <button style={{ ...button, background: '#a76bca', color: 'white' }} onClick={reset}>Play again!</button>}
    </div>}
    {winner !== null && !setup && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#fff0ba,#f9d8f1,#dff5ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20, zIndex: 5, textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(28px, 8vw, 44px)', margin: 0 }}>🏆 {winner === 0 ? 'Daddy' : 'Aubrielle'} wins!</h1>
      <div style={{ fontSize: 26, fontWeight: 900 }}>{winner === 0 ? PRINCES[prince].name : PRINCESSES[princess].name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 55, transform: 'rotate(-25deg)' }}>🙌</span>
        {winner === 0 ? <Portrait name={PRINCES[prince].name} size={120}/> : <Portrait name={PRINCESSES[princess].name} size={120}/>}
        <span style={{ fontSize: 55, transform: 'rotate(25deg)' }}>🙌</span>
      </div>
      <div style={{ fontSize: 70 }}>🥇</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Three splats! Royal champion! 🎉</div>
      <button onClick={reset} style={{ ...button, background: '#a76bca', color: 'white', padding: '16px 36px' }}>Play again!</button>
      <button onClick={() => { reset(); setSetup(true) }} style={button}>Choose characters</button>
    </div>}
  </div>
}
