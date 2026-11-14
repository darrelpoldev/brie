import { useLayoutEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ball, castleModel, characterModel, cloudModel, flowerModel, poopModel } from './toyModels'

const units = 24
const worldX = x => (x - 180) / units

function View({ focus, ground }) {
  const { camera, invalidate } = useThree()
  useLayoutEffect(() => {
    const x = worldX(focus.x)
    const y = (ground - focus.y) / units
    camera.left = -95 / units
    camera.right = 95 / units
    camera.top = 160 / units
    camera.bottom = -160 / units
    camera.position.set(x, y, 16)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    invalidate()
  }, [camera, focus.x, focus.y, ground, invalidate])
  return null
}

function Landscape() {
  const scene = useMemo(() => {
    const group = new THREE.Group()
    ball(group, '#7bb895', [0, -2.4, -4], [23, 4.1, 2.9])
    ball(group, '#9dce9c', [-3, -1.85, -2.7], [13, 3.4, 1.7])
    ball(group, '#acd8a6', [6.1, -2.1, -2.6], [8, 3.8, 1.85])
    ball(group, '#92c995', [0, -4.27, -.7], [28, 4.5, .84])
    ball(group, '#ffe4a0', [5.5, 7.5, -7], [1.12, 1.12, .2])
    for (const [x, y, scale] of [[-5, 7.8, 1.55], [-.27, 8.65, .98], [4.1, 5.25, 1.32], [8.8, 8.9, 1.02]]) {
      const cloud = cloudModel()
      cloud.position.set(x, y, -4)
      cloud.scale.setScalar(scale)
      group.add(cloud)
    }
    for (const [x, y, scale] of [[-.04, .95, 1.4], [-6.85, .73, .82], [6.85, .97, 1.12]]) {
      const castle = castleModel()
      castle.position.set(x, y, -2)
      castle.scale.setScalar(scale)
      group.add(castle)
    }
    for (let index = 0; index < 11; index++) {
      const flower = flowerModel(['#f3a8b6', '#f8ca78', '#daa5e6'][index % 3])
      flower.position.set(-8 + index * 1.64, -.41 + Math.sin(index * 1.5) * .22, 1.1)
      flower.scale.setScalar(.28 + index % 3 * .06)
      group.add(flower)
    }
    return group
  }, [])
  return <primitive object={scene} />
}

function Figurine({ name, look, x, hit, turn, index }) {
  const model = useMemo(() => characterModel(name, look), [name, look])
  return <group position={[worldX(x), .03, .55]} rotation={[0, index === 0 ? .22 : -.22, hit ? (index === 0 ? .24 : -.24) : 0]}>
    <mesh position={[0, -.037, -.1]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[.82, 40]} />
      <meshBasicMaterial color={turn === index ? '#f5d38c' : '#71a281'} />
    </mesh>
    <primitive object={model} scale={hit ? 1.15 : 1.27} />
  </group>
}

export default function BattleScene({ focus, ground, players, positions, turn, hitPlayer, trajectory, landing, shot, splat, aim }) {
  const worldY = y => (ground - y) / units
  const projectile = useMemo(() => poopModel(), [])
  const current = positions[turn]
  const inHand = aim && { x: current.x + (turn === 0 ? 21 : -21), y: current.y - 35 }
  const payload = shot || inHand
  return <Canvas aria-hidden="true" orthographic camera={{ left: -95 / units, right: 95 / units, top: 160 / units, bottom: -160 / units, position: [0, 0, 16] }} frameloop="demand" dpr={[1, 1.5]}
    style={{ pointerEvents: 'none' }} gl={{ antialias: true, powerPreference: 'low-power' }}
    fallback={<span className="battle-unsupported">3D play needs WebGL 2.</span>}>
    <color attach="background" args={['#c8e7ef']} />
    <hemisphereLight args={['#fff5e3', '#b7a6c8', 2.15]} />
    <directionalLight position={[-3, 6, 7]} color="#fff3db" intensity={2.25} />
    <directionalLight position={[3, 4, -5]} color="#d6efff" intensity={1.1} />
    <View focus={focus} ground={ground} />
    <Landscape />
    {players.map((player, index) => <Figurine key={index} {...player} x={positions[index].x} hit={hitPlayer === index} turn={turn} index={index} />)}
    {trajectory.map((p, index) => <mesh key={index} position={[worldX(p.x), worldY(p.y), 1.25]}>
      <sphereGeometry args={[.085, 12, 8]} />
      <meshBasicMaterial color="#fff3c3" />
    </mesh>)}
    {landing && <mesh position={[worldX(landing.x), worldY(landing.y), 1.16]}>
      <ringGeometry args={[.33, .44, 32]} />
      <meshBasicMaterial color={landing.hit ? '#338456' : '#b35b9a'} />
    </mesh>}
    {payload && <primitive object={projectile} position={[worldX(payload.x), worldY(payload.y), 1.4]} scale={.45} rotation={[0, .2, shot ? worldX(payload.x) * .32 : -.15]} />}
    {splat && <group position={[worldX(splat.x), worldY(splat.y), 1.48]}>
      {Array.from({ length: 9 }, (_, i) => {
        const angle = i * Math.PI * 2 / 9
        return <mesh key={i} position={[Math.cos(angle) * .64, Math.sin(angle) * .57, 0]} scale={[.22, .14, .11]} rotation={[0, 0, angle]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color={i % 2 ? '#ab6e4a' : '#ffd18b'} />
        </mesh>
      })}
    </group>}
  </Canvas>
}
