import { useEffect, useRef, useState } from 'react'
import { Group } from 'three'
import { RenderedToy } from './ToyArt'
import { ball, block, drum, productModel } from './toyModels'
import FamilyScene from './FamilyScene'
import './family-play.css'

const family = [
  { name: 'Bluey', warm: false, adult: false },
  { name: 'Bingo', warm: true, adult: false },
  { name: 'Bandit', warm: false, adult: true },
  { name: 'Chilli', warm: true, adult: true },
]
const stations = [
  { name: 'Snack Time', room: 'Kitchen', icon: '🍎', action: 'Eat an apple', reaction: 'crunches an apple!', color: '#fbe1ae', notes: [330, 523] },
  { name: 'Tea Party', room: 'Dining room', icon: '🪑', action: 'Sit and have tea', reaction: 'sits down for tea!', color: '#efd1df', notes: [494, 659, 784] },
  { name: 'Music Time', room: 'Playroom', icon: '🎵', action: 'Play the xylophone', reaction: 'plays a tune!', color: '#d4e8f5', notes: [523, 659, 784] },
  { name: 'Bubble Bath', room: 'Bathroom', icon: '🫧', action: 'Splash in the bath', reaction: 'makes a big splash!', color: '#cfebe6', notes: [784, 659, 523] },
  { name: 'Trampoline', room: 'Backyard', icon: '★', action: 'Bounce on the trampoline', reaction: 'bounces high!', color: '#dbedc1', notes: [392, 587, 880] },
]
const keys = ['Red', 'Yellow', 'Green', 'Blue']

const challenges = [
  { prompt: 'Put three apples on the plate.', options: ['🍎 Apple'], answer: [0, 0, 0], hint: 'Count the apples as you tap.' },
  { prompt: 'Set the table: plate, cup, then spoon.', options: ['🥄 Spoon', '🍽 Plate', '☕ Cup'], answer: [1, 2, 0], hint: 'The plate goes first, then the cup.' },
  { prompt: 'Copy the tune: red, yellow, red.', options: ['🔴 Red', '🟡 Yellow', '🟢 Green', '🔵 Blue'], answer: [0, 1, 0], hint: 'Red, yellow, red. Try as many times as you like.' },
  { prompt: 'Pop four bubbles.', options: ['🫧 Pop a bubble'], answer: [0, 0, 0, 0], hint: 'Count each pop.' },
  { prompt: 'Finish the pattern: low, high, low, …', options: ['↓ Low bounce', '↑ High bounce'], answer: [1], hint: 'Say it out loud: low, high, low, high.' },
]

function RoomChallenge({ index, onComplete, play }) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [retry, setRetry] = useState(false)
  const { prompt, options, answer, hint } = challenges[index]
  const complete = progress === answer.length

  function choose(option) {
    const pitches = index === 2 ? [523, 659, 784, 1047] : [440, 523, 659, 784]
    play([pitches[option]])
    if (answer[progress] !== option) {
      setRetry(true)
      return
    }
    setRetry(false)
    setProgress(progress + 1)
    if (progress + 1 === answer.length) onComplete(index)
  }

  return <div className="family-challenge">
    <button type="button" className="family-task" aria-expanded={open} onClick={() => setOpen(!open)}>
      {complete ? '★ Star found' : '☆ Find a star'}
    </button>
    {open && <div className="family-task-panel">
      <p>{complete ? 'You found a star!' : prompt}</p>
      {!complete && <div className="family-step-count" aria-label={`${progress} of ${answer.length} steps`}>
        {answer.map((step, position) => <span key={position} aria-hidden="true">{position < progress ? '★' : '☆'}</span>)}
      </div>}
      <div className="family-task-actions">
        {complete ? <button type="button" onClick={() => { setProgress(0); setRetry(false) }}>Try again</button>
          : options.map((option, number) => <button type="button" key={option} onClick={() => choose(number)}>{option}</button>)}
      </div>
      {retry && !complete && <p role="status">{hint}</p>}
    </div>}
  </div>
}

function activityModel(index) {
  if (index === 0) return productModel('Apple')
  const group = new Group()
  if (index === 1) {
    block(group, '#bb7951', [0, .23, -.29], [1.21, 1.12, .21])
    block(group, '#e7ad72', [0, -.23, .11], [1.3, .25, .99])
    for (const x of [-.49, .49]) {
      for (const z of [-.24, .46]) block(group, '#9f684a', [x, -.48, z], [.16, .52, .16])
    }
    drum(group, '#fff0d7', [.21, -.04, .37], [.26, .23, .26])
    drum(group, '#d79a77', [.21, .08, .37], [.203, .035, .203])
  } else if (index === 2) {
    block(group, '#a07662', [0, -.29, 0], [1.6, .19, 1.15])
    for (const [key, color] of ['#e37579', '#ebba5e', '#8bb873', '#76aadb'].entries()) {
      block(group, color, [(key - 1.5) * .36, -.13, 0], [.3, .17, 1.02 - key * .115])
    }
  } else if (index === 3) {
    ball(group, '#83bfcf', [0, -.26, 0], [.94, .46, .61])
    ball(group, '#c9f1f4', [0, -.045, 0], [.88, .24, .56])
    for (const [x, y, z, size] of [[-.45,.19,.18,.25],[.05,.25,.1,.31],[.48,.12,.19,.25],[.24,.48,-.25,.13]]) {
      ball(group, '#f8ffff', [x,y,z], [size,size,size])
    }
  } else {
    for (const x of [-.59,.59]) block(group, '#726690', [x,-.39,0], [.14,.48,.14])
    drum(group, '#ef947c', [0,-.14,0], [.87,.19,.62])
    drum(group, '#62537f', [0,-.025,0], [.73,.08,.51])
  }
  return group
}

function CharacterArt({ member, makeCharacter, size }) {
  return <RenderedToy artKey={`family:${member.name}`} size={size} fallback={member.warm ? '🟠' : '🔵'}
    makeModel={() => makeCharacter(member.warm, member.adult)} />
}

export default function FamilyPlay({ makeCharacter, onBack }) {
  const [selected, setSelected] = useState(0)
  const [places, setPlaces] = useState([0, 2, 4, 1])
  const [seated, setSeated] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showChallenges, setShowChallenges] = useState(false)
  const [stars, setStars] = useState([])
  const [carrying, setCarrying] = useState(null)
  const house = useRef(null)
  const drag = useRef(null)
  const frame = useRef(null)
  const handledDrag = useRef(false)
  const audio = useRef(null)

  useEffect(() => () => {
    cancelAnimationFrame(frame.current)
    audio.current?.close().catch(() => {})
  }, [])

  function play(notes) {
    const Audio = window.AudioContext || window.webkitAudioContext
    if (!Audio) return
    const context = audio.current ??= new Audio()
    if (context.state === 'suspended') context.resume().catch(() => {})
    notes.forEach((frequency, index) => {
      const tone = context.createOscillator()
      const volume = context.createGain()
      const start = context.currentTime + index * .105
      tone.frequency.value = frequency
      volume.gain.setValueAtTime(.065, start)
      volume.gain.exponentialRampToValueAtTime(.001, start + .24)
      tone.connect(volume).connect(context.destination)
      tone.start(start)
      tone.stop(start + .25)
    })
  }

  function act(member, station) {
    if (station !== 0 && seated === member) setSeated(null)
    setSelected(member)
    setPlaces(previous => previous.map((place, index) => index === member ? station : place))
    setFeedback(previous => ({ member, station, repeat: (previous?.repeat ?? 0) + 1 }))
    play(stations[station].notes)
  }

  function earnStar(index) {
    setStars(previous => previous.includes(index) ? previous : [...previous, index])
  }

  function autoScroll() {
    const current = drag.current
    if (!current?.moving || current.member === null) return
    const bounds = house.current.getBoundingClientRect()
    if (current.y >= bounds.top && current.y <= bounds.bottom) {
      if (current.x > bounds.right - 48) house.current.scrollLeft += 8
      if (current.x < bounds.left + 48) house.current.scrollLeft -= 8
    }
    frame.current = requestAnimationFrame(autoScroll)
  }

  function startDrag(event, member) {
    if (!event.isPrimary || event.button !== 0) return
    handledDrag.current = false
    drag.current = { member, id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event) {
    const current = drag.current
    if (current?.id !== event.pointerId) return
    current.x = event.clientX
    current.y = event.clientY
    if (!current.moving && Math.hypot(current.x - current.startX, current.y - current.startY) < 9) return
    if (!current.moving) {
      current.moving = true
      frame.current = requestAnimationFrame(autoScroll)
    }
    setCarrying({ member: current.member, x: current.x, y: current.y })
  }

  function finishDrag(event, canceled = false) {
    const current = drag.current
    if (current?.id !== event.pointerId) return
    drag.current = null
    cancelAnimationFrame(frame.current)
    setCarrying(null)
    if (canceled || !current.moving) return
    handledDrag.current = true
    const hit = document.elementFromPoint(event.clientX, event.clientY)
    const target = hit?.closest('[data-play-station]')
    if (!target || !house.current.contains(target)) return
    const station = Number(target.dataset.playStation)
    if (current.member === null) {
      const recipient = hit.closest('[data-family-member]')
      if (station === 0 && recipient) act(Number(recipient.dataset.familyMember), 0)
      return
    }
    if (station === 0) {
      if (hit.closest('[data-kitchen-chair]')) sit(current.member)
      else {
        if (seated === current.member) setSeated(null)
        setPlaces(previous => previous.map((place, index) => index === current.member ? 0 : place))
        setSelected(current.member)
        setFeedback(null)
      }
      return
    }
    act(current.member, station)
  }

  function sit(member) {
    setSelected(member)
    setSeated(member)
    setPlaces(previous => previous.map((place, index) => index === member ? 0 : place))
    setFeedback(null)
    play([392, 523])
  }

  function character(member, index, inRoom = false) {
    return <button type="button" key={member.name} className={inRoom ? 'family-puppet family-in-room' : 'family-puppet'}
      aria-label={inRoom ? `Move ${member.name} from ${stations[places[index]].room}` : member.name}
      data-family-member={inRoom ? index : undefined}
      aria-pressed={index === selected} onClick={() => { if (!handledDrag.current) setSelected(index); handledDrag.current = false }}
      onPointerDown={event => startDrag(event, index)} onPointerMove={moveDrag}
      onPointerUp={event => finishDrag(event)} onPointerCancel={event => finishDrag(event, true)}>
      <CharacterArt member={member} makeCharacter={makeCharacter} size={66} />
      <span>{member.name}</span>
    </button>
  }

  return <main className="bluey-page family-play">
    <div className="bluey-shell">
      <header className="bluey-nav"><button type="button" aria-label="Back to Bluey" onClick={onBack}>←</button><strong>Bluey</strong></header>
      <h1>Play House</h1>
      <p className="family-prompt">Drag the apple to feed Bluey. Swipe to explore.</p>
      <div className="family-cast" aria-label="Choose a character">{family.map((member, index) => character(member, index))}</div>
      <div className="family-house" ref={house} tabIndex={0} role="region" aria-label="Play House. Scroll sideways to explore.">
        <div className="family-world">
          <div className="family-live-scene">
            <FamilyScene stations={stations} family={family} places={places} makeCharacter={makeCharacter}
              makeProp={activityModel} feedback={feedback} seated={seated} carrying={carrying} />
          </div>
        {stations.map((station, index) => <section className="family-room" key={station.name}
          data-play-station={index} aria-label={station.room} style={{ '--room-color': station.color }}>
          <h2>{station.room}</h2>
          <button type="button" className={index === 0 ? 'family-activity family-food' : 'family-activity'} aria-label={index === 0 ? 'Apple. Drag to feed a character' : station.action}
            onPointerDown={index === 0 ? event => startDrag(event, null) : undefined}
            onPointerMove={index === 0 ? moveDrag : undefined}
            onPointerUp={index === 0 ? event => finishDrag(event) : undefined}
            onPointerCancel={index === 0 ? event => finishDrag(event, true) : undefined} onClick={() => {
            if (index === 0 && handledDrag.current) { handledDrag.current = false; return }
            const occupant = places.indexOf(index)
            act(index === 0 && seated !== null ? seated : places[selected] === index || occupant === -1 ? selected : occupant, index)
          }}>
            <RenderedToy artKey={`family-station:${index}`} makeModel={() => activityModel(index)} fallback={station.icon} size={126} />
            <span>{index === 0 ? 'Apple' : station.name}</span>
          </button>
          {index === 0 && <button type="button" className="family-chair" data-kitchen-chair
            aria-label="Chair. Drag a character here to sit" onClick={() => sit(selected)}><span>Chair</span></button>}
          <div className="family-room-cast">
            {family.map((member, memberIndex) => places[memberIndex] === index && <div
              className={`family-pose family-pose-${index}${index === 0 && seated === memberIndex ? ' family-seated' : ''}`} style={{ gridColumn: memberIndex + 1 }}
              key={`${member.name}:${feedback?.member === memberIndex ? feedback.repeat : ''}`}>
              {character(member, memberIndex, true)}
              {feedback?.member === memberIndex && feedback.station === index && <span className="family-reaction" aria-hidden="true">{station.icon}</span>}
            </div>)}
          </div>
          {index === 2 && <div className="family-notes" aria-label="Xylophone keys">
            {keys.map((key, pitch) => <button type="button" key={key} aria-label={`Play ${key.toLowerCase()} note`}
              style={{ '--key-color': ['#e7868b', '#efbd55', '#94c681', '#8fbbe7'][pitch] }}
              onClick={() => play([[523, 659, 784, 1047][pitch]])}>♪</button>)}
          </div>}
          <div style={{ display: showChallenges ? undefined : "none" }}><RoomChallenge index={index} onComplete={earnStar} play={play} /></div>
        </section>)}
        </div>
      </div>
      <p role="status" className="family-status">{feedback
        ? `${family[feedback.member].name} ${stations[feedback.station].reaction}`
        : seated === null ? '' : `${family[seated].name} is sitting!`}</p>
      <button type="button" className="family-find-stars" aria-pressed={showChallenges}
        onClick={() => setShowChallenges(!showChallenges)}>
        {showChallenges ? 'Hide star challenges' : '☆ Find stars'}
      </button>
      {showChallenges && <p className="family-stars" aria-live="polite">{stars.length === stations.length
        ? '★ You found all five stars!' : `★ ${stars.length} / ${stations.length} stars`}</p>}
      {carrying && <div className="family-carry" style={{ left: carrying.x, top: carrying.y }} aria-hidden="true">
        {carrying.member === null
          ? <RenderedToy artKey="family-station:0" makeModel={() => activityModel(0)} fallback="🍎" size={65} />
          : <CharacterArt member={family[carrying.member]} makeCharacter={makeCharacter} size={80} />}
      </div>}
    </div>
  </main>
}
