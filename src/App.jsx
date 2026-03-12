import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Audio helpers (Web Audio API, no files needed) ─────────────────────────
let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = typeof AudioContext !== 'undefined'
      ? new AudioContext()
      : typeof webkitAudioContext !== 'undefined'
        ? new webkitAudioContext()
        : null
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.12) {
  const ctx = getAudioCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = volume
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
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

function playLetterSound(idx) {
  const freq = 262 + idx * 28
  playTone(freq, 0.3, 'sine', 0.1)
  setTimeout(() => playTone(freq * 1.5, 0.15, 'sine', 0.06), 150)
}

function playPlant() {
  playTone(440, 0.1, 'sine', 0.08)
  setTimeout(() => playTone(554, 0.1, 'sine', 0.08), 80)
  setTimeout(() => playTone(659, 0.15, 'sine', 0.08), 160)
}

function playPageTurn() {
  playTone(500, 0.08, 'sine', 0.06)
  setTimeout(() => playTone(600, 0.08, 'sine', 0.06), 60)
}

function playMix() {
  playTone(400, 0.15, 'triangle', 0.08)
  setTimeout(() => playTone(500, 0.15, 'triangle', 0.08), 100)
  setTimeout(() => playTone(650, 0.25, 'sine', 0.1), 200)
}

function playStoryReveal() {
  playTone(392, 0.15, 'sine', 0.08)
  setTimeout(() => playTone(494, 0.15, 'sine', 0.08), 150)
  setTimeout(() => playTone(587, 0.15, 'sine', 0.08), 300)
  setTimeout(() => playTone(784, 0.3, 'sine', 0.1), 450)
}

function playCombine() {
  playTone(330, 0.12, 'sine', 0.1)
  setTimeout(() => playTone(440, 0.12, 'sine', 0.1), 100)
  setTimeout(() => playTone(554, 0.12, 'sine', 0.1), 200)
  setTimeout(() => playTone(659, 0.25, 'sine', 0.12), 300)
}

// ─── Dinosaur sounds ────────────────────────────────────────────────────────
function playDinoRoar() {
  // Deep rumbling roar (T-Rex)
  const ctx = getAudioCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(120, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.5)
  setTimeout(() => {
    playTone(80, 0.3, 'sawtooth', 0.1)
  }, 200)
}

function playDinoStomp() {
  // Heavy stomping (Brachiosaurus)
  playTone(60, 0.25, 'square', 0.12)
  setTimeout(() => playTone(50, 0.3, 'square', 0.1), 200)
  setTimeout(() => playTone(80, 0.15, 'sine', 0.06), 350)
}

function playDinoChirp() {
  // High-pitched chirpy call (Parasaurolophus)
  playTone(600, 0.15, 'sine', 0.1)
  setTimeout(() => playTone(800, 0.15, 'sine', 0.1), 120)
  setTimeout(() => playTone(700, 0.2, 'sine', 0.08), 240)
  setTimeout(() => playTone(900, 0.25, 'sine', 0.1), 360)
}

function playDinoFlap() {
  // Flapping/swooshing (Pteranodon)
  playTone(300, 0.08, 'triangle', 0.08)
  setTimeout(() => playTone(500, 0.08, 'triangle', 0.08), 80)
  setTimeout(() => playTone(350, 0.08, 'triangle', 0.06), 160)
  setTimeout(() => playTone(550, 0.1, 'triangle', 0.08), 240)
}

function playDinoRattle() {
  // Rattling/clicking (Stegosaurus tail plates)
  playTone(200, 0.06, 'square', 0.06)
  setTimeout(() => playTone(250, 0.06, 'square', 0.06), 70)
  setTimeout(() => playTone(180, 0.06, 'square', 0.06), 140)
  setTimeout(() => playTone(220, 0.08, 'square', 0.06), 210)
  setTimeout(() => playTone(300, 0.12, 'sine', 0.08), 280)
}

function playDinoHonk() {
  // Horn-like honk (Triceratops)
  playTone(180, 0.2, 'sawtooth', 0.1)
  setTimeout(() => playTone(220, 0.25, 'sawtooth', 0.12), 150)
  setTimeout(() => playTone(160, 0.15, 'sawtooth', 0.08), 350)
}

function playDinoSnap() {
  // Quick snapping bite (Velociraptor)
  playTone(400, 0.05, 'square', 0.1)
  setTimeout(() => playTone(350, 0.05, 'square', 0.1), 60)
  setTimeout(() => playTone(500, 0.08, 'sine', 0.08), 120)
  setTimeout(() => playTone(600, 0.06, 'sine', 0.06), 180)
}

function playDinoSplash() {
  // Water splash (Spinosaurus)
  const ctx = getAudioCtx()
  if (!ctx) return
  const bufferSize = ctx.sampleRate * 0.3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3)) * 0.08
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start()
  playTone(100, 0.3, 'sawtooth', 0.1)
}

// ─── Dinosaur Data ──────────────────────────────────────────────────────────
const DINOSAURS = [
  {
    name: 'T-Rex',
    fullName: 'Tyrannosaurus Rex',
    emoji: '🦖',
    color: '#66BB6A',
    fact: 'King of the dinosaurs!',
    playSound: playDinoRoar,
    bgColor: '#E8F5E9',
  },
  {
    name: 'Brachio',
    fullName: 'Brachiosaurus',
    emoji: '🦕',
    color: '#42A5F5',
    fact: 'Super tall and gentle!',
    playSound: playDinoStomp,
    bgColor: '#E3F2FD',
  },
  {
    name: 'Para',
    fullName: 'Parasaurolophus',
    emoji: '🦎',
    color: '#AB47BC',
    fact: 'Has a cool head crest!',
    playSound: playDinoChirp,
    bgColor: '#F3E5F5',
  },
  {
    name: 'Ptero',
    fullName: 'Pteranodon',
    emoji: '🦅',
    color: '#FFA726',
    fact: 'Flies through the sky!',
    playSound: playDinoFlap,
    bgColor: '#FFF3E0',
  },
  {
    name: 'Stego',
    fullName: 'Stegosaurus',
    emoji: '🐊',
    color: '#EF5350',
    fact: 'Has cool back plates!',
    playSound: playDinoRattle,
    bgColor: '#FFEBEE',
  },
  {
    name: 'Tricera',
    fullName: 'Triceratops',
    emoji: '🦏',
    color: '#26A69A',
    fact: 'Three horns on its head!',
    playSound: playDinoHonk,
    bgColor: '#E0F2F1',
  },
  {
    name: 'Raptor',
    fullName: 'Velociraptor',
    emoji: '🐉',
    color: '#FF7043',
    fact: 'Small but super fast!',
    playSound: playDinoSnap,
    bgColor: '#FBE9E7',
  },
  {
    name: 'Spino',
    fullName: 'Spinosaurus',
    emoji: '🐲',
    color: '#5C6BC0',
    fact: 'Loves to swim in rivers!',
    playSound: playDinoSplash,
    bgColor: '#E8EAF6',
  },
]

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

// ─── Letter Land Data ──────────────────────────────────────────────────────
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const LETTER_DATA = {
  A: [{ word: 'Apple', emoji: '🍎' }, { word: 'Ant', emoji: '🐜' }, { word: 'Airplane', emoji: '✈️' }, { word: 'Avocado', emoji: '🥑' }],
  B: [{ word: 'Bear', emoji: '🐻' }, { word: 'Ball', emoji: '⚽' }, { word: 'Balloon', emoji: '🎈' }, { word: 'Butterfly', emoji: '🦋' }],
  C: [{ word: 'Cat', emoji: '🐱' }, { word: 'Cookie', emoji: '🍪' }, { word: 'Car', emoji: '🚗' }, { word: 'Cow', emoji: '🐮' }],
  D: [{ word: 'Dog', emoji: '🐶' }, { word: 'Duck', emoji: '🦆' }, { word: 'Drum', emoji: '🥁' }, { word: 'Dolphin', emoji: '🐬' }],
  E: [{ word: 'Elephant', emoji: '🐘' }, { word: 'Egg', emoji: '🥚' }, { word: 'Eagle', emoji: '🦅' }],
  F: [{ word: 'Fish', emoji: '🐟' }, { word: 'Flower', emoji: '🌸' }, { word: 'Frog', emoji: '🐸' }, { word: 'Fox', emoji: '🦊' }],
  G: [{ word: 'Grape', emoji: '🍇' }, { word: 'Giraffe', emoji: '🦒' }, { word: 'Guitar', emoji: '🎸' }],
  H: [{ word: 'Hat', emoji: '🎩' }, { word: 'Horse', emoji: '🐴' }, { word: 'Heart', emoji: '❤️' }, { word: 'House', emoji: '🏠' }],
  I: [{ word: 'Ice cream', emoji: '🍦' }, { word: 'Ice', emoji: '🧊' }, { word: 'Island', emoji: '🏝️' }],
  J: [{ word: 'Jellyfish', emoji: '🪼' }, { word: 'Juice', emoji: '🧃' }, { word: 'Jet', emoji: '🛩️' }],
  K: [{ word: 'Kite', emoji: '🪁' }, { word: 'Koala', emoji: '🐨' }, { word: 'King', emoji: '🤴' }, { word: 'Kangaroo', emoji: '🦘' }],
  L: [{ word: 'Lion', emoji: '🦁' }, { word: 'Ladybug', emoji: '🐞' }, { word: 'Leaf', emoji: '🍃' }, { word: 'Lemon', emoji: '🍋' }],
  M: [{ word: 'Moon', emoji: '🌙' }, { word: 'Monkey', emoji: '🐵' }, { word: 'Mouse', emoji: '🐭' }, { word: 'Mushroom', emoji: '🍄' }],
  N: [{ word: 'Nest', emoji: '🪺' }, { word: 'Nut', emoji: '🥜' }, { word: 'Noodles', emoji: '🍜' }],
  O: [{ word: 'Octopus', emoji: '🐙' }, { word: 'Orange', emoji: '🍊' }, { word: 'Owl', emoji: '🦉' }],
  P: [{ word: 'Penguin', emoji: '🐧' }, { word: 'Pizza', emoji: '🍕' }, { word: 'Pig', emoji: '🐷' }, { word: 'Panda', emoji: '🐼' }],
  Q: [{ word: 'Queen', emoji: '👸' }, { word: 'Question', emoji: '❓' }, { word: 'Quarter', emoji: '🪙' }],
  R: [{ word: 'Rainbow', emoji: '🌈' }, { word: 'Rabbit', emoji: '🐰' }, { word: 'Rocket', emoji: '🚀' }, { word: 'Robot', emoji: '🤖' }],
  S: [{ word: 'Sun', emoji: '☀️' }, { word: 'Star', emoji: '⭐' }, { word: 'Snake', emoji: '🐍' }, { word: 'Strawberry', emoji: '🍓' }],
  T: [{ word: 'Tree', emoji: '🌳' }, { word: 'Tiger', emoji: '🐯' }, { word: 'Turtle', emoji: '🐢' }, { word: 'Train', emoji: '🚂' }],
  U: [{ word: 'Umbrella', emoji: '☂️' }, { word: 'Unicorn', emoji: '🦄' }, { word: 'Up', emoji: '⬆️' }],
  V: [{ word: 'Violin', emoji: '🎻' }, { word: 'Volcano', emoji: '🌋' }, { word: 'Van', emoji: '🚐' }],
  W: [{ word: 'Whale', emoji: '🐋' }, { word: 'Watermelon', emoji: '🍉' }, { word: 'Worm', emoji: '🪱' }, { word: 'Wolf', emoji: '🐺' }],
  X: [{ word: 'X-ray', emoji: '🩻' }, { word: 'Xylophone', emoji: '🎶' }],
  Y: [{ word: 'Yarn', emoji: '🧶' }, { word: 'Yo-yo', emoji: '🪀' }, { word: 'Yogurt', emoji: '🥛' }],
  Z: [{ word: 'Zebra', emoji: '🦓' }, { word: 'Zipper', emoji: '🤐' }, { word: 'Zucchini', emoji: '🥒' }],
}

function getRandomLetterItem(letter) {
  const items = LETTER_DATA[letter]
  return items[Math.floor(Math.random() * items.length)]
}

// ─── Counting Garden Data ──────────────────────────────────────────────────
const GARDEN_ITEMS = ['🌷', '🌻', '🌸', '🦋', '🌺', '🍄', '🐛', '🐝', '🌼', '🐞', '🌹', '🐌', '🪻', '🌿', '🐦', '🪲', '🍀', '🌾', '🐜', '🪷']
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']

// ─── Story Time Data ───────────────────────────────────────────────────────
const STORY_CHARACTERS = [
  { name: 'Bear', emoji: '🐻' },
  { name: 'Bunny', emoji: '🐰' },
  { name: 'Cat', emoji: '🐱' },
  { name: 'Frog', emoji: '🐸' },
  { name: 'Owl', emoji: '🦉' },
  { name: 'Fox', emoji: '🦊' },
  { name: 'Puppy', emoji: '🐶' },
  { name: 'Penguin', emoji: '🐧' },
  { name: 'Monkey', emoji: '🐵' },
  { name: 'Turtle', emoji: '🐢' },
  { name: 'Duck', emoji: '🦆' },
  { name: 'Mouse', emoji: '🐭' },
]
const STORY_PLACES = [
  { name: 'a magical forest', emoji: '🌲' },
  { name: 'a sunny beach', emoji: '🏖️' },
  { name: 'a tall mountain', emoji: '⛰️' },
  { name: 'a secret garden', emoji: '🌻' },
  { name: 'a rainbow bridge', emoji: '🌈' },
  { name: 'a cozy castle', emoji: '🏰' },
  { name: 'a deep ocean', emoji: '🌊' },
  { name: 'a snowy village', emoji: '🏔️' },
  { name: 'a candy land', emoji: '🍭' },
  { name: 'a starry sky', emoji: '🌌' },
  { name: 'a mushroom town', emoji: '🍄' },
  { name: 'a flowery meadow', emoji: '🌼' },
]
const STORY_ACTIONS = [
  { name: 'found a treasure chest', emoji: '🎁' },
  { name: 'made a new friend', emoji: '💕' },
  { name: 'discovered a magic flower', emoji: '🌺' },
  { name: 'caught a falling star', emoji: '⭐' },
  { name: 'built a little house', emoji: '🏠' },
  { name: 'found a golden key', emoji: '🔑' },
  { name: 'saw a beautiful butterfly', emoji: '🦋' },
  { name: 'planted a magic seed', emoji: '🌱' },
  { name: 'heard a lovely song', emoji: '🎵' },
  { name: 'baked a yummy cake', emoji: '🎂' },
  { name: 'painted a pretty picture', emoji: '🎨' },
  { name: 'flew on a magic carpet', emoji: '🪄' },
]
const STORY_ENDINGS = [
  { text: 'And they lived happily ever after!', emoji: '🌈' },
  { text: 'And they danced with joy!', emoji: '💃' },
  { text: 'And everyone celebrated together!', emoji: '🎉' },
  { text: 'And the whole world smiled!', emoji: '😊' },
  { text: 'And they fell asleep under the stars!', emoji: '🌟' },
  { text: 'And they made a wish come true!', emoji: '✨' },
  { text: 'And they hugged their best friend!', emoji: '🤗' },
  { text: 'And they sang the happiest song!', emoji: '🎶' },
  { text: 'And fireworks lit up the sky!', emoji: '🎆' },
  { text: 'And a rainbow appeared just for them!', emoji: '🌈' },
  { text: 'And they shared cookies with everyone!', emoji: '🍪' },
  { text: 'And the adventure was just beginning!', emoji: '🚀' },
]

// ─── Color Discovery Data ──────────────────────────────────────────────────
const BASE_COLORS_LIST = [
  { name: 'Red', color: '#EF5350' },
  { name: 'Blue', color: '#42A5F5' },
  { name: 'Yellow', color: '#FFEE58' },
  { name: 'White', color: '#FAFAFA' },
  { name: 'Green', color: '#66BB6A' },
  { name: 'Orange', color: '#FFA726' },
  { name: 'Purple', color: '#AB47BC' },
  { name: 'Black', color: '#424242' },
]

function getColorMix(c1, c2) {
  const key = [c1, c2].sort().join('+')
  const mixes = {
    // Primary mixes
    'Blue+Red': { name: 'Purple', color: '#AB47BC' },
    'Red+Yellow': { name: 'Orange', color: '#FFA726' },
    'Blue+Yellow': { name: 'Green', color: '#66BB6A' },
    // White mixes
    'Red+White': { name: 'Pink', color: '#F48FB1' },
    'Blue+White': { name: 'Light Blue', color: '#81D4FA' },
    'White+Yellow': { name: 'Cream', color: '#FFF8E1' },
    'Green+White': { name: 'Mint', color: '#A5D6A7' },
    'Orange+White': { name: 'Peach', color: '#FFCCBC' },
    'Purple+White': { name: 'Lavender', color: '#CE93D8' },
    // Black mixes
    'Black+Red': { name: 'Maroon', color: '#8B0000' },
    'Black+Blue': { name: 'Navy', color: '#1A237E' },
    'Black+Yellow': { name: 'Olive', color: '#827717' },
    'Black+Green': { name: 'Forest', color: '#2E7D32' },
    'Black+Orange': { name: 'Brown', color: '#795548' },
    'Black+Purple': { name: 'Plum', color: '#4A148C' },
    'Black+White': { name: 'Gray', color: '#9E9E9E' },
    // Secondary mixes
    'Green+Red': { name: 'Brown', color: '#795548' },
    'Blue+Orange': { name: 'Teal', color: '#009688' },
    'Purple+Yellow': { name: 'Brown', color: '#8D6E63' },
    'Green+Yellow': { name: 'Lime', color: '#CDDC39' },
    'Blue+Green': { name: 'Turquoise', color: '#26C6DA' },
    'Orange+Red': { name: 'Scarlet', color: '#E53935' },
    'Blue+Purple': { name: 'Indigo', color: '#5C6BC0' },
    'Green+Orange': { name: 'Amber', color: '#FFB300' },
    'Purple+Red': { name: 'Magenta', color: '#E91E63' },
    'Orange+Yellow': { name: 'Gold', color: '#FFD600' },
    'Orange+Purple': { name: 'Rust', color: '#BF360C' },
    'Green+Purple': { name: 'Slate', color: '#607D8B' },
  }
  return mixes[key] || null
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
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '400px',
  },
  toyButton: (idx) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 8px',
    borderRadius: '24px',
    border: 'none',
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    textAlign: 'center',
    aspectRatio: '1',
    animation: `float 3s ease-in-out infinite, fadeSlideIn 0.5s ease-out ${idx * 0.1}s both`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    WebkitTapHighlightColor: 'transparent',
  }),
  toyIcon: {
    fontSize: 'clamp(32px, 8vw, 44px)',
    lineHeight: 1,
    flexShrink: 0,
  },
  toyLabel: {
    fontSize: 'clamp(13px, 3.5vw, 16px)',
    fontWeight: 800,
    color: '#5D4E6D',
    lineHeight: 1.2,
  },
  badge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'linear-gradient(135deg, #FFE082, #FFAB91)',
    color: '#7B5E3B',
    fontWeight: 800,
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '20px',
    boxShadow: '0 2px 10px rgba(255,171,145,0.3)',
    animation: 'popIn 0.6s ease-out',
  },
  installChip: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    color: '#5D4E6D',
    fontWeight: 700,
    fontSize: '12px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    animation: 'popIn 0.6s ease-out 0.2s both',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    transition: 'transform 0.2s, box-shadow 0.2s',
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

// ─── Letter Land Screen ────────────────────────────────────────────────────
function LetterLand({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)

  const handleLetterTap = (letter, idx) => {
    playLetterSound(idx)
    setSelected(letter)
    setCurrentItem(getRandomLetterItem(letter))
  }

  const currentIdx = selected ? LETTERS.indexOf(selected) : -1

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🔤 Letter Land</span>
      </nav>

      {selected ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px', gap: '16px',
        }}>
          <div style={{
            fontSize: 'clamp(80px, 25vw, 140px)', fontWeight: 900,
            color: COLORS[currentIdx % COLORS.length],
            animation: 'popIn 0.3s ease-out', lineHeight: 1,
          }}>
            {selected}
          </div>
          <div style={{ fontSize: '64px', animation: 'popIn 0.3s ease-out 0.1s both' }}>
            {currentItem.emoji}
          </div>
          <div style={{
            fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800,
            color: '#5D4E6D', animation: 'fadeSlideIn 0.4s ease-out 0.15s both',
          }}>
            {selected} is for {currentItem.word}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {currentIdx > 0 && (
              <button
                style={{ ...s.backBtn, fontSize: '24px' }}
                onClick={() => handleLetterTap(LETTERS[currentIdx - 1], currentIdx - 1)}
                aria-label="Previous letter"
              >
                ◀
              </button>
            )}
            <button
              style={{
                padding: '12px 28px', borderRadius: '20px', border: 'none',
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                fontSize: '16px', fontWeight: 700, color: '#9E8DAE', cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onClick={() => setSelected(null)}
            >
              All Letters
            </button>
            {currentIdx < 25 && (
              <button
                style={{ ...s.backBtn, fontSize: '24px' }}
                onClick={() => handleLetterTap(LETTERS[currentIdx + 1], currentIdx + 1)}
                aria-label="Next letter"
              >
                ▶
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexWrap: 'wrap',
          alignContent: 'center', justifyContent: 'center',
          gap: '10px', padding: '16px', overflow: 'auto',
        }}>
          {LETTERS.map((letter, i) => (
            <button
              key={letter}
              style={{
                width: '56px', height: '56px', borderRadius: '16px',
                border: '2.5px solid rgba(255,255,255,0.8)',
                background: `${COLORS[i % COLORS.length]}22`,
                fontSize: '24px', fontWeight: 900,
                color: COLORS[i % COLORS.length],
                cursor: 'pointer',
                animation: `popIn 0.3s ease-out ${i * 0.02}s both`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={() => handleLetterTap(letter, i)}
            >
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Counting Garden Screen ────────────────────────────────────────────────
function CountingGarden({ onBack }) {
  const [items, setItems] = useState([])
  const gardenRef = useRef(null)

  const plantItem = () => {
    if (items.length >= 20) return
    playPlant()
    const gardenEl = gardenRef.current
    const rect = gardenEl ? gardenEl.getBoundingClientRect() : { width: 300, height: 400 }
    const emoji = GARDEN_ITEMS[items.length % GARDEN_ITEMS.length]
    const x = 20 + Math.random() * (rect.width - 80)
    const y = 20 + Math.random() * (rect.height - 80)
    setItems(prev => [...prev, { id: prev.length, emoji, x, y }])
    if (items.length + 1 === 5 || items.length + 1 === 10 || items.length + 1 === 15 || items.length + 1 === 20) {
      setTimeout(playHappyChime, 300)
    }
  }

  const resetGarden = () => {
    playTap()
    setItems([])
  }

  const count = items.length

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🌻 Counting</span>
      </nav>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', gap: '12px', flexShrink: 0,
      }}>
        <div style={{
          fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 900,
          color: '#CE93D8', lineHeight: 1,
          animation: count > 0 ? 'popIn 0.3s ease-out' : 'none',
        }}>
          {count}
        </div>
        <div style={{
          fontSize: 'clamp(18px, 5vw, 28px)', fontWeight: 700,
          color: '#9E8DAE', textTransform: 'capitalize',
        }}>
          {NUMBER_WORDS[count]}
          {count === 1 ? ' thing' : ' things'}
        </div>
      </div>

      <div
        ref={gardenRef}
        style={{
          flex: 1, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 60%, #A5D6A7 100%)',
          cursor: count < 20 ? 'pointer' : 'default',
          touchAction: 'manipulation',
        }}
        onClick={plantItem}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute', left: item.x, top: item.y,
              fontSize: 'clamp(36px, 10vw, 48px)',
              animation: 'popIn 0.4s ease-out',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              pointerEvents: 'none',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {count < 20 && (
          <div style={{
            position: 'absolute', bottom: '50%', left: '50%',
            transform: 'translate(-50%, 50%)',
            fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700,
            color: 'rgba(93,78,109,0.4)',
            textAlign: 'center', pointerEvents: 'none',
            animation: 'float 3s ease-in-out infinite',
          }}>
            {count === 0 ? 'Tap to plant!' : `Tap for more! (${20 - count} left)`}
          </div>
        )}

        {count === 20 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '32px', fontWeight: 900, color: '#5D4E6D',
            textAlign: 'center', animation: 'celebrate 0.5s ease',
            background: 'rgba(255,255,255,0.8)', padding: '16px 24px',
            borderRadius: '20px', backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}>
            Garden is full!
          </div>
        )}
      </div>

      {count > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <button
            style={{
              padding: '12px 28px', borderRadius: '20px', border: 'none',
              background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
              fontSize: '14px', fontWeight: 700, color: '#9E8DAE', cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
            onClick={resetGarden}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Story Time Screen ─────────────────────────────────────────────────────
function StoryTime({ onBack }) {
  const [step, setStep] = useState(0)
  const [character, setCharacter] = useState(null)
  const [place, setPlace] = useState(null)
  const [action, setAction] = useState(null)
  const [ending, setEnding] = useState(null)
  const [charGrid, setCharGrid] = useState(() => shuffleArray(STORY_CHARACTERS).slice(0, 9))
  const [placeGrid, setPlaceGrid] = useState(() => shuffleArray(STORY_PLACES).slice(0, 9))
  const [actionGrid, setActionGrid] = useState(() => shuffleArray(STORY_ACTIONS).slice(0, 9))

  const shuffleCharGrid = () => { playTap(); setCharGrid(shuffleArray(STORY_CHARACTERS).slice(0, 9)) }
  const shufflePlaceGrid = () => { playTap(); setPlaceGrid(shuffleArray(STORY_PLACES).slice(0, 9)) }
  const shuffleActionGrid = () => { playTap(); setActionGrid(shuffleArray(STORY_ACTIONS).slice(0, 9)) }

  const pickCharacter = (c) => {
    playTap()
    setCharacter(c)
    setStep(1)
  }

  const pickPlace = (p) => {
    playTap()
    setPlace(p)
    setStep(2)
  }

  const pickAction = (a) => {
    playPageTurn()
    setAction(a)
    setEnding(STORY_ENDINGS[Math.floor(Math.random() * STORY_ENDINGS.length)])
    setStep(3)
    setTimeout(playStoryReveal, 300)
  }

  const newStory = () => {
    playTap()
    setStep(0)
    setCharacter(null)
    setPlace(null)
    setAction(null)
    setEnding(null)
    setCharGrid(shuffleArray(STORY_CHARACTERS).slice(0, 9))
    setPlaceGrid(shuffleArray(STORY_PLACES).slice(0, 9))
    setActionGrid(shuffleArray(STORY_ACTIONS).slice(0, 9))
  }

  const stepTitles = [
    'Pick a character',
    'Where do they go?',
    'What happens?',
    'Your story!',
  ]

  const storyChoiceStyle = (i) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '12px 8px', borderRadius: '20px', border: 'none',
    background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', cursor: 'pointer',
    animation: `popIn 0.3s ease-out ${i * 0.05}s both`,
    transition: 'transform 0.2s',
  })

  const storyShuffleStyle = {
    padding: '12px 28px', borderRadius: '20px', border: 'none',
    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
    fontSize: '16px', fontWeight: 800, color: '#CE93D8', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    animation: 'fadeSlideIn 0.4s ease-out',
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>📖 Story Time</span>
      </nav>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px', gap: '24px', overflow: 'auto',
      }}>
        <div style={{
          fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 800,
          color: '#5D4E6D', textAlign: 'center',
          animation: 'fadeSlideIn 0.4s ease-out',
        }}>
          {stepTitles[step]}
        </div>

        {step === 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
              {charGrid.map((c, i) => (
                <button key={c.name} style={storyChoiceStyle(i)} onClick={() => pickCharacter(c)}>
                  <span style={{ fontSize: '36px' }}>{c.emoji}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#5D4E6D' }}>{c.name}</span>
                </button>
              ))}
            </div>
            <button onClick={shuffleCharGrid} style={storyShuffleStyle}>
              Shuffle
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
              {placeGrid.map((p, i) => (
                <button key={p.name} style={storyChoiceStyle(i)} onClick={() => pickPlace(p)}>
                  <span style={{ fontSize: '36px' }}>{p.emoji}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#5D4E6D', textTransform: 'capitalize' }}>{p.name}</span>
                </button>
              ))}
            </div>
            <button onClick={shufflePlaceGrid} style={storyShuffleStyle}>
              Shuffle
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
              {actionGrid.map((a, i) => (
                <button key={a.name} style={storyChoiceStyle(i)} onClick={() => pickAction(a)}>
                  <span style={{ fontSize: '36px' }}>{a.emoji}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#5D4E6D' }}>{a.name}</span>
                </button>
              ))}
            </div>
            <button onClick={shuffleActionGrid} style={storyShuffleStyle}>
              Shuffle
            </button>
          </>
        )}

        {step === 3 && character && place && action && ending && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '20px',
            maxWidth: '400px', width: '100%',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.8)', borderRadius: '24px',
              padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{
                textAlign: 'center', fontSize: '60px', marginBottom: '16px',
                animation: 'popIn 0.4s ease-out',
              }}>
                {character.emoji} {place.emoji} {action.emoji}
              </div>
              <p style={{
                fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 700,
                color: '#5D4E6D', lineHeight: 1.6, textAlign: 'center',
                animation: 'fadeSlideIn 0.5s ease-out 0.2s both',
              }}>
                Once upon a time, <strong>{character.name}</strong> {character.emoji} went to {place.name} {place.emoji}.
              </p>
              <p style={{
                fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 700,
                color: '#5D4E6D', lineHeight: 1.6, textAlign: 'center',
                marginTop: '12px',
                animation: 'fadeSlideIn 0.5s ease-out 0.4s both',
              }}>
                There, {character.name} {action.name} {action.emoji}!
              </p>
              <p style={{
                fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 700,
                color: '#CE93D8', lineHeight: 1.6, textAlign: 'center',
                marginTop: '12px',
                animation: 'fadeSlideIn 0.5s ease-out 0.6s both',
              }}>
                {ending.text} {ending.emoji}
              </p>
            </div>

            <button
              style={{
                padding: '16px 32px', borderRadius: '24px', border: 'none',
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                fontSize: '18px', fontWeight: 800, color: '#CE93D8', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                animation: 'fadeSlideIn 0.5s ease-out 0.8s both',
                alignSelf: 'center',
              }}
              onClick={newStory}
            >
              New Story
            </button>
          </div>
        )}

        {step < 3 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: i <= step ? '#CE93D8' : 'rgba(206,147,216,0.3)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Color Discovery Screen ────────────────────────────────────────────────
function ColorDiscovery({ onBack }) {
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const pickColor = (color) => {
    if (showResult) return
    if (selected.length >= 2) return
    playTap()
    const next = [...selected, color]
    setSelected(next)
    if (next.length === 2) {
      const mix = getColorMix(next[0].name, next[1].name)
      if (mix) {
        setResult(mix)
        setTimeout(() => {
          setShowResult(true)
          playMix()
        }, 600)
      } else {
        setResult({ name: next[0].name === next[1].name ? next[0].name : 'Hmm...', color: next[0].color })
        setTimeout(() => {
          setShowResult(true)
          playWobble()
        }, 600)
      }
    }
  }

  const reset = () => {
    playTap()
    setSelected([])
    setResult(null)
    setShowResult(false)
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🎨 Color Mix</span>
      </nav>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px', gap: '28px', overflow: 'auto',
      }}>
        <div style={{
          fontSize: 'clamp(18px, 4.5vw, 24px)', fontWeight: 800,
          color: '#5D4E6D', textAlign: 'center',
        }}>
          {selected.length === 0 ? 'Pick a color!' :
           selected.length === 1 ? 'Pick another color!' :
           showResult ? `You made ${result.name}!` : 'Mixing...'}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          minHeight: '100px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: selected[0] ? 'none' : '3px dashed #CE93D8',
            background: selected[0] ? selected[0].color : 'rgba(206,147,216,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: '#CE93D8',
            animation: selected[0] ? 'popIn 0.3s ease-out' : 'none',
            boxShadow: selected[0] ? `0 4px 20px ${selected[0].color}44` : 'none',
          }}>
            {!selected[0] && '?'}
          </div>

          <span style={{ fontSize: '28px', fontWeight: 900, color: '#CE93D8' }}>+</span>

          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: selected[1] ? 'none' : '3px dashed #CE93D8',
            background: selected[1] ? selected[1].color : 'rgba(206,147,216,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: '#CE93D8',
            animation: selected[1] ? 'popIn 0.3s ease-out' : 'none',
            boxShadow: selected[1] ? `0 4px 20px ${selected[1].color}44` : 'none',
          }}>
            {!selected[1] && '?'}
          </div>

          {selected.length === 2 && (
            <>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#CE93D8' }}>=</span>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: showResult ? result.color : 'rgba(206,147,216,0.1)',
                border: showResult ? 'none' : '3px dashed #CE93D8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: '#CE93D8',
                animation: showResult ? 'celebrate 0.5s ease' : 'none',
                boxShadow: showResult ? `0 4px 20px ${result.color}44` : 'none',
              }}>
                {!showResult && '?'}
              </div>
            </>
          )}
        </div>

        {!showResult && (
          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {BASE_COLORS_LIST.map((c, i) => (
              <button
                key={c.name}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  padding: '16px 24px', borderRadius: '20px', border: 'none',
                  background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)', cursor: 'pointer',
                  animation: `popIn 0.3s ease-out ${i * 0.08}s both`,
                }}
                onClick={() => pickColor(c)}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: c.color,
                  border: c.name === 'White' ? '2px solid #E0E0E0' : 'none',
                  boxShadow: `0 2px 8px ${c.color}44`,
                }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#5D4E6D' }}>{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {showResult && result && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            animation: 'fadeSlideIn 0.4s ease-out',
          }}>
            <div style={{
              fontSize: 'clamp(24px, 7vw, 40px)', fontWeight: 900,
              color: result.color,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {result.name}
            </div>
            <button
              style={{
                padding: '14px 32px', borderRadius: '24px', border: 'none',
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                fontSize: '16px', fontWeight: 800, color: '#CE93D8', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
              onClick={reset}
            >
              Mix Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Drag & Drop Combine Game ───────────────────────────────────────────────
const COMBINE_ITEMS = [
  { id: 'sun', emoji: '☀️', label: 'Sun' },
  { id: 'water', emoji: '💧', label: 'Water' },
  { id: 'dirt', emoji: '🟤', label: 'Dirt' },
  { id: 'seed', emoji: '🌱', label: 'Seed' },
  { id: 'snow', emoji: '❄️', label: 'Snow' },
  { id: 'egg', emoji: '🥚', label: 'Egg' },
  { id: 'milk', emoji: '🥛', label: 'Milk' },
  { id: 'bread', emoji: '🍞', label: 'Bread' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'wind', emoji: '🌬️', label: 'Wind' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'cloud', emoji: '☁️', label: 'Cloud' },
  { id: 'fruit', emoji: '🍎', label: 'Fruit' },
  { id: 'rock', emoji: '🪨', label: 'Rock' },
  { id: 'wood', emoji: '🪵', label: 'Wood' },
  { id: 'honey', emoji: '🍯', label: 'Honey' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'fish', emoji: '🐟', label: 'Fish' },
  { id: 'candy', emoji: '🍬', label: 'Candy' },
]

// Helper to build bidirectional recipes from a compact list
const _recipes = [
  // Sun combos
  ['sun', 'water', '🌈', 'Rainbow!'],
  ['sun', 'dirt', '🏜️', 'Desert!'],
  ['sun', 'seed', '🌳', 'Tree!'],
  ['sun', 'snow', '💦', 'Puddle!'],
  ['sun', 'egg', '🐣', 'Chick!'],
  ['sun', 'flower', '🐝', 'Bee!'],
  ['sun', 'cloud', '🌅', 'Sunset!'],
  ['sun', 'fire', '🌋', 'Volcano!'],
  ['sun', 'star', '🌟', 'Superstar!'],
  ['sun', 'fruit', '🍊', 'Orange!'],
  ['sun', 'wind', '🪁', 'Kite!'],
  ['sun', 'rock', '🔥', 'Hot Rock!'],
  ['sun', 'wood', '🧺', 'Picnic!'],
  ['sun', 'honey', '🍋', 'Lemonade!'],
  ['sun', 'moon', '🌗', 'Eclipse!'],
  ['sun', 'fish', '🐠', 'Tropical Fish!'],
  ['sun', 'candy', '🍭', 'Lollipop!'],
  // Water combos
  ['water', 'dirt', '🫧', 'Mud!'],
  ['water', 'seed', '🌿', 'Plant!'],
  ['water', 'snow', '🧊', 'Ice!'],
  ['water', 'cloud', '🌧️', 'Rain!'],
  ['water', 'flower', '🪴', 'Garden!'],
  ['water', 'fire', '♨️', 'Steam!'],
  ['water', 'fruit', '🧃', 'Juice!'],
  ['water', 'star', '✨', 'Sparkle!'],
  ['water', 'wind', '🌊', 'Wave!'],
  ['water', 'rock', '⛲', 'Fountain!'],
  ['water', 'wood', '🚣', 'Boat!'],
  ['water', 'honey', '🍵', 'Tea!'],
  ['water', 'moon', '🌊', 'Tide!'],
  ['water', 'fish', '🧜‍♀️', 'Mermaid!'],
  ['water', 'candy', '🧊', 'Popsicle!'],
  // Dirt combos
  ['dirt', 'seed', '🌻', 'Flower!'],
  ['dirt', 'snow', '⛄', 'Snowman!'],
  ['dirt', 'fire', '🧱', 'Brick!'],
  ['dirt', 'wind', '🌪️', 'Tornado!'],
  ['dirt', 'star', '💎', 'Diamond!'],
  ['dirt', 'cloud', '🥧', 'Mud Pie!'],
  ['dirt', 'fruit', '🥕', 'Carrot!'],
  ['dirt', 'rock', '⛰️', 'Mountain!'],
  ['dirt', 'wood', '🏠', 'House!'],
  ['dirt', 'moon', '🌑', 'Crater!'],
  ['dirt', 'fish', '🦴', 'Fossil!'],
  // Seed combos
  ['seed', 'snow', '🎄', 'Pine Tree!'],
  ['seed', 'fire', '🍿', 'Popcorn!'],
  ['seed', 'wind', '🍃', 'Leaves!'],
  ['seed', 'flower', '💐', 'Bouquet!'],
  ['seed', 'cloud', '🍄', 'Mushroom!'],
  ['seed', 'fruit', '🍇', 'Grapes!'],
  ['seed', 'rock', '🌵', 'Cactus!'],
  ['seed', 'wood', '🌲', 'Forest!'],
  ['seed', 'honey', '🍀', 'Clover!'],
  ['seed', 'moon', '🌼', 'Moonflower!'],
  // Snow combos
  ['snow', 'wind', '🌨️', 'Blizzard!'],
  ['snow', 'star', '🔮', 'Magic!'],
  ['snow', 'flower', '🥶', 'Frost!'],
  ['snow', 'fruit', '🍧', 'Snow Cone!'],
  ['snow', 'milk', '🍦', 'Ice Cream!'],
  ['snow', 'rock', '🏔️', 'Glacier!'],
  ['snow', 'wood', '🛷', 'Sled!'],
  ['snow', 'moon', '🌌', 'Aurora!'],
  ['snow', 'candy', '🎅', 'Santa!'],
  ['snow', 'cloud', '☃️', 'Snow Globe!'],
  ['snow', 'fish', '🐧', 'Penguin!'],
  // Egg combos
  ['egg', 'milk', '🧁', 'Cupcake!'],
  ['egg', 'fire', '🍳', 'Fried Egg!'],
  ['egg', 'wind', '🐦', 'Bird!'],
  ['egg', 'star', '🦕', 'Dinosaur!'],
  ['egg', 'flower', '🐛', 'Caterpillar!'],
  ['egg', 'cloud', '🪺', 'Nest!'],
  ['egg', 'fruit', '🥞', 'Pancake!'],
  ['egg', 'rock', '🐢', 'Turtle!'],
  ['egg', 'wood', '🦉', 'Owl!'],
  ['egg', 'honey', '🍪', 'Cookie!'],
  ['egg', 'candy', '🎂', 'Birthday Cake!'],
  // Milk combos
  ['milk', 'bread', '🍰', 'Cake!'],
  ['milk', 'fire', '☕', 'Hot Cocoa!'],
  ['milk', 'fruit', '🥤', 'Smoothie!'],
  ['milk', 'honey', '🥣', 'Cereal!'],
  ['milk', 'candy', '🍫', 'Chocolate!'],
  ['milk', 'star', '🌠', 'Milky Way!'],
  ['milk', 'cloud', '🧈', 'Butter!'],
  // Bread combos
  ['bread', 'fire', '🥐', 'Toast!'],
  ['bread', 'fruit', '🥧', 'Pie!'],
  ['bread', 'honey', '🥪', 'Honey Sandwich!'],
  ['bread', 'candy', '🍩', 'Donut!'],
  ['bread', 'fish', '🍣', 'Sushi!'],
  // Fire combos
  ['fire', 'flower', '🏮', 'Lantern!'],
  ['fire', 'rock', '🐉', 'Dragon!'],
  ['fire', 'wood', '🏕️', 'Campfire!'],
  ['fire', 'star', '☄️', 'Comet!'],
  ['fire', 'candy', '🎇', 'Sparkler!'],
  ['fire', 'moon', '🚀', 'Rocket!'],
  ['fire', 'wind', '🎆', 'Firework!'],
  // Wind combos
  ['wind', 'rock', '🏜️', 'Sand Dune!'],
  ['wind', 'wood', '🎐', 'Wind Chime!'],
  ['wind', 'flower', '🌾', 'Wheat!'],
  ['wind', 'moon', '🦇', 'Bat!'],
  ['wind', 'cloud', '⛈️', 'Storm!'],
  ['wind', 'candy', '🎈', 'Balloon!'],
  // Star combos
  ['star', 'rock', '💫', 'Meteor!'],
  ['star', 'wood', '🎄', 'Christmas Tree!'],
  ['star', 'flower', '💮', 'Wishing Flower!'],
  ['star', 'moon', '🌃', 'Night Sky!'],
  ['star', 'candy', '🎪', 'Circus!'],
  ['star', 'cloud', '🛸', 'UFO!'],
  // Rock combos
  ['rock', 'wood', '⚒️', 'Tools!'],
  ['rock', 'flower', '🏺', 'Vase!'],
  ['rock', 'moon', '🌕', 'Moon Rock!'],
  ['rock', 'fish', '🪸', 'Coral!'],
  ['rock', 'candy', '💍', 'Ring!'],
  // Wood combos
  ['wood', 'flower', '🌳', 'Treehouse!'],
  ['wood', 'moon', '🐺', 'Wolf!'],
  ['wood', 'fish', '🎣', 'Fishing Rod!'],
  ['wood', 'honey', '🐝', 'Beehive!'],
  ['wood', 'candy', '🎭', 'Puppet!'],
  // Honey combos
  ['honey', 'flower', '🐻', 'Bear!'],
  ['honey', 'fruit', '🍰', 'Tart!'],
  ['honey', 'moon', '🌛', 'Honeymoon!'],
  ['honey', 'fish', '🦦', 'Otter!'],
  // Moon combos
  ['moon', 'cloud', '🌙', 'Crescent!'],
  ['moon', 'flower', '🧚', 'Fairy!'],
  ['moon', 'candy', '🧙', 'Wizard!'],
  ['moon', 'fish', '🐳', 'Whale!'],
  // Fish combos
  ['fish', 'flower', '🪷', 'Lily Pad!'],
  ['fish', 'candy', '🐡', 'Pufferfish!'],
  ['fish', 'cloud', '🐬', 'Dolphin!'],
  ['fish', 'fruit', '🥥', 'Coconut!'],
  ['fish', 'star', '🐚', 'Starfish!'],
  // Candy combos
  ['candy', 'flower', '💝', 'Valentine!'],
  ['candy', 'fruit', '🍓', 'Strawberry!'],
  ['candy', 'cloud', '🎀', 'Cotton Candy!'],
]
const COMBINE_RECIPES = {}
_recipes.forEach(([a, b, emoji, label]) => {
  COMBINE_RECIPES[`${a}+${b}`] = { emoji, label }
  COMBINE_RECIPES[`${b}+${a}`] = { emoji, label }
})

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function MixAndMatch({ onBack }) {
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [discoveries, setDiscoveries] = useState([])
  const [gridItems, setGridItems] = useState(() => shuffleArray(COMBINE_ITEMS).slice(0, 9))

  const totalRecipes = Object.keys(COMBINE_RECIPES).length / 2

  const shuffleGrid = () => {
    playTap()
    setGridItems(shuffleArray(COMBINE_ITEMS).slice(0, 9))
  }

  const pickItem = (item) => {
    if (showResult) return
    if (selected.length >= 2) return
    playTap()
    const next = [...selected, item]
    setSelected(next)
    if (next.length === 2) {
      const key = `${next[0].id}+${next[1].id}`
      const recipe = COMBINE_RECIPES[key]
      if (recipe) {
        setResult({ from: next[0], to: next[1], ...recipe })
        setTimeout(() => {
          setShowResult(true)
          playCombine()
        }, 600)
        setDiscoveries(prev => {
          const sorted = [next[0].id, next[1].id].sort().join('+')
          if (prev.includes(sorted)) return prev
          return [...prev, sorted]
        })
      } else {
        setResult({ from: next[0], to: next[1], emoji: '❓', label: 'Hmm... try something else!' })
        setTimeout(() => {
          setShowResult(true)
          playWobble()
        }, 600)
      }
    }
  }

  const reset = () => {
    playTap()
    setSelected([])
    setResult(null)
    setShowResult(false)
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🧩 Mix & Match</span>
      </nav>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px', gap: '28px', overflow: 'auto',
      }}>
        {/* Progress */}
        <div style={{
          fontSize: 'clamp(13px, 3.5vw, 16px)', fontWeight: 700,
          color: '#9E8DAE', textAlign: 'center',
        }}>
          {discoveries.length} / {totalRecipes} discovered
        </div>

        {/* Prompt text */}
        <div style={{
          fontSize: 'clamp(18px, 4.5vw, 24px)', fontWeight: 800,
          color: '#5D4E6D', textAlign: 'center',
        }}>
          {selected.length === 0 ? 'Pick something!' :
           selected.length === 1 ? 'Pick another!' :
           showResult ? `You made ${result.label}` : 'Mixing...'}
        </div>

        {/* Inline equation slots */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          minHeight: '100px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {/* Slot 1 */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            border: selected[0] ? 'none' : '3px dashed #CE93D8',
            background: selected[0] ? 'rgba(255,255,255,0.75)' : 'rgba(206,147,216,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: selected[0] ? '44px' : '28px', color: '#CE93D8',
            animation: selected[0] ? 'popIn 0.3s ease-out' : 'none',
            boxShadow: selected[0] ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
          }}>
            {selected[0] ? selected[0].emoji : '?'}
          </div>

          <span style={{ fontSize: '28px', fontWeight: 900, color: '#CE93D8' }}>+</span>

          {/* Slot 2 */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            border: selected[1] ? 'none' : '3px dashed #CE93D8',
            background: selected[1] ? 'rgba(255,255,255,0.75)' : 'rgba(206,147,216,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: selected[1] ? '44px' : '28px', color: '#CE93D8',
            animation: selected[1] ? 'popIn 0.3s ease-out' : 'none',
            boxShadow: selected[1] ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
          }}>
            {selected[1] ? selected[1].emoji : '?'}
          </div>

          {/* Result slot (appears after two are picked) */}
          {selected.length === 2 && (
            <>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#CE93D8' }}>=</span>
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: showResult ? 'rgba(255,255,255,0.75)' : 'rgba(206,147,216,0.1)',
                border: showResult ? 'none' : '3px dashed #CE93D8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: showResult ? '44px' : '28px', color: '#CE93D8',
                animation: showResult ? (result.label.includes('Hmm') ? 'shake 0.4s ease' : 'celebrate 0.5s ease') : 'none',
                boxShadow: showResult ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
              }}>
                {showResult ? result.emoji : '?'}
              </div>
            </>
          )}
        </div>

        {/* Items grid - hidden when showing result */}
        {!showResult && (
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              width: '100%',
            }}>
              {gridItems.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '6px', padding: '14px 8px', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    animation: `popIn 0.3s ease-out ${i * 0.05}s both`,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onClick={() => pickItem(item)}
                >
                  <span style={{ fontSize: 'clamp(32px, 8vw, 44px)', lineHeight: 1, pointerEvents: 'none' }}>
                    {item.emoji}
                  </span>
                  <span style={{
                    fontSize: 'clamp(11px, 3vw, 14px)', fontWeight: 700,
                    color: '#5D4E6D', pointerEvents: 'none',
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <button
              style={{
                padding: '10px 24px', borderRadius: '20px', border: 'none',
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: '#CE93D8',
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
              onClick={shuffleGrid}
            >
              🔀 Shuffle
            </button>
          </div>
        )}

        {/* Result display + Mix Again */}
        {showResult && result && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            animation: 'fadeSlideIn 0.4s ease-out',
          }}>
            <div style={{
              fontSize: 'clamp(24px, 7vw, 40px)', fontWeight: 900,
              color: result.label.includes('Hmm') ? '#9E8DAE' : '#5D4E6D',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {result.label}
            </div>
            <button
              style={{
                padding: '14px 32px', borderRadius: '24px', border: 'none',
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                fontSize: '16px', fontWeight: 800, color: '#CE93D8', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
              onClick={reset}
            >
              Mix Again
            </button>
          </div>
        )}

        {/* Discoveries */}
        {discoveries.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px',
            justifyContent: 'center', maxWidth: '380px',
            animation: 'fadeIn 0.3s ease-out',
          }}>
            {discoveries.map((key) => {
              const recipe = COMBINE_RECIPES[key]
              return (
                <div key={key} style={{
                  padding: '6px 12px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.7)',
                  fontSize: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  {recipe.emoji}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Toddler Time Data ────────────────────────────────────────────────────
const TIME_ACTIVITIES = [
  { hour: 7, label: 'Wake Up!', emoji: '🌅', sky: 'linear-gradient(180deg, #FFE0B2 0%, #FFCC80 100%)', description: 'Good morning!' },
  { hour: 8, label: 'Breakfast', emoji: '🥣', sky: 'linear-gradient(180deg, #FFF9C4 0%, #FFE082 100%)', description: 'Yummy cereal!' },
  { hour: 9, label: 'Playtime', emoji: '🧸', sky: 'linear-gradient(180deg, #B3E5FC 0%, #81D4FA 100%)', description: 'Time to play!' },
  { hour: 10, label: 'Outside', emoji: '🌳', sky: 'linear-gradient(180deg, #B2EBF2 0%, #80DEEA 100%)', description: 'Let\'s go outside!' },
  { hour: 11, label: 'Story Time', emoji: '📖', sky: 'linear-gradient(180deg, #C8E6C9 0%, #A5D6A7 100%)', description: 'Read a book!' },
  { hour: 12, label: 'Lunch', emoji: '🍕', sky: 'linear-gradient(180deg, #BBDEFB 0%, #64B5F6 100%)', description: 'Lunchtime!' },
  { hour: 1, label: 'Nap Time', emoji: '😴', sky: 'linear-gradient(180deg, #D1C4E9 0%, #B39DDB 100%)', description: 'Sleepy time...' },
  { hour: 2, label: 'Wake Up!', emoji: '🌤️', sky: 'linear-gradient(180deg, #B3E5FC 0%, #4FC3F7 100%)', description: 'Hello again!' },
  { hour: 3, label: 'Snack', emoji: '🍎', sky: 'linear-gradient(180deg, #C8E6C9 0%, #81C784 100%)', description: 'Apple snack!' },
  { hour: 4, label: 'Art Time', emoji: '🎨', sky: 'linear-gradient(180deg, #F8BBD0 0%, #F48FB1 100%)', description: 'Let\'s draw!' },
  { hour: 5, label: 'Dinner', emoji: '🍝', sky: 'linear-gradient(180deg, #FFCCBC 0%, #FF8A65 100%)', description: 'Dinner is ready!' },
  { hour: 6, label: 'Bath Time', emoji: '🛁', sky: 'linear-gradient(180deg, #B2EBF2 0%, #80CBC4 100%)', description: 'Splish splash!' },
  { hour: 7, label: 'Bedtime', emoji: '🌙', sky: 'linear-gradient(180deg, #311B92 0%, #4527A0 100%)', description: 'Goodnight!' },
]

function playClockTick() {
  playTone(800, 0.05, 'sine', 0.04)
  setTimeout(() => playTone(600, 0.05, 'sine', 0.03), 60)
}

// ─── Toddler Time Screen ─────────────────────────────────────────────────
function ToddlerTime({ onBack }) {
  const [activityIndex, setActivityIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const activity = TIME_ACTIVITIES[activityIndex]
  const isNight = activityIndex >= 11 // Bath and Bedtime

  const goNext = () => {
    if (animating) return
    playClockTick()
    setAnimating(true)
    setTimeout(() => setAnimating(false), 500)
    setActivityIndex(prev => (prev + 1) % TIME_ACTIVITIES.length)
    if ((activityIndex + 1) % TIME_ACTIVITIES.length === 0) {
      setTimeout(playHappyChime, 300)
    }
  }

  const goPrev = () => {
    if (animating) return
    playClockTick()
    setAnimating(true)
    setTimeout(() => setAnimating(false), 500)
    setActivityIndex(prev => (prev - 1 + TIME_ACTIVITIES.length) % TIME_ACTIVITIES.length)
  }

  // Calculate hour hand angle (30 degrees per hour)
  const displayHour = activity.hour
  const hourAngle = (displayHour % 12) * 30

  // The clock SVG
  const clockSize = 220
  const cx = clockSize / 2
  const cy = clockSize / 2
  const clockRadius = clockSize / 2 - 10

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🕐 Toddler Time</span>
      </nav>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px 20px', gap: '16px', overflow: 'auto',
        background: activity.sky,
        transition: 'background 0.6s ease',
      }}>
        {/* Activity emoji and label */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          animation: animating ? 'popIn 0.4s ease-out' : 'none',
        }}>
          <span style={{
            fontSize: 'clamp(48px, 14vw, 72px)', lineHeight: 1,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          }}>
            {activity.emoji}
          </span>
          <div style={{
            fontSize: 'clamp(24px, 7vw, 36px)', fontWeight: 900,
            color: isNight ? '#E8EAF6' : '#5D4E6D',
            textShadow: isNight ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            {activity.label}
          </div>
          <div style={{
            fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 600,
            color: isNight ? '#B39DDB' : '#9E8DAE',
          }}>
            {activity.description}
          </div>
        </div>

        {/* Clock face */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '50%',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          animation: animating ? 'popIn 0.3s ease-out' : 'none',
        }}>
          <svg width={clockSize} height={clockSize} viewBox={`0 0 ${clockSize} ${clockSize}`}>
            {/* Clock circle */}
            <circle cx={cx} cy={cy} r={clockRadius} fill="white" stroke="#E0E0E0" strokeWidth="3" />

            {/* Hour numbers */}
            {[...Array(12)].map((_, i) => {
              const num = i + 1
              const angle = (num * 30 - 90) * Math.PI / 180
              const x = cx + (clockRadius - 22) * Math.cos(angle)
              const y = cy + (clockRadius - 22) * Math.sin(angle)
              const isActive = num === displayHour % 12 || (displayHour === 12 && num === 12)
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? '#CE93D8' : '#5D4E6D'}
                  fontSize={isActive ? '22' : '18'}
                  fontWeight={isActive ? '900' : '700'}
                  fontFamily="Nunito, sans-serif"
                >
                  {num}
                </text>
              )
            })}

            {/* Hour tick marks */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180
              const x1 = cx + (clockRadius - 4) * Math.cos(angle)
              const y1 = cy + (clockRadius - 4) * Math.sin(angle)
              const x2 = cx + (clockRadius - 10) * Math.cos(angle)
              const y2 = cy + (clockRadius - 10) * Math.sin(angle)
              return (
                <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
              )
            })}

            {/* Hour hand */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + 55 * Math.cos((hourAngle - 90) * Math.PI / 180)}
              y2={cy + 55 * Math.sin((hourAngle - 90) * Math.PI / 180)}
              stroke="#CE93D8"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ transition: 'x2 0.5s ease, y2 0.5s ease' }}
            />

            {/* Center dot */}
            <circle cx={cx} cy={cy} r="8" fill="#CE93D8" />
            <circle cx={cx} cy={cy} r="4" fill="white" />
          </svg>
        </div>

        {/* Time display */}
        <div style={{
          fontSize: 'clamp(28px, 8vw, 44px)', fontWeight: 900,
          color: isNight ? '#E8EAF6' : '#5D4E6D',
          background: 'rgba(255,255,255,0.7)',
          padding: '8px 24px', borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          textAlign: 'center',
          animation: animating ? 'popIn 0.3s ease-out' : 'none',
        }}>
          {displayHour === 12 ? '12' : displayHour} : 00
          <span style={{ fontSize: 'clamp(14px, 4vw, 20px)', marginLeft: '4px', fontWeight: 700 }}>
            {activityIndex <= 4 ? 'AM' : 'PM'}
          </span>
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex', gap: '20px', alignItems: 'center',
        }}>
          <button
            style={{
              width: '64px', height: '64px', borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
              fontSize: '28px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
            onClick={goPrev}
            aria-label="Previous hour"
          >
            ◀
          </button>

          <div style={{
            fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 700,
            color: isNight ? '#B39DDB' : '#9E8DAE', textAlign: 'center',
          }}>
            {activityIndex + 1} / {TIME_ACTIVITIES.length}
          </div>

          <button
            style={{
              width: '64px', height: '64px', borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
              fontSize: '28px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
            onClick={goNext}
            aria-label="Next hour"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dino World Screen ──────────────────────────────────────────────────────
function DinoWorld({ onBack }) {
  const [activeDino, setActiveDino] = useState(null)
  const [bouncingDinos, setBouncingDinos] = useState({})
  const [footprints, setFootprints] = useState([])
  const footprintId = useRef(0)

  const handleDinoTap = (e, dino, idx) => {
    e.preventDefault()
    dino.playSound()
    setActiveDino(idx)
    setBouncingDinos(prev => ({ ...prev, [idx]: true }))

    // Add a footprint trail
    setFootprints(prev => [
      ...prev.slice(-8),
      { id: footprintId.current++, emoji: '🦶', x: 20 + Math.random() * 60, y: 30 + Math.random() * 40 }
    ])

    setTimeout(() => {
      setBouncingDinos(prev => ({ ...prev, [idx]: false }))
    }, 600)

    setTimeout(() => {
      setActiveDino(null)
    }, 2000)
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={onBack} aria-label="Back">←</button>
        <span style={s.navTitle}>🦕 Dino World</span>
      </nav>

      {/* Active dino display */}
      <div style={{
        padding: '16px 20px',
        textAlign: 'center',
        minHeight: '90px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: activeDino !== null ? DINOSAURS[activeDino].bgColor : 'transparent',
        transition: 'background 0.3s ease',
      }}>
        {activeDino !== null ? (
          <div style={{ animation: 'popIn 0.3s ease-out' }}>
            <div style={{ fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 800, color: DINOSAURS[activeDino].color }}>
              {DINOSAURS[activeDino].fullName}
            </div>
            <div style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', fontWeight: 600, color: '#9E8DAE', marginTop: '4px' }}>
              {DINOSAURS[activeDino].fact}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 700, color: '#BBA8CC' }}>
            Tap a dinosaur to hear it!
          </div>
        )}
      </div>

      {/* Dino grid */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px 16px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        alignContent: 'start',
      }}>
        {DINOSAURS.map((dino, idx) => (
          <button
            key={dino.name}
            onPointerDown={(e) => handleDinoTap(e, dino, idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '16px 8px',
              borderRadius: '24px',
              border: activeDino === idx ? `3px solid ${dino.color}` : '3px solid transparent',
              background: dino.bgColor,
              cursor: 'pointer',
              boxShadow: activeDino === idx ? `0 6px 24px ${dino.color}33` : '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              animation: bouncingDinos[idx]
                ? 'celebrate 0.5s ease'
                : `fadeSlideIn 0.4s ease-out ${idx * 0.08}s both`,
              WebkitTapHighlightColor: 'transparent',
              aspectRatio: '1',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = '' }}
          >
            <span style={{
              fontSize: 'clamp(40px, 10vw, 56px)',
              lineHeight: 1,
              filter: bouncingDinos[idx] ? 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' : 'none',
              transition: 'filter 0.2s',
            }}>
              {dino.emoji}
            </span>
            <div style={{
              fontSize: 'clamp(13px, 3.5vw, 16px)',
              fontWeight: 800,
              color: dino.color,
              lineHeight: 1.2,
            }}>
              {dino.name}
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#BBA8CC',
              lineHeight: 1,
            }}>
              Tap me!
            </div>
          </button>
        ))}
      </div>

      {/* Footprint trail decoration */}
      {footprints.map((fp) => (
        <div
          key={fp.id}
          style={{
            position: 'fixed',
            left: `${fp.x}%`,
            top: `${fp.y}%`,
            fontSize: '20px',
            opacity: 0.3,
            pointerEvents: 'none',
            animation: 'fadeIn 0.3s ease-out',
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
          }}
        >
          {fp.emoji}
        </div>
      ))}
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home')
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallTip, setShowInstallTip] = useState(false)

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

  // Pre-initialize AudioContext on first user interaction (required by mobile browsers)
  useEffect(() => {
    const initAudio = () => {
      const ctx = getAudioCtx()
      if (ctx && ctx.state === 'suspended') ctx.resume()
      document.removeEventListener('touchstart', initAudio)
      document.removeEventListener('click', initAudio)
    }
    document.addEventListener('touchstart', initAudio, { once: true })
    document.addEventListener('click', initAudio, { once: true })
    return () => {
      document.removeEventListener('touchstart', initAudio)
      document.removeEventListener('click', initAudio)
    }
  }, [])

  // Capture PWA install prompt & detect installed state
  useEffect(() => {
    // Check if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (installPrompt) {
      playTap()
      installPrompt.prompt()
      const result = await installPrompt.userChoice
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
      }
      setInstallPrompt(null)
    }
  }

  const handleOfflineChipClick = () => {
    if (isInstalled) return
    playTap()
    setShowInstallTip(prev => !prev)
  }

  if (screen === 'shapes') {
    return <ShapePlayground onBack={() => setScreen('home')} />
  }

  if (screen === 'patterns') {
    return <PatternGame onBack={() => setScreen('home')} />
  }

  if (screen === 'letters') {
    return <LetterLand onBack={() => setScreen('home')} />
  }

  if (screen === 'counting') {
    return <CountingGarden onBack={() => setScreen('home')} />
  }

  if (screen === 'story') {
    return <StoryTime onBack={() => setScreen('home')} />
  }

  if (screen === 'colors') {
    return <ColorDiscovery onBack={() => setScreen('home')} />
  }

  if (screen === 'combine') {
    return <MixAndMatch onBack={() => setScreen('home')} />
  }

  if (screen === 'time') {
    return <ToddlerTime onBack={() => setScreen('home')} />
  }

  if (screen === 'dinos') {
    return <DinoWorld onBack={() => setScreen('home')} />
  }

  return (
    <div style={s.app}>
      <div style={s.home}>
        <div style={s.badge}>Free to Play 🎈</div>

        {installPrompt ? (
          <button
            style={s.installChip}
            onClick={handleInstallClick}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            <span>📲</span>
            <span>Add to Home Screen</span>
          </button>
        ) : (
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', zIndex: 10 }}>
            <button
              style={{ ...s.installChip, position: 'relative', top: 'auto', right: 'auto', cursor: isInstalled ? 'default' : 'pointer' }}
              onClick={handleOfflineChipClick}
              onMouseEnter={(e) => { if (!isInstalled) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <span>{isInstalled ? '✅' : '📡'}</span>
              <span>{isInstalled ? 'Installed' : 'Works Offline'}</span>
            </button>
            {showInstallTip && !isInstalled && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#5D4E6D',
                maxWidth: '220px',
                animation: 'popIn 0.3s ease-out',
              }}>
                <strong>Add to Home Screen</strong><br />
                Tap your browser's <strong>Share</strong> or <strong>Menu</strong> button, then choose <strong>"Add to Home Screen"</strong>.
              </div>
            )}
          </div>
        )}

        <h1 style={s.title}>BRIE</h1>
        <p style={s.subtitle}>Play, explore &amp; discover</p>

        <div style={s.toyGrid}>
          {[
            { icon: '🔷', label: 'Shapes', screen: 'shapes' },
            { icon: '🌟', label: 'Patterns', screen: 'patterns' },
            { icon: '🔤', label: 'Letters', screen: 'letters' },
            { icon: '🌻', label: 'Counting', screen: 'counting' },
            { icon: '📖', label: 'Stories', screen: 'story' },
            { icon: '🎨', label: 'Colors', screen: 'colors' },
            { icon: '🧩', label: 'Mix & Match', screen: 'combine' },
            { icon: '🕐', label: 'Time', screen: 'time' },
            { icon: '🦕', label: 'Dinos', screen: 'dinos' },
          ].map((game, idx) => (
            <button
              key={game.screen}
              style={s.toyButton(idx)}
              onClick={() => { playTap(); setScreen(game.screen) }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <span style={s.toyIcon}>{game.icon}</span>
              <div style={s.toyLabel}>{game.label}</div>
            </button>
          ))}
        </div>

        <footer style={s.footer}>
          No ads · No rules · No data collected · Just play 🌈
        </footer>
      </div>
    </div>
  )
}
