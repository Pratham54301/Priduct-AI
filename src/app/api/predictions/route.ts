import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/history`, {
      method: 'GET',
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) {
      return NextResponse.json({ 
        success: false,
        message: 'No token provided' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { symbol, exchange, timeframe, ticker } = body || {};
    
    // Support both 'ticker' (legacy) and 'symbol' (current)
    const stockSymbol = symbol || ticker;
    
    if (!stockSymbol || typeof stockSymbol !== 'string') {
      return NextResponse.json({ 
        success: false,
        message: 'Symbol (ticker) is required' 
      }, { status: 400 });
    }

    // Default exchange to NSE if not provided
    const stockExchange = exchange || 'NSE';
    const timeFrame = timeframe || '1day';

    const backendRes = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ 
        symbol: stockSymbol,
        exchange: stockExchange,
        timeframe: timeFrame 
      }),
    });

    const data = await backendRes.json().catch(() => ({ success: false, message: 'Invalid backend response' }));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 