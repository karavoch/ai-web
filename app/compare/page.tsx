import Link from "next/link";
import { BackgroundGlow } from "../components/BackgroundGlow";

export default function Compare() {
  return (
    <main className="safe-top safe-bottom relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center font-sans text-white">
      <BackgroundGlow />

      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-5 h-[2px] w-8 bg-[#ff3b00]" />
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          В разработке
        </p>
        <h1 className="text-2xl font-normal leading-tight tracking-tight">
          Сравнение с другом
        </h1>
        <p className="mt-4 text-[13px] leading-[1.6] text-white/50">
          Здесь появится возможность сравнить свой профиль с профилем друга.
          Только не подумай, что мне это интересно — просто функция.
        </p>
        <Link
          href="/interview"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 font-mono text-[11px] font-bold tracking-[0.15em] text-black shadow-lg shadow-black/40 active:scale-[0.98]"
        >
          ПРОЙТИ ИНТЕРВЬЮ
        </Link>
      </div>
    </main>
  );
}