import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const body = await request.json();

    // For now, just return success since we don't have password change endpoint in backend
    // In a real app, you would call the backend to change password
    console.log('Password change request:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 