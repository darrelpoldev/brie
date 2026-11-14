import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { ball, block, drum } from './toyModels'

const roomWidth = 6
const roomHeight = 6

function buildHouse(stations, makeProp) {
  const house = new Group()
  stations.forEach(({ color }, index) => {
    const room = new Group()
    room.position.x = index * roomWidth
    house.add(room)
    block(room, index === 4 ? '#bedff0' : color, [0, .92, -1.1], [6, 4.16, .22])
    block(room, index === 4 ? '#b5d694' : '#ddb486', [0, -2.04, -.85], [6, 1.92, .48])
    if (index < 4) {
      block(room, '#fff1d8', [0, -1.08, -.73], [6, .15, .18])
      for (let i = 0; i < 5; i++) block(room, '#edc498', [0, -1.29 - i * .39, -.59], [6, .044, .12])
      block(room, '#cfac85', [2.87, .84, -.72], [.26, 4.1, .23])
    }
    block(room, '#fff2d9', [1.66, 1.37, -.81], [1.63, 1.39, .22])
    block(room, '#8ecce6', [1.66, 1.37, -.67], [1.4, 1.17, .08])
    ball(room, '#fae3a2', [1.97, 1.62, -.59], [.18, .18, .04])
    block(room, '#fff2d9', [1.66, 1.37, -.57], [.065, 1.18, .075])
    block(room, '#fff2d9', [1.66, 1.37, -.57], [1.4, .065, .075])
    ball(room, index === 4 ? '#87b86f' : '#e6aa8b', [0, -2.14, -.53], [2.14, .52, .07])
    if (index === 0) {
      block(room, '#a77253', [0, -.67, -.31], [2.32, 1.16, .7])
      block(room, '#fff1d0', [0, -.07, .04], [2.52, .18, 1])
    }
    const prop = makeProp(index)
    prop.position.set(0, index === 0 ? .36 : -.47, .22)
    prop.rotation.set(.24, -.28, 0)
    prop.scale.setScalar(1.22)
    room.add(prop)
    if (index === 4) {
      for (const x of [-2, 2.35]) {
        drum(room, '#ac8664', [x, .42, -.49], [.12, 1.8, .12])
        ball(room, '#8cbc83', [x, 1.34, -.47], [.55, .57, .31])
      }
    }
  })
  return house
}

function Puppet({ model, destination, action, station }) {
  const ref = useRef(null)
  const started = useRef(null)
  const origin = useRef([destination.x, destination.y, .9])
  const effect = useRef(null)
  const reducedMotion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const invalidate = useThree(state => state.invalidate)
  useEffect(() => {
    started.current = null
    invalidate()
  }, [action, destination.x, destination.y, invalidate])
  useFrame(({ clock, invalidate: redraw }, delta) => {
    const puppet = ref.current
    const drift = destination.x - puppet.position.x
    const step = reducedMotion ? 1 : Math.min(1, delta * 15)
    if (started.current === null) started.current = clock.elapsedTime
    const elapsed = clock.elapsedTime - started.current
    const bouncing = action && elapsed < 1 && !reducedMotion
    const bounce = bouncing ? Math.abs(Math.sin(elapsed * (station === 4 ? 10 : 6))) * (1 - elapsed) : 0
    puppet.position.x += drift * step
    puppet.position.y += (destination.y + bounce * (station === 4 ? 1.65 : .45) - puppet.position.y) * step
    puppet.rotation.z = bounce * (station === 0 ? .21 : -.09)
    puppet.scale.y = station === 1 ? .45 : .59
    effect.current.visible = Boolean(action && elapsed < .9)
    effect.current.position.y = .45 + Math.min(elapsed, .9) * .62
    effect.current.scale.setScalar(Math.max(.02, 1 - elapsed))

    if ((action && elapsed < 1) || Math.abs(drift) > .005 || Math.abs(destination.y - puppet.position.y) > .005) redraw()
  })
  return <group ref={ref} position={origin.current} scale={.59}>
    <primitive object={model} />
    <group ref={effect} visible={false}>
      {[0, 1, 2].map(index => <mesh key={index} position={[(index - 1) * .36, index % 2 * .28, .5]}>
        <sphereGeometry args={[.14, 16, 12]} />
        <meshStandardMaterial color={station === 3 ? '#c7efff' : station === 0 ? '#f9857b' : '#ffe58e'} />
      </mesh>)}
    </group>
  </group>
}

export default function FamilyScene({ stations, family, places, makeCharacter, makeProp, feedback }) {
  const scenery = useMemo(() => buildHouse(stations, makeProp), [stations, makeProp])
  const dolls = useMemo(() => family.map(member => makeCharacter(member.warm, member.adult)), [family, makeCharacter])
  const halfWidth = stations.length * roomWidth / 2
  return <Canvas orthographic camera={{ left: -halfWidth, right: halfWidth, top: roomHeight / 2, bottom: -roomHeight / 2,
    position: [halfWidth - roomWidth / 2, 0, 14], rotation: [0, 0, 0] }}
    dpr={1} frameloop="demand" aria-hidden="true" fallback={<div className="family-scene-fallback" />}>
    <hemisphereLight args={['#fff4e1', '#b2abd0', 2.05]} />
    <directionalLight position={[-4, 7, 7]} color="#fff3dc" intensity={2.55} />
    <primitive object={scenery} />
    {places.map((station, index) => station === null ? null : <Puppet key={index} model={dolls[index]} station={station}
      destination={{ x: station * roomWidth + (index - 1.5) * 1.19, y: station === 4 ? -1.42 : -1.79 }}
      action={feedback?.member === index ? feedback.repeat : 0} />)}
  </Canvas>
}
