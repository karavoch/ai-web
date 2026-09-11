"use client";

import Link from "next/link";
import { Mascot } from "../components/Mascot";
import { BackgroundGlow } from "../components/BackgroundGlow";

export default function Home() {
  return (
    <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col font-sans text-white antialiased">
      <BackgroundGlow />

      <header className="relative z-10 flex w-full items-center justify-between px-5 py-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white">
          MINDPRINT
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          18+
        </span>
      </header>

      <section className="relative z-10 flex flex-1 flex-col justify-center px-5 py-6">
        <div className="mb-5 flex justify-center">
          <Mascot state="idle" size="sm" />
        </div>

        <div className="mx-auto mb-4 h-[2px] w-8 bg-[#ff3b00]" />

        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
          Пройди тест
        </p>

        <h1 className="mx-auto max-w-xs text-center text-[22px] font-normal leading-[1.25] tracking-tight text-[#ff3b00]">
          Во что ты на самом деле веришь?
        </h1>

        <p className="mx-auto mt-4 max-w-[280px] text-center text-[13px] leading-[1.6] text-white/50">
          10 вопросов о сложных ситуациях. Без правильных ответов — только твои.
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/interview"
            className="flex h-12 items-center justify-between rounded-xl bg-white px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-black shadow-lg shadow-black/40 transition-all active:scale-[0.98]"
          >
            <span>НАЧАТЬ</span>
            <span className="font-sans text-base font-light">→</span>
          </Link>

          <Link
            href="/compare"
            className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 font-mono text-[11px] font-bold tracking-[0.15em] text-white backdrop-blur-sm transition-all active:scale-[0.98]"
          >
            <span>СРАВНИТЬ</span>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 flex w-full items-center justify-between px-5 py-4 font-mono text-[9px] uppercase tracking-widest text-white/30">
        <span>Больше, чем просто ответы</span>
        <span className="h-[1px] w-4 bg-[#ff3b00]" />
      </footer>
    </main>
  );
}