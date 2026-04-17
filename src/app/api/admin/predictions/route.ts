import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });

    const query = request.nextUrl.searchParams.toString();
    const response = await fetch(`${BACKEND_URL}/api/admin/predictions${query ? `?${query}` : ''}`, {
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch prediction logs' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });

    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Prediction id is required' }, { status: 400 });

    const response = await fetch(`${BACKEND_URL}/api/admin/predictions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete prediction' }, { status: 500 });
  }
}
