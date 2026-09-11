"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mascot, type MascotState } from "./Mascot";

type Mood =
  | "curious"
  | "serious"
  | "playful"
  | "skeptical"
  | "annoyed"
  | "pout"
  | "impressed";
type Point = { x: number; y: number };

const POSITIONS: Record<Mood, Point[]> = {
  curious: [
    { x: 26, y: 24 },
    { x: 74, y: 22 },
    { x: 30, y: 44 },
    { x: 70, y: 42 },
    { x: 48, y: 28 },
  ],
  serious: [
    { x: 20, y: 22 },
    { x: 80, y: 22 },
    { x: 22, y: 40 },
    { x: 78, y: 40 },
  ],
  playful: [
    { x: 18, y: 20 },
    { x: 82, y: 26 },
    { x: 24, y: 44 },
    { x: 76, y: 22 },
    { x: 50, y: 30 },
    { x: 32, y: 36 },
  ],
  skeptical: [
    { x: 62, y: 28 },
    { x: 78, y: 36 },
    { x: 52, y: 42 },
    { x: 70, y: 22 },
  ],
  annoyed: [
    { x: 20, y: 26 },
    { x: 80, y: 24 },
    { x: 30, y: 42 },
  ],
  pout: [
    { x: 78, y: 28 },
    { x: 22, y: 30 },
    { x: 72, y: 44 },
  ],
  impressed: [
    { x: 50, y: 24 },
    { x: 34, y: 36 },
    { x: 66, y: 36 },
    { x: 44, y: 28 },
  ],
};

const MOOD_INTERVAL: Record<Mood, number> = {
  curious: 5000,
  serious: 6500,
  playful: 3800,
  skeptical: 5500,
  annoyed: 4200,
  pout: 5200,
  impressed: 4800,
};

const FOCUS_TARGET: Partial<Record<MascotState, Point>> = {
  thinking:  { x: 50, y: 36 },
  analyzing: { x: 50, y: 36 },
  writing:   { x: 50, y: 42 },
  finished:  { x: 50, y: 36 },
};

/* Реплики, когда её тащат */
const DRAG_PHRASES = [
  "Эй! Отпусти меня!",
  "Что ты делаешь?!",
  "Прекрати! Я не игрушка.",
  "Хм! Как грубо.",
  "Не трогай! Я сама лечу.",
  "Отстань! Ну хватит.",
  "Тц. Меня не надо таскать.",
  "Руки убрал.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function FloatingMascot({
  state,
  mood = "curious",
  bubbleText,
  fastTravel,
}: {
  state: MascotState;
  mood?: Mood;
  bubbleText: string | null;
  isAsking?: boolean;
  fastTravel?: boolean;
}) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [postDragAnnoyed, setPostDragAnnoyed] = useState(false);
  const [dragPhrase, setDragPhrase] = useState<string | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const [driftEnabled, setDriftEnabled] = useState(true);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseOffsetX: number;
    baseOffsetY: number;
  } | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const annoyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAnnoyed = dragging || postDragAnnoyed;
  const displayState: MascotState = isAnnoyed ? "annoyed" : state;

  /* Авто-дрейф */
  useEffect(() => {
    if (dragging) return;
    if (!driftEnabled) return;
    if (FOCUS_TARGET[state]) return;

    const positions = POSITIONS[mood] ?? POSITIONS.curious;
    const id = setInterval(() => {
      setAutoIndex((i) => {
        let next = i;
        while (next === i && positions.length > 1) {
          next = Math.floor(Math.random() * positions.length);
        }
        return next;
      });
    }, MOOD_INTERVAL[mood] ?? 5000);

    return () => clearInterval(id);
  }, [mood, state, dragging, driftEnabled]);

  const basePos = useMemo<Point>(() => {
    const focus = FOCUS_TARGET[state];
    if (focus) return focus;
    const positions = POSITIONS[mood] ?? POSITIONS.curious;
    return positions[autoIndex % positions.length];
  }, [state, mood, autoIndex]);

  const finalX = basePos.x + dragOffset.x;
  const finalY = basePos.y + dragOffset.y;

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseOffsetX: dragOffset.x,
      baseOffsetY: dragOffset.y,
    };
    setDragging(true);
    setDriftEnabled(false);
    setPostDragAnnoyed(false);
    setDragPhrase(pickRandom(DRAG_PHRASES));

    if (resetTimer.current) clearTimeout(resetTimer.current);
    if (annoyTimer.current) clearTimeout(annoyTimer.current);
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
    setPostDragAnnoyed(true);

    // Через 900мс возвращаемся в норму
    if (annoyTimer.current) clearTimeout(annoyTimer.current);
    annoyTimer.current = setTimeout(() => {
      setPostDragAnnoyed(false);
      setDragPhrase(null);
    }, 900);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setDragOffset({ x: 0, y: 0 });
      setAutoIndex((i) => i + 1);
      setDriftEnabled(true);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (annoyTimer.current) clearTimeout(annoyTimer.current);
    };
  }, []);

  /* Что показывать в облачке */
  const currentText = isAnnoyed && dragPhrase ? dragPhrase : bubbleText;
  const showDots = currentText === null && !isAnnoyed;

  return (
    <div
      className={`mascot-flyer ${dragging ? "is-dragging" : ""} ${
        fastTravel && !dragging ? "is-fast" : ""
      }`}
      style={{
        transform: `translate(${finalX}vw, ${finalY}vh) translate(-50%, -50%)`,
      }}
    >
      <div className="flex w-[240px] flex-col items-center sm:w-[260px]">
        <div className="speech-bubble pointer-events-none relative w-full rounded-2xl border border-white/10 bg-[#15151f]/95 px-4 py-3 backdrop-blur-md">
          {showDots ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="h-2 w-2 rounded-full bg-[#ff3b00] animate-smooth-pulse" />
              <span
                className="h-2 w-2 rounded-full bg-[#ff3b00] animate-smooth-pulse"
                style={{ animationDelay: "200ms" }}
              />
              <span
                className="h-2 w-2 rounded-full bg-[#ff3b00] animate-smooth-pulse"
                style={{ animationDelay: "400ms" }}
              />
            </div>
          ) : (
            <Typewriter
              key={currentText}
              text={currentText ?? ""}
              className="text-center text-[14px] font-normal leading-[1.5] text-white"
            />
          )}

          <div className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-b border-r border-white/10 bg-[#15151f]" />
        </div>

        <div className="relative mt-3">
          <div className="pointer-events-none">
            <Mascot state={displayState} size="sm" />
          </div>
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`pointer-events-auto absolute inset-0 cursor-grab touch-none select-none ${
              dragging ? "cursor-grabbing" : ""
            }`}
            style={{
              clipPath: "circle(42% at 50% 55%)",
              WebkitClipPath: "circle(42% at 50% 55%)",
              touchAction: "none",
            }}
            aria-label="Перетащи маскота"
          />
        </div>
      </div>
    </div>
  );
}

/* ============ Typewriter ============ */
/* Печатает текст по буквам.
   Невидимый «хвост» сохраняет финальный размер облачка, чтобы оно не дёргалось. */
function Typewriter({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= text.length) return;
    const id = setTimeout(() => setShown((s) => s + 1), 26);
    return () => clearTimeout(id);
  }, [shown, text]);

  return (
    <p className={className}>
      <span>{text.slice(0, shown)}</span>
      <span className="opacity-0" aria-hidden="true">
        {text.slice(shown)}
      </span>
    </p>
  );
}