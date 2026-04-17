import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizationHeader } from '@/lib/serverAuth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch user details' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}/membership`, {
      method: 'PATCH',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update membership' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = requireAuthorizationHeader(request);
    if (!authHeader) return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
