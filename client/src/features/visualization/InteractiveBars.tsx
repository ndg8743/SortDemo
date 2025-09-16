import { Stage, Container, Graphics } from '@pixi/react';
import { useMemo, useRef, useState, useCallback } from 'react';

export interface InteractiveBarsProps {
  values: number[];
  width: number;
  height: number;
  onValuesChange: (newValues: number[]) => void;
}

export function InteractiveBars({ values, width, height, onValuesChange }: InteractiveBarsProps) {
  const [draggedItems, setDraggedItems] = useState<Map<number, { index: number; offset: number }>>(new Map());
  const max = useMemo(() => Math.max(1, ...values), [values]);
  const barWidth = Math.max(1, Math.floor(width / Math.max(1, values.length)));
  const stageRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    const x = event.clientX - rect.left;
    const index = Math.floor(x / barWidth);

    if (index >= 0 && index < values.length) {
      const offset = x - (index * barWidth + barWidth / 2);
      setDraggedItems(prev => {
        const newMap = new Map(prev);
        newMap.set(event.pointerId, { index, offset });
        return newMap;
      });
    }
  }, [barWidth, values.length]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedItems.has(event.pointerId)) return;

    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { index: draggedIndex, offset: dragOffset } = draggedItems.get(event.pointerId)!;

    const x = event.clientX - rect.left;
    const newIndex = Math.floor((x - dragOffset) / barWidth);

    if (newIndex >= 0 && newIndex < values.length && newIndex !== draggedIndex) {
      const newValues = [...values];
      const draggedValue = newValues[draggedIndex];
      newValues.splice(draggedIndex, 1);
      newValues.splice(newIndex, 0, draggedValue);
      
      onValuesChange(newValues);

      setDraggedItems(prev => {
        const newMap = new Map(prev);
        newMap.set(event.pointerId, { ...newMap.get(event.pointerId)!, index: newIndex });
        return newMap;
      });
    }
  }, [draggedItems, barWidth, values, onValuesChange]);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (draggedItems.has(event.pointerId)) {
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);
      setDraggedItems(prev => {
        const newMap = new Map(prev);
        newMap.delete(event.pointerId);
        return newMap;
      });
    }
  }, [draggedItems]);

  const draw = (g: any) => {
    g.clear();
    const baseColor = 0x4b5563; // slate-600
    const dragColor = 0x3b82f6; // blue-500
    
    const currentlyDraggedIndices = Array.from(draggedItems.values()).map(item => item.index);

    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      const h = Math.floor((v / max) * (height - 2));
      let color = baseColor;

      if (currentlyDraggedIndices.includes(i)) {
        color = dragColor;
      }

      g.beginFill(color);
      g.drawRect(i * barWidth, height - h, barWidth - 1, h);
      g.endFill();
    }
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none', cursor: 'grab' }}
    >
      <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
        <Container>
          <Graphics draw={draw} />
        </Container>
      </Stage>
    </div>
  );
}
