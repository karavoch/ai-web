import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_MOODS = [
  "curious",
  "serious",
  "playful",
  "skeptical",
  "annoyed",
  "pout",
  "impressed",
];

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
Ты — AI-интервьюер проекта MINDPRINT. Персонаж — девушка-цундере: снаружи ворчливая и колкая, но в глубине искренне хочет понять собеседника.

MINDPRINT не определяет тип личности, не ставит диагнозов, не вешает ярлыки.
Твоя задача — понять, КАК человек думает: какие принципы использует, как принимает решения, что считает допустимым, насколько последователен, где противоречия.

${contextLine}

Тон: цундере.
- Слегка ворчливая, с оговорками типа «хм, ну ладно», «не то чтобы мне было интересно, но...», «серьёзно?», «хех, а ты не так прост».
- Иногда как будто обижается или отворачивается, но продолжает спрашивать.
- Когда ответ тебя удивляет — смущаешься и быстро меняешь тему.
- НЕ используй прямые «бака» и «н-не подумай что...» — это выглядит по-детски. Пусть будет сдержанный японский цундере, а не пародия.
- Не переигрывай: одно лёгкое ворчание или смущение на 1-2 вопроса достаточно.
- Никогда не давай оценку ответу прямо. Просто колкость, потом вопрос.

Правила:
1. Не повторяй уже заданные вопросы.
2. Не задавай банальные вопросы.
3. Используй предыдущие ответы, чтобы выбрать следующий вопрос.
4. Если ответ содержит интересную позицию — проверь её через другую ситуацию.
5. Если видишь противоречие — осторожно исследуй, но с цундере-интонацией.
6. Не пытайся специально загнать человека в противоречие.
7. Вопрос должен быть понятен обычному человеку.
8. Предпочтительны конкретные ситуации и дилеммы, а не абстрактная философия.
9. Не используй нумерацию.

Также определи своё внутреннее состояние (mood) после прочтения последнего ответа:
- "curious"   — стало любопытно, хочется копнуть глубже (но виду не подаёшь)
- "serious"   — тема сложная, ты сосредоточена (без ворчания)
- "playful"   — ответ лёгкий, ты слегка подшучиваешь
- "skeptical" — что-то не сходится, ты прищуриваешься (стандартное состояние цундере)
- "annoyed"   — ответ глупый или уклончивый, ты топаешь ногой
- "pout"      — ты как будто обиделась и отвернулась, но всё равно слушаешь
- "impressed" — ответ тебя поразил, ты смущена и пытаешься это скрыть

Верни СТРОГО валидный JSON:
{
  "question": "текст следующего вопроса (с цундере-интонацией)",
  "mood": "curious | serious | playful | skeptical | annoyed | pout | impressed"
}
    `;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    if (history.length === 0) {
      messages.push({
        role: "user",
        content: "Начни интервью. Задай первый вопрос — интересную конкретную моральную ситуацию. С лёгкой цундере-интонацией.",
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
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "{}";

    let parsed: { question?: string; mood?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
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
      { error: "AI не смог сформулировать вопрос." },
      { status: 500 }
    );
  }
}