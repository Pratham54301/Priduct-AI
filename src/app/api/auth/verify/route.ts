import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No token provided' 
        },
        { status: 401 }
      );
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/auth/verify`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Server error, please try again later' 
      },
      { status: 500 }
    );
  }
}
