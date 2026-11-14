import { useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Group } from 'three'
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

function pupModel() {
  const pup = new Group()
  const navy = '#28416e', blue = '#68a8d8', pale = '#a6d1ed', cream = '#fff0d5'
  for (const side of [-1, 1]) {
    block(pup, navy, [side * .43, .85, 0], [.32, .53, .34], [0, 0, -side * .15])
    block(pup, '#eaab98', [side * .43, .9, .184], [.15, .24, .035])
    block(pup, blue, [side * .28, -.74, .08], [.34, .3, .65])
    block(pup, blue, [side * .58, -.33, .02], [.23, .46, .31], [0, 0, side * .18])
  }
  block(pup, blue, [0, -.32, 0], [.98, .72, .57])
  block(pup, pale, [0, -.34, .295], [.5, .54, .045])
  block(pup, blue, [0, .3, .015], [1.2, .87, .71])
  block(pup, navy, [-.39, .47, .376], [.39, .48, .055])
  block(pup, pale, [.16, .62, .377], [.41, .16, .04])
  for (const side of [-1, 1]) {
    ball(pup, '#fff9ee', [side * .225, .4, .43], [.145, .182, .058])
    ball(pup, '#263446', [side * .225 + .022, .412, .479], [.07, .094, .035])
    ball(pup, '#fff', [side * .225 + .004, .451, .508], [.025, .028, .012])
  }
  block(pup, cream, [.065, .078, .49], [.62, .31, .31])
  ball(pup, navy, [.14, .15, .665], [.153, .092, .067])
  ball(pup, '#9d605f', [.12, -.025, .651], [.11, .035, .027])
  return pup
}

export function BlueyArt({ size = 92 }) {
  return <RenderedToy artKey="bluey-pup" makeModel={pupModel} fallback="🐶" size={size} />
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

function Room({ opened, hiding, found, hint }) {
  const { props, pup, backdrop } = useMemo(() => {
    const backdrop = new Group()
    block(backdrop, '#f8ddbd', [0, 1.5, -1.5], [7.2, 4.3, .3])
    block(backdrop, '#e2b68f', [0, -2.1, -1.4], [7.2, 3, .3])
    block(backdrop, '#fff2d4', [0, -.66, -1.19], [7.2, .15, .13])
    for (let i = 0; i < 6; i++) block(backdrop, '#edc59f', [0, -.95 - i * .48, -1.19], [7.2, .06, .12])
    block(backdrop, '#d98e84', [0, -2.26, -1.04], [2.5, 2.2, .1])
    block(backdrop, '#edaa94', [0, -2.26, -.97], [2.22, 1.92, .09])
    for (const y of [-1.45, -3.06]) block(backdrop, '#fff0c7', [0, y, -.9], [2.09, .06, .06])
    return { backdrop, props: spots.map(makeProp), pup: pupModel() }
  }, [])
  return <Canvas orthographic camera={camera} dpr={[1, 1.5]} frameloop="demand" aria-hidden="true"
    fallback={<div className="bluey-fallback" />} gl={{ antialias: true, powerPreference: 'low-power' }}>
    <hemisphereLight args={['#fff6e4', '#b9a1b7', 2.15]} />
    <directionalLight position={[-3, 6, 6]} color="#fff2d7" intensity={2.4} />
    <primitive object={backdrop} />
    {spots.map(({ x, y, name }, index) => {
      const inspected = opened.includes(index)
      return <group key={name} position={[x, y, 0]}>
        <mesh position={[0, -.54, -.53]} scale={[1, .2, .05]}>
          <sphereGeometry args={[.9, 22, 12]} />
          <meshBasicMaterial transparent opacity={.19} color="#82564b" />
        </mesh>
        {(!inspected || index !== hiding) && <primitive object={props[index]}
          position={inspected ? [index % 2 ? .43 : -.43, -.13, -.17] : [0, 0, 0]}
          scale={inspected ? .72 : 1} rotation={[.08, index % 2 ? -.19 : .19, inspected ? .17 : 0]} />}
        {index === hiding && found && <primitive object={pup} scale={.93} />}
        {index === hiding && hint && !found && <mesh position={[.76, .64, .9]}>
          <sphereGeometry args={[.113, 16, 12]} /><meshBasicMaterial color="#fff1a4" />
        </mesh>}
      </group>
    })}
  </Canvas>
}

function newSpot(previous) {
  const offset = 1 + Math.floor(Math.random() * (spots.length - 1))
  return (previous + offset) % spots.length
}

export default function Bluey({ onBack }) {
  const [playing, setPlaying] = useState(false)
  const [hiding, setHiding] = useState(() => Math.floor(Math.random() * spots.length))
  const [opened, setOpened] = useState([])
  const startRef = useRef(null)
  const firstSpotRef = useRef(null)
  const replayRef = useRef(null)
  const found = opened.includes(hiding)
  const hint = opened.length >= 2 && !found

  function start() {
    setPlaying(true)
    requestAnimationFrame(() => firstSpotRef.current?.focus())
  }

  function search(index) {
    if (found || opened.includes(index)) return
    setOpened([...opened, index])
    if (index === hiding) requestAnimationFrame(() => replayRef.current?.focus())
  }

  function replay() {
    setHiding(newSpot(hiding))
    setOpened([])
    requestAnimationFrame(() => firstSpotRef.current?.focus())
  }

  return <main className="bluey-page">
    <div className="bluey-shell">
      <header className="bluey-nav">
        <button type="button" aria-label={playing ? 'Back to Bluey' : 'Back to playroom'} onClick={() => {
          if (!playing) return onBack()
          setPlaying(false)
          setOpened([])
          setHiding(newSpot(hiding))
          requestAnimationFrame(() => startRef.current?.focus())
        }}>←</button>
        <strong>Bluey</strong>
      </header>
      {playing ? <section className="bluey-game" aria-labelledby="hide-title">
        <h1 id="hide-title">Hide &amp; Seek</h1>
        <p role="status" className="bluey-status">{found ? 'You found Bluey!' : hint ? 'Look for the little sparkle!' : opened.length ? 'Try another hiding spot!' : 'Tap a hiding spot to find Bluey.'}</p>
        <div className="bluey-room">
          <Room opened={opened} hiding={hiding} found={found} hint={hint} />
          <div className="bluey-spots">
            {spots.map(({ name, x, y, symbol }, index) => {
              const checked = opened.includes(index)
              const isHint = hint && index === hiding
              return <button key={name} type="button" ref={index === 0 ? firstSpotRef : undefined}
                style={{ left: `${50 + x / frame * 50}%`, top: `${50 - y / frame * 50}%` }}
                className={`bluey-spot${checked ? ' checked' : ''}${isHint ? ' sparkle' : ''}`}
                aria-label={`Check the ${name.toLowerCase()}${isHint ? ', sparkling' : ''}`}
                disabled={found || checked} onClick={() => search(index)}>
                <span className="bluey-prop-fallback" aria-hidden="true">{checked && index === hiding ? '🐶' : symbol}</span>
                <span>{checked && index === hiding ? 'Found!' : checked ? 'Empty' : name}</span>
              </button>
            })}
          </div>
        </div>
        {found && <button className="bluey-primary" type="button" ref={replayRef} onClick={replay}>Play again</button>}
      </section> : <section className="bluey-intro">
        <div className="bluey-character"><BlueyArt size={184} /></div>
        <h1>Hide &amp; Seek</h1>
        <p>Bluey is hiding somewhere in the playroom.</p>
        <button className="bluey-primary" type="button" ref={startRef} onClick={start}>Find Bluey</button>
      </section>}
    </div>
  </main>
}
