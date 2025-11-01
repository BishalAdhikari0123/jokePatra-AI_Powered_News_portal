import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface GeneratedArticle {
  title: string;
  slug: string;
  summary: string;
  content_html: string;
  tags: string[];
  language: string;
}

export async function generateSatiricalNews(
  customPrompt?: string
): Promise<GeneratedArticle> {
  const defaultPrompt = `You are "jokePatra" — Nepal's most sarcastic, witty daily news writer.
Generate a fake but funny satirical news article about Nepal.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks, no extra text.

The JSON must have exactly these fields:
{
  "title": "A catchy, sarcastic headline",
  "slug": "url-friendly-slug-format",
  "summary": "Brief 1-2 sentence summary",
  "content_html": "<p>Full article content with HTML tags. Make it 3-4 paragraphs, witty, sarcastic, and entertaining.</p>",
  "tags": ["tag1", "tag2", "tag3"],
  "language": "en"
}

Tone: sarcastic, humorous, clever, satirical but not hateful or defamatory.
Context: current Nepali politics, society, pop culture, infrastructure, or everyday life.
Make it feel like real news but obviously satirical.`;

  const prompt = customPrompt || defaultPrompt;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048,
        },
      }
    );

    const generatedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    const cleanedText = generatedText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsedData: GeneratedArticle = JSON.parse(cleanedText);

    return {
      title: parsedData.title || 'Untitled Satire',
      slug: parsedData.slug || generateSlug(parsedData.title),
      summary: parsedData.summary || '',
      content_html: parsedData.content_html || '<p>No content generated</p>',
      tags: parsedData.tags || ['nepal', 'satire'],
      language: parsedData.language || 'en',
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate satirical news');
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}
