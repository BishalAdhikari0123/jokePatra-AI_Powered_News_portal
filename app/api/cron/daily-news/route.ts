import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSatiricalNews } from '@/lib/gemini';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const generatedContent = await generateSatiricalNews();

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
        published_at: new Date().toISOString(),
        source: 'Gemini 1.5 Flash (Auto)',
        prompt_used: 'Daily automated generation',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: article,
        message: 'Daily satirical news generated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
