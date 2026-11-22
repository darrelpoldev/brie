import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { setBackend } from '@tensorflow/tfjs-core'
import { load } from '@tensorflow-models/coco-ssd'

let detector
let lastInference = Promise.resolve()

async function loadDetector() {
  // The model downloads once per page. Inference runs locally on camera frames.
  if (!await setBackend('webgl')) await setBackend('cpu')
  return load()
}

export async function createObjectScanner() {
  detector ??= loadDetector().catch(error => {
    detector = undefined
    throw error
  })
  const model = await detector
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })

  return async video => {
    const scale = Math.min(1, 384 / Math.max(video.videoWidth, video.videoHeight))
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale))
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale))
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const inference = lastInference.then(() => model.detect(canvas, 12, .45))
    lastInference = inference.catch(() => {})
    const detections = await inference

    return detections.filter(item => !['person', 'dog', 'cat'].includes(item.class)).map(item => {
      const [x, y, width, height] = item.bbox
      return {
        label: item.class,
        x: x / canvas.width,
        y: y / canvas.height,
        width: width / canvas.width,
        height: height / canvas.height,
      }
    })
  }
}
