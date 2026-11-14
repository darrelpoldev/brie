import { useEffect, useState } from 'react'
import { clockModel, dinoModel, flowerModel, glyphModel, shapeModel, toyModel } from './toyModels'
import { toyPreview } from './toyPreview'

export function RenderedToy({ artKey, makeModel, fallback, size, className, wide, flat }) {
  const [rendered, setRendered] = useState(null)
  useEffect(() => {
    const url = toyPreview(artKey, makeModel, wide, flat)
    setRendered(previous => previous?.key === artKey && previous.url === url ? previous : { key: artKey, url })
  }, [artKey, makeModel, wide, flat])
  const url = rendered?.key === artKey ? rendered.url : null
  return url
    ? <img className={className} src={url} alt="" draggable="false" width={size} height={size} />
    : <span className={className} aria-hidden="true" style={{ fontSize: typeof size === 'number' ? size * .68 : undefined }}>{fallback}</span>
}

export function ToyArt({ kind, size, fallback, className }) {
  return <RenderedToy artKey={kind} makeModel={() => toyModel(kind)} size={size} fallback={fallback} className={className} wide={kind === 'home'} />
}

export function GamePiece({ type = 'glyph', value, color, size, fallback = value, className }) {
  const factory = {
    shape: shapeModel,
    glyph: glyphModel,
    flower: flowerModel,
    dino: (name, tint) => dinoModel(tint, name),
    clock: clockModel,
  }[type]
  return <RenderedToy artKey={`${type}:${value}:${color}`} makeModel={() => factory(value, color)} fallback={fallback} size={size} className={className} flat={type === 'clock'} />
}
