import { Stage, Container, Graphics } from '@pixi/react'
// Using any for Pixi Graphics draw signature to align with @pixi/react typings
import { useMemo } from 'react'

export interface Highlights {
  compare?: number[]
  swap?: number[]
  write?: number[]
  pivot?: number[]
}

export function PixiBars({ values, width, height, highlights }: { values: number[]; width: number; height: number; highlights?: Highlights }) {
  const max = useMemo(() => Math.max(1, ...values), [values])
  const safeWidth = Math.max(0, width)
  const safeHeight = Math.max(0, height)
  const barWidth = Math.max(1, Math.floor(safeWidth / Math.max(1, values.length)))

  const draw = (g: any) => {
    g.clear()
    const baseColor = 0x4b5563 // slate-600
    const compareColor = 0x22c55e // green-500
    const swapColor = 0xef4444 // red-500
    const writeColor = 0x3b82f6 // blue-500

    for (let i = 0; i < values.length; i++) {
      const v = values[i]
      const h = Math.floor((v / max) * (safeHeight - 2))
      let color = baseColor
      if (highlights?.compare?.includes(i)) color = compareColor
      if (highlights?.swap?.includes(i)) color = swapColor
      if (highlights?.write?.includes(i)) color = writeColor
      g.beginFill(color)
      g.drawRect(i * barWidth, safeHeight - h, barWidth - 1, h)
      g.endFill()
    }
  }

  return (
    <Stage width={safeWidth} height={safeHeight} options={{ backgroundAlpha: 0 }}>
      <Container>
        <Graphics draw={draw} />
      </Container>
    </Stage>
  )
}


