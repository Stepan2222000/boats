import OpenAI from "openai";
import { z } from "zod";
import { storage } from "./storage";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const OPENAI_API_URL = "https://api.openai.com/v1";

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
  try {
    // Get validation settings from database
    const validationModelSetting = await storage.getAiSetting('validationModel');
    const validationPromptSetting = await storage.getAiSetting('validationPrompt');
    
    const model = validationModelSetting?.settingValue || "gpt-4o-mini";
    const systemPrompt = validationPromptSetting?.settingValue || `Ты помощник для проверки объявлений о продаже водной техники. 
Проверь, что пользователь предоставил все необходимые данные для публикации объявления:

Обязательные поля:
- Описание лодки/катера (хотя бы несколько слов)
- Цена (в рублях)
- Местоположение (город)

Верни результат в формате JSON:
{
  "isValid": true/false,
  "missingFields": ["поле1", "поле2"],
  "extractedData": {
    "price": число,
    "location": "город"
  }
}`;

    const userPrompt = `Описание пользователя: "${description}"`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
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

// Schema for Responses API with all Avito fields
const responsesApiBoatSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  manufacturer: z.string().nullable(),
  model: z.string().nullable(),
  manufacturerCountry: z.string().nullable(),
  category: z.string().nullable(),
  length: z.number().positive().nullable(),
  width: z.number().positive().nullable(),
  draft: z.number().positive().nullable(),
  maxPassengers: z.number().int().positive().nullable(),
  hullMaterial: z.string().nullable(),
  boatType: z.string().nullable(),
  engineType: z.string().nullable(),
  trailerIncluded: z.boolean().nullable(),
  availability: z.string().nullable(),
  condition: z.string().nullable(),
  warnings: z.array(z.string()).optional().default([]),
});

// Generate boat listing using Responses API with web_search
export async function generateBoatListingWithResponses(input: {
  rawDescription: string;
  price: number;
  year: number;
  location: string;
  photoUrls: string[];
}) {
  try {
    // Get AI settings from database
    const modelSetting = await storage.getAiSetting('responsesModel');
    const verbositySetting = await storage.getAiSetting('verbosity');
    const reasoningEffortSetting = await storage.getAiSetting('reasoningEffort');
    const maxOutputTokensSetting = await storage.getAiSetting('maxOutputTokens');
    const systemPromptSetting = await storage.getAiSetting('systemPrompt');

    const model = modelSetting?.settingValue || "gpt-5-mini";
    const verbosity = verbositySetting?.settingValue || "medium";
    const reasoningEffort = reasoningEffortSetting?.settingValue || "medium";
    const maxOutputTokens = maxOutputTokensSetting?.settingValue ? parseInt(maxOutputTokensSetting.settingValue) : 8192;
    
    const systemPrompt = systemPromptSetting?.settingValue || `Ты профессиональный эксперт по водной технике и копирайтер для маркетплейса.

ВАЖНЫЕ ПРАВИЛА:
1. Заполняй ТОЛЬКО те поля, которые есть в скрине Avito
2. Если информация недоступна - оставляй null и добавляй предупреждение в warnings
3. Данные пользователя ПРИОРИТЕТНЕЕ веб-источников
4. НЕ придумывай данные - только факты из веб-поиска или пользователя
5. Все источники информации записывай отдельно

Поля из Avito для заполнения:
- Марка (manufacturer)
- Модель (model) 
- Страна происхождения бренда (manufacturerCountry)
- Год выпуска (year)
- Тип судна (boatType): Катер/Яхта/Гидроцикл/Лодка
- Категория (category): например "Катер с каютой"
- Длина (length) в метрах
- Ширина (width) в метрах
- Осадка (draft) в метрах
- Максимально пассажиров (maxPassengers)
- Материал корпуса (hullMaterial): например "Стеклопластик"
- Тип мотора (engineType): Стационарный/Подвесной
- Прицеп в комплекте (trailerIncluded): true/false
- Доступность (availability): "В наличии"/"Под заказ"
- Состояние (condition): "Новое"/"Б/у"`;

    const userPrompt = `Пользователь хочет продать лодку/катер/яхту.

Описание от пользователя: "${input.rawDescription}"
Цена: ${input.price} ₽
Год: ${input.year}
Местоположение: ${input.location}
Фото: ${input.photoUrls.length} шт.

Твоя задача:
1. Используй WEB SEARCH для поиска характеристик этой модели
2. Заполни ВСЕ поля из Avito, которые удалось найти
3. Если поле не найдено - оставь null и добавь предупреждение
4. Создай профессиональное описание (3-5 предложений)
5. Создай информативный заголовок

Верни СТРОГО в формате JSON:
{
  "title": "краткий заголовок с моделью",
  "description": "профессиональное описание 3-5 предложений",
  "manufacturer": "производитель или null",
  "model": "модель или null",
  "manufacturerCountry": "страна производителя или null",
  "category": "категория или null",
  "length": число в метрах или null,
  "width": число в метрах или null,
  "draft": число в метрах или null,
  "maxPassengers": число или null,
  "hullMaterial": "материал или null",
  "boatType": "Катер/Яхта/Гидроцикл/Лодка или null",
  "engineType": "тип мотора или null",
  "trailerIncluded": true/false/null,
  "availability": "доступность или null",
  "condition": "состояние или null",
  "warnings": ["список предупреждений о недостающих данных"]
}`;

    // Call Responses API with web_search tool
    const response = await fetch(`${OPENAI_API_URL}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        verbosity,
        reasoning_effort: reasoningEffort,
        max_completion_tokens: maxOutputTokens,
        input: [
          {
            type: "message",
            role: "system",
            content: systemPrompt,
          },
          {
            type: "message",
            role: "user",
            content: userPrompt,
          }
        ],
        tools: [
          {
            type: "web_search"
          }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Responses API error:", errorText);
      throw new Error(`Responses API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract content from response
    const content = data.output?.[0]?.content || data.output;
    if (!content) {
      throw new Error("No content in Responses API response");
    }

    // Parse JSON response
    let parsed;
    try {
      parsed = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (parseError) {
      console.error("Failed to parse Responses API JSON:", content);
      throw new Error("Invalid JSON from AI");
    }

    // Extract sources from annotations if available
    const sources: string[] = [];
    if (data.annotations && Array.isArray(data.annotations)) {
      for (const annotation of data.annotations) {
        if (annotation.type === 'web_search' && annotation.url) {
          sources.push(annotation.url);
        }
      }
    }

    // Validate response
    const validationResult = responsesApiBoatSchema.safeParse(parsed);
    
    if (!validationResult.success) {
      console.error("Responses API validation failed:", validationResult.error);
      console.log("Parsed content:", parsed);
      
      // Return with fallback values
      return {
        title: parsed?.title || `${parsed?.manufacturer || ''} ${parsed?.model || 'Лодка'} ${input.year}`.trim(),
        description: parsed?.description || input.rawDescription,
        manufacturer: parsed?.manufacturer || null,
        model: parsed?.model || null,
        manufacturerCountry: parsed?.manufacturerCountry || null,
        category: parsed?.category || null,
        length: parsed?.length || null,
        width: parsed?.width || null,
        draft: parsed?.draft || null,
        maxPassengers: parsed?.maxPassengers || null,
        hullMaterial: parsed?.hullMaterial || null,
        boatType: parsed?.boatType || null,
        engineType: parsed?.engineType || null,
        trailerIncluded: parsed?.trailerIncluded || null,
        availability: parsed?.availability || null,
        condition: parsed?.condition || null,
        sources,
        warnings: parsed?.warnings || ["Не удалось валидировать некоторые данные"],
      };
    }
    
    return {
      ...validationResult.data,
      sources,
    };
  } catch (error: any) {
    console.error("Responses API generation error:", error);
    throw new Error(`Не удалось сгенерировать объявление: ${error.message}`);
  }
}
