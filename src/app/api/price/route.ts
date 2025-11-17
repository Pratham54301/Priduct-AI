import { NextRequest, NextResponse } from 'next/server';

const PRICE_API_KEY = process.env.PRICE_API_KEY;
const PRICE_API_URL = process.env.PRICE_API_URL || 'https://api.example.com/live';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const exchange = searchParams.get('exchange');

    // Validate required parameters
    if (!symbol) {
      return NextResponse.json({
        success: false,
        message: 'Symbol parameter is required'
      }, { status: 400 });
    }

    if (!exchange) {
      return NextResponse.json({
        success: false,
        message: 'Exchange parameter is required'
      }, { status: 400 });
    }

    // Validate API key exists
    if (!PRICE_API_KEY) {
      console.error('PRICE_API_KEY is not configured');
      return NextResponse.json({
        success: false,
        message: 'Price API service is not configured'
      }, { status: 500 });
    }

    // Build API URL with query parameters
    const apiUrl = new URL(PRICE_API_URL);
    apiUrl.searchParams.set('symbol', symbol);
    apiUrl.searchParams.set('exchange', exchange);
    apiUrl.searchParams.set('apikey', PRICE_API_KEY);

    // Fetch live price from external API
    let externalResponse;
    try {
      externalResponse = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    } catch (fetchError: any) {
      // Handle network errors
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        console.error('Price API request timeout:', fetchError);
        return NextResponse.json({
          success: false,
          message: 'Request to price API timed out'
        }, { status: 504 });
      }
      
      console.error('Network error fetching price:', fetchError);
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to price API service'
      }, { status: 503 });
    }

    // Check if external API responded successfully
    if (!externalResponse.ok) {
      let errorMessage = 'Failed to fetch live price';
      
      try {
        const errorData = await externalResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = `Price API returned ${externalResponse.status}: ${externalResponse.statusText}`;
      }

      console.error('Price API error:', {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        message: errorMessage
      });

      return NextResponse.json({
        success: false,
        message: errorMessage
      }, { status: externalResponse.status >= 500 ? 502 : externalResponse.status });
    }

    // Parse response from external API
    let externalData;
    try {
      externalData = await externalResponse.json();
    } catch (parseError) {
      console.error('Failed to parse price API response:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid response from price API'
      }, { status: 502 });
    }

    // Extract price data from external API response
    // Assuming the external API returns data in various possible formats
    // Adjust these mappings based on your actual API response structure
    const price = externalData.price || externalData.close || externalData.current_price || externalData.last;
    const change = externalData.change || externalData.change_amount || 0;
    const percent = externalData.percent || externalData.change_percent || externalData.pct_change || 0;
    const timestamp = externalData.timestamp || externalData.updated_at || new Date().toISOString();

    // Validate that we got essential data
    if (price === undefined || price === null) {
      console.error('Price data missing from API response:', externalData);
      return NextResponse.json({
        success: false,
        message: 'Price data not found in API response'
      }, { status: 502 });
    }

    // Return unified response format
    return NextResponse.json({
      success: true,
      price: Number(price),
      change: Number(change),
      percent: Number(percent),
      timestamp: timestamp
    });

  } catch (error: any) {
    // Catch any unexpected errors
    console.error('Unexpected error in price API route:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred while fetching price'
    }, { status: 500 });
  }
}

