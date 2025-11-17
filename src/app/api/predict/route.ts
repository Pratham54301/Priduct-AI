import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

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
    const { symbol, exchange, timeframe } = body || {};
    
    if (!symbol || typeof symbol !== 'string') {
      return NextResponse.json({ 
        success: false,
        message: 'Stock symbol is required' 
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
        symbol: symbol,
        exchange: stockExchange,
        timeframe: timeFrame 
      }),
    });

    let backendData;
    try {
      backendData = await backendRes.json();
    } catch (e) {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid response from backend' 
      }, { status: 500 });
    }

    if (!backendRes.ok) {
      return NextResponse.json({ 
        success: false,
        message: backendData.message || backendData.error || 'Failed to generate prediction' 
      }, { status: backendRes.status });
    }

    // Backend returns { success: true, data: prediction }
    // We need to convert to { success: true, prediction: ... }
    if (backendData.success && backendData.data) {
      return NextResponse.json({
        success: true,
        message: 'Prediction generated successfully',
        prediction: backendData.data
      });
    } else if (backendData.success) {
      // If backend already has prediction field
      return NextResponse.json({
        success: true,
        message: 'Prediction generated successfully',
        prediction: backendData.prediction || backendData
      });
    } else {
      // Backend returned error format
      return NextResponse.json({
        success: false,
        message: backendData.message || 'Failed to generate prediction'
      }, { status: backendRes.status });
    }
  } catch (error: any) {
    console.error('Error generating prediction:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

