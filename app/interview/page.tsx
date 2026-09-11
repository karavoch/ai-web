"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mascot, type MascotState } from "../components/Mascot";
import { DraggableMascot } from "../components/DraggableMascot";

type InterviewItem = { question: string; answer: string };

const TOTAL_QUESTIONS = 10;
const MIN_AGE = 18;

type Phase = "intro" | "blocked" | "interview" | "analyzing";

const INTRO_STEPS = [
  {
    state: "idle" as MascotState,
    text: "Привет. Я — Mindprint. AI, который попробует понять, как ты думаешь.",
  },
  {
    state: "listening" as MascotState,
    text: "Мы поговорим о сложных ситуациях. Здесь нет правильных ответов — только твои.",
  },
  {
    state: "listening" as MascotState,
    text: "Как тебя зовут?",
  },
  {
    state: "listening" as MascotState,
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
      console.error(err);
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

  /* ---- Интро ---- */
  function handleIntroNext() {
    // Валидация имени
    if (introStep === 2 && !userName.trim()) return;

    // Валидация возраста + 18+ гейт
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
      setMascotState("listening");
    } else {
      setPhase("interview");
      setMascotState("thinking");
    }
  }

  function handleIntroAnswer(value: string) {
    if (introStep === 2) setUserName(value);
    if (introStep === 3) setUserAge(value.replace(/\D/g, "")); // только цифры
    setMascotState("listening");
  }

  /* ---- Ответ AI ---- */
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

  /* ============ RENDER ============ */

  // Блок 18+
  if (phase === "blocked") {
    return (
      <main className="safe-top safe-bottom flex min-h-[100svh] flex-col items-center justify-center bg-[#f3f1e9] px-6 text-center font-sans text-[#1c1b18]">
        <div className="mb-6 scale-90">
          <Mascot state="skeptical" size="lg" />
        </div>

        <div className="mb-4 h-[2px] w-10 bg-[#ff3b00]" />

        <h1 className="text-2xl font-normal leading-tight tracking-tight sm:text-3xl">
          К сожалению, не могу пустить.
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#757167]">
          Вопросы, которые я задаю, рассчитаны на взрослых. Возвращайся, когда
          тебе исполнится {MIN_AGE}.
        </p>

        <Link
          href="/"
          className="mt-8 flex h-14 items-center justify-center border border-[#1a1917]/20 px-8 font-mono text-xs font-bold tracking-[0.2em] text-[#1a1917] transition-all active:scale-[0.98]"
        >
          НА ГЛАВНУЮ
        </Link>
      </main>
    );
  }

  // Фаза анализа — полноэкранный оверлей
  if (phase === "analyzing") {
    return (
      <main className="safe-top safe-bottom flex min-h-[100svh] flex-col items-center justify-center bg-[#f3f1e9] px-6 text-center">
        <div className="scale-90 sm:scale-100">
          <Mascot state={mascotState} size="lg" />
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8c887d]">
          Анализирую ответы…
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased">
      {/* Маскот в углу — только в интервью, на мобилке уменьшен */}
      {phase === "interview" && (
        <DraggableMascot state={mascotState} initial={{ right: 16, bottom: 16 }} />
      )}

      <div className="safe-top safe-bottom mx-auto flex min-h-[100svh] max-w-2xl flex-col px-5 sm:px-10">
        <header className="flex items-center justify-between py-5">
          <Link
            href="/"
            className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#1c1b18] active:opacity-60"
          >
            MINDPRINT
          </Link>

          <div className="font-mono text-[10px] tracking-widest text-[#8c887d]">
            {phase === "intro"
              ? `ИНТРО ${introStep + 1}/${INTRO_STEPS.length}`
              : `${String(Math.min(currentNumber, TOTAL_QUESTIONS)).padStart(2, "0")} / ${String(TOTAL_QUESTIONS).padStart(2, "0")}`}
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-6">
          {/* Прогресс-бар */}
          <div className="mb-8 h-[2px] w-full bg-[#e0dcd1]">
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

          {/* === ИНТРО === */}
          {phase === "intro" && (
            <IntroView
              step={introStep}
              stepData={INTRO_STEPS[introStep]}
              userName={userName}
              userAge={userAge}
              onAnswer={handleIntroAnswer}
              onNext={handleIntroNext}
            />
          )}

          {/* === ИНТЕРВЬЮ === */}
          {phase === "interview" && (
            <>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8c887d]">
                {loading ? "MINDPRINT думает" : `Ситуация №${currentNumber}`}
              </p>

              {loading ? (
                <div>
                  <h1 className="flex flex-wrap items-center gap-3 text-2xl font-normal leading-tight tracking-tight sm:text-3xl">
                    Формируем следующий вопрос
                    <span className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff3b00] animate-smooth-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-[#ff3b00] animate-smooth-pulse" style={{ animationDelay: "200ms" }} />
                      <span className="h-2 w-2 rounded-full bg-[#ff3b00] animate-smooth-pulse" style={{ animationDelay: "400ms" }} />
                    </span>
                  </h1>
                </div>
              ) : error ? (
                <div>
                  <h1 className="text-xl font-normal text-[#ff3b00]">{error}</h1>
                  <button
                    onClick={() => {
                      setLoading(true);
                      fetchQuestion(history);
                    }}
                    className="mt-6 flex h-12 items-center bg-[#1a1917] px-6 font-mono text-xs font-bold tracking-[0.2em] text-white active:scale-[0.98]"
                  >
                    ПОПРОБОВАТЬ СНОВА
                  </button>
                </div>
              ) : (
                <div key={question} className="animate-fade-in-up">
                  <h1 className="text-2xl font-normal leading-[1.2] tracking-tight sm:text-3xl">
                    {question}
                  </h1>

                  <p className="mt-4 text-xs leading-relaxed text-[#757167]">
                    Отвечай своими словами. Правильных ответов нет.
                  </p>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Напиши своими словами…"
                    className="mt-6 min-h-40 w-full resize-none border border-[#e2ded2] bg-white/60 p-4 text-base leading-relaxed outline-none transition-colors placeholder:text-[#a39f93] focus:border-[#1c1b18]"
                    disabled={sending}
                    autoFocus
                    inputMode="text"
                  />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#a39f93]">
                      {answer.length > 0 ? `${answer.length} символов` : ""}
                    </span>

                    <button
                      onClick={handleNext}
                      disabled={!answer.trim() || sending}
                      className="flex h-14 w-full items-center justify-center gap-4 bg-[#1a1917] px-7 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all active:scale-[0.98] active:bg-[#33312d] disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
                    >
                      {sending
                        ? "ДУМАЕМ…"
                        : currentNumber === TOTAL_QUESTIONS
                          ? "ЗАВЕРШИТЬ →"
                          : "ПРОДОЛЖИТЬ →"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <footer className="border-t border-[#e2ded2] py-4 font-mono text-[10px] uppercase tracking-widest text-[#a39f93]">
          Отвечай честно — это твой профиль.
        </footer>
      </div>
    </main>
  );
}

/* ============ Интро ============ */

function IntroView({
  step,
  stepData,
  userName,
  userAge,
  onAnswer,
  onNext,
}: {
  step: number;
  stepData: { state: MascotState; text: string };
  userName: string;
  userAge: string;
  onAnswer: (v: string) => void;
  onNext: () => void;
}) {
  const isNameStep = step === 2;
  const isAgeStep = step === 3;
  const value = isNameStep ? userName : isAgeStep ? userAge : "";
  const canProceed = step < 2 ? true : value.trim().length > 0;

  return (
    <div key={step} className="animate-fade-in-up">
      <div className="mb-6 flex items-start gap-3">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff3b00]" />
        <p className="text-xl font-normal leading-[1.3] tracking-tight sm:text-2xl">
          {stepData.text}
        </p>
      </div>

      {(isNameStep || isAgeStep) && (
        <input
          type={isAgeStep ? "tel" : "text"}
          inputMode={isAgeStep ? "numeric" : "text"}
          value={value}
          onChange={(e) => onAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canProceed) onNext();
          }}
          placeholder={isNameStep ? "Например, Иван" : "Например, 24"}
          maxLength={isAgeStep ? 3 : 40}
          className="mb-6 w-full max-w-sm border-b-2 border-[#e2ded2] bg-transparent pb-3 text-lg outline-none transition-colors placeholder:text-[#a39f93] focus:border-[#ff3b00]"
          autoFocus
        />
      )}

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="flex h-14 w-full items-center justify-center gap-4 bg-[#1a1917] px-8 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all active:scale-[0.98] active:bg-[#33312d] disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
      >
        <span>{step === 3 ? "НАЧАТЬ ИНТЕРВЬЮ" : "ДАЛЕЕ"}</span>
        <span className="font-sans text-base font-light">→</span>
      </button>
    </div>
  );
}