import { useEffect, useState } from 'react'

export function useSize(target: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    const el = target.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        setSize({ width: Math.max(0, Math.floor(cr.width)), height: Math.max(0, Math.floor(cr.height)) })
      }
    })
    ro.observe(el)
    // initialize size synchronously if possible
    setSize({ width: Math.max(0, Math.floor(el.clientWidth)), height: Math.max(0, Math.floor(el.clientHeight)) })
    return () => ro.disconnect()
  }, [target])

  return size
}



