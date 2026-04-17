import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });

    const response = await fetch(`${BACKEND_URL}/api/admin/analytics`, {
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch analytics' }, { status: 500 });
  }
}
