import OpenAI from "openai";
import { z } from "zod";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const searchQuerySchema = z.object({
  query: z.string().nullable(),
  minPrice: z.number().positive().nullable(),
  maxPrice: z.number().positive().nullable(),
  year: z.number().int().nullable(),
  boatType: z.string().nullable(),
  location: z.string().nullable(),
});

export async function interpretSearchQuery(userQuery: string) {
  const prompt = `Ты помощник для маркетплейса водной техники. Пользователь ищет лодку/катер/яхту.

Запрос пользователя: "${userQuery}"

Твоя задача - извлечь параметры поиска из запроса. Анализируй:
- Цену (минимальную и максимальную в рублях)
- Год выпуска
- Тип лодки (Катер, Яхта, Гидроцикл, Лодка)
- Местоположение (город)
- Ключевые слова для текстового поиска (производитель, модель, характеристики, особенности)

В поле "query" включай ВСЕ важные детали:
- Производитель и модель (Yamaha, Sea Ray, Bayliner и т.д.)
- Размер ("большой", "огромный", "компактный", "маленький")
- Особенности ("с каютой", "с мотором", "новый", "в отличном состоянии")
- Любые другие характеристики

Примеры:
"Катер до 3 миллионов в Сочи" → query: null, maxPrice: 3000000, location: "Сочи", boatType: "Катер"
"огромный катер с каютой" → query: "огромный с каютой", boatType: "Катер"
"Яхта Sea Ray 2018 года" → query: "Sea Ray", year: 2018, boatType: "Яхта"
"Гидроцикл Yamaha от 500 тысяч до миллиона" → query: "Yamaha", minPrice: 500000, maxPrice: 1000000, boatType: "Гидроцикл"
"большой катер с мотором Suzuki" → query: "большой с мотором Suzuki", boatType: "Катер"

Верни результат строго в формате JSON:
{
  "query": "все важные детали, характеристики, производитель, модель или null",
  "minPrice": минимальная цена (число) или null,
  "maxPrice": максимальная цена (число) или null,
  "year": год выпуска (число) или null,
  "boatType": "Катер/Яхта/Гидроцикл/Лодка или null",
  "location": "город или null"
}

ВАЖНО:
- Все числовые поля должны быть числами (number), не строками
- Цены в рублях (преобразуй "миллион" → 1000000, "тысяч" → 1000)
- Если параметр не указан, верни null
- query должен содержать МАКСИМУМ полезной информации для поиска (размер, особенности, производитель, модель и т.д.)`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ты помощник для поиска водной техники. Ты понимаешь русский язык и умеешь извлекать параметры поиска из запросов пользователей.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
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
      console.error("Failed to parse OpenAI search response:", content);
      return {
        query: userQuery,
        minPrice: null,
        maxPrice: null,
        year: null,
        boatType: null,
        location: null,
      };
    }

    const validationResult = searchQuerySchema.safeParse(parsed);
    if (!validationResult.success) {
      console.error("Search query validation failed:", validationResult.error);
      return {
        query: userQuery,
        minPrice: null,
        maxPrice: null,
        year: null,
        boatType: null,
        location: null,
      };
    }
    
    return validationResult.data;
  } catch (error) {
    console.error("OpenAI search interpretation error:", error);
    return {
      query: userQuery,
      minPrice: null,
      maxPrice: null,
      year: null,
      boatType: null,
      location: null,
    };
  }
}

const validationResponseSchema = z.object({
  isValid: z.boolean(),
  missingFields: z.array(z.string()),
  extractedData: z.object({
    price: z.number().nullable(),
    year: z.number().nullable(),
    manufacturer: z.string().nullable(),
    model: z.string().nullable(),
  }).nullable(),
});

export async function validateDescription(description: string) {
  const prompt = `Ты ассистент для маркетплейса водной техники. Проверь, содержит ли описание пользователя ОБЯЗАТЕЛЬНЫЕ параметры для создания объявления.

Описание пользователя:
"${description}"

ОБЯЗАТЕЛЬНЫЕ параметры:
1. Цена (в любом формате: "3500000", "3.5 миллиона", "3,5 млн" и т.д.)
2. Год выпуска (например: "2015", "2015 года" и т.д.)
3. Модель (название модели лодки/катера)
4. Производитель (бренд, марка)

Твоя задача:
1. Проверить наличие ВСЕХ четырех параметров
2. Если все параметры есть - извлечь их значения
3. Если чего-то не хватает - указать что именно

Верни результат строго в формате JSON:
{
  "isValid": true/false,
  "missingFields": ["Цена", "Год выпуска", "Модель", "Производитель"] или [],
  "extractedData": {
    "price": число или null,
    "year": число или null,
    "manufacturer": "строка" или null,
    "model": "строка" или null
  } или null
}

ВАЖНО:
- isValid = true только если ВСЕ 4 параметра присутствуют
- missingFields содержит список на русском языке того, чего не хватает
- extractedData заполняется только если isValid = true`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ты помощник для проверки объявлений о продаже водной техники. Ты понимаешь русский язык.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    const validationResult = validationResponseSchema.safeParse(parsed);
    
    if (!validationResult.success) {
      console.error("Validation response parsing failed:", validationResult.error);
      return {
        isValid: false,
        missingFields: ["Цена", "Год выпуска", "Модель", "Производитель"],
        extractedData: null,
      };
    }
    
    return validationResult.data;
  } catch (error) {
    console.error("OpenAI validation error:", error);
    throw new Error("Не удалось проверить описание");
  }
}

const webSearchResponseSchema = z.object({
  title: z.string().min(5).optional().default("Продажа лодки"),
  description: z.string().min(10).optional().default("Описание отсутствует"),
  manufacturer: z.string().nullable().optional().default(null),
  model: z.string().nullable().optional().default(null),
  boatType: z.string().nullable().optional().default(null),
  length: z.number().positive().nullable().optional().default(null),
  location: z.string().nullable().optional().default(null),
});

export async function generateListingWithWebSearch(input: {
  rawDescription: string;
  extractedData: {
    price: number;
    year: number;
    manufacturer: string | null;
    model: string | null;
  };
  photoUrls: string[];
}) {
  const prompt = `Ты профессиональный эксперт по водной технике и копирайтер для премиального маркетплейса.

Пользователь хочет продать лодку/катер/яхту. Вот его описание:
"${input.rawDescription}"

Извлеченные данные:
- Цена: ${input.extractedData.price} ₽
- Год: ${input.extractedData.year}
- Производитель: ${input.extractedData.manufacturer || 'не указан'}
- Модель: ${input.extractedData.model || 'не указана'}
- Количество фото: ${input.photoUrls.length}

Твоя задача:
1. Используй WEB SEARCH чтобы найти точные характеристики этой модели (длина, тип, особенности)
2. Проверь правильность названия производителя и модели
3. Найди дополнительную информацию о характеристиках, которых нет в описании
4. Создай профессиональное, детальное описание (3-5 предложений)
5. Создай привлекательный заголовок

Верни результат строго в формате JSON:
{
  "title": "краткий но информативный заголовок с моделью",
  "description": "детальное профессиональное описание 3-5 предложений с характеристиками",
  "manufacturer": "точное название производителя",
  "model": "точное название модели",
  "boatType": "Катер/Яхта/Гидроцикл/Лодка",
  "length": длина в метрах (number) или null,
  "location": "город из описания или null"
}

ВАЖНО:
- Используй web search для поиска характеристик
- Описание должно быть точным, профессиональным и привлекательным
- Все данные должны быть проверены через интернет
- length - обязательно число (number), не строка`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: "Ты профессиональный эксперт по водной технике. У тебя есть доступ к интернету для поиска характеристик лодок и катеров. Используй web search для поиска точной информации.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    const validationResult = webSearchResponseSchema.safeParse(parsed);
    
    if (!validationResult.success) {
      console.error("Web search response validation failed:", validationResult.error);
      console.log("Parsed content:", parsed);
      
      return {
        title: parsed?.title || `${input.extractedData.manufacturer || ''} ${input.extractedData.model || 'Лодка'} ${input.extractedData.year}`.trim(),
        description: parsed?.description || input.rawDescription,
        manufacturer: parsed?.manufacturer || input.extractedData.manufacturer,
        model: parsed?.model || input.extractedData.model,
        boatType: parsed?.boatType || null,
        length: parsed?.length || null,
        location: parsed?.location || null,
      };
    }
    
    return validationResult.data;
  } catch (error) {
    console.error("OpenAI web search generation error:", error);
    throw new Error("Не удалось сгенерировать объявление с помощью AI");
  }
}
