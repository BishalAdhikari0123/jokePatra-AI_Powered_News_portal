import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSatiricalNews } from '@/lib/gemini';
import { validateRequest, generatePromptSchema } from '@/lib/validation';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ApiResponse, GenerateArticleRequest, Article } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { error, value } = validateRequest<GenerateArticleRequest>(
      generatePromptSchema,
      body
    );

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error },
        { status: 400 }
      );
    }

    const { prompt, publish, featured_image } = value!;

    const enhancedPrompt = `You are "jokePatra" — Nepal's most sarcastic, witty daily news writer.

${prompt}

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

Tone: sarcastic, humorous, clever, satirical but not hateful or defamatory.`;

    const generatedContent = await generateSatiricalNews(enhancedPrompt);

    // Determine if article should be published based on the request
    const shouldPublish = publish ?? false;

    const { data: article, error: insertError } = await supabaseAdmin
      .from('articles')
      .insert({
        title: generatedContent.title,
        slug: generatedContent.slug,
        summary: generatedContent.summary,
        content: generatedContent.content_html,
        tags: generatedContent.tags,
        language: generatedContent.language,
        satire: true,
        published_at: shouldPublish ? new Date().toISOString() : null,
        source: 'Gemini 1.5 Flash',
        prompt_used: prompt,
        featured_image: featured_image || null,
        author_id: decoded.userId,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    const message = shouldPublish 
      ? 'Article generated and published successfully' 
      : 'Article generated and saved as draft';

    return NextResponse.json<ApiResponse<Article>>(
      {
        success: true,
        data: article as Article,
        message,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
