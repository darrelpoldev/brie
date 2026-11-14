import * as THREE from 'three'

const sphere = new THREE.SphereGeometry(1, 24, 16)
const box = new THREE.BoxGeometry(1, 1, 1)
const cone = new THREE.ConeGeometry(1, 1, 24)
const cylinder = new THREE.CylinderGeometry(1, 1, 1, 32)
const materials = new Map()

function material(color) {
  if (!materials.has(color)) {
    materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .52 }))
  }
  return materials.get(color)
}

function part(parent, geometry, color, position, scale, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material(color))
  mesh.position.set(...position)
  mesh.scale.set(...scale)
  mesh.rotation.set(...rotation)
  parent.add(mesh)
  return mesh
}

export const ball = (parent, color, position, scale) => part(parent, sphere, color, position, scale)
export const block = (parent, color, position, scale, rotation) => part(parent, box, color, position, scale, rotation)
export const point = (parent, color, position, scale, rotation) => part(parent, cone, color, position, scale, rotation)
export const drum = (parent, color, position, scale, rotation) => part(parent, cylinder, color, position, scale, rotation)

const shapeGeometries = new Map()
export const shapeNames = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond']

export function shapeModel(name, color) {
  const group = new THREE.Group()
  if (!shapeGeometries.has(name)) {
    const shape = new THREE.Shape()
    if (name === 'circle') {
      shape.absarc(0, 0, .74, 0, Math.PI * 2)
    } else if (name === 'heart') {
      shape.moveTo(0, -.72)
      shape.bezierCurveTo(-1.6, .35, -.42, 1.12, 0, .43)
      shape.bezierCurveTo(.42, 1.12, 1.6, .35, 0, -.72)
    } else {
      const vertices = {
        square: [[-.68, -.68], [.68, -.68], [.68, .68], [-.68, .68]],
        triangle: [[-.76, -.63], [.76, -.63], [0, .8]],
        diamond: [[0, -.82], [.75, 0], [0, .82], [-.75, 0]],
        star: Array.from({ length: 10 }, (_, i) => {
          const angle = Math.PI / 2 + i * Math.PI / 5
          const radius = i % 2 ? .38 : .86
          return [Math.cos(angle) * radius, Math.sin(angle) * radius]
        }),
      }[name]
      shape.moveTo(...vertices[0])
      vertices.slice(1).forEach(vertex => shape.lineTo(...vertex))
      shape.closePath()
    }
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: .31, bevelEnabled: true, bevelSize: .07, bevelThickness: .07, bevelSegments: 3,
    })
    geometry.translate(0, 0, -.155)
    shapeGeometries.set(name, geometry)
  }
  part(group, shapeGeometries.get(name), color, [0, 0, 0], [1, 1, 1])
  return group
}

export function castleModel() {
  const group = new THREE.Group()
  block(group, '#d69fe8', [0, .52, 0], [1.6, 1.04, .76])
  block(group, '#9062a8', [0, .34, .39], [.31, .65, .05])
  ball(group, '#9062a8', [0, .66, .41], [.155, .15, .04])
  for (const x of [-.77, 0, .77]) {
    const tall = x === 0
    const height = tall ? 1.62 : 1.25
    const z = tall ? -.16 : .15
    drum(group, '#ead2f4', [x, height / 2, z], [.25, height, .25])
    point(group, '#9762d0', [x, height + .24, z], [.34, .57, .34])
    if (tall) {
      drum(group, '#fbdb8b', [x, height + .62, z], [.025, .34, .025])
      block(group, '#f7a1ae', [x + .13, height + .72, z], [.26, .14, .045])
    } else {
      ball(group, '#76518e', [x, .83, z + .24], [.065, .125, .035])
    }
  }
  return group
}

export function cloudModel() {
  const group = new THREE.Group()
  for (const [x, y, size] of [[-.42, 0, .34], [-.06, .14, .5], [.38, .02, .37]]) {
    ball(group, '#fff9ed', [x, y, 0], [size, size * .69, size * .67])
  }
  return group
}

export function flowerModel(color) {
  const group = new THREE.Group()
  drum(group, '#48856a', [0, -.24, 0], [.045, .84, .045])
  ball(group, '#80c994', [.19, -.37, 0], [.22, .085, .11]).rotation.z = .48
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3
    ball(group, color, [Math.cos(angle) * .32, .24 + Math.sin(angle) * .32, .01], [.195, .195, .14])
  }
  ball(group, '#ffc65b', [0, .24, .135], [.205, .205, .15])
  return group
}

export function dinoModel(color, kind = 'Brachiosaurus') {
  const group = new THREE.Group()
  const longNeck = /brachio/i.test(kind)
  const flyer = /ptero/i.test(kind)
  const horned = /tricera/i.test(kind)
  const height = longNeck ? .57 : .3
  ball(group, color, [-.12, -.17, 0], [.59, .36, .37])
  ball(group, color, [-.61, -.14, 0], [.37, .12, .14]).rotation.z = -.32
  ball(group, color, [.24, .02, 0], [.19, longNeck ? .57 : .3, .21]).rotation.z = -.37
  if (horned) {
    ball(group, color, [.24, height + .02, 0], [.18, .42, .43])
    for (const z of [-.19, .19]) point(group, '#fff0c1', [.56, height + .2, z], [.075, .24, .075], [0, 0, -.7])
  }
  ball(group, color, [.43, height, 0], [.33, .26, .25])
  ball(group, '#ffe0a5', [.61, height - .085, .005], [.2, .125, .203])
  ball(group, '#302447', [.47, height + .055, .23], [.05, .067, .043])
  ball(group, '#fff', [.459, height + .077, .264], [.017, .017, .009])
  for (const x of [-.34, .18]) {
    for (const z of [-.19, .19]) ball(group, color, [x, -.43, z], [.135, .22, .14])
  }
  if (flyer) {
    for (const sign of [-1, 1]) ball(group, color, [-.12, -.05, sign * .4], [.36, .085, .5])
  } else if (/stego|anky/i.test(kind)) {
    for (const x of [-.52, -.28, -.04]) point(group, '#f9b976', [x, .2, 0], [.13, .31, .11])
  }
  return group
}

export function poopModel() {
  const group = new THREE.Group()
  ball(group, '#865032', [0, -.45, 0], [.73, .26, .5])
  ball(group, '#a56946', [0, -.17, 0], [.55, .28, .43])
  ball(group, '#b77850', [0, .12, 0], [.38, .26, .32])
  const curl = point(group, '#b77850', [.11, .38, 0], [.21, .38, .21], [0, 0, -.42])
  curl.position.z = -.04
  for (const x of [-.17, .17]) {
    ball(group, '#fff6e9', [x, -.045, .384], [.095, .115, .045])
    ball(group, '#3c2834', [x, -.047, .424], [.047, .063, .025])
  }
  ball(group, '#fff6e9', [0, -.24, .45], [.15, .045, .037])
  return group
}

export function characterModel(name, look) {
  const group = new THREE.Group()
  const snow = name === 'Olaf'
  const ogre = name === 'Shrek'
  const beast = name === 'Beast'
  const skin = look?.skin ?? (snow ? '#fffaf1' : ogre ? '#a2c757' : '#bb865f')
  const outfit = look?.dress ?? (snow ? '#fffaf1' : ogre ? '#896445' : '#35699a')
  if (look) {
    point(group, outfit, [0, .38, 0], [.62, .76, .48])
    ball(group, outfit, [0, .67, .04], [.31, .29, .24])
    ball(group, look.hair, [0, .99, -.12], [.405, look.style === 'long' ? .62 : .46, .34])
  } else {
    ball(group, outfit, [0, .39, 0], [.52, .4, .38])
    if (!snow) for (const x of [-.29, .29]) ball(group, '#493344', [x, .095, .16], [.19, .1, .27])
  }
  for (const sign of [-1, 1]) ball(group, skin, [sign * .43, .49, .14], [.14, .19, .155])
  ball(group, skin, [0, 1.04, .04], [.44, .43, .37])
  if (look) {
    ball(group, look.hair, [0, 1.34, .04], [.42, .185, .35])
    if (look.style === 'bun') ball(group, look.hair, [.04, 1.51, -.12], [.205, .177, .184])
    if (/braid/.test(look.style)) {
      for (const side of look.style === 'braids' ? [-1, 1] : [1]) {
        for (let i = 0; i < 4; i++) ball(group, look.hair, [side * (.39 + i * .018), 1.18 - i * .16, .1 + i * .02], [.105, .143, .1])
      }
    }
    if (name === 'Snow White') ball(group, '#e65c73', [0, 1.5, .21], [.21, .083, .08])
  }
  if (ogre || beast) {
    for (const sign of [-1, 1]) {
      point(group, beast ? '#704930' : skin, [sign * .42, 1.32, .035], [.14, .36, .13], [0, 0, -sign * .68])
      if (ogre) ball(group, skin, [sign * .53, 1.44, .04], [.09, .08, .083])
    }
  }
  if (beast) ball(group, '#704930', [0, 1.35, .055], [.39, .16, .34])
  if (snow) {
    point(group, '#ff9b3f', [0, 1.01, .46], [.09, .28, .09], [Math.PI / 2, 0, 0])
    for (const y of [.34, .55]) ball(group, '#604d67', [0, y, .365], [.058, .058, .047])
  } else {
    ball(group, skin, [0, 1.015, .407], [.093, .074, .065])
  }
  for (const x of [-.15, .15]) {
    ball(group, '#35233e', [x, 1.12, .39], [.055, .069, .045])
    ball(group, '#fffaf1', [x - .012, 1.14, .428], [.017, .019, .01])
    if (look) ball(group, '#ef9c9b', [x * 1.63, 1.005, .35], [.067, .038, .021])
  }
  ball(group, '#6d3c50', [0, .9, .392], [.102, .041, .033])
  return group
}

export function glyphModel(text, color = '#72489e', printedOnly = false) {
  const group = new THREE.Group()
  const tile = printedOnly ? new THREE.Group() : shapeModel('square', color)
  if (!printedOnly) tile.rotation.z = -.08
  group.add(tile)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.font = 'bold 81px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = printedOnly ? color : '#fff8e9'
  ctx.fillText(text, 64, 69, 115)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const plane = new THREE.PlaneGeometry(1.13, 1.13)
  const decal = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
  const print = new THREE.Mesh(plane, decal)
  print.position.z = .16
  tile.add(print)
  group.userData.dispose = () => { texture.dispose(); plane.dispose(); decal.dispose() }
  return group
}

export function clockModel(hour = 10) {
  const group = new THREE.Group()
  drum(group, '#8e64ba', [0, 0, 0], [.89, .29, .89], [Math.PI / 2, 0, 0])
  drum(group, '#fffaeb', [0, 0, .145], [.8, .05, .8], [Math.PI / 2, 0, 0])
  const labels = []
  for (let i = 1; i <= 12; i++) {
    const angle = i * Math.PI / 6
    const label = glyphModel(String(i), i === (hour % 12 || 12) ? '#995cb6' : '#56456f', true)
    label.scale.setScalar(.19)
    label.position.set(.62 * Math.sin(angle), .62 * Math.cos(angle), .178)
    labels.push(label)
    group.add(label)
  }
  const angle = hour * Math.PI / 6
  ball(group, '#8d55bb', [.205 * Math.sin(angle), .205 * Math.cos(angle), .22], [.048, .26, .049]).rotation.z = -angle
  ball(group, '#e4a45b', [0, 0, .273], [.096, .096, .05])
  group.userData.dispose = () => labels.forEach(label => label.userData.dispose())
  return group
}

export function productModel(name) {
  const group = new THREE.Group()
  switch (name) {
    case 'Apple':
      for (const x of [-.18, .18]) ball(group, '#e86474', [x, -.08, 0], [.48, .55, .43])
      drum(group, '#866243', [0, .5, 0], [.055, .34, .055])
      ball(group, '#65ae76', [.24, .59, 0], [.29, .1, .15]).rotation.z = .45
      break
    case 'Banana':
      for (let i = 0; i < 11; i++) {
        const angle = Math.PI + i * Math.PI / 10
        ball(group, '#f9ce5f', [Math.cos(angle) * .58, Math.sin(angle) * .58 + .25, 0], [.18, .22, .18])
      }
      ball(group, '#846447', [-.58, .39, 0], [.085, .14, .085])
      break
    case 'Carrot':
      point(group, '#f99358', [0, -.09, 0], [.37, 1.26, .34], [0, 0, 2.88])
      for (const x of [-.18, 0, .18]) ball(group, '#63a86c', [x - .16, .64, 0], [.11, .29, .1]).rotation.z = -x * 3
      break
    case 'Milk':
      block(group, '#c6e6ff', [0, -.12, 0], [.83, 1.12, .65])
      block(group, '#f9f9ee', [0, .47, 0], [.77, .17, .58])
      ball(group, '#f8faf3', [0, -.09, .334], [.22, .3, .037])
      break
    case 'Bread':
      ball(group, '#b77b52', [0, 0, 0], [.75, .56, .43])
      for (const x of [-.33, 0, .33]) ball(group, '#ecd09c', [x, .27, .318], [.08, .19, .035]).rotation.z = -.47
      break
    case 'Cookie':
      drum(group, '#dca66f', [0, 0, 0], [.72, .29, .72], [Math.PI / 2, 0, 0])
      for (const [x, y] of [[-.4, .18], [.35, .23], [-.25, -.35], [.13, -.36], [.04, .05]]) {
        ball(group, '#72462f', [x, y, .145], [.095, .09, .06])
      }
      break
  }
  return group
}

export function islandModel() {
  const group = new THREE.Group()
  ball(group, '#92b8ae', [0, -.4, 0], [2.6, .53, 1.2])
  ball(group, '#b4d9a3', [0, -.26, .04], [2.57, .25, 1.17])
  ball(group, '#efc58b', [0, -.05, .72], [1.4, .035, .23])
  const castle = castleModel()
  castle.position.set(.1, -.05, -.16)
  castle.rotation.y = -.18
  group.add(castle)
  for (const [x, y, z, color] of [[-1.8, .27, .6, '#f88da8'], [1.62, .28, .53, '#ef9db4'], [2.03, .12, .2, '#e5abed']]) {
    const flower = flowerModel(color)
    flower.scale.setScalar(.48)
    flower.position.set(x, y, z)
    group.add(flower)
  }
  for (const [x, y, color] of [[-1.6, 1, '#f7bd7a'], [1.6, 1.18, '#ee9caf'], [-2.25, 1.58, '#cf9fe9']]) {
    const star = shapeModel('star', color)
    star.position.set(x, y, .22)
    star.scale.setScalar(.32)
    star.rotation.set(.19, -.33, x / 4)
    group.add(star)
  }
  for (const [x, y, z, scale] of [[-2.45, 2.08, -.8, .77], [2.3, 1.9, -.8, 1], [-2.95, .49, -.6, .55]]) {
    const cloud = cloudModel()
    cloud.position.set(x, y, z)
    cloud.scale.setScalar(scale)
    group.add(cloud)
  }
  return group
}

export function toyModel(kind) {
  switch (kind) {
    case 'home': return islandModel()
    case 'royal-poop': return poopModel()
    case 'shapes': return shapeModel('triangle', '#74c9ca')
    case 'patterns': return shapeModel('star', '#efb35f')
    case 'letters': return glyphModel('Aa', '#a17ad4')
    case 'counting': return flowerModel('#f18d9c')
    case 'story': {
      const group = new THREE.Group()
      for (const side of [-1, 1]) {
        block(group, '#9982ce', [side * .42, -.04, -.07], [.87, 1.22, .22], [0, side * .27, side * .08])
        block(group, '#fff0cc', [side * .42, .01, .06], [.74, 1.09, .14], [0, side * .27, side * .08])
        for (const y of [-.14, .04, .22]) block(group, '#ddb593', [side * .4, y, .16], [.34, .031, .045])
      }
      return group
    }
    case 'colors': {
      const group = new THREE.Group()
      for (const [x, y, color] of [[-.39, -.26, '#f58a9c'], [.41, -.26, '#69c5cc'], [0, .34, '#f5c76e']]) {
        ball(group, color, [x, y, 0], [.43, .43, .43])
      }
      return group
    }
    case 'combine': {
      const group = new THREE.Group()
      const heart = shapeModel('heart', '#e58ebd')
      heart.scale.setScalar(.63)
      heart.position.set(-.38, .24, 0)
      heart.rotation.z = .24
      const star = shapeModel('star', '#88bde7')
      star.scale.setScalar(.59)
      star.position.set(.37, -.21, .25)
      star.rotation.z = -.23
      group.add(heart, star)
      return group
    }
    case 'time': return clockModel()
    case 'dinos': return dinoModel('#7abfa2')
    case 'cashier': {
      const group = new THREE.Group()
      block(group, '#65ad8e', [0, -.25, 0], [1.43, .58, .98])
      block(group, '#f1d7a3', [0, .075, 0], [1.55, .115, 1.04])
      block(group, '#ce94c9', [0, .34, -.13], [1.06, .43, .61], [-.26, 0, 0])
      block(group, '#514961', [0, .41, .18], [.64, .18, .052])
      for (const x of [-.25, 0, .25]) ball(group, '#fce3ae', [x, .17, .39], [.075, .051, .065])
      return group
    }
  }
}
