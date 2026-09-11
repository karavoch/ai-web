"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { BackgroundGlow } from "../components/BackgroundGlow";

type InterviewItem = { question: string; answer: string };

const EMPTY_ARRAY: InterviewItem[] = [];
let cachedRawData: string | null = null;
let cachedSnapshot: InterviewItem[] = EMPTY_ARRAY;

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): InterviewItem[] {
  if (typeof window === "undefined") return EMPTY_ARRAY;
  const rawData = sessionStorage.getItem("mindprint_interview");
  if (rawData !== cachedRawData) {
    cachedRawData = rawData;
    if (!rawData) cachedSnapshot = EMPTY_ARRAY;
    else {
      try {
        cachedSnapshot = JSON.parse(rawData) as InterviewItem[];
      } catch {
        cachedSnapshot = EMPTY_ARRAY;
      }
    }
  }
  return cachedSnapshot;
}

function getServerSnapshot(): InterviewItem[] {
  return EMPTY_ARRAY;
}

export default function Result() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const answered = items.length;
  const total = 10;
  const percent = Math.min(Math.round((answered / total) * 100), 100);

  return (
    <main className="safe-top safe-bottom relative min-h-[100svh] bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased">
      <BackgroundGlow />

      <header className="relative z-10 flex w-full items-center justify-between border-b border-[#e2ded2]/60 px-5 py-4">
        <Link
          href="/"
          className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#1c1b18]"
        >
          MINDPRINT
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
          ПРОФИЛЬ
        </span>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-md px-5">
        {/* Заголовок */}
        <section className="py-8">
          <div className="mb-5 h-[2px] w-8 bg-[#ff3b00]" />

          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8c887d]">
            Интервью завершено
          </p>

          <h1 className="text-[26px] font-normal leading-[1.15] tracking-tight">
            Твой профиль
            <br />
            <span className="text-[#ff3b00]">мышления.</span>
          </h1>

          <p className="mt-4 text-[13px] leading-[1.6] text-[#757167]">
            Это не диагноз. Это карта того, как ты принимаешь решения и где
            проходят твои границы.
          </p>

          {/* Статистика */}
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-[#e2ded2]">
            <div className="bg-[#f3f1e9] p-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#8c887d]">
                Ответов
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-light">
                  {String(answered).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] text-[#8c887d]">
                  /{total}
                </span>
              </div>
            </div>
            <div className="bg-[#f3f1e9] p-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#8c887d]">
                Прогресс
              </div>
              <div className="mt-2 text-2xl font-light text-[#ff3b00]">
                {percent}%
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/analyze"
              className="flex h-12 items-center justify-between rounded-xl bg-[#ff3b00] px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-white transition-all active:scale-[0.98]"
            >
              <span>ЗАПУСТИТЬ АНАЛИЗ</span>
              <span className="font-sans text-base font-light">→</span>
            </Link>
            <Link
              href="/interview"
              className="flex h-12 items-center justify-center rounded-xl border border-[#1c1b18]/15 bg-white/40 px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-[#1c1b18] backdrop-blur-sm transition-all active:scale-[0.98]"
            >
              ПРОЙТИ ЗАНОВО
            </Link>
          </div>
        </section>

        {/* Что AI найдёт */}
        <section className="border-t border-[#e2ded2]/60 py-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
            Структура профиля
          </p>
          <h2 className="mt-2 text-xl font-normal leading-tight tracking-tight">
            Что AI попробует найти?
          </h2>

          <div className="mt-5 grid gap-3">
            <ProfileCard number="01" title="Принципы" text="Какие ценности определяют твои решения." />
            <ProfileCard number="02" title="Границы" text="Где проходят твои моральные границы." />
            <ProfileCard number="03" title="Противоречия" text="Где твои ответы сталкиваются друг с другом." />
            <ProfileCard number="04" title="Изменения" text="Как меняется позиция при усложнении." />
          </div>
        </section>

        {/* Ответы */}
        {items.length > 0 && (
          <section className="border-t border-[#e2ded2]/60 py-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
              Твои ответы
            </p>
            <h2 className="mt-2 text-xl font-normal leading-tight tracking-tight">
              Сырой материал
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              {items.map((item, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-[#e2ded2]/80 bg-white/50 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-widest text-[#8c887d]">
                      ВОПРОС
                    </span>
                    <span className="font-mono text-base font-light text-[#ff3b00]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="text-[14px] leading-[1.5]">{item.question}</p>

                  <div className="mt-3 border-t border-dashed border-[#e2ded2] pt-3">
                    <span className="mb-1 block font-mono text-[9px] tracking-widest text-[#8c887d]">
                      ОТВЕТ
                    </span>
                    <p className="text-[13px] leading-[1.6] text-[#757167]">
                      {item.answer}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="relative z-10 mt-2 flex w-full items-center justify-between border-t border-[#e2ded2]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-widest text-[#a39f93]">
        <span>MINDPRINT</span>
        <span>{answered} ОТВЕТОВ</span>
      </footer>
    </main>
  );
}

function ProfileCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#e2ded2]/80 bg-white/50 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[#8c887d]">
          {number}
        </span>
        <span className="h-2 w-2 bg-[#ff3b00]" />
      </div>
      <h3 className="mt-5 text-base font-normal tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[12px] leading-[1.6] text-[#757167]">{text}</p>
    </div>
  );
}