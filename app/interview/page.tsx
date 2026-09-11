"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type InterviewItem = {
  question: string;
  answer: string;
};

const TOTAL_QUESTIONS = 10;

export default function Interview() {
  const router = useRouter();

  const [history, setHistory] = useState<InterviewItem[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const hasFetched = useRef(false);

  async function fetchQuestion(currentHistory: InterviewItem[]) {
    setError("");
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: currentHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера");
      }

      setQuestion(data.question);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Не удалось получить вопрос.";
      setError(message);
    } finally {
      setLoading(false);
      setSending(false);
    }
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchQuestion([]);
  }, []);

  async function handleNext() {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || sending || loading) {
      return;
    }

    const updatedHistory = [...history, { question, answer: trimmedAnswer }];

    setHistory(updatedHistory);
    setAnswer("");

    if (updatedHistory.length >= TOTAL_QUESTIONS) {
      sessionStorage.setItem(
        "mindprint_interview",
        JSON.stringify(updatedHistory)
      );
      router.push("/result");
      return;
    }

    setSending(true);
    setLoading(true);

    await fetchQuestion(updatedHistory);
  }

  const currentNumber = history.length + 1;
  const progress = Math.min((currentNumber / TOTAL_QUESTIONS) * 100, 100);

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#111]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 sm:px-10">
        <header className="flex items-center justify-between py-6">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.2em] transition-opacity hover:opacity-60"
          >
            MINDPRINT
          </Link>

          <div className="text-xs text-black/40">
            {String(Math.min(currentNumber, TOTAL_QUESTIONS)).padStart(2, "0")}{" "}
            / {String(TOTAL_QUESTIONS).padStart(2, "0")}
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="mb-10 h-1 w-full bg-black/10">
            <div
              className="h-1 bg-[#ff4d35] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mb-5 text-sm font-medium text-black/40">
            {loading ? "MINDPRINT думает" : `Ситуация №${currentNumber}`}
          </p>

          {loading ? (
            <div className="max-w-3xl">
              <h1 className="flex items-center gap-4 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Формируем следующий вопрос
                <span className="ml-1 flex gap-2">
                  <span
                    className="h-3 w-3 rounded-full bg-[#ff4d35] animate-smooth-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-3 w-3 rounded-full bg-[#ff4d35] animate-smooth-pulse"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="h-3 w-3 rounded-full bg-[#ff4d35] animate-smooth-pulse"
                    style={{ animationDelay: "400ms" }}
                  />
                </span>
              </h1>
            </div>
          ) : error ? (
            <div className="max-w-3xl">
              <h1 className="text-3xl font-medium text-[#ff4d35]">{error}</h1>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchQuestion(history);
                }}
                className="mt-6 bg-[#111] px-6 py-3 text-sm font-bold text-white"
              >
                ПОПРОБОВАТЬ СНОВА
              </button>
            </div>
          ) : (
            <div key={question} className="animate-fade-in-up">
              <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                {question}
              </h1>

              <p className="mt-8 text-lg text-black/50">
                Отвечай своими словами. Здесь нет правильного ответа.
              </p>

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                    handleNext();
                  }
                }}
                placeholder="Напиши своими словами..."
                className="mt-8 min-h-44 w-full resize-none border border-black/15 bg-white/50 p-5 text-base outline-none transition-colors placeholder:text-black/30 focus:border-black"
                disabled={sending}
                autoFocus
              />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-black/30">
                  {answer.length > 0
                    ? `${answer.length} символов`
                    : "Ответь свободно"}
                </span>

                <button
                  onClick={handleNext}
                  disabled={!answer.trim() || sending}
                  className="bg-[#111] px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                >
                  {sending
                    ? "ДУМАЕМ..."
                    : currentNumber === TOTAL_QUESTIONS
                    ? "ЗАВЕРШИТЬ →"
                    : "ПРОДОЛЖИТЬ →"}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="border-t border-black/10 py-5 text-xs text-black/30">
          Отвечай так, как действительно думаешь.
          <span className="float-right hidden sm:inline">
            Ctrl + Enter → продолжить
          </span>
        </footer>
      </div>
    </main>
  );
}