import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RenderedToy } from './ToyArt'
import { ball, block, drum, shapeModel } from './toyModels'
import './bluey.css'

const spots = [
  { name: 'Curtain', x: -2, y: 1.7, color: '#df8e8c', symbol: '▥' },
  { name: 'Bookshelf', x: 2, y: 1.7, color: '#e9ae67', symbol: '▤' },
  { name: 'Sofa', x: -2, y: -.45, color: '#78b6a3', symbol: '▰' },
  { name: 'Toy chest', x: 2, y: -.45, color: '#e5a35e', symbol: '▣' },
  { name: 'Basket', x: -2, y: -2.55, color: '#dcaa83', symbol: '▧' },
  { name: 'Pillow', x: 2, y: -2.55, color: '#c795d5', symbol: '✿' },
]

const rooms = [
  { name: 'Living room', icon: '🛋', wall: '#f8ddbd', rug: '#e1a58e', props: [0, 2, 5] },
  { name: 'Playroom', icon: '🧸', wall: '#d9e8bc', rug: '#a7c7dc', props: [1, 3, 4] },
  { name: 'Bedroom', icon: '🛏', wall: '#e6d3ed', rug: '#c2a4d8', props: [0, 4, 5] },
]
const positions = [[-2.07, .54], [2.05, .39], [.75, -1.76]]

const roundedBrick = new RoundedBoxGeometry(1, 1, 1, 4, .095)
const brickMaterials = new Map()

function brick(group, color, position, size, tilt = 0) {
  if (!brickMaterials.has(color)) {
    brickMaterials.set(color, new MeshStandardMaterial({ color, roughness: .36 }))
  }
  const piece = new Mesh(roundedBrick, brickMaterials.get(color))
  piece.position.set(...position)
  piece.scale.set(...size)
  piece.rotation.z = tilt
  group.add(piece)
}

function pupModel(bingo = false) {
  const pup = new Group()
  const dark = bingo ? '#ad522d' : '#304b85'
  const base = bingo ? '#efa356' : '#639dd7'
  const light = bingo ? '#ffcc83' : '#a4d2ef'
  const cream = '#ffecd0'

  for (const side of [-1, 1]) {
    brick(pup, dark, [side * .44, .8, 0], [.34, .59, .33], -side * .18)
    brick(pup, bingo ? '#f7ba81' : '#e4a69a', [side * .44, .87, .174], [.18, .32, .045], -side * .18)
    brick(pup, dark, [side * .24, -.7, -.01], [.41, .37, .59])
    brick(pup, light, [side * .24, -.79, .19], [.42, .2, .44])
    brick(pup, base, [side * .597, -.26, -.01], [.27, .51, .33], side * .17)
    brick(pup, light, [side * .64, -.433, .02], [.25, .17, .34], side * .17)
  }
  brick(pup, dark, [.57, -.54, -.36], [.59, .29, .3], .42)
  brick(pup, light, [.79, -.435, -.36], [.22, .28, .31], .42)
  brick(pup, base, [0, -.22, 0], [1.09, .88, .67])
  brick(pup, light, [.03, -.31, .325], [.56, .53, .055])
  brick(pup, base, [0, .32, .018], [1.24, .91, .74])
  brick(pup, dark, [-.36, .54, .382], [.49, .44, .053])
  ball(pup, dark, [-.39, .44, .389], [.255, .235, .045])
  for (const side of [-1, 1]) {
    ball(pup, light, [side * .28, .655, .407], [.139, .059, .033]).rotation.z = side * .16
    ball(pup, '#fffaf0', [side * .239, .417, .437], [.164, .219, .075])
    ball(pup, '#202a3e', [side * .239 + .041, .415, .503], [.067, .107, .032])
    ball(pup, '#fff', [side * .239 + .02, .462, .529], [.022, .028, .012])
  }
  brick(pup, cream, [.055, .071, .495], [.67, .33, .35])
  ball(pup, '#283449', [.192, .153, .683], [.161, .093, .09])
  ball(pup, '#514254', [.1, -.023, .678], [.146, .064, .03])
  ball(pup, '#f3a89d', [.137, -.048, .697], [.074, .027, .012])
  return pup
}

export function BlueyArt({ size = 92 }) {
  return <RenderedToy artKey="bluey-pup-v2" makeModel={() => pupModel()} fallback="🐶" size={size} />
}

function makeProp(spot) {
  const g = new Group()
  const { color, name } = spot
  if (name === 'Curtain') {
    block(g, '#ffebaf', [0, .69, 0], [1.6, .12, .12])
    block(g, '#88c8e1', [0, 0, -.12], [1.34, 1.25, .13])
    for (let i = 0; i < 7; i++) drum(g, i % 2 ? '#e9a29c' : color, [(i - 3) * .201, .02, .06], [.14, 1.23, .17])
    block(g, '#ffe9be', [0, -.67, .05], [1.53, .13, .32])
  } else if (name === 'Bookshelf') {
    block(g, '#b67553', [0, 0, 0], [1.56, 1.32, .41])
    for (const height of [-.64, 0, .64]) block(g, color, [0, height, .21], [1.66, .115, .49])
    for (const x of [-.77, .77]) block(g, color, [x, 0, .2], [.13, 1.35, .49])
    for (let i = 0; i < 5; i++) {
      const bg = ['#78b6a3', '#df909a', '#f8d080', '#b198cd', '#8cb9dc'][i]
      block(g, bg, [-.53 + i * .23, .27, .245], [.17, .43, .34], [0, 0, i === 4 ? -.12 : 0])
      block(g, '#f8dfad', [-.53 + i * .23, .32, .421], [.105, .032, .014])
    }
    block(g, '#8cc6b0', [.14, -.32, .27], [.75, .37, .37])
    block(g, '#f9df95', [.14, -.3, .468], [.24, .065, .04])
  } else if (name === 'Sofa') {
    ball(g, color, [0, .22, -.19], [.88, .52, .27])
    ball(g, color, [0, -.26, .08], [.91, .3, .44])
    for (const x of [-.77, .77]) ball(g, '#8cc9b5', [x, -.03, .21], [.22, .25, .4])
    block(g, '#f3c9a0', [-.31, .1, .1], [.45, .42, .27], [0, 0, .2])
    block(g, '#f4a597', [.34, .13, .13], [.4, .42, .28], [0, 0, -.21])
  } else if (name === 'Toy chest') {
    block(g, color, [0, -.13, 0], [1.53, .86, .71])
    block(g, '#f5c87b', [0, .34, 0], [1.66, .2, .83])
    for (const x of [-.53, .53]) block(g, '#efce8c', [x, -.13, .367], [.12, .89, .045])
    const star = shapeModel('star', '#fff0a5')
    star.scale.setScalar(.22)
    star.position.set(0, -.04, .4)
    g.add(star)
  } else if (name === 'Basket') {
    drum(g, color, [0, -.14, 0], [.72, .79, .47])
    for (let i = 0; i < 4; i++) drum(g, i % 2 ? '#ecc597' : '#c48f6a', [0, i * .155 - .42, 0], [.73, .067, .485])
    drum(g, '#b98161', [0, .28, 0], [.76, .12, .51])
    for (const x of [-.3, .21]) ball(g, x < 0 ? '#e7a0ad' : '#96b9df', [x, .36, .02], [.25, .19, .32])
  } else {
    ball(g, color, [0, -.15, 0], [.87, .49, .43]).rotation.z = -.19
    const heart = shapeModel('heart', '#ffe1b4')
    heart.scale.setScalar(.26)
    heart.position.set(0, -.11, .43)
    heart.rotation.z = -.18
    g.add(heart)
  }
  return g
}

const frame = 3.5
const camera = { left: -frame, right: frame, top: frame, bottom: -frame, position: [0, 0, 12] }

function HidingProp({ model, inspected, side }) {
  const ref = useRef(null)
  const progress = useRef(0)
  useFrame(({ invalidate }, delta) => {
    const target = inspected ? 1 : 0
    progress.current += (target - progress.current) * Math.min(1, delta * 13)
    if (Math.abs(target - progress.current) < .015) progress.current = target
    const amount = progress.current
    ref.current.position.set(side * .43 * amount, -.13 * amount, -.17 * amount)
    ref.current.scale.setScalar(1 - .28 * amount)
    ref.current.rotation.z = side * .19 * amount
    if (amount !== target) invalidate()
  })
  return <group ref={ref}><primitive object={model} rotation={[.08, -side * .19, 0]} /></group>
}

function Reveal({ model }) {
  const ref = useRef(null)
  const start = useRef(null)
  useFrame(({ clock, invalidate }) => {
    start.current ??= clock.elapsedTime
    const time = Math.min(1, (clock.elapsedTime - start.current) / .66)
    ref.current.scale.setScalar(.62 + Math.sin(time * Math.PI / 2) * .43)
    ref.current.position.set(-.13, Math.sin(time * Math.PI) * .37 + .19, .64)
    ref.current.rotation.y = Math.sin(time * Math.PI) * .65 - .17
    if (time < 1) invalidate()
  })
  return <group ref={ref}><primitive object={model} /></group>
}

function Room({ room, opened, hiding, found, hint, friend, guidePosition }) {
  const { props, pup, guide, backdrop } = useMemo(() => {
    const backdrop = new Group()
    block(backdrop, room.wall, [0, 1.5, -1.5], [7.2, 4.3, .3])
    block(backdrop, '#e2b68f', [0, -2.1, -1.4], [7.2, 3, .3])
    block(backdrop, '#fff2d4', [0, -.66, -1.19], [7.2, .15, .13])
    for (let i = 0; i < 6; i++) block(backdrop, '#edc59f', [0, -.95 - i * .48, -1.19], [7.2, .06, .12])
    block(backdrop, '#d98e84', [0, -2.26, -1.04], [2.5, 2.2, .1])
    block(backdrop, room.rug, [0, -2.26, -.97], [2.22, 1.92, .09])
    for (const y of [-1.45, -3.06]) block(backdrop, '#fff0c7', [0, y, -.9], [2.09, .06, .06])
    // Printed wall trim, a garden window, and exposed studs give the
    // scene the depth of a toy set viewed with the front wall removed.
    brick(backdrop, '#cc8c58', [0, 2.7, -1.34], [2.02, 1.34, .24])
    brick(backdrop, '#8ecbe5', [0, 2.72, -1.19], [1.78, 1.11, .07])
    ball(backdrop, '#fff0b1', [.51, 2.99, -1.13], [.21, .21, .022])
    ball(backdrop, '#a1cb81', [-.55, 2.27, -1.12], [.77, .22, .045])
    ball(backdrop, '#81b58a', [.56, 2.26, -1.11], [.71, .21, .045])
    for (const x of [-.9, 0, .9]) block(backdrop, '#fff1d2', [x, 2.7, -1.04], [.075, 1.18, .15])
    block(backdrop, '#fff1d2', [0, 2.68, -1.02], [1.89, .07, .14])
    block(backdrop, '#fff1d2', [0, 2.11, -1.03], [2.12, .14, .36])
    for (let i = 0; i < 14; i++) {
      drum(backdrop, '#c8815e', [(i - 6.5) * .49, -3.29, -.79], [.14, .1, .12], [Math.PI / 2, 0, 0])
    }
    for (const [x, y, color] of [[-3.13, 2.65, '#eab66e'], [3.05, 2.58, '#e59196'], [-3.04, -.01, '#e7ab61']]) {
      const star = shapeModel('star', color)
      star.scale.setScalar(.17)
      star.position.set(x, y, -1.15)
      backdrop.add(star)
    }
    return { backdrop, props: room.props.map(index => makeProp(spots[index])), pup: pupModel(friend === 'Bingo'), guide: pupModel(friend !== 'Bingo') }
  }, [room, friend])
  return <Canvas orthographic camera={camera} dpr={[1, 1.5]} frameloop="demand" aria-hidden="true"
    fallback={<div className="bluey-fallback" />} gl={{ antialias: true, powerPreference: 'low-power' }}>
    <hemisphereLight args={['#fff6e4', '#b9a1b7', 2.15]} />
    <directionalLight position={[-3, 6, 6]} color="#fff2d7" intensity={2.4} />
    <primitive object={backdrop} />
    <SearchGuide model={guide} target={guidePosition} />
    {positions.map(([x, y], index) => {
      const { name } = spots[room.props[index]]
      const inspected = opened.includes(index)
      return <group key={name} position={[x, y, 0]}>
        <mesh position={[0, -.54, -.53]} scale={[1, .2, .05]}>
          <sphereGeometry args={[.9, 22, 12]} />
          <meshBasicMaterial transparent opacity={.19} color="#82564b" />
        </mesh>
        <HidingProp model={props[index]} inspected={inspected} side={index % 2 ? 1 : -1} />
        {index === hiding && found && <Reveal model={pup} />}
        {index === hiding && hint && !found && <group position={[.64, .71, .52]} rotation={[0, 0, -.26]}>
          <mesh position={[-.12, 0, 0]}><boxGeometry args={[.15, .31, .14]} />
            <meshStandardMaterial color={friend === 'Bingo' ? '#ad522d' : '#304b85'} /></mesh>
          <mesh position={[.13, .035, 0]}><boxGeometry args={[.15, .33, .14]} />
            <meshStandardMaterial color={friend === 'Bingo' ? '#efa356' : '#639dd7'} /></mesh>
        </group>}
      </group>
    })}
  </Canvas>
}

function SearchGuide({ model, target }) {
  const ref = useRef(null)
  useFrame(({ invalidate }, delta) => {
    const position = ref.current.position
    const step = Math.min(1, delta * 8)
    position.x += (target[0] - position.x) * step
    position.y += (target[1] - position.y) * step
    const distance = Math.hypot(target[0] - position.x, target[1] - position.y)
    ref.current.rotation.y = target[0] > position.x ? .34 : -.19
    if (distance > .015) invalidate()
  })
  return <group ref={ref} position={[-2.32, -2.26, 1]} scale={.78}><primitive object={model} /></group>
}

function hideFriend(previousRoom) {
  return {
    room: (previousRoom + 1 + Math.floor(Math.random() * (rooms.length - 1))) % rooms.length,
    prop: Math.floor(Math.random() * positions.length),
  }
}

export default function Bluey({ onBack }) {
  const [playing, setPlaying] = useState(false)
  const [hiding, setHiding] = useState(() => hideFriend(0))
  const [roomIndex, setRoomIndex] = useState(0)
  const [round, setRound] = useState(0)
  const [checked, setChecked] = useState({})
  const [lastProp, setLastProp] = useState(null)
  const [clue, setClue] = useState(false)
  const [walkTarget, setWalkTarget] = useState(null)
  const [note, setNote] = useState(null)
  const gesture = useRef(null)
  const friend = round % 2 === 0 ? 'Bingo' : 'Bluey'
  const seeker = friend === 'Bingo' ? 'Bluey' : 'Bingo'
  const room = rooms[roomIndex]
  const opened = checked[roomIndex] ?? []
  const rightRoom = roomIndex === hiding.room
  const found = Boolean(checked[hiding.room]?.includes(hiding.prop))
  const hint = rightRoom && clue && !found
  const guidePosition = walkTarget ?? (lastProp === null ? [-2.32, -2.26] : [positions[lastProp][0] - .68, positions[lastProp][1] - .61])
  const startRef = useRef(null)
  const audioRef = useRef(null)
  const firstSpotRef = useRef(null)
  const replayRef = useRef(null)
  useEffect(() => () => { audioRef.current?.close().catch(() => {}) }, [])

  function playNotes(notes) {
    const Audio = window.AudioContext || window.webkitAudioContext
    if (!Audio) return
    const audio = audioRef.current ??= new Audio()
    if (audio.state === 'suspended') audio.resume().catch(() => {})
    const now = audio.currentTime
    for (const [index, note] of notes.entries()) {
      const tone = audio.createOscillator()
      const gain = audio.createGain()
      const start = now + index * .09
      tone.frequency.value = note
      gain.gain.setValueAtTime(.09, start)
      gain.gain.exponentialRampToValueAtTime(.001, start + .21)
      tone.connect(gain).connect(audio.destination)
      tone.start(start)
      tone.stop(start + .22)
    }
  }

  function start() {
    setPlaying(true)
    requestAnimationFrame(() => firstSpotRef.current?.focus())
  }

  function search(index) {
    if (found || opened.includes(index)) return
    setWalkTarget(null)
    setLastProp(index)
    setChecked({ ...checked, [roomIndex]: [...opened, index] })
    if (rightRoom && index === hiding.prop) {
      playNotes([523, 659, 784])
      requestAnimationFrame(() => replayRef.current?.focus())
    } else {
      playNotes([392, 523])
      setClue(true)
    }
  }

  function moveTo(index) {
    setRoomIndex(index)
    setWalkTarget(null)
    setNote(null)
    setLastProp(null)
  }

  function reset(nextRound) {
    setHiding(hideFriend(hiding.room))
    setRound(nextRound)
    setChecked({})
    setLastProp(null)
    setClue(false)
    setRoomIndex(0)
    setWalkTarget(null)
    setNote(null)
  }

  function beginGesture(event) {
    if (found || !event.isPrimary || event.target.closest('button')) return
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function endGesture(event) {
    const start = gesture.current
    if (start?.id !== event.pointerId) return
    gesture.current = null
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      moveTo((roomIndex + (dx < 0 ? 1 : rooms.length - 1)) % rooms.length)
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width * 7 - 3.5
    const y = 3.5 - (event.clientY - bounds.top) / bounds.height * 7
    setWalkTarget([Math.max(-2.6, Math.min(2.6, x)), Math.max(-2.55, Math.min(.1, y))])
  }

  const message = found
    ? `You found ${friend}!`
    : clue
      ? rightRoom ? 'Look! Someone’s peeking out.' : `I hear a giggle in the ${rooms[hiding.room].name.toLowerCase()}!`
      : `Help ${seeker} find ${friend}.`

  return <main className="bluey-page">
    <div className="bluey-shell">
      <header className="bluey-nav">
        <button type="button" aria-label={playing ? 'Back to Bluey' : 'Back to playroom'} onClick={() => {
          if (!playing) return onBack()
          setPlaying(false)
          reset(0)
          requestAnimationFrame(() => startRef.current?.focus())
        }}>←</button>
        <strong>Bluey</strong>
      </header>
      {playing ? <section className="bluey-game" aria-labelledby="hide-title">
        <h1 id="hide-title">Hide &amp; Seek</h1>
        <p role="status" className="bluey-status">{message}</p>
        <nav className="bluey-rooms" aria-label="Rooms">
          {rooms.map(({ name, icon }, index) => <button key={name} type="button"
            aria-current={roomIndex === index ? 'location' : undefined}
            className={clue && !found && index === hiding.room && !rightRoom ? 'room-clue' : undefined}
            onClick={() => moveTo(index)} disabled={found}>
            <span aria-hidden="true">{icon}</span>{name}
          </button>)}
        </nav>
        <div className="bluey-room" aria-label={room.name}
          onPointerDown={beginGesture} onPointerUp={endGesture} onPointerCancel={() => { gesture.current = null }}>
          <Room key={roomIndex} room={room} guidePosition={guidePosition} friend={friend}
            opened={opened} hiding={rightRoom ? hiding.prop : -1} found={found} hint={hint} />
          <div className="bluey-spots">
            {positions.map(([x, y], index) => {
              const { name, symbol } = spots[room.props[index]]
              const inspected = opened.includes(index)
              const isHint = hint && index === hiding.prop
              const isFound = found && rightRoom && index === hiding.prop
              return <button key={name} type="button" ref={index === 0 ? firstSpotRef : undefined}
                style={{ left: `${50 + x / frame * 50}%`, top: `${50 - y / frame * 50}%` }}
                className={`bluey-spot${inspected ? ' checked' : ''}${isHint ? ' sparkle' : ''}`}
                aria-label={`Check the ${name.toLowerCase()}${isHint ? ', sparkling' : ''}`}
                disabled={found || inspected} onClick={() => search(index)}>
                <span className="bluey-prop-fallback" aria-hidden="true">{isFound ? '🐶' : symbol}</span>
                <span>{isFound ? 'Found!' : inspected ? 'Empty' : name}</span>
              </button>
            })}
          </div>
        </div>
        {roomIndex === 1 && !found && <div className="bluey-xylophone" role="group" aria-label="Play the xylophone">
          {['Red', 'Yellow', 'Green', 'Blue'].map((color, index) => <button key={color}
            type="button" aria-label={`Play the ${color.toLowerCase()} key`}
            className={note === index ? 'played' : undefined}
            style={{ backgroundColor: ['#f39791', '#f5cf70', '#92c78b', '#91c3ed'][index] }}
            onClick={() => {
              setNote(index)
              playNotes([[523, 659, 784, 1047][index]])
            }}>♪</button>)}
        </div>}
        {!found && <button className="bluey-listen" type="button" onClick={() => { playNotes([587, 740, 659]); setClue(true) }} disabled={clue}>Listen for a giggle</button>}
        {found && <button className="bluey-primary" type="button" ref={replayRef} onClick={() => {
          reset(round + 1)
          requestAnimationFrame(() => firstSpotRef.current?.focus())
        }}>Your turn, {friend}! →</button>}
      </section> : <section className="bluey-intro">
        <div className="bluey-character"><BlueyArt size={184} /></div>
        <h1>Hide &amp; Seek</h1>
        <p>Bingo is hiding somewhere in the house.</p>
        <button className="bluey-primary" type="button" ref={startRef} onClick={start}>Find Bingo</button>
      </section>}
    </div>
  </main>
}
