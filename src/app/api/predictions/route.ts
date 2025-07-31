import { NextRequest, NextResponse } from 'next/server';

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