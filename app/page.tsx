"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased selection:bg-[#ff3b00] selection:text-white">
      {/* Хедер */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-8">
        <Link
          href="/"
          className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#1c1b18]"
        >
          MINDPRINT
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-12 px-8 py-8 lg:grid-cols-12">
        {/* Левая колонка */}
        <div className="flex flex-col items-start lg:col-span-6">
          <div className="mb-8 h-[2px] w-12 bg-[#ff3b00]" />

          <span className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#8c887d]">
            Пройди тест
          </span>

          <h1 className="text-4xl font-normal leading-[1.15] tracking-tight text-[#ff3b00] sm:text-5xl lg:text-[3.5rem]">
            Тебе зададут вопросы, на которые не всегда приятно отвечать.
          </h1>

          <p className="mt-8 max-w-md text-xs font-normal leading-relaxed text-[#757167] sm:text-sm">
            Мы исследуем не только твои убеждения, но и то, как ты думаешь, что
            чувствуешь и почему принимаешь те или иные решения.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/interview"
              className="inline-flex items-center gap-6 bg-[#1a1917] px-8 py-4 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all hover:bg-[#33312d] active:scale-95"
            >
              <span>НАЧАТЬ</span>
              <span className="font-sans text-base font-light">→</span>
            </Link>

            <Link
              href="/compare"
              className="inline-flex items-center gap-2 border border-[#1a1917]/20 px-6 py-4 font-mono text-xs font-bold tracking-[0.2em] text-[#1a1917] transition-all hover:border-[#1a1917] hover:bg-[#e9e5da] active:scale-95"
            >
              <span>СРАВНИТЬ</span>
            </Link>
          </div>
        </div>

        {/* Правая колонка — абстрактная композиция */}
        <div className="relative flex items-center justify-center py-6 lg:col-span-6">
          <div className="relative flex h-[500px] w-full max-w-[550px] items-center justify-center">
            {/* Связующие линии */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full stroke-[#a39f93]/40"
              fill="none"
              strokeWidth="1"
            >
              <path d="M 330 180 Q 240 180 210 140" />
              <path d="M 400 240 Q 320 220 300 170" />
              <path d="M 190 320 Q 220 280 250 300" />
              <path d="M 390 380 Q 340 360 300 320" />
            </svg>

            {/* Точки на линиях */}
            <span className="absolute left-[208px] top-[138px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />
            <span className="absolute left-[298px] top-[218px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />
            <span className="absolute left-[248px] top-[298px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />
            <span className="absolute left-[338px] top-[358px] h-1.5 w-1.5 rounded-full bg-[#ff3b00]" />

            {/* 1. Искра */}
            <div className="absolute left-16 top-8 flex h-24 w-24 items-center justify-center rounded-[40%_60%_50%_50%/50%_40%_60%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm">
              <span className="text-xl font-light text-[#ff3b00]">✳</span>
            </div>

            {/* 2. Троеточие */}
            <div className="absolute right-16 top-12 flex h-20 w-28 items-center justify-center rounded-[50%_50%_40%_60%/60%_40%_50%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm">
              <span className="font-mono text-sm tracking-widest text-[#1c1b18]">
                •••
              </span>
            </div>

            {/* 3. Маленькая плашка */}
            <div className="absolute left-10 top-44 flex h-16 w-16 items-center justify-center rounded-[50%_40%_60%_50%/40%_60%_50%_50%] border border-white/20 bg-[#e3dfd3]/50" />

            {/* 4. Крест */}
            <div className="absolute bottom-16 left-6 flex h-28 w-28 items-center justify-center rounded-[60%_40%_50%_50%/50%_60%_40%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm">
              <span className="text-lg font-light text-[#ff3b00]">✕</span>
            </div>

            {/* 5. Дефис */}
            <div className="absolute right-6 top-44 flex h-16 w-24 items-center justify-center rounded-[40%_60%_50%_50%/60%_40%_50%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm">
              <span className="h-[1px] w-5 bg-[#1c1b18]" />
            </div>

            {/* 6. Квадрат */}
            <div className="absolute bottom-36 right-8 flex h-16 w-16 items-center justify-center rounded-[50%_50%_40%_60%/50%_40%_60%_50%] border border-white/20 bg-[#e3dfd3]/50">
              <span className="h-2.5 w-2.5 border border-[#ff3b00]" />
            </div>

            {/* 7. График */}
            <div className="absolute bottom-10 right-14 flex h-24 w-24 items-center justify-center rounded-[40%_60%_60%_40%/50%_50%_50%_50%] border border-white/20 bg-[#e3dfd3]/60 backdrop-blur-sm">
              <svg
                className="h-5 w-5 text-[#1c1b18]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 17l6-6 4 4 8-8"
                />
              </svg>
            </div>

            {/* Центральный силуэт */}
            <div className="relative z-10 mt-12 flex items-center justify-center">
              <svg className="h-[360px] w-[260px]" viewBox="0 0 200 260">
                <defs>
                  <linearGradient
                    id="silhouetteNoise"
                    x1="100"
                    y1="0"
                    x2="100"
                    y2="260"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#2b2824" />
                    <stop
                      offset="70%"
                      stopColor="#2b2824"
                      stopOpacity="0.85"
                    />
                    <stop
                      offset="100%"
                      stopColor="#f3f1e9"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M100 25 C130 25, 145 50, 145 85 C145 120, 130 135, 120 145 C140 160, 175 185, 185 260 L15 260 C25 185, 60 160, 80 145 C70 135, 55 120, 55 85 C55 50, 70 25, 100 25 Z"
                  fill="url(#silhouetteNoise)"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between border-t border-[#e2ded2] px-8 py-6 font-mono text-[10px] uppercase tracking-widest text-[#a39f93]">
        <div>БОЛЬШЕ, ЧЕМ ПРОСТО ОТВЕТЫ</div>
        <div className="flex items-center gap-2">
          <span>MINDPRINT</span>
          <span className="h-[1px] w-4 bg-[#ff3b00]" />
        </div>
      </footer>
    </main>
  );
}