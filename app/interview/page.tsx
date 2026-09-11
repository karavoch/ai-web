"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mascot, type MascotState } from "../components/Mascot";
import { BackgroundGlow } from "../components/BackgroundGlow";

type InterviewItem = { question: string; answer: string };

const TOTAL_QUESTIONS = 10;
const MIN_AGE = 18;

type Phase = "intro" | "blocked" | "interview" | "analyzing";

const INTRO_STEPS: { state: MascotState; text: string }[] = [
  {
    state: "idle",
    text: "Привет. Я — Mindprint. AI, который попробует понять, как ты думаешь.",
  },
  {
    state: "listening",
    text: "Мы поговорим о сложных ситуациях. Здесь нет правильных ответов — только твои.",
  },
  {
    state: "listening",
    text: "Как тебя зовут?",
  },
  {
    state: "listening",
    text: "Сколько тебе лет?",
  },
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

  const hasFetched = useRef(false);

  async function fetchQuestion(currentHistory: InterviewItem[]) {
    setError("");
    setMascotState("thinking");
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
      setMascotState("listening");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Не удалось получить вопрос.";
      setError(message);
      setMascotState("skeptical");
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
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer || sending || loading) return;

    const updatedHistory = [...history, { question, answer: trimmedAnswer }];
    setHistory(updatedHistory);
    setAnswer("");
    setMascotState("writing");

    await new Promise((r) => setTimeout(r, 500));

    if (updatedHistory.length >= TOTAL_QUESTIONS) {
      sessionStorage.setItem(
        "mindprint_interview",
        JSON.stringify(updatedHistory)
      );
      setPhase("analyzing");
      setMascotState("analyzing");
      await new Promise((r) => setTimeout(r, 1600));
      setMascotState("finished");
      await new Promise((r) => setTimeout(r, 800));
      router.push("/result");
      return;
    }

    setSending(true);
    setLoading(true);
    await fetchQuestion(updatedHistory);
  }

  const currentNumber = history.length + 1;
  const progress = Math.min((currentNumber / TOTAL_QUESTIONS) * 100, 100);

  /* === 18+ блок === */
  if (phase === "blocked") {
    return (
      <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center font-sans text-[#1c1b18]">
        <BackgroundGlow />

        <div className="relative z-10 flex flex-col items-center">
          <Mascot state="skeptical" size="sm" />

          <div className="mb-4 mt-6 h-[2px] w-8 bg-[#ff3b00]" />

          <h1 className="text-lg font-normal leading-tight tracking-tight">
            Не могу пустить.
          </h1>

          <p className="mt-3 max-w-[280px] text-[13px] leading-[1.6] text-[#757167]">
            Вопросы рассчитаны на взрослых. Возвращайся, когда исполнится {MIN_AGE}.
          </p>

          <Link
            href="/"
            className="mt-7 flex h-12 items-center justify-center rounded-xl border border-[#1c1b18]/15 bg-white/40 px-6 font-mono text-[11px] font-bold tracking-[0.15em] text-[#1c1b18] backdrop-blur-sm transition-all active:scale-[0.98]"
          >
            НА ГЛАВНУЮ
          </Link>
        </div>
      </main>
    );
  }

  /* === Фаза анализа === */
  if (phase === "analyzing") {
    return (
      <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        <BackgroundGlow />

        <div className="relative z-10 flex flex-col items-center">
          <Mascot state={mascotState} size="sm" />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8c887d]">
            Анализирую ответы…
          </p>
        </div>
      </main>
    );
  }

  /* === Основной интерфейс === */
  const bubbleText =
    phase === "intro"
      ? INTRO_STEPS[introStep].text
      : loading
        ? null
        : error
          ? error
          : question;

  return (
    <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased">
      <BackgroundGlow />

      {/* Хедер */}
      <header className="relative z-10 flex w-full items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#1c1b18] active:opacity-60"
        >
          MINDPRINT
        </Link>

        <span className="font-mono text-[10px] tracking-widest text-[#8c887d]">
          {phase === "intro"
            ? `${introStep + 1} / ${INTRO_STEPS.length}`
            : `${String(Math.min(currentNumber, TOTAL_QUESTIONS)).padStart(2, "0")} / ${TOTAL_QUESTIONS}`}
        </span>
      </header>

      {/* Прогресс */}
      <div className="relative z-10 mx-5 h-[2px] w-[calc(100%-40px)] bg-[#e0dcd1]">
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

      {/* Контент */}
      <section className="relative z-10 flex flex-1 flex-col px-5 pt-5">
        {/* Облачко + маскот */}
        <div className="flex flex-col items-center">
          {/* Облачко */}
          <div key={bubbleText} className="relative w-full max-w-sm">
            <div className="speech-bubble relative rounded-2xl bg-white/90 px-4 py-4 backdrop-blur-sm">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-2">
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
                <p className="text-center text-[15px] font-normal leading-[1.5] text-[#1c1b18]">
                  {bubbleText}
                </p>
              )}

              {/* Хвостик облачка */}
              <div className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-white/90 backdrop-blur-sm" />
            </div>
          </div>

          {/* Маскот */}
          <div className="mt-4 mb-2">
            <Mascot state={mascotState} size="sm" />
          </div>
        </div>

        {/* Поле ввода */}
        <div className="mt-auto w-full max-w-sm mx-auto pb-4">
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
              className="mb-3 h-12 w-full rounded-xl border border-[#e2ded2] bg-white/60 px-4 text-center text-[15px] outline-none backdrop-blur-sm transition-colors placeholder:text-[#a39f93] focus:border-[#ff3b00]"
              autoFocus
            />
          )}

          {phase === "intro" && introStep < 2 && (
            <div className="mb-3" />
          )}

          {phase === "interview" && (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Напиши своими словами…"
              className="mb-3 min-h-[120px] w-full resize-none rounded-xl border border-[#e2ded2] bg-white/60 p-4 text-[15px] leading-[1.6] outline-none backdrop-blur-sm transition-colors placeholder:text-[#a39f93] focus:border-[#ff3b00]"
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
            className="flex h-12 w-full items-center justify-between rounded-xl bg-[#1a1917] px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-white transition-all active:scale-[0.98] active:bg-[#33312d] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span>
              {phase === "intro"
                ? introStep === 3
                  ? "НАЧАТЬ ИНТЕРВЬЮ"
                  : "ДАЛЕЕ"
                : sending
                  ? "ДУМАЕМ…"
                  : currentNumber === TOTAL_QUESTIONS
                    ? "ЗАВЕРШИТЬ"
                    : "ОТВЕТИТЬ"}
            </span>
            <span className="font-sans text-base font-light">→</span>
          </button>

          {phase === "interview" && !error && !loading && (
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-widest text-[#a39f93]">
              Без правильных ответов
            </p>
          )}
        </div>
      </section>
    </main>
  );
}