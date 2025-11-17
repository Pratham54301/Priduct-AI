import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

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

    // Proxy to backend prediction service
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

    if (!backendRes.ok) {
      let errorMessage = 'Failed to generate prediction';
      try {
        // Try to read as text first, then parse as JSON
        const text = await backendRes.text();
        if (text) {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // If not JSON, use the text as error message
            errorMessage = text || errorMessage;
          }
        }
      } catch (e) {
        // If reading fails, use default message
        errorMessage = `Backend error: ${backendRes.status} ${backendRes.statusText}`;
      }
      
      return NextResponse.json({ 
        success: false,
        message: errorMessage 
      }, { status: backendRes.status });
    }

    let data;
    try {
      data = await backendRes.json();
      // If backend returns success/data format, pass it through
      // Otherwise wrap it in success/data format
      if (data.success !== undefined) {
        return NextResponse.json(data);
      } else {
        return NextResponse.json({
          success: true,
          data: data
        });
      }
    } catch (e) {
      // If response is not JSON, return error
      return NextResponse.json({
        success: false,
        message: 'Invalid response from backend'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error generating prediction:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 