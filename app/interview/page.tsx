"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mascot, type MascotState } from "../components/Mascot";
import { FloatingMascot } from "../components/FloatingMascot";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { AuroraBorealis } from "../components/AuroraBorealis";

type InterviewItem = { question: string; answer: string };
type Mood =
  | "curious"
  | "serious"
  | "playful"
  | "skeptical"
  | "annoyed"
  | "pout"
  | "impressed";

const TOTAL_QUESTIONS = 10;
const MIN_AGE = 18;

type Phase = "intro" | "blocked" | "interview" | "analyzing";

const INTRO_STEPS: { state: MascotState; text: string }[] = [
  { state: "idle", text: "Хм. Ну привет. Я Mindprint. Не то чтобы мне было интересно, но… как ты вообще думаешь?" },
  { state: "listening", text: "Мы поговорим о сложных ситуациях. Здесь нет правильных ответов — только твои. Только не ври, ладно?" },
  { state: "listening", text: "Как тебя зовут?" },
  { state: "listening", text: "Сколько тебе лет? Только честно." },
];

export default function Interview() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("intro");
  const [introStep, setIntroStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

  const [history, setHistory] = useState<InterviewItem[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mood, setMood] = useState<Mood>("curious");
  const [fastTravel, setFastTravel] = useState(false);

  const hasFetched = useRef(false);

  async function fetchQuestion(currentHistory: InterviewItem[]) {
    setError("");
    setMascotState("thinking");
    setFastTravel(true);
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: currentHistory,
          userContext: { name: userName, age: userAge },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка сервера");

      setQuestion(data.question);
      const newMood = (data.mood || "curious") as Mood;
      setMood(newMood);

      const moodToState: Record<Mood, MascotState> = {
        curious:   "listening",
        serious:   "listening",
        playful:   "listening",
        skeptical: "skeptical",
        annoyed:   "annoyed",
        pout:      "pout",
        impressed: "blush",
      };
      setMascotState(moodToState[newMood] ?? "listening");
      setFastTravel(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ошибка.";
      setError(message);
      setMascotState("skeptical");
      setFastTravel(false);
    } finally {
      setLoading(false);
      setSending(false);
    }
  }

  useEffect(() => {
    if (phase !== "interview") return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    setLoading(true);
    fetchQuestion([]);
  }, [phase]);

  function handleIntroNext() {
    if (introStep === 2 && !userName.trim()) return;

    if (introStep === 3) {
      const ageNum = parseInt(userAge.trim(), 10);
      if (!userAge.trim() || isNaN(ageNum)) return;
      if (ageNum < MIN_AGE) {
        setPhase("blocked");
        setMascotState("skeptical");
        return;
      }
    }

    if (introStep < INTRO_STEPS.length - 1) {
      setIntroStep(introStep + 1);
    } else {
      setPhase("interview");
      setMascotState("thinking");
    }
  }

  function handleIntroAnswer(value: string) {
    if (introStep === 2) setUserName(value);
    if (introStep === 3) setUserAge(value.replace(/\D/g, ""));
  }

  async function handleNext() {
    const trimmed = answer.trim();
    if (!trimmed || sending || loading) return;

    const len = trimmed.length;
    if (len < 10) {
      setMascotState("annoyed");
    } else if (len > 200) {
      setMascotState("skeptical");
    } else {
      setMascotState("writing");
    }
    setFastTravel(true);

    const updated = [...history, { question, answer: trimmed }];
    setHistory(updated);
    setAnswer("");

    await new Promise((r) => setTimeout(r, 700));

    if (updated.length >= TOTAL_QUESTIONS) {
      sessionStorage.setItem("mindprint_interview", JSON.stringify(updated));
      setPhase("analyzing");
      setMascotState("analyzing");
      await new Promise((r) => setTimeout(r, 2400));
      setMascotState("finished");
      await new Promise((r) => setTimeout(r, 900));
      router.push("/result");
      return;
    }

    setSending(true);
    setLoading(true);
    await fetchQuestion(updated);
  }

  const currentNumber = history.length + 1;
  const progress = Math.min((currentNumber / TOTAL_QUESTIONS) * 100, 100);
  const auroraActive = mascotState === "thinking" || mascotState === "analyzing";

  if (phase === "blocked") {
    return (
      <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center font-sans">
        <BackgroundGlow />
        <div className="relative z-10 flex flex-col items-center">
          <Mascot state="skeptical" size="sm" />
          <div className="mb-4 mt-6 h-[2px] w-8 bg-[#ff3b00]" />
          <h1 className="text-lg font-normal leading-tight tracking-tight">
            Хм. Нет.
          </h1>
          <p className="mt-3 max-w-[280px] text-[13px] leading-[1.6] text-white/50">
            Вопросы рассчитаны на взрослых. Возвращайся, когда исполнится {MIN_AGE}.
          </p>
          <Link
            href="/"
            className="mt-7 flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 font-mono text-[11px] font-bold tracking-[0.15em] text-white backdrop-blur-sm active:scale-[0.98]"
          >
            НА ГЛАВНУЮ
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "analyzing") {
    return (
      <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        <BackgroundGlow />
        <AuroraBorealis active />
        <div className="relative z-10 flex flex-col items-center">
          <Mascot state={mascotState} size="sm" />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Анализирую ответы…
          </p>
        </div>
      </main>
    );
  }

  /* Текст, который показывается в облачке.
     null → облачко покажет анимированные точки. */
  const bubbleText: string | null =
    phase === "intro"
      ? INTRO_STEPS[introStep].text
      : loading
        ? null
        : error
          ? error
          : question;

  const isAsking =
    phase === "interview" && !loading && !error && !!question && !sending;

  return (
    <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col font-sans">
      <BackgroundGlow />
      <AuroraBorealis active={auroraActive} />

      <header className="relative z-20 flex w-full items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white active:opacity-60"
        >
          MINDPRINT
        </Link>
        <span className="font-mono text-[10px] tracking-widest text-white/40">
          {phase === "intro"
            ? `${introStep + 1} / ${INTRO_STEPS.length}`
            : `${String(Math.min(currentNumber, TOTAL_QUESTIONS)).padStart(2, "0")} / ${TOTAL_QUESTIONS}`}
        </span>
      </header>

      <div className="relative z-20 mx-5 h-[2px] w-[calc(100%-40px)] bg-white/10">
        <div
          className="h-[2px] bg-[#ff3b00] transition-all duration-500"
          style={{
            width:
              phase === "intro"
                ? `${((introStep + 1) / INTRO_STEPS.length) * 100}%`
                : `${progress}%`,
          }}
        />
      </div>

      <FloatingMascot
        state={mascotState}
        mood={mood}
        bubbleText={bubbleText}
        isAsking={isAsking}
        fastTravel={fastTravel}
      />

      <section className="relative z-20 mt-auto w-full px-5 pb-5">
        <div className="mx-auto w-full max-w-sm">
          {phase === "intro" && introStep >= 2 && (
            <input
              type={introStep === 3 ? "tel" : "text"}
              inputMode={introStep === 3 ? "numeric" : "text"}
              value={introStep === 2 ? userName : userAge}
              onChange={(e) => handleIntroAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleIntroNext();
              }}
              placeholder={introStep === 2 ? "Твоё имя" : "Возраст"}
              maxLength={introStep === 3 ? 3 : 40}
              className="mb-3 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-center text-[15px] text-white outline-none backdrop-blur-md transition-colors placeholder:text-white/30 focus:border-[#ff3b00]"
              autoFocus
            />
          )}

          {phase === "interview" && (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Напиши своими словами…"
              className="mb-3 min-h-[110px] w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-4 text-[15px] leading-[1.55] text-white outline-none backdrop-blur-md transition-colors placeholder:text-white/30 focus:border-[#ff3b00]"
              disabled={sending}
              autoFocus
            />
          )}

          <button
            onClick={phase === "intro" ? handleIntroNext : handleNext}
            disabled={
              phase === "intro"
                ? !(introStep < 2 || (introStep === 2 ? userName.trim() : userAge.trim()))
                : !answer.trim() || sending
            }
            className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-black shadow-lg shadow-black/40 transition-all active:scale-[0.98] active:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span>
              {phase === "intro"
                ? introStep === 3
                  ? "НАЧАТЬ"
                  : "ДАЛЕЕ"
                : sending
                  ? "ДУМАЕМ…"
                  : currentNumber === TOTAL_QUESTIONS
                    ? "ЗАВЕРШИТЬ"
                    : "ОТВЕТИТЬ"}
            </span>
            <span className="font-sans text-base font-light">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}