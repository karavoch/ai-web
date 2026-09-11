"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

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
    <main className="safe-top safe-bottom min-h-[100svh] bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased">
      <header className="flex w-full items-center justify-between border-b border-[#e2ded2] px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#1c1b18]"
        >
          MINDPRINT
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
            ПРОФИЛЬ
          </span>
          <span className="h-[1px] w-6 bg-[#ff3b00]" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        {/* Заголовок */}
        <section className="py-10 sm:py-16">
          <div className="mb-6 h-[2px] w-10 bg-[#ff3b00]" />

          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.15em] text-[#8c887d]">
            Интервью завершено
          </span>

          <h1 className="text-[2rem] font-normal leading-[1.1] tracking-tight sm:text-5xl">
            Твой профиль
            <br />
            <span className="text-[#ff3b00]">мышления.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#757167]">
            Это не диагноз и не тип личности. Это карта того, как ты принимаешь
            решения, какие принципы защищаешь и где проходят твои границы.
          </p>

          {/* Статистика — grid 2x2, компактно */}
          <div className="mt-8 grid grid-cols-2 gap-px bg-[#e2ded2]">
            <div className="bg-[#f3f1e9] p-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#8c887d]">
                Ответов
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-light">
                  {String(answered).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] text-[#8c887d]">
                  / {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="bg-[#f3f1e9] p-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#8c887d]">
                Прогресс
              </div>
              <div className="mt-3 text-4xl font-light text-[#ff3b00]">
                {percent}%
              </div>
            </div>

            <div className="bg-[#f3f1e9] p-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#8c887d]">
                Формат
              </div>
              <div className="mt-3 text-lg font-light">СВОБОДНЫЙ</div>
            </div>

            <div className="bg-[#f3f1e9] p-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#8c887d]">
                AI-анализ
              </div>
              <div className="mt-3 text-lg font-light">ГОТОВИТСЯ</div>
            </div>
          </div>

          {/* Кнопки — на всю ширину */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/interview"
              className="flex h-14 w-full items-center justify-between bg-[#1a1917] px-6 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all active:scale-[0.98] active:bg-[#33312d]"
            >
              <span>ПРОЙТИ ЗАНОВО</span>
              <span className="font-sans text-base font-light">→</span>
            </Link>

            <Link
              href="/analyze"
              className="flex h-14 w-full items-center justify-between bg-[#ff3b00] px-6 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all active:scale-[0.98] active:bg-[#e03500]"
            >
              <span>ЗАПУСТИТЬ АНАЛИЗ</span>
              <span className="font-sans text-base font-light">→</span>
            </Link>
          </div>
        </section>

        {/* Что AI найдёт */}
        <section className="border-t border-[#e2ded2] py-10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
            Структура профиля
          </span>
          <h2 className="mt-3 text-2xl font-normal leading-tight tracking-tight sm:text-3xl">
            Что AI попробует найти?
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProfileCard number="01" title="Принципы" text="Какие ценности определяют твои решения." />
            <ProfileCard number="02" title="Границы" text="Где проходят твои моральные границы." />
            <ProfileCard number="03" title="Противоречия" text="Где твои ответы сталкиваются друг с другом." />
            <ProfileCard number="04" title="Изменения" text="Как меняется позиция при усложнении ситуации." />
          </div>
        </section>

        {/* Ответы */}
        {items.length > 0 && (
          <section className="border-t border-[#e2ded2] py-10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
              Твои ответы
            </span>
            <h2 className="mt-3 text-2xl font-normal leading-tight tracking-tight sm:text-3xl">
              Сырой материал для анализа
            </h2>

            <div className="mt-6 flex flex-col gap-3">
              {items.map((item, index) => (
                <article
                  key={index}
                  className="border border-[#e2ded2] bg-white/40 p-4 sm:p-6"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-[#8c887d]">
                      ВОПРОС
                    </span>
                    <span className="font-mono text-lg font-light text-[#ff3b00]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="text-base leading-relaxed">
                    {item.question}
                  </p>

                  <div className="mt-4 border-t border-dashed border-[#e2ded2] pt-4">
                    <span className="mb-1 block font-mono text-[9px] tracking-widest text-[#8c887d]">
                      ТВОЙ ОТВЕТ
                    </span>
                    <p className="text-sm leading-relaxed text-[#757167]">
                      {item.answer}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Следующий этап */}
        <section className="border-t border-[#e2ded2] py-10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
            Следующий этап
          </span>
          <h2 className="mt-3 text-3xl font-normal leading-[1.1] tracking-tight sm:text-4xl">
            Теперь нужен
            <br />
            <span className="text-[#ff3b00]">AI-анализ.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#757167]">
            Сейчас это только структура. Следующим шагом AI найдёт
            закономерности в твоих ответах.
          </p>
        </section>
      </div>

      <footer className="mt-4 flex w-full items-center justify-between border-t border-[#e2ded2] px-5 py-5 font-mono text-[10px] uppercase tracking-widest text-[#a39f93] sm:px-8">
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
    <div className="border border-[#e2ded2] bg-white/40 p-4 transition-colors active:border-[#1c1b18] sm:p-5">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[#8c887d]">
          {number}
        </span>
        <span className="h-2 w-2 bg-[#ff3b00]" />
      </div>
      <h3 className="mt-6 text-lg font-normal tracking-tight">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#757167]">{text}</p>
    </div>
  );
}