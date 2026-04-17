import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const sanitizePredictionError = (message?: string) => {
  const text = String(message || '').trim();
  if (!text) return 'Unable to generate prediction right now. Please try again.';
  const lower = text.toLowerCase();
  if (
    lower.includes('googlegenerativeai error') ||
    lower.includes('quota exceeded') ||
    lower.includes('too many requests')
  ) {
    return 'AI service quota is currently exhausted. Please retry shortly.';
  }
  return text.length > 220 ? `${text.slice(0, 220)}...` : text;
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) {
      console.error('[Predict API] No token provided');
      return NextResponse.json({ 
        success: false,
        message: 'No token provided' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { symbol, exchange, timeframe } = body || {};
    
    console.log('[Predict API] Request received:', { symbol, exchange, timeframe });
    
    if (!symbol || typeof symbol !== 'string') {
      console.error('[Predict API] Missing symbol:', { symbol, type: typeof symbol });
      return NextResponse.json({ 
        success: false,
        message: 'Stock symbol is required' 
      }, { status: 400 });
    }

    // Default exchange to NSE if not provided
    const stockExchange = exchange || 'NSE';
    const timeFrame = timeframe || '1day';

    console.log('[Predict API] Proxying to backend:', { 
      url: `${BACKEND_URL}/api/predict`,
      symbol,
      exchange: stockExchange,
      timeframe: timeFrame
    });

    // Proxy to backend prediction service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/predict`, {
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
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('[Predict API] Backend request timeout');
        return NextResponse.json({ 
          success: false,
          message: 'Prediction request timed out. Please try again.' 
        }, { status: 504 });
      }
      console.error('[Predict API] Backend fetch error:', {
        error: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack
      });
      return NextResponse.json({ 
        success: false,
        message: `Failed to connect to prediction service: ${fetchError.message}` 
      }, { status: 503 });
    }

    let backendData;
    try {
      const responseText = await backendRes.text();
      console.log('[Predict API] Backend response status:', backendRes.status);
      console.log('[Predict API] Backend response (first 500 chars):', responseText.substring(0, 500));
      
      try {
        backendData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Predict API] Failed to parse backend response:', {
          error: parseError,
          responseText: responseText.substring(0, 200)
        });
        return NextResponse.json({ 
          success: false,
          message: 'Invalid JSON response from backend' 
        }, { status: 500 });
      }
    } catch (e: any) {
      console.error('[Predict API] Error reading backend response:', e);
      return NextResponse.json({ 
        success: false,
        message: 'Invalid response from backend' 
      }, { status: 500 });
    }

    if (!backendRes.ok) {
      console.error('[Predict API] Backend error response:', {
        status: backendRes.status,
        data: backendData
      });
      const message = sanitizePredictionError(backendData.message || backendData.error);
      return NextResponse.json({ 
        success: false,
        message,
        code: message.includes('quota') ? 'AI_QUOTA_EXCEEDED' : undefined,
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

