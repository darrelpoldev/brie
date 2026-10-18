import { useEffect, useRef, useState } from 'react'

const PRINCES = ['Beast', 'Olaf', 'Shrek'].map(name => ({ name }))
const PRINCESSES = ['Elsa', 'Anna', 'Snow White', 'Cinderella', 'Rapunzel', 'Ariel', 'Belle'].map(name => ({ name }))
// Lightweight original vector portraits: no image requests or third-party assets.
const LOOKS = {
  Elsa: { hair: '#f8e9ad', dress: '#8bd9ed', skin: '#f8d9c7', style: 'braid', bg: '#e4f8ff' },
  Anna: { hair: '#a34f27', dress: '#344f9c', skin: '#f4c8ad', style: 'braids', bg: '#fce7ee' },
  'Snow White': { hair: '#24232d', dress: '#f9d751', skin: '#f5d4bd', style: 'bob', bg: '#fff0d5' },
  Cinderella: { hair: '#e5ba61', dress: '#90c9f2', skin: '#f3d3b7', style: 'bun', bg: '#e6f2ff' },
  Rapunzel: { hair: '#e8bd49', dress: '#bd8bd6', skin: '#f5d1b5', style: 'long', bg: '#f4e7ff' },
  Ariel: { hair: '#c84935', dress: '#a87bc5', skin: '#f6c9aa', style: 'long', bg: '#e3f9f4' },
  Belle: { hair: '#75442d', dress: '#f4ca4d', skin: '#eec8a7', style: 'bun', bg: '#fff6d9' },
}
function PrincessPortrait({ name, size = 66 }) {
  const p = LOOKS[name]
  if (!p) return null
  return <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={name} style={{ display: 'block', margin: 'auto' }}>
    <circle cx="50" cy="50" r="48" fill={p.bg} />
    {p.style === 'long' && <path d="M29 38 Q18 65 21 91 L37 87 L62 87 L79 92 Q84 60 69 35Z" fill={p.hair}/>}
    {p.style === 'braids' && <><path d="M28 39 Q16 65 27 88" stroke={p.hair} strokeWidth="11" fill="none" strokeLinecap="round"/><path d="M72 39 Q84 65 73 88" stroke={p.hair} strokeWidth="11" fill="none" strokeLinecap="round"/></>}
    <path d="M27 100 Q24 76 43 71 L57 71 Q76 76 73 100Z" fill={p.dress}/>
    <path d="M44 65 L44 76 Q50 84 56 76 L56 65" fill={p.skin}/>
    <ellipse cx="50" cy="46" rx="22" ry="27" fill={p.skin}/>
    <path d="M28 43 Q20 11 48 16 Q74 10 73 43 Q62 30 50 29 Q41 38 28 43Z" fill={p.hair}/>
    {p.style === 'bob' && <><path d="M28 34 Q20 53 27 65 L34 64 L32 38" fill={p.hair}/><path d="M72 34 Q80 53 73 65 L66 64 L68 38" fill={p.hair}/><path d="M37 22 L50 15 L63 22 L50 29Z" fill="#d93d45"/></>}
    {p.style === 'bun' && <circle cx="51" cy="14" r="12" fill={p.hair}/>}
    {p.style === 'braid' && <path d="M69 33 Q87 53 76 82" stroke={p.hair} strokeWidth="12" fill="none" strokeLinecap="round"/>}
    <ellipse cx="42" cy="49" rx="2.3" ry="3" fill="#3d3440"/>
    <ellipse cx="58" cy="49" rx="2.3" ry="3" fill="#3d3440"/>
    <path d="M44 60 Q50 65 56 60" fill="none" stroke="#ba6c73" strokeWidth="2" strokeLinecap="round"/>
    <path d="M39 76 Q50 85 61 76" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2"/>
  </svg>
}

// Compact original vector caricatures inspired by familiar fairy-tale characters.
function DaddyPortrait({ name, size = 48 }) {
  const snow = name === 'Olaf'
  const ogre = name === 'Shrek'
  const skin = snow ? '#fffdf7' : ogre ? '#9fc84c' : '#ae7446'
  return <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={name} style={{ display: 'block', margin: 'auto' }}>
    <circle cx="50" cy="50" r="48" fill={snow ? '#dff3ff' : ogre ? '#e9f4d6' : '#f7e7c7'}/>
    {snow ? <>
      <circle cx="50" cy="73" r="22" fill="#fff"/>
      <circle cx="50" cy="37" r="22" fill="#fff"/>
      <path d="M43 15 L38 5 M50 15 L52 3 M56 17 L65 7" stroke="#765338" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="42" cy="34" r="3.8" fill="#292929"/><circle cx="58" cy="34" r="3.8" fill="#292929"/>
      <path d="M50 40 L73 46 L49 49Z" fill="#f28b28"/>
      <path d="M40 53 Q50 60 61 52" stroke="#333" strokeWidth="3" fill="none"/>
      <circle cx="50" cy="68" r="3" fill="#333"/><circle cx="50" cy="79" r="3" fill="#333"/>
    </> : <>
      {ogre ? <>
        <path d="M29 39 L14 25 Q10 17 19 17 L36 28 M71 39 L86 25 Q90 17 81 17 L64 28" fill={skin} stroke="#789c39" strokeWidth="3"/>
        <path d="M26 77 L22 100 H78 L74 77Z" fill="#74513c"/>
        <path d="M32 79 L43 92 L57 92 L68 79" fill="#f2e6c8"/>
      </> : <>
        <path d="M24 78 L16 100 H84 L76 78Z" fill="#375f93"/>
        <path d="M26 31 L18 13 L38 24 M74 31 L82 13 L62 24" fill="#79502c" stroke="#5d3925" strokeWidth="3"/>
        <path d="M24 29 Q15 13 35 15 L50 22 Q65 9 78 27" fill="#70482a"/>
      </>}
      <ellipse cx="50" cy="52" rx="27" ry="31" fill={skin}/>
      {ogre ? <><ellipse cx="35" cy="54" rx="9" ry="6" fill="#88b33f"/><ellipse cx="65" cy="54" rx="9" ry="6" fill="#88b33f"/></> : <ellipse cx="50" cy="61" rx="13" ry="9" fill="#d49a69"/>}
      <circle cx="40" cy="46" r="3.5" fill="#27212a"/><circle cx="60" cy="46" r="3.5" fill="#27212a"/>
      <path d="M41 69 Q50 75 59 69" stroke="#54372e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {!ogre && <path d="M26 35 Q50 20 74 35" fill="none" stroke="#70482a" strokeWidth="9" strokeLinecap="round"/>}
    </>}
  </svg>
}

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
  const [impactCamera, setImpactCamera] = useState(null)
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
    return { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height }
  }

  function vector(point) {
    const start = dragRef.current || point
    const dx = (point.x - start.x) * 190 / point.width
    const dy = (point.y - start.y) * 320 / point.height
    const distance = Math.hypot(dx, dy)
    const power = clamp(distance * 1.8 + 45, 45, 145)
    // Aim by dragging towards the target. The upward component controls loft.
    const direction = turn === 0 ? 1 : -1
    const vx = direction * (80 + power * 1.35)
    const vy = -clamp(175 - dy * 1.1, 135, 295)
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
    setImpactCamera(null)
    const start = { x: current.x, y: current.y - 27 }
    const startTime = performance.now()
    const frame = (now) => {
      const t = Math.min((now - startTime) / 1000, 4)
      const x = start.x + vx * t
      const y = start.y + vy * t + GRAVITY * t * t / 2
      const hit = Math.hypot(x - target.x, y - (target.y - 22)) < 35
      if (hit || y >= GROUND - 6 || x < -15 || x > W + 15) {
        setShot(null)
        setImpactCamera({ x: clamp(x, 0, W), y: clamp(y, -75, GROUND) })
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
          setImpactCamera(null)
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
    setImpactCamera(null)
    setSplat(null)
    setScores(initialScores())
    setTurn(0)
    setWinner(null)
  }

  const trajectory = aim ? Array.from({ length: 14 }, (_, i) => {
    const t = i * 0.105
    return { x: current.x + aim.vx * t, y: current.y - 27 + aim.vy * t + GRAVITY * t * t / 2 }
  }).filter(p => p.y < GROUND && p.x >= 0 && p.x <= W) : []

  // Follow the active player while aiming, the projectile in flight, then the impact.
  // Camera coordinates affect presentation only; projectile physics remain in world space.
  const focus = shot || impactCamera || { x: current.x, y: current.y - 32 }
  const cameraX = clamp(focus.x, 95, W - 95)
  const cameraY = clamp(focus.y - 32, 45, 90)
  const cameraView = `${cameraX - 95} ${cameraY - 160} 190 320`

  const button = { border: 0, borderRadius: 18, padding: '13px 18px', background: '#fff', color: '#65456d', fontWeight: 800, fontSize: 16, cursor: 'pointer' }
  return <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(#fff1fb,#e8f7ff)', fontFamily: 'Nunito, sans-serif', color: '#65456d', padding: '16px', boxSizing: 'border-box', textAlign: 'center' }}>
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
            <DaddyPortrait name={p.name} size={46}/><div>{p.name}</div>
          </button>)}
        </div>
        <h3 style={{ fontSize: 15, margin: '9px 0 5px' }}>Aubrielle's princess</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
          {PRINCESSES.map((p, i) => <button key={p.name} onClick={() => setPrincess(i)} aria-pressed={princess === i} style={{ ...button, minWidth: 0, padding: '6px 1px', borderRadius: 12, border: princess === i ? '3px solid #e97fae' : '3px solid transparent', fontSize: 10, overflowWrap: 'anywhere' }}>
            <PrincessPortrait name={p.name} size={43}/><div>{p.name}</div>
          </button>)}
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '8px 2px max(8px, env(safe-area-inset-bottom))' }}>
        <button onClick={() => { reset(); setSetup(false) }} style={{ ...button, background: '#a76bca', color: 'white', width: '100%', padding: '12px 20px' }}>Let's play! ✨</button>
      </div>
    </div> : <div style={{ width: '100%', maxWidth: 650, margin: '6px auto 0', minHeight: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: '8px 0' }}>{winner !== null ? (winner === 0 ? 'Daddy wins! 🎉' : 'Aubrielle wins! 🎉') : (turn === 0 ? "Daddy's turn!" : "Aubrielle's turn!")}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 17, fontWeight: 800, marginBottom: 12 }}><span>🤴 Daddy: {scores[0]} / 3</span><span>👸 Aubrielle: {scores[1]} / 3</span></div>
      <svg ref={stageRef} viewBox={cameraView} preserveAspectRatio="none" role="img" aria-label="Royal poop battle playfield. Drag to aim and release to throw." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={() => { dragRef.current = null; setAim(null) }} style={{ width: '100%', flex: 1, minHeight: 0, borderRadius: 22, touchAction: 'none', background: '#c9eeff', boxShadow: '0 8px 25px #8b75a033', userSelect: 'none' }}>
        <rect x="-200" y="-300" width="800" height="500" fill="#c9eeff" />
        <circle cx="295" cy="39" r="22" fill="#ffe68a" />
        <path d="M0 172 Q85 115 175 166 Q267 115 360 166 V240 H0Z" fill="#9ddc91" />
        <path d="M0 194 Q100 165 180 190 Q290 158 360 190 V240 H0Z" fill="#75c67b" />
        <rect x="-200" y={GROUND} width="800" height="220" fill="#6cbf75" />
        <foreignObject x="26" y="137" width="56" height="56"><DaddyPortrait name={PRINCES[prince].name} size={56}/></foreignObject>
        <foreignObject x="278" y="137" width="56" height="56"><PrincessPortrait name={PRINCESSES[princess].name} size={56}/></foreignObject>
        {trajectory.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#fff" opacity={0.9 - i * 0.04} />)}
        {shot && <text x={shot.x} y={shot.y} textAnchor="middle" fontSize="24">💩</text>}
        {splat && <g><text x={splat.x} y={splat.y} textAnchor="middle" fontSize="33">💥</text><text x={splat.x} y={splat.y - 30} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#78435b">{splat.hit ? 'SPLAT! 🎉' : 'PLOP!'}</text></g>}
        {aim && <text x={current.x} y={current.y - 52} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#745078">Power {Math.round(aim.power / 145 * 100)}%</text>}
      </svg>
      <p style={{ fontSize: 14, fontWeight: 700, margin: '8px 0', flexShrink: 0 }}>{winner !== null ? 'Hooray! Another round?' : shot || splat ? 'Here it comes!' : 'Drag on the field to aim, then let go to throw! 💩'}</p>
      {winner !== null && <button style={{ ...button, background: '#a76bca', color: 'white' }} onClick={reset}>Play again!</button>}
    </div>}
    {winner !== null && !setup && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#fff0ba,#f9d8f1,#dff5ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20, zIndex: 5, textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(28px, 8vw, 44px)', margin: 0 }}>🏆 {winner === 0 ? 'Daddy' : 'Aubrielle'} wins!</h1>
      <div style={{ fontSize: 26, fontWeight: 900 }}>{winner === 0 ? PRINCES[prince].name : PRINCESSES[princess].name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 55, transform: 'rotate(-25deg)' }}>🙌</span>
        {winner === 0 ? <DaddyPortrait name={PRINCES[prince].name} size={120}/> : <PrincessPortrait name={PRINCESSES[princess].name} size={120}/>}
        <span style={{ fontSize: 55, transform: 'rotate(25deg)' }}>🙌</span>
      </div>
      <div style={{ fontSize: 70 }}>🥇</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Three splats! Royal champion! 🎉</div>
      <button onClick={reset} style={{ ...button, background: '#a76bca', color: 'white', padding: '16px 36px' }}>Play again!</button>
      <button onClick={() => { reset(); setSetup(true) }} style={button}>Choose characters</button>
    </div>}
  </div>
}
