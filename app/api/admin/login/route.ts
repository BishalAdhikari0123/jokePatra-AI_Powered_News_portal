import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword, generateToken } from '@/lib/auth';
import { validateRequest, loginSchema } from '@/lib/validation';
import { ApiResponse, LoginRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { error, value } = validateRequest<LoginRequest>(loginSchema, body);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error },
        { status: 400 }
      );
    }

    const { email, password } = value!;

    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (dbError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.email);

    return NextResponse.json<ApiResponse<{ token: string; user: any }>>(
      {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
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
