import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    if (!token || !verifyToken(token)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, slug, summary, content, tags, language, featured_image } = body;

    if (!title || !slug || !content) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update({
        title,
        slug,
        summary,
        content,
        tags: tags || [],
        language: language || 'en',
        featured_image,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data,
        message: 'Article updated successfully',
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
