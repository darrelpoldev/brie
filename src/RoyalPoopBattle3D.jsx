import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

const COLORS = { sky: '#e4f8ff', grass: '#9ddc91', hill: '#75c67b', purple: '#a76bca', pink: '#f49ac1', cream: '#fff4b3' }
const roster = [{ name: 'Olaf', color: '#fffdf7' }, { name: 'Shrek', color: '#9fc84c' }, { name: 'Beast', color: '#ae7446' }]
const partners = [{ name: 'Elsa', color: '#8bd9ed' }, { name: 'Anna', color: '#344f9c' }, { name: 'Snow White', color: '#f9d751' }, { name: 'Cinderella', color: '#90c9f2' }, { name: 'Rapunzel', color: '#bd8bd6' }, { name: 'Ariel', color: '#a87bc5' }, { name: 'Belle', color: '#f4ca4d' }]
const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

function Character({ position, color, active, hit, winner }) {
  const body = useRef()
  useFrame(({ clock }) => {
    if (!body.current) return
    const t = clock.getElapsedTime()
    body.current.position.y = Math.sin(t * (winner ? 8 : 3)) * (winner ? 0.16 : 0.055)
    body.current.rotation.z = hit ? Math.sin(t * 22) * 0.17 : Math.sin(t * 2) * 0.025
  })
  return <group position={position}>
    <group ref={body}>
      <mesh position={[0, 0.65, 0]} castShadow><capsuleGeometry args={[0.42, 0.6, 5, 12]}/><meshStandardMaterial color={color} roughness={0.9}/></mesh>
      <mesh position={[0, 1.48, 0]} castShadow><sphereGeometry args={[0.49, 20, 16]}/><meshStandardMaterial color={color} roughness={0.9}/></mesh>
      {[-0.17, 0.17].map(x => <mesh key={x} position={[x, 1.55, 0.45]}><sphereGeometry args={[0.055, 10, 8]}/><meshBasicMaterial color="#352d42"/></mesh>)}
      <mesh position={[0, 1.33, 0.46]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.12, 0.022, 8, 16, Math.PI]}/><meshBasicMaterial color="#965a6b"/></mesh>
      {[-1, 1].map(side => <mesh key={side} position={[side * 0.51, winner ? 1.42 : 0.87, 0]} rotation={[0, 0, side * (winner ? -0.75 : 0.35)]} castShadow><capsuleGeometry args={[0.11, 0.42, 4, 8]}/><meshStandardMaterial color={color}/></mesh>)}
      {active && <mesh position={[0, 2.2, 0]}><torusGeometry args={[0.22, 0.045, 8, 24]}/><meshBasicMaterial color={COLORS.cream}/></mesh>}
    </group>
  </group>
}

function CameraRig({ focus }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    const desired = new THREE.Vector3(focus.x, focus.y, 12 / focus.zoom)
    camera.position.lerp(desired, 1 - Math.exp(-4 * delta))
    camera.lookAt(focus.x, focus.y, 0)
  })
  return null
}

function Scene({ turn, player, partner, projectile, focus, hit, winner }) {
  return <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'low-power' }} camera={{ position: [0, 2, 12], fov: 42 }} style={{ touchAction: 'none' }}>
    <color attach="background" args={[COLORS.sky]}/>
    <ambientLight intensity={1.7}/>
    <directionalLight position={[-3, 8, 6]} intensity={2} castShadow shadow-mapSize={[512, 512]}/>
    <CameraRig focus={focus}/>
    <mesh position={[0, -0.35, -2]}><sphereGeometry args={[7, 24, 16]}/><meshStandardMaterial color={COLORS.hill} roughness={1}/></mesh>
    <mesh position={[0, -0.32, 0]} receiveShadow><boxGeometry args={[18, 0.35, 5]}/><meshStandardMaterial color={COLORS.grass}/></mesh>
    <Character position={[-3, -0.1, 0]} color={roster[player].color} active={turn === 0 && winner === null} hit={hit === 0} winner={winner === 0}/>
    <Character position={[3, -0.1, 0]} color={partners[partner].color} active={turn === 1 && winner === null} hit={hit === 1} winner={winner === 1}/>
    {projectile && <mesh position={[projectile.x, projectile.y, 0.6]} castShadow><sphereGeometry args={[0.22, 14, 10]}/><meshStandardMaterial color="#9d673e" roughness={0.95}/></mesh>}
  </Canvas>
}

export default function RoyalPoopBattle3D({ onBack }) {
  const [setup, setSetup] = useState(true)
  const [player, setPlayer] = useState(0)
  const [partner, setPartner] = useState(0)
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [winner, setWinner] = useState(null)
  const [projectile, setProjectile] = useState(null)
  const [hit, setHit] = useState(null)
  const [focus, setFocus] = useState({ x: -3, y: 1, zoom: 1.3 })
  const [message, setMessage] = useState('Drag to aim, release to throw!')
  const pointer = useRef(null)
  const timers = useRef([])
  const frame = useRef(null)
  useEffect(() => () => { timers.current.forEach(clearTimeout); cancelAnimationFrame(frame.current) }, [])
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }
  function reset() { timers.current.forEach(clearTimeout); timers.current = []; cancelAnimationFrame(frame.current); setTurn(0); setScores([0, 0]); setWinner(null); setHit(null); setProjectile(null); setFocus({ x: -3, y: 1, zoom: 1.3 }); setMessage('Drag to aim, release to throw!') }
  function throwBall(dx, dy) {
    if (projectile || winner !== null || setup) return
    const side = turn === 0 ? -1 : 1
    const start = performance.now()
    const duration = 1150
    const distance = clamp(Math.hypot(dx, dy), 0, 160)
    const hitTarget = distance > 35 ? Math.abs(dy) < 115 : true
    const endX = hitTarget ? -side * 3 : -side * 1.7
    setMessage('Here it comes!')
    setFocus({ x: side * 3, y: 1.2, zoom: 1.65 })
    later(() => {
      const begin = performance.now()
      function tick(now) {
        const t = clamp((now - begin) / duration, 0, 1)
        const x = side * 3 + (endX - side * 3) * t
        const y = 1.05 + Math.sin(Math.PI * t) * 2.5
        setProjectile({ x, y })
        setFocus({ x: x * 0.65, y: y * 0.45 + 0.65, zoom: 1.12 })
        if (t < 1) frame.current = requestAnimationFrame(tick)
        else {
          setProjectile(null)
          setFocus({ x: endX, y: 1.1, zoom: 1.65 })
          if (hitTarget) {
            setHit(1 - turn)
            setMessage('SPLAT! Great throw!')
            const next = [...scores]; next[turn] += 1; setScores(next)
            if (next[turn] >= 3) { setWinner(turn); setMessage('Royal champion!') }
            else later(() => { setHit(null); setTurn(1 - turn); setFocus({ x: -side * 3, y: 1, zoom: 1.3 }); setMessage('Your turn! Drag and throw!') }, 1100)
          } else {
            setMessage('PLOP! Try again!')
            later(() => { setTurn(1 - turn); setFocus({ x: -side * 3, y: 1, zoom: 1.3 }); setMessage('Your turn!') }, 1100)
          }
        }
      }
      frame.current = requestAnimationFrame(tick)
    }, 280)
  }
  const button = { border: 0, borderRadius: 18, padding: '12px 18px', fontWeight: 800, background: '#fff', color: '#77518c', fontSize: 16 }
  return <div style={{ minHeight: '100dvh', background: '#fce7ee', color: '#77518c', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, boxSizing: 'border-box', gap: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 550 }}><button style={button} onClick={onBack}>← Back</button><strong>Royal Poop Battle · 3D prototype</strong></div>
    {setup ? <div style={{ width: '100%', maxWidth: 450, display: 'grid', gap: 14, textAlign: 'center' }}>
      <h2 style={{ margin: 4 }}>Choose your characters!</h2>
      <strong>Daddy</strong><div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>{roster.map((p, i) => <button key={p.name} onClick={() => setPlayer(i)} style={{ ...button, background: player === i ? '#e6d2f5' : '#fff' }}>{p.name}</button>)}</div>
      <strong>Aubrielle</strong><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>{partners.map((p, i) => <button key={p.name} onClick={() => setPartner(i)} style={{ ...button, background: partner === i ? '#e6d2f5' : '#fff' }}>{p.name}</button>)}</div>
      <button style={{ ...button, background: COLORS.purple, color: 'white', fontSize: 22 }} onClick={() => setSetup(false)}>Let's play!</button>
    </div> : <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 550, fontWeight: 800 }}><span>Daddy {scores[0]} / 3</span><span>Aubrielle {scores[1]} / 3</span></div>
      <div onPointerDown={e => { if (winner !== null || projectile) return; pointer.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId) }} onPointerUp={e => { if (!pointer.current) return; const dx = e.clientX - pointer.current.x, dy = e.clientY - pointer.current.y; pointer.current = null; if (Math.hypot(dx, dy) > 12) throwBall(dx, dy) }} onPointerCancel={() => { pointer.current = null }} style={{ width: '100%', maxWidth: 550, height: 'min(67dvh, 650px)', minHeight: 320, borderRadius: 24, overflow: 'hidden', touchAction: 'none', boxShadow: '0 8px 30px #77518c22' }}>
        <Scene turn={turn} player={player} partner={partner} projectile={projectile} focus={focus} hit={hit} winner={winner}/>
      </div>
      <strong style={{ textAlign: 'center', fontSize: 19 }}>{winner !== null ? (winner === 0 ? 'Daddy' : 'Aubrielle') + ' wins! 🥇' : message}</strong>
      {winner !== null && <button style={{ ...button, background: COLORS.purple, color: 'white' }} onClick={reset}>Play again!</button>}
      <button style={button} onClick={() => { reset(); setSetup(true) }}>Choose characters</button>
    </>}
  </div>
}
