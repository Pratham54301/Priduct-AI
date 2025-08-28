import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Mock prediction data
    const mockPredictions = [
      {
        _id: '1',
        ticker: 'AAPL',
        createdAt: '2024-01-15T10:30:00Z',
        accuracy: 85,
        result: 'Bullish',
        type: 'Stock'
      },
      {
        _id: '2',
        ticker: 'TSLA',
        createdAt: '2024-01-14T14:20:00Z',
        accuracy: 72,
        result: 'Bearish',
        type: 'Stock'
      },
      {
        _id: '3',
        ticker: 'BTC',
        createdAt: '2024-01-13T09:15:00Z',
        accuracy: 91,
        result: 'Bullish',
        type: 'Crypto'
      },
      {
        _id: '4',
        ticker: 'ETH',
        createdAt: '2024-01-12T16:45:00Z',
        accuracy: 78,
        result: 'Neutral',
        type: 'Crypto'
      }
    ];

    return NextResponse.json(mockPredictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const body = await request.json();
    const { ticker } = body || {};
    if (!ticker || typeof ticker !== 'string') {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    // Proxy to backend prediction service
    const backendRes = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ ticker }),
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return NextResponse.json({ error: text || 'Backend error' }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating prediction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 