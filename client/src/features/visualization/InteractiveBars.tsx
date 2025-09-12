import { Stage, Container, Graphics } from '@pixi/react'
import { useMemo, useRef, useState, useCallback } from 'react'

export interface InteractiveBarsProps {
  values: number[]
  width: number
  height: number
  onValuesChange: (newValues: number[]) => void
}

export function InteractiveBars({ values, width, height, onValuesChange }: InteractiveBarsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const max = useMemo(() => Math.max(1, ...values), [values])
  const barWidth = Math.max(1, Math.floor(width / Math.max(1, values.length)))
  const stageRef = useRef<any>(null)

  const handlePointerDown = useCallback((event: any) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = event.clientX - rect.left
    const index = Math.floor(x / barWidth)
    
    if (index >= 0 && index < values.length) {
      setDraggedIndex(index)
      setDragOffset(x - (index * barWidth + barWidth / 2))
    }
  }, [barWidth, values.length])

  const handlePointerMove = useCallback((event: any) => {
    if (draggedIndex === null) return
    
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = event.clientX - rect.left
    const newIndex = Math.floor((x - dragOffset) / barWidth)
    
    if (newIndex >= 0 && newIndex < values.length && newIndex !== draggedIndex) {
      const newValues = [...values]
      const draggedValue = newValues[draggedIndex]
      newValues[draggedIndex] = newValues[newIndex]
      newValues[newIndex] = draggedValue
      onValuesChange(newValues)
      setDraggedIndex(newIndex)
    }
  }, [draggedIndex, dragOffset, barWidth, values, onValuesChange])

  const handlePointerUp = useCallback(() => {
    setDraggedIndex(null)
    setDragOffset(0)
  }, [])

  const draw = (g: any) => {
    g.clear()
    const baseColor = 0x4b5563 // slate-600
    const dragColor = 0x3b82f6 // blue-500
    const hoverColor = 0x6b7280 // gray-500

    for (let i = 0; i < values.length; i++) {
      const v = values[i]
      const h = Math.floor((v / max) * (height - 2))
      let color = baseColor
      
      if (i === draggedIndex) {
        color = dragColor
      } else if (draggedIndex !== null && Math.abs(i - draggedIndex) <= 1) {
        color = hoverColor
      }
      
      g.beginFill(color)
      g.drawRect(i * barWidth, height - h, barWidth - 1, h)
      g.endFill()
    }
  }

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none', cursor: 'grab' }}
    >
      <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
        <Container>
          <Graphics draw={draw} />
        </Container>
      </Stage>
    </div>
  )
}
