import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Mock watchlist data
    const mockWatchlist = [
      {
        _id: '1',
        ticker: 'AAPL'
      },
      {
        _id: '2',
        ticker: 'TSLA'
      },
      {
        _id: '3',
        ticker: 'BTC'
      },
      {
        _id: '4',
        ticker: 'ETH'
      },
      {
        _id: '5',
        ticker: 'GOOGL'
      }
    ];

    return NextResponse.json(mockWatchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 