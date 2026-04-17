import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });

    const response = await fetch(`${BACKEND_URL}/api/admin/settings`, {
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
