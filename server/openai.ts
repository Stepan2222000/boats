import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { z } from "zod";

const aiResponseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  manufacturer: z.string().nullable(),
  model: z.string().nullable(),
  boatType: z.string().nullable(),
  length: z.number().positive().nullable(),
});

export async function generateBoatListing(input: {
  rawDescription: string;
  price: string;
  year: string;
  location: string;
  manufacturer?: string;
  model?: string;
  length?: string;
}) {
  const prompt = `Ты профессиональный копирайтер для премиального маркетплейса водной техники. 
Пользователь хочет разместить объявление о продаже лодки/катера/яхты.

Данные от пользователя:
- Описание: ${input.rawDescription}
- Цена: ${input.price} ₽
- Год: ${input.year}
- Местоположение: ${input.location}
${input.manufacturer ? `- Производитель: ${input.manufacturer}` : ''}
${input.model ? `- Модель: ${input.model}` : ''}
${input.length ? `- Длина: ${input.length} м` : ''}

Твоя задача:
1. Извлечь и нормализовать данные (производитель, модель, тип лодки, длина и т.д.)
2. Создать красивое, привлекательное описание на русском языке (2-4 предложения)
3. Создать короткий, но информативный заголовок

Верни результат строго в формате JSON:
{
  "title": "краткий заголовок",
  "description": "красивое описание 2-4 предложения",
  "manufacturer": "производитель или null",
  "model": "модель или null",
  "boatType": "Катер/Яхта/Гидроцикл/Лодка или null",
  "length": число длины в метрах (number) или null
}

ВАЖНО: 
- length должен быть числом (number), не строкой
- Все поля кроме title и description могут быть null
- Описание должно быть профессиональным, привлекательным и правдивым`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ты профессиональный копирайтер для премиального маркетплейса водной техники. Ты пишешь на русском языке.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Invalid response format from AI");
    }

    const validationResult = aiResponseSchema.safeParse(parsed);
    if (!validationResult.success) {
      console.error("AI response validation failed:", validationResult.error);
      
      return {
        title: parsed.title || "Продажа лодки",
        description: parsed.description || input.rawDescription,
        manufacturer: parsed.manufacturer || input.manufacturer || null,
        model: parsed.model || input.model || null,
        boatType: parsed.boatType || null,
        length: input.length ? parseFloat(input.length) : null,
      };
    }
    
    return validationResult.data;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Не удалось обработать данные с помощью AI");
  }
}
