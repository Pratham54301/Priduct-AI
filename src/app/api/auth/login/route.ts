import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Set HTTP-only cookie if login successful
    if (response.ok && data.success && data.data?.token) {
      const responseNext = NextResponse.json(data, { status: response.status });
      responseNext.cookies.set('token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        path: '/',
      });
      return responseNext;
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Server error, please try again later' 
      },
      { status: 500 }
    );
  }
}
