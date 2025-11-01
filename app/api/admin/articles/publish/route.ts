import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function PATCH(request: NextRequest) {
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
    const { id, publish } = body;

    if (!id || typeof publish !== 'boolean') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Article ID and publish status required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update({
        published_at: publish ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const message = publish 
      ? 'Article published successfully' 
      : 'Article unpublished successfully';

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data,
        message,
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
