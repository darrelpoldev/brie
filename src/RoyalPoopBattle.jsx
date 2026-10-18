import { useEffect, useRef, useState } from 'react'

const PRINCES = [{ name: 'Prince Charming', emoji: '🤴' }, { name: 'Royal Knight', emoji: '🫅' }, { name: 'King Daddy', emoji: '👑' }]
const PRINCESSES = [{ name: 'Snow Princess', emoji: '❄️' }, { name: 'Tower Princess', emoji: '👸' }, { name: 'Ocean Princess', emoji: '🧜‍♀️' }, { name: 'Rose Princess', emoji: '🌹' }, { name: 'Forest Princess', emoji: '🌸' }]
const W = 360, H = 240, GROUND = 198, GRAVITY = 420
const POSITIONS = [{ x: 54, y: GROUND }, { x: 306, y: GROUND }]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const initialScores = () => [0, 0]

export default function RoyalPoopBattle({ onBack }) {
  const [setup, setSetup] = useState(true)
  const [prince, setPrince] = useState(0)
  const [princess, setPrincess] = useState(0)
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState(initialScores)
  const [aim, setAim] = useState(null)
  const [shot, setShot] = useState(null)
  const [splat, setSplat] = useState(null)
  const [winner, setWinner] = useState(null)
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const animationRef = useRef(null)
  const timeoutRef = useRef(null)
  const current = POSITIONS[turn]
  const target = POSITIONS[1 - turn]

  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current)
    clearTimeout(timeoutRef.current)
  }, [])

  function coordinates(event) {
    const rect = stageRef.current.getBoundingClientRect()
    return { x: (event.clientX - rect.left) * W / rect.width, y: (event.clientY - rect.top) * H / rect.height }
  }

  function vector(point) {
    const dx = point.x - current.x
    const dy = point.y - (current.y - 22)
    const distance = Math.hypot(dx, dy)
    const power = clamp(distance, 20, 145)
    // Aim by dragging towards the target. The upward component controls loft.
    const direction = turn === 0 ? 1 : -1
    const vx = direction * (80 + power * 1.35)
    const vy = -clamp(110 - dy * 1.1, 115, 295)
    return { vx, vy, power }
  }

  function startDrag(event) {
    if (setup || winner !== null || shot || splat) return
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
    const v = vector(coordinates(event))
    dragRef.current = null
    setAim(null)
    launch(v)
  }

  function launch({ vx, vy }) {
    const start = { x: current.x, y: current.y - 27 }
    const startTime = performance.now()
    const frame = (now) => {
      const t = Math.min((now - startTime) / 1000, 4)
      const x = start.x + vx * t
      const y = start.y + vy * t + GRAVITY * t * t / 2
      const hit = Math.hypot(x - target.x, y - (target.y - 22)) < 35
      if (hit || y >= GROUND - 6 || x < -15 || x > W + 15) {
        setShot(null)
        setSplat({ x: clamp(x, 15, W - 15), y: clamp(y, 25, GROUND), hit })
        if (hit) {
          setScores(prev => {
            const next = [...prev]
            next[turn] += 1
            if (next[turn] >= 3) setWinner(turn)
            return next
          })
        }
        timeoutRef.current = setTimeout(() => {
          setSplat(null)
          if (!hit || scores[turn] < 2) setTurn(t => 1 - t)
        }, 1000)
        return
      }
      setShot({ x, y })
      animationRef.current = requestAnimationFrame(frame)
    }
    setShot(start)
    animationRef.current = requestAnimationFrame(frame)
  }

  function reset() {
    cancelAnimationFrame(animationRef.current)
    clearTimeout(timeoutRef.current)
    dragRef.current = null
    setAim(null)
    setShot(null)
    setSplat(null)
    setScores(initialScores())
    setTurn(0)
    setWinner(null)
  }

  const trajectory = aim ? Array.from({ length: 14 }, (_, i) => {
    const t = i * 0.105
    return { x: current.x + aim.vx * t, y: current.y - 27 + aim.vy * t + GRAVITY * t * t / 2 }
  }).filter(p => p.y < GROUND && p.x >= 0 && p.x <= W) : []

  const button = { border: 0, borderRadius: 18, padding: '13px 18px', background: '#fff', color: '#65456d', fontWeight: 800, fontSize: 16, cursor: 'pointer' }
  return <div style={{ minHeight: '100dvh', background: 'linear-gradient(#fff1fb,#e8f7ff)', fontFamily: 'Nunito, sans-serif', color: '#65456d', padding: '16px', boxSizing: 'border-box', textAlign: 'center' }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 600, margin: 'auto' }}>
      <button onClick={onBack} style={button} aria-label="Back to games">←</button>
      <strong style={{ fontSize: 'clamp(19px, 5vw, 27px)' }}>💩 Royal Poop Battle</strong>
      <button onClick={() => { reset(); setSetup(true) }} style={button} aria-label="Choose characters again">↻</button>
    </header>
    {setup ? <div style={{ maxWidth: 540, margin: '30px auto' }}>
      <h2>Choose your royal team!</h2>
      <h3>Daddy's Prince</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {PRINCES.map((p, i) => <button key={p.name} onClick={() => setPrince(i)} style={{ ...button, border: prince === i ? '3px solid #9c67cc' : '3px solid transparent' }}><span style={{ fontSize: 32 }}>{p.emoji}</span><div>{p.name}</div></button>)}
      </div>
      <h3>Aubrielle's Princess</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {PRINCESSES.map((p, i) => <button key={p.name} onClick={() => setPrincess(i)} style={{ ...button, border: princess === i ? '3px solid #e97fae' : '3px solid transparent' }}><span style={{ fontSize: 32 }}>{p.emoji}</span><div>{p.name}</div></button>)}
      </div>
      <button onClick={() => { reset(); setSetup(false) }} style={{ ...button, background: '#a76bca', color: 'white', marginTop: 30, padding: '17px 40px' }}>Let's play! ✨</button>
    </div> : <div style={{ maxWidth: 650, margin: '20px auto' }}>
      <h2 style={{ margin: '8px 0' }}>{winner !== null ? (winner === 0 ? 'Daddy wins! 🎉' : 'Aubrielle wins! 🎉') : (turn === 0 ? "Daddy's turn!" : "Aubrielle's turn!")}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 17, fontWeight: 800, marginBottom: 12 }}><span>🤴 Daddy: {scores[0]} / 3</span><span>👸 Aubrielle: {scores[1]} / 3</span></div>
      <svg ref={stageRef} viewBox="0 0 360 240" role="img" aria-label="Royal poop battle playfield. Drag to aim and release to throw." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={() => { dragRef.current = null; setAim(null) }} style={{ width: '100%', borderRadius: 22, touchAction: 'none', background: '#c9eeff', boxShadow: '0 8px 25px #8b75a033', userSelect: 'none' }}>
        <circle cx="295" cy="39" r="22" fill="#ffe68a" />
        <path d="M0 172 Q85 115 175 166 Q267 115 360 166 V240 H0Z" fill="#9ddc91" />
        <path d="M0 194 Q100 165 180 190 Q290 158 360 190 V240 H0Z" fill="#75c67b" />
        <rect y={GROUND} width={W} height={H - GROUND} fill="#6cbf75" />
        <text x="54" y="191" fontSize="43" textAnchor="middle">{PRINCES[prince].emoji}</text>
        <text x="306" y="191" fontSize="43" textAnchor="middle">{PRINCESSES[princess].emoji}</text>
        {trajectory.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#fff" opacity={0.9 - i * 0.04} />)}
        {shot && <text x={shot.x} y={shot.y} textAnchor="middle" fontSize="24">💩</text>}
        {splat && <g><text x={splat.x} y={splat.y} textAnchor="middle" fontSize="33">💥</text><text x={splat.x} y={splat.y - 30} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#78435b">{splat.hit ? 'SPLAT! 🎉' : 'PLOP!'}</text></g>}
        {aim && <text x={current.x} y={current.y - 52} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#745078">Power {Math.round(aim.power / 145 * 100)}%</text>}
      </svg>
      <p style={{ fontSize: 17, fontWeight: 700 }}>{winner !== null ? 'Hooray! Another round?' : shot || splat ? 'Here it comes!' : 'Drag on the field to aim, then let go to throw! 💩'}</p>
      {winner !== null && <button style={{ ...button, background: '#a76bca', color: 'white' }} onClick={reset}>Play again!</button>}
    </div>}
  </div>
}
