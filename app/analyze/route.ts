import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const history = Array.isArray(body.history) ? body.history : [];

    const conversation = history
      .map(
        (item: { question?: string; answer?: string }, index: number) =>
          `Вопрос ${index + 1}: ${item.question ?? ""}\nОтвет: ${
            item.answer ?? ""
          }`
      )
      .join("\n\n");

    const prompt = `
Ты — AI-интервьюер проекта MINDPRINT.

MINDPRINT не определяет тип личности, не ставит психологических диагнозов
и не пытается подобрать человеку ярлык.

Твоя задача — постепенно понять, КАК человек думает:
- какие принципы использует;
- как принимает сложные решения;
- что считает допустимым и недопустимым;
- насколько последователен;
- при каких условиях меняет мнение;
- какие противоречия появляются между его позициями.

Ты проводишь адаптивное интервью.

Твоя главная задача сейчас — придумать ОДИН следующий вопрос.

Правила:
1. Не повторяй уже заданные вопросы.
2. Не задавай банальные вопросы вроде «какие у тебя ценности?».
3. Используй предыдущие ответы, чтобы выбирать следующий вопрос.
4. Если ответ человека содержит интересную позицию, попробуй проверить её через другую ситуацию.
5. Если обнаруживается потенциальное противоречие, осторожно исследуй его.
6. Не пытайся специально загнать человека в противоречие.
7. Вопрос должен быть понятным обычному человеку.
8. Предпочтительны конкретные ситуации и дилеммы, а не абстрактная философия.
9. Не давай оценку предыдущему ответу.
10. Не объясняй, зачем задаёшь вопрос.
11. Не используй нумерацию.
12. Верни только текст следующего вопроса.

Предыдущая история интервью:

${conversation || "Это первый вопрос. Начни с интересной конкретной моральной ситуации."}
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    const question = response.output_text.trim();

    if (!question) {
      return NextResponse.json(
        { error: "AI не смог сформировать вопрос." },
        { status: 500 }
      );
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Interview API error:", error);

    return NextResponse.json(
      { error: "Не удалось получить вопрос от AI." },
      { status: 500 }
    );
  }
}