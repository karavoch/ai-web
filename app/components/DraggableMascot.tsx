"use client";

import { useRef, useState } from "react";
import { Mascot, type MascotState } from "./Mascot";

export function DraggableMascot({
  state,
  initial = { right: 32, bottom: 32 },
}: {
  state: MascotState;
  initial?: { right: number; bottom: number };
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: pos.x,
      baseY: pos.y,
    };
    setIsDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({ x: dragRef.current.baseX + dx, y: dragRef.current.baseY + dy });
  }

  function onPointerUp() {
    dragRef.current = null;
    setIsDragging(false);
  }

  return (
    <div
      className="pointer-events-none fixed z-40 select-none"
      style={{
        right: `${initial.right}px`,
        bottom: `${initial.bottom}px`,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`pointer-events-auto cursor-grab touch-none transition-transform ${
          isDragging ? "cursor-grabbing scale-105" : "hover:scale-105"
        }`}
        style={{ transitionDuration: "150ms" }}
        title="Перетащи меня"
      >
        <Mascot state={state} size="sm" />
      </div>
    </div>
  );
}