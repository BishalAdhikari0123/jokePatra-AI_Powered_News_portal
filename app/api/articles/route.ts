import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ApiResponse, Article } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly initialized
    if (!supabase) {
      console.error('Supabase is not initialized. Environment variables missing.');
      return NextResponse.json<ApiResponse>(
        { 
          success: false, 
          error: 'Database configuration error. Please check environment variables.' 
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error, count } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ articles: Article[]; total: number }>>(
      {
        success: true,
        data: { articles: data as Article[], total: count || 0 },
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
