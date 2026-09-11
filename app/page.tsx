"use client";

import Link from "next/link";
import { Mascot } from "./components/Mascot";

export default function Home() {
  return (
    <main className="safe-top safe-bottom flex min-h-[100svh] flex-col bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased selection:bg-[#ff3b00] selection:text-white">
      {/* Хедер */}
      <header className="flex w-full items-center justify-between px-5 py-5 sm:px-8 sm:py-8">
        <Link
          href="/"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#1c1b18]"
        >
          MINDPRINT
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
          18+
        </span>
      </header>

      {/* Контент */}
      <section className="flex flex-1 flex-col px-5 pb-8 sm:px-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Текст + кнопки */}
        <div className="order-2 flex flex-col items-start lg:order-1 lg:col-span-6">
          <div className="mb-6 h-[2px] w-10 bg-[#ff3b00]" />

          <span className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#8c887d]">
            Пройди тест
          </span>

          <h1 className="text-[2rem] font-normal leading-[1.12] tracking-tight text-[#ff3b00] sm:text-5xl lg:text-[3.5rem]">
            Тебе зададут вопросы, на которые не всегда приятно отвечать.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#757167]">
            Мы исследуем не только твои убеждения, но и то, как ты думаешь, что
            чувствуешь и почему принимаешь те или иные решения.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/interview"
              className="flex h-14 w-full items-center justify-between bg-[#1a1917] px-6 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all active:scale-[0.98] active:bg-[#33312d] sm:w-auto sm:gap-6"
            >
              <span>НАЧАТЬ</span>
              <span className="font-sans text-base font-light">→</span>
            </Link>

            <Link
              href="/compare"
              className="flex h-14 w-full items-center justify-center border border-[#1a1917]/20 px-6 font-mono text-xs font-bold tracking-[0.2em] text-[#1a1917] transition-all active:scale-[0.98] active:bg-[#e9e5da] sm:w-auto"
            >
              <span>СРАВНИТЬ</span>
            </Link>
          </div>
        </div>

        {/* Маскот */}
        <div className="order-1 mb-6 flex items-center justify-center lg:order-2 lg:col-span-6 lg:mb-0">
          <div className="relative flex h-[260px] w-full max-w-[360px] items-center justify-center sm:h-[420px]">
            {/* Связующие линии */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full stroke-[#a39f93]/40"
              fill="none"
              strokeWidth="1"
            >
              <path d="M 240 130 Q 180 130 150 100" />
              <path d="M 280 180 Q 220 160 200 120" />
              <path d="M 140 240 Q 160 210 180 220" />
              <path d="M 270 280 Q 240 260 210 230" />
            </svg>

            {/* Точки */}
            <span className="absolute left-[148px] top-[98px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />
            <span className="absolute left-[198px] top-[158px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />
            <span className="absolute left-[178px] top-[218px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />
            <span className="absolute left-[228px] top-[258px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />

            {/* Плашки — только с sm и выше, чтобы не засорять экран на телефоне */}
            <div className="absolute left-2 top-4 hidden h-16 w-16 items-center justify-center rounded-[40%_60%_50%_50%/50%_40%_60%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm sm:flex sm:h-20 sm:w-20">
              <span className="text-lg font-light text-[#ff3b00]">✳</span>
            </div>
            <div className="absolute right-2 top-6 hidden h-14 w-20 items-center justify-center rounded-[50%_50%_40%_60%/60%_40%_50%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm sm:flex">
              <span className="font-mono text-xs tracking-widest text-[#1c1b18]">
                •••
              </span>
            </div>
            <div className="absolute bottom-4 left-2 hidden h-20 w-20 items-center justify-center rounded-[60%_40%_50%_50%/50%_60%_40%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm sm:flex">
              <span className="text-base font-light text-[#ff3b00]">✕</span>
            </div>
            <div className="absolute bottom-2 right-4 hidden h-16 w-16 items-center justify-center rounded-[40%_60%_60%_40%/50%_50%_50%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm sm:flex">
              <svg
                className="h-4 w-4 text-[#1c1b18]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
              </svg>
            </div>

            {/* Маскот — на мобилке меньше */}
            <div className="relative z-10">
              <div className="scale-[0.65] sm:scale-90 lg:scale-100">
                <Mascot state="idle" size="xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="flex w-full items-center justify-between border-t border-[#e2ded2] px-5 py-4 font-mono text-[10px] uppercase tracking-widest text-[#a39f93] sm:px-8 sm:py-6">
        <div>БОЛЬШЕ, ЧЕМ ПРОСТО ОТВЕТЫ</div>
        <div className="flex items-center gap-2">
          <span>MINDPRINT</span>
          <span className="h-[1px] w-4 bg-[#ff3b00]" />
        </div>
      </footer>
    </main>
  );
}