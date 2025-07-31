import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Call the backend to verify token and get user data
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userData = await response.json();
    
    // Return user data with additional fields
    return NextResponse.json({
      _id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      phone: null, // Add default values for optional fields
      plan: 'free',
      usage: 0,
      maxUsage: 10,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 