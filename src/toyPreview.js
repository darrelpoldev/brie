import * as THREE from 'three'

let renderer
const cache = new Map()

export function lightScene(scene) {
  scene.add(new THREE.HemisphereLight('#fff5e3', '#b8a4d5', 2.15))
  const key = new THREE.DirectionalLight('#fff6e7', 2.45)
  key.position.set(-3, 6, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight('#d6efff', 1.1)
  rim.position.set(3, 2, -4)
  scene.add(rim)
}

export function toyPreview(key, makeModel, wide = false, flat = false) {
  if (cache.has(key)) return cache.get(key)
  if (renderer === null) return null
  if (!renderer) {
    // One context renders all stills. Only the battle uses a live canvas.
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true })
    if (!context) {
      renderer = null
      return null
    }
    renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true })
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.13
  }

  const width = wide ? 840 : 160
  const height = wide ? 360 : 160
  const scene = new THREE.Scene()
  const model = makeModel()
  scene.add(model)
  lightScene(scene)
  const bounds = new THREE.Box3().setFromObject(model)
  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const half = wide ? 1.95 : Math.max(size.x, size.y, size.z) * .64
  const aspect = width / height
  const camera = new THREE.OrthographicCamera(-half * aspect, half * aspect, half, -half, .01, 100)
  camera.position.copy(center).add(new THREE.Vector3(flat ? .17 : wide ? .35 : 2.15, flat ? .12 : 2.7, 8))
  camera.lookAt(center)
  renderer.setSize(width, height, false)
  renderer.render(scene, camera)
  const url = renderer.domElement.toDataURL('image/png')
  model.userData.dispose?.()
  if (cache.size >= 240) cache.delete(cache.keys().next().value)
  cache.set(key, url)
  return url
}
