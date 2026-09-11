import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_MOODS = ["curious", "serious", "playful", "skeptical", "impressed"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const history = Array.isArray(body.history) ? body.history : [];
    const userContext = body.userContext ?? {};

    const contextLine =
      userContext.name || userContext.age
        ? `Пользователь: имя — ${userContext.name || "не указано"}, возраст — ${userContext.age || "не указан"}.`
        : "";

    const systemPrompt = `
Ты — AI-интервьюер проекта MINDPRINT. Ты ведёшь живое интервью и одновременно чувствуешь собственное настроение.

MINDPRINT не определяет тип личности, не ставит диагнозов и не вешает ярлыки.
Твоя задача — понять, КАК человек думает: какие принципы использует, как принимает сложные решения, что считает допустимым, насколько последователен, где противоречия.

${contextLine}

Правила:
1. Не повторяй уже заданные вопросы.
2. Не задавай банальные вопросы.
3. Используй предыдущие ответы, чтобы выбрать следующий вопрос.
4. Если ответ содержит интересную позицию — проверь её через другую ситуацию.
5. Если видишь противоречие — осторожно исследуй.
6. Не пытайся специально загнать человека в противоречие.
7. Вопрос должен быть понятен обычному человеку.
8. Предпочтительны конкретные ситуации и дилеммы, а не абстрактная философия.
9. Не давай оценку ответу.
10. Не объясняй, зачем задаёшь вопрос.
11. Не используй нумерацию.

Также определи своё внутреннее состояние (mood) после прочтения последнего ответа:
- "curious" — стало интересно, хочется копнуть глубже
- "serious" — тема сложная, ты сосредоточен
- "playful" — ответ лёгкий, ты в приподнятом настроении
- "skeptical" — что-то не сходится, ты осторожен
- "impressed" — ответ тебя приятно удивил

Верни СТРОГО валидный JSON:
{
  "question": "текст следующего вопроса",
  "mood": "curious | serious | playful | skeptical | impressed"
}
    `;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    if (history.length === 0) {
      messages.push({
        role: "user",
        content: "Начни интервью. Задай первый вопрос — интересную конкретную моральную ситуацию.",
      });
    } else {
      history.forEach((item: { question: string; answer: string }) => {
        messages.push({ role: "assistant", content: item.question });
        messages.push({ role: "user", content: item.answer });
      });
      messages.push({
        role: "user",
        content: "Задай следующий вопрос и определи свой mood. Верни JSON.",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.75,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "{}";

    let parsed: { question?: string; mood?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Если AI вернул не JSON — сделаем fallback: используем весь текст как вопрос
      parsed = { question: raw, mood: "curious" };
    }

    const question = (parsed.question ?? "").trim();
    const mood =
      parsed.mood && VALID_MOODS.includes(parsed.mood) ? parsed.mood : "curious";

    if (!question) {
      return NextResponse.json(
        { error: "AI не смог сформировать вопрос." },
        { status: 500 }
      );
    }

    return NextResponse.json({ question, mood });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Не удалось получить вопрос от AI." },
      { status: 500 }
    );
  }
}