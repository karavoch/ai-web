"use client";

import Link from "next/link";
import { Mascot } from "./components/Mascot";
import { BackgroundGlow } from "./components/BackgroundGlow";

export default function Home() {
  return (
   <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col font-sans text-[#1c1b18] antialiased">
  <BackgroundGlow />

      {/* Хедер */}
      <header className="relative z-10 flex w-full items-center justify-between px-5 py-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#1c1b18]">
          MINDPRINT
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
          18+
        </span>
      </header>

      {/* Контент */}
      <section className="relative z-10 flex flex-1 flex-col justify-center px-5 py-6">
        {/* Маскот */}
        <div className="mb-5 flex justify-center">
          <Mascot state="idle" size="sm" />
        </div>

        {/* Акцентная линия */}
        <div className="mx-auto mb-4 h-[2px] w-8 bg-[#ff3b00]" />

        {/* Метка */}
        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-[#8c887d]">
          Пройди тест
        </p>

        {/* Короткий заголовок */}
        <h1 className="mx-auto max-w-xs text-center text-[22px] font-normal leading-[1.25] tracking-tight text-[#ff3b00]">
          Во что ты на самом деле веришь?
        </h1>

        {/* Описание */}
        <p className="mx-auto mt-4 max-w-[280px] text-center text-[13px] leading-[1.6] text-[#757167]">
          10 вопросов о сложных ситуациях. Без правильных ответов — только твои.
        </p>

        {/* Кнопки */}
        <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/interview"
            className="flex h-12 items-center justify-between rounded-xl bg-[#1a1917] px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-white transition-all active:scale-[0.98] active:bg-[#33312d]"
          >
            <span>НАЧАТЬ</span>
            <span className="font-sans text-base font-light">→</span>
          </Link>

          <Link
            href="/compare"
            className="flex h-12 items-center justify-center rounded-xl border border-[#1c1b18]/15 bg-white/40 px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-[#1c1b18] backdrop-blur-sm transition-all active:scale-[0.98] active:bg-white/70"
          >
            <span>СРАВНИТЬ</span>
          </Link>
        </div>
      </section>

      {/* Футер */}
      <footer className="relative z-10 flex w-full items-center justify-between px-5 py-4 font-mono text-[9px] uppercase tracking-widest text-[#a39f93]">
        <span>Больше, чем просто ответы</span>
        <span className="h-[1px] w-4 bg-[#ff3b00]" />
      </footer>
    </main>
  );
}