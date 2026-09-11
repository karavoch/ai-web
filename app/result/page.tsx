"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

type InterviewItem = {
  question: string;
  answer: string;
};

const EMPTY_ARRAY: InterviewItem[] = [];
let cachedRawData: string | null = null;
let cachedSnapshot: InterviewItem[] = EMPTY_ARRAY;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): InterviewItem[] {
  if (typeof window === "undefined") return EMPTY_ARRAY;

  const rawData = sessionStorage.getItem("mindprint_interview");

  if (rawData !== cachedRawData) {
    cachedRawData = rawData;
    if (!rawData) {
      cachedSnapshot = EMPTY_ARRAY;
    } else {
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
    <main className="min-h-screen bg-[#f3f1e9] font-sans text-[#1c1b18] antialiased selection:bg-[#ff3b00] selection:text-white">
      {/* Хедер */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-[#e2ded2] px-8 py-6">
        <Link
          href="/"
          className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#1c1b18] transition-opacity hover:opacity-60"
        >
          MINDPRINT
        </Link>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-widest text-[#8c887d]">
            ПРОФИЛЬ
          </span>
          <span className="h-[1px] w-8 bg-[#ff3b00]" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-8">
        {/* Заголовок */}
        <section className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <div className="mb-8 h-[2px] w-12 bg-[#ff3b00]" />

            <span className="mb-4 block font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#8c887d]">
              Интервью завершено
            </span>

            <h1 className="text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-[4rem]">
              Твой профиль
              <br />
              <span className="text-[#ff3b00]">мышления.</span>
            </h1>

            <p className="mt-8 max-w-lg text-xs leading-relaxed text-[#757167] sm:text-sm">
              Это не диагноз и не тип личности. Это предварительная карта того,
              как ты принимаешь решения, какие принципы защищаешь и где проходят
              твои границы.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/interview"
                className="inline-flex items-center gap-6 bg-[#1a1917] px-8 py-4 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all hover:bg-[#33312d] active:scale-95"
              >
                <span>ПРОЙТИ ЗАНОВО</span>
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

          {/* Правая колонка — карточка-статистика */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-[#e2ded2]">
              <div className="bg-[#f3f1e9] p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                  Ответов
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-light text-[#1c1b18]">
                    {String(answered).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-[#8c887d]">
                    / {String(total).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="bg-[#f3f1e9] p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                  Формат
                </div>
                <div className="mt-6 text-2xl font-light text-[#1c1b18]">
                  СВОБОДНЫЙ
                </div>
              </div>

              <div className="bg-[#f3f1e9] p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                  Прогресс
                </div>
                <div className="mt-6 text-2xl font-light text-[#ff3b00]">
                  {percent}%
                </div>
              </div>

              <div className="bg-[#f3f1e9] p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                  AI-анализ
                </div>
                <div className="mt-6 text-2xl font-light text-[#1c1b18]">
                  ГОТОВИТСЯ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Что будет в профиле */}
        <section className="border-t border-[#e2ded2] py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                Структура профиля
              </span>
              <h2 className="mt-4 text-3xl font-normal leading-tight tracking-tight">
                Что AI
                <br />
                попробует найти?
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-9">
              <ProfileCard
                number="01"
                title="Принципы"
                text="Какие ценности чаще всего определяют твои решения — даже когда ты сам этого не замечаешь."
              />
              <ProfileCard
                number="02"
                title="Границы"
                text="Где проходят твои моральные границы и в каких случаях ты готов их пересмотреть."
              />
              <ProfileCard
                number="03"
                title="Противоречия"
                text="Моменты, где разные твои ответы сталкиваются друг с другом и создают напряжение."
              />
              <ProfileCard
                number="04"
                title="Изменения"
                text="Как меняется твоя позиция, когда ситуация становится сложнее и цена ошибки растёт."
              />
            </div>
          </div>
        </section>

        {/* Ответы */}
        {items.length > 0 && (
          <section className="border-t border-[#e2ded2] py-16">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                  Твои ответы
                </span>
                <h2 className="mt-4 text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
                  Сырой материал
                  <br />
                  для анализа
                </h2>
              </div>

              <span className="hidden font-mono text-xs tracking-widest text-[#8c887d] sm:block">
                {String(answered).padStart(2, "0")} ЗАПИСЕЙ
              </span>
            </div>

            <div className="grid gap-4">
              {items.map((item, index) => (
                <article
                  key={index}
                  className="group grid gap-6 border border-[#e2ded2] bg-white/40 p-6 transition-all duration-300 hover:border-[#1c1b18] hover:bg-white sm:grid-cols-[80px_1fr] sm:p-8"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-widest text-[#8c887d]">
                      ВОПРОС
                    </span>
                    <span className="font-mono text-2xl font-light text-[#ff3b00]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-base leading-relaxed text-[#1c1b18] sm:text-lg">
                        {item.question}
                      </p>
                    </div>

                    <div className="border-t border-dashed border-[#e2ded2] pt-6">
                      <span className="mb-2 block font-mono text-[10px] tracking-widest text-[#8c887d]">
                        ТВОЙ ОТВЕТ
                      </span>
                      <p className="text-sm leading-relaxed text-[#757167]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Следующий этап */}
        <section className="border-t border-[#e2ded2] py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c887d]">
                Следующий этап
              </span>
            </div>

            <div className="lg:col-span-9">
              <h2 className="text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
                Теперь нужен
                <br />
                <span className="text-[#ff3b00]">AI-анализ.</span>
              </h2>

              <p className="mt-8 max-w-xl text-xs leading-relaxed text-[#757167] sm:text-sm">
                Сейчас это только структура. Следующим шагом AI получит твои
                ответы, найдёт закономерности и вернётся к старым темам в новом
                контексте.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-6 bg-[#ff3b00] px-8 py-4 font-mono text-xs font-bold tracking-[0.2em] text-white transition-all hover:bg-[#e03500] active:scale-95"
                >
                  <span>ЗАПУСТИТЬ АНАЛИЗ</span>
                  <span className="font-sans text-base font-light">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Футер */}
      <footer className="mx-auto mt-8 flex w-full max-w-7xl items-center justify-between border-t border-[#e2ded2] px-8 py-6 font-mono text-[10px] uppercase tracking-widest text-[#a39f93]">
        <div>БОЛЬШЕ, ЧЕМ ПРОСТО ОТВЕТЫ</div>
        <div className="flex items-center gap-2">
          <span>{answered} ОТВЕТОВ</span>
          <span className="h-[1px] w-4 bg-[#ff3b00]" />
          <span>MINDPRINT</span>
        </div>
      </footer>
    </main>
  );
}

/* Карточка раздела профиля */
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
    <div className="group relative border border-[#e2ded2] bg-white/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1c1b18] hover:bg-white sm:p-8">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[#8c887d]">
          {number}
        </span>
        <span className="h-2 w-2 bg-[#ff3b00] transition-transform duration-300 group-hover:scale-150" />
      </div>

      <h3 className="mt-10 text-2xl font-normal tracking-tight text-[#1c1b18]">
        {title}
      </h3>

      <p className="mt-4 text-xs leading-relaxed text-[#757167] sm:text-sm">
        {text}
      </p>
    </div>
  );
}