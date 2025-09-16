import { useEffect, useRef } from 'react'
import type { CreateTypes } from 'canvas-confetti'
import confetti from 'canvas-confetti'

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const confettiRef = useRef<CreateTypes | null>(null)

  // Initialize the confetti instance and store it in a ref
  useEffect(() => {
    if (canvasRef.current && !confettiRef.current) {
      confettiRef.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: false,
      })
    }
  }, [])

  // Fire confetti when active becomes true
  useEffect(() => {
    if (active && confettiRef.current) {
      console.log('Confetti!')
      confettiRef.current({
        particleCount: 160,
        spread: 80,
        startVelocity: 45,
        gravity: 1,
        ticks: 200,
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#a855f7'],
        origin: { x: 0.5, y: 0 },
      })
    }
  }, [active])

  return <canvas ref={canvasRef} className={`confetti w-full h-full ${active ? 'active' : ''}`} />
}
