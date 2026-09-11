"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mascot, type MascotState } from "./Mascot";

type Mood = "curious" | "serious" | "playful" | "skeptical" | "impressed";

const POSITIONS: Record<Mood, Array<{ x: number; y: number }>> = {
  curious: [
    { x: 28, y: 26 },
    { x: 72, y: 24 },
    { x: 32, y: 44 },
    { x: 68, y: 42 },
  ],
  serious: [
    { x: 22, y: 22 },
    { x: 78, y: 22 },
    { x: 22, y: 40 },
    { x: 78, y: 40 },
  ],
  playful: [
    { x: 20, y: 22 },
    { x: 80, y: 28 },
    { x: 25, y: 45 },
    { x: 75, y: 24 },
    { x: 50, y: 32 },
  ],
  skeptical: [
    { x: 78, y: 32 },
    { x: 78, y: 44 },
    { x: 72, y: 24 },
  ],
  impressed: [
    { x: 50, y: 26 },
    { x: 36, y: 38 },
    { x: 64, y: 38 },
  ],
};

const MOOD_INTERVAL: Record<Mood, number> = {
  curious: 5000,
  serious: 6500,
  playful: 3800,
  skeptical: 5500,
  impressed: 4800,
};

const STATE_TARGET: Partial<Record<MascotState, { x: number; y: number }>> = {
  thinking:  { x: 50, y: 36 },
  analyzing: { x: 50, y: 36 },
  writing:   { x: 50, y: 42 },
  finished:  { x: 50, y: 36 },
  skeptical: { x: 65, y: 38 },
};

export function FloatingMascot({
  state,
  mood = "curious",
  bubble,
  isAsking,
  fastTravel,
}: {
  state: MascotState;
  mood?: Mood;
  bubble: React.ReactNode;
  isAsking: boolean;
  fastTravel?: boolean;
}) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseOffsetX: number;
    baseOffsetY: number;
  } | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Авто-дрейф: setState только в callback setInterval — ок */
  useEffect(() => {
    if (dragging) return;
    if (!isAsking) return;
    if (state !== "listening" && state !== "idle") return;

    const positions = POSITIONS[mood] ?? POSITIONS.curious;
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % positions.length);
    }, MOOD_INTERVAL[mood] ?? 5000);

    return () => clearInterval(id);
  }, [isAsking, mood, state, dragging]);

  /* Базовая позиция вычисляется при каждом рендере — без setState */
  const basePos = useMemo(() => {
    const stateTarget = STATE_TARGET[state];
    if (stateTarget) return stateTarget;

    if (isAsking) {
      const positions = POSITIONS[mood] ?? POSITIONS.curious;
      return positions[autoIndex % positions.length];
    }

    return { x: 50, y: 35 };
  }, [state, mood, isAsking, autoIndex]);

  /* Финальная позиция = базовая + смещение от drag */
  const finalX = basePos.x + dragOffset.x;
  const finalY = basePos.y + dragOffset.y;

  /* Drag handlers */
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseOffsetX: dragOffset.x,
      baseOffsetY: dragOffset.y,
    };
    setDragging(true);

    if (resetTimer.current) clearTimeout(resetTimer.current);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setDragOffset({
      x: dragRef.current.baseOffsetX + (dx / vw) * 100,
      y: dragRef.current.baseOffsetY + (dy / vh) * 100,
    });
  }

  function onPointerUp() {
    dragRef.current = null;
    setDragging(false);

    /* Через 4 секунды после drag плавно вернуться в траекторию */
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setDragOffset({ x: 0, y: 0 });
    }, 4000);
  }

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  return (
    <div
      className={`mascot-flyer ${dragging ? "is-dragging" : ""} ${
        fastTravel && !dragging ? "is-fast" : ""
      }`}
      style={{
        transform: `translate(${finalX}vw, ${finalY}vh) translate(-50%, -50%)`,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`pointer-events-auto flex w-[240px] touch-none select-none flex-col items-center sm:w-[260px] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "none" }}
      >
        <div className="speech-bubble relative w-full rounded-2xl border border-white/10 bg-[#15151f]/95 px-4 py-3 backdrop-blur-md">
          {bubble}
          <div className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-b border-r border-white/10 bg-[#15151f]" />
        </div>

        <div className="mt-3">
          <Mascot state={state} size="sm" />
        </div>
      </div>
    </div>
  );
}