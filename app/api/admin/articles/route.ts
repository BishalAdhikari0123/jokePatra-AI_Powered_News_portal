import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ApiResponse, Article } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase Admin is properly initialized
    if (!supabaseAdmin) {
      console.error('Supabase Admin is not initialized. Environment variables missing.');
      return NextResponse.json<ApiResponse>(
        { 
          success: false, 
          error: 'Database configuration error. Please check environment variables in Vercel.' 
        },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    if (!token || !verifyToken(token)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error, count } = await supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
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

export async function DELETE(request: NextRequest) {
  try {
    // Check if Supabase Admin is properly initialized
    if (!supabaseAdmin) {
      console.error('Supabase Admin is not initialized. Environment variables missing.');
      return NextResponse.json<ApiResponse>(
        { 
          success: false, 
          error: 'Database configuration error. Please check environment variables in Vercel.' 
        },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    if (!token || !verifyToken(token)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Article ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
