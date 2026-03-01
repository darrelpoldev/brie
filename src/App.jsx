import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Audio helpers (Web Audio API, no files needed) ─────────────────────────
const audioCtx = typeof AudioContext !== 'undefined'
  ? new AudioContext()
  : typeof webkitAudioContext !== 'undefined'
    ? new webkitAudioContext()
    : null

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.12) {
  if (!audioCtx) return
  if (audioCtx.state === 'suspended') audioCtx.resume()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = volume
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

function playHappyChime() {
  playTone(523, 0.12)
  setTimeout(() => playTone(659, 0.12), 100)
  setTimeout(() => playTone(784, 0.2), 200)
}

function playWobble() {
  playTone(300, 0.15, 'triangle', 0.08)
  setTimeout(() => playTone(260, 0.15, 'triangle', 0.08), 120)
}

function playTap() {
  playTone(440, 0.06, 'sine', 0.06)
}

function playDrop() {
  playTone(350, 0.1, 'sine', 0.08)
}

// ─── Color palette ──────────────────────────────────────────────────────────
const COLORS = ['#FF8A80', '#FFAB91', '#CE93D8', '#81D4FA', '#A5D6A7', '#FFE082', '#F48FB1', '#80CBC4']

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

// ─── Shape SVG paths ────────────────────────────────────────────────────────
const SHAPE_PATHS = {
  circle: (size, color) => (
    <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill={color} />
  ),
  square: (size, color) => (
    <rect x={2} y={2} width={size - 4} height={size - 4} rx={6} fill={color} />
  ),
  triangle: (size, color) => {
    const h = size - 4
    const points = `${size / 2},2 ${size - 2},${h + 2} 2,${h + 2}`
    return <polygon points={points} fill={color} />
  },
  star: (size, color) => {
    const cx = size / 2, cy = size / 2, r1 = size / 2 - 2, r2 = r1 * 0.4
    let points = ''
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * Math.PI / 180
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
      points += `${cx + r1 * Math.cos(outerAngle)},${cy + r1 * Math.sin(outerAngle)} `
      points += `${cx + r2 * Math.cos(innerAngle)},${cy + r2 * Math.sin(innerAngle)} `
    }
    return <polygon points={points.trim()} fill={color} />
  },
  heart: (size, color) => (
    <path
      d={`M${size / 2},${size * 0.85} C${size * 0.1},${size * 0.55} ${size * 0.0},${size * 0.25} ${size * 0.25},${size * 0.15} C${size * 0.38},${size * 0.08} ${size * 0.48},${size * 0.18} ${size / 2},${size * 0.32} C${size * 0.52},${size * 0.18} ${size * 0.62},${size * 0.08} ${size * 0.75},${size * 0.15} C${size * 1.0},${size * 0.25} ${size * 0.9},${size * 0.55} ${size / 2},${size * 0.85}Z`}
      fill={color}
    />
  ),
  diamond: (size, color) => {
    const cx = size / 2, cy = size / 2, rx = size / 2 - 2, ry = size / 2 - 2
    const points = `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`
    return <polygon points={points} fill={color} />
  },
}

const SHAPE_NAMES = Object.keys(SHAPE_PATHS)

const SHAPE_EMOJIS = {
  circle: '⬤',
  square: '■',
  triangle: '▲',
  star: '★',
  heart: '♥',
  diamond: '◆',
}

function ShapeSVG({ shape, size, color }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {SHAPE_PATHS[shape](size, color)}
    </svg>
  )
}

// ─── Pattern level generator ────────────────────────────────────────────────
function generateLevel(levelNum) {
  const patternLength = Math.min(3 + Math.floor(levelNum / 3), 6)
  const usedShapes = SHAPE_NAMES.slice(0, Math.min(3 + Math.floor(levelNum / 2), 6))

  // Build a repeating pattern
  const baseLen = 2 + (levelNum % 3 === 2 ? 1 : 0)
  const base = []
  for (let i = 0; i < baseLen; i++) {
    base.push({
      shape: usedShapes[Math.floor(Math.random() * usedShapes.length)],
      color: randomColor(),
    })
  }

  const sequence = []
  for (let i = 0; i < patternLength; i++) {
    sequence.push({ ...base[i % base.length] })
  }

  const answer = { ...base[patternLength % base.length] }

  // Generate wrong choices
  const wrongChoices = []
  while (wrongChoices.length < 2) {
    const candidate = {
      shape: usedShapes[Math.floor(Math.random() * usedShapes.length)],
      color: randomColor(),
    }
    if (candidate.shape !== answer.shape || candidate.color !== answer.color) {
      wrongChoices.push(candidate)
    }
  }

  // Shuffle choices
  const choices = [answer, ...wrongChoices]
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }
  const correctIndex = choices.indexOf(answer)

  return { sequence, answer, choices, correctIndex }
}

// ─── CSS (all-in-one) ───────────────────────────────────────────────────────
const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(145deg, #FEF3E8 0%, #FDE8D8 50%, #E8F0FE 100%);
    color: #5D4E6D;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes celebrate {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.2) rotate(-5deg); }
    50% { transform: scale(1.3) rotate(5deg); }
    75% { transform: scale(1.2) rotate(-3deg); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

// ─── Inline style helpers ───────────────────────────────────────────────────
const s = {
  app: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  // Home
  home: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    gap: '20px',
    overflow: 'auto',
    position: 'relative',
  },
  title: {
    fontSize: 'clamp(48px, 12vw, 80px)',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #FF8A80, #CE93D8, #81D4FA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-1px',
    lineHeight: 1,
  },
  subtitle: {
    fontSize: 'clamp(16px, 4vw, 22px)',
    fontWeight: 600,
    color: '#9E8DAE',
    marginTop: '-8px',
  },
  toyGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '360px',
  },
  toyButton: (idx) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    borderRadius: '24px',
    border: 'none',
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    textAlign: 'left',
    animation: `float 3s ease-in-out infinite, fadeSlideIn 0.5s ease-out ${idx * 0.15}s both`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    WebkitTapHighlightColor: 'transparent',
  }),
  toyIcon: {
    fontSize: '40px',
    lineHeight: 1,
    flexShrink: 0,
  },
  toyLabel: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#5D4E6D',
  },
  toyDesc: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#A99BBE',
    marginTop: '2px',
  },
  badge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #FFE082, #FFAB91)',
    color: '#7B5E3B',
    fontWeight: 800,
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '20px',
    boxShadow: '0 2px 10px rgba(255,171,145,0.3)',
    animation: 'popIn 0.6s ease-out',
  },
  footer: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#BBA8CC',
    textAlign: 'center',
    lineHeight: 1.6,
    padding: '8px 0',
  },

  // Nav bar
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '12px',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
    flexShrink: 0,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    border: 'none',
    background: 'rgba(255,255,255,0.7)',
    fontSize: '20px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#5D4E6D',
  },

  // Shape Playground
  shapePalette: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    overflowX: 'auto',
    flexShrink: 0,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  shapeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    border: '2.5px solid rgba(255,255,255,0.8)',
    background: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: '8px',
  },
  canvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'radial-gradient(circle, #D8CDE8 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    touchAction: 'none',
  },
  clearBtn: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    padding: '12px 24px',
    borderRadius: '20px',
    border: 'none',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(8px)',
    fontSize: '14px',
    fontWeight: 700,
    color: '#9E8DAE',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    zIndex: 10,
  },

  // Pattern game
  patternArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    gap: '28px',
    overflow: 'auto',
  },
  streak: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#CE93D8',
  },
  sequenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  seqItem: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.5)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    animation: 'popIn 0.3s ease-out both',
  },
  mystery: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    border: '3px dashed #CE93D8',
    background: 'rgba(206,147,216,0.1)',
    fontSize: '28px',
    fontWeight: 800,
    color: '#CE93D8',
    animation: 'float 2s ease-in-out infinite',
  },
  choicesRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  choiceBtn: (state) => ({
    width: '72px',
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20px',
    border: state === 'correct' ? '3px solid #A5D6A7' : state === 'wrong' ? '3px solid #FF8A80' : '2.5px solid rgba(255,255,255,0.8)',
    background: state === 'correct' ? 'rgba(165,214,167,0.2)' : state === 'wrong' ? 'rgba(255,138,128,0.1)' : 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s',
    animation: state === 'correct' ? 'celebrate 0.5s ease' : state === 'wrong' ? 'shake 0.4s ease' : 'popIn 0.3s ease-out both',
    padding: '10px',
  }),
  feedback: {
    fontSize: '32px',
    fontWeight: 900,
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

// ─── Shape Playground Screen ────────────────────────────────────────────────
function ShapePlayground({ onBack }) {
  const [shapes, setShapes] = useState([])
  const canvasRef = useRef(null)
  const dragRef = useRef(null)
  const idCounter = useRef(0)

  const addShape = useCallback((shapeType) => {
    playTap()
    const size = 40 + Math.random() * 40
    const rotation = Math.floor(Math.random() * 360)
    const color = randomColor()
    const canvasEl = canvasRef.current
    const rect = canvasEl ? canvasEl.getBoundingClientRect() : { width: 300, height: 400 }
    const x = Math.random() * (rect.width - size - 20) + 10
    const y = Math.random() * (rect.height - size - 20) + 10

    setShapes(prev => [...prev, {
      id: idCounter.current++,
      shape: shapeType,
      x, y, size, rotation, color,
    }])
  }, [])

  const getPointerPos = (e) => {
    const touch = e.touches ? e.touches[0] : e
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  const handlePointerDown = (e, shapeId) => {
    e.preventDefault()
    e.stopPropagation()
    const pos = getPointerPos(e)
    const shape = shapes.find(s => s.id === shapeId)
    if (!shape) return

    dragRef.current = {
      id: shapeId,
      offsetX: pos.x - shape.x,
      offsetY: pos.y - shape.y,
    }

    // Bring to front and mark as grabbed
    setShapes(prev => {
      const idx = prev.findIndex(s => s.id === shapeId)
      if (idx === -1) return prev
      const updated = [...prev]
      const [item] = updated.splice(idx, 1)
      updated.push({ ...item, grabbed: true })
      return updated
    })
  }

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return
    e.preventDefault()
    const pos = getPointerPos(e)
    const { id, offsetX, offsetY } = dragRef.current
    setShapes(prev => prev.map(s =>
      s.id === id ? { ...s, x: pos.x - offsetX, y: pos.y - offsetY } : s
    ))
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current) return
    const id = dragRef.current.id
    dragRef.current = null
    playDrop()
    setShapes(prev => prev.map(s =>
      s.id === id ? { ...s, grabbed: false } : s
    ))
  }, [])

  const clearShapes = () => {
    playTap()
    setShapes([])
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🔷 Shape Play</span>
      </nav>

      <div style={s.shapePalette}>
        {SHAPE_NAMES.map(name => (
          <button
            key={name}
            style={s.shapeBtn}
            onClick={() => addShape(name)}
            aria-label={`Add ${name}`}
          >
            <ShapeSVG shape={name} size={36} color={COLORS[SHAPE_NAMES.indexOf(name) % COLORS.length]} />
          </button>
        ))}
      </div>

      <div
        ref={canvasRef}
        style={s.canvas}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      >
        {shapes.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: item.size,
              height: item.size,
              transform: `rotate(${item.rotation}deg) scale(${item.grabbed ? 1.15 : 1})`,
              filter: item.grabbed
                ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))'
                : 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
              transition: item.grabbed ? 'none' : 'transform 0.2s, filter 0.2s',
              cursor: item.grabbed ? 'grabbing' : 'grab',
              zIndex: item.grabbed ? 100 : 1,
              animation: 'popIn 0.3s ease-out',
              touchAction: 'none',
            }}
            onMouseDown={(e) => handlePointerDown(e, item.id)}
            onTouchStart={(e) => handlePointerDown(e, item.id)}
          >
            <ShapeSVG shape={item.shape} size={item.size} color={item.color} />
          </div>
        ))}

        {shapes.length > 0 && (
          <button style={s.clearBtn} onClick={clearShapes}>
            Clear ✨
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Pattern Sorting Game Screen ────────────────────────────────────────────
function PatternGame({ onBack }) {
  const [level, setLevel] = useState(0)
  const [data, setData] = useState(() => generateLevel(0))
  const [chosen, setChosen] = useState(null) // null | 'correct' | 'wrong'
  const [chosenIdx, setChosenIdx] = useState(null)
  const [streak, setStreak] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')

  const advance = useCallback(() => {
    const next = level + 1
    setLevel(next)
    setData(generateLevel(next))
    setChosen(null)
    setChosenIdx(null)
    setFeedbackText('')
  }, [level])

  const handleChoice = (idx) => {
    if (chosen) return
    setChosenIdx(idx)

    if (idx === data.correctIndex) {
      setChosen('correct')
      setFeedbackText('🎉 Yay!')
      setStreak(prev => prev + 1)
      playHappyChime()
      setTimeout(advance, 1200)
    } else {
      setChosen('wrong')
      setFeedbackText('Try again!')
      setStreak(0)
      playWobble()
      setTimeout(() => {
        setChosen(null)
        setChosenIdx(null)
        setFeedbackText('')
      }, 800)
    }
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🌟 Patterns</span>
      </nav>

      <div style={s.patternArea}>
        {streak > 0 && (
          <div style={s.streak}>
            {'⭐'.repeat(Math.min(streak, 10))} {streak} in a row!
          </div>
        )}

        <div style={s.sequenceRow}>
          {data.sequence.map((item, i) => (
            <div key={i} style={{ ...s.seqItem, animationDelay: `${i * 0.08}s` }}>
              <ShapeSVG shape={item.shape} size={36} color={item.color} />
            </div>
          ))}
          <div style={s.mystery}>
            {chosen === 'correct' ? (
              <ShapeSVG shape={data.answer.shape} size={36} color={data.answer.color} />
            ) : '?'}
          </div>
        </div>

        <div style={s.choicesRow}>
          {data.choices.map((item, i) => {
            let state = null
            if (chosenIdx === i) state = chosen
            return (
              <button
                key={i}
                style={s.choiceBtn(state)}
                onClick={() => handleChoice(i)}
                aria-label={`Choice ${i + 1}: ${item.shape}`}
              >
                <ShapeSVG shape={item.shape} size={44} color={item.color} />
              </button>
            )
          })}
        </div>

        <div style={{
          ...s.feedback,
          color: chosen === 'correct' ? '#A5D6A7' : '#FF8A80',
          animation: feedbackText ? 'popIn 0.3s ease-out' : 'none',
        }}>
          {feedbackText}
        </div>
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home')

  // Inject global styles once
  useEffect(() => {
    const id = 'brie-global-styles'
    if (!document.getElementById(id)) {
      const tag = document.createElement('style')
      tag.id = id
      tag.textContent = globalStyles
      document.head.appendChild(tag)
    }
  }, [])

  if (screen === 'shapes') {
    return <ShapePlayground onBack={() => setScreen('home')} />
  }

  if (screen === 'patterns') {
    return <PatternGame onBack={() => setScreen('home')} />
  }

  return (
    <div style={s.app}>
      <div style={s.home}>
        <div style={s.badge}>FREE 🎈</div>

        <h1 style={s.title}>BRIE</h1>
        <p style={s.subtitle}>Play, explore &amp; discover</p>

        <div style={s.toyGrid}>
          <button
            style={s.toyButton(0)}
            onClick={() => { playTap(); setScreen('shapes') }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            <span style={s.toyIcon}>🔷</span>
            <div>
              <div style={s.toyLabel}>Shape Play</div>
              <div style={s.toyDesc}>Drop &amp; drag colorful shapes</div>
            </div>
          </button>

          <button
            style={s.toyButton(1)}
            onClick={() => { playTap(); setScreen('patterns') }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            <span style={s.toyIcon}>🌟</span>
            <div>
              <div style={s.toyLabel}>Patterns</div>
              <div style={s.toyDesc}>Find the missing shape</div>
            </div>
          </button>
        </div>

        <footer style={s.footer}>
          No ads · No rules · No data collected · Just play 🌈
        </footer>
      </div>
    </div>
  )
}
