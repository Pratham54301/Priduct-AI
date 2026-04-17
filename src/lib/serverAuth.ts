import { NextRequest } from 'next/server';

export function resolveBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const cookieToken = request.cookies.get('token')?.value;
  return cookieToken || null;
}

export function requireAuthorizationHeader(request: NextRequest): string | null {
  const token = resolveBearerToken(request);
  if (!token) {
    return null;
  }

  return `Bearer ${token}`;
}

