import { NextRequest, NextResponse } from 'next/server';

type VerifiedUser = {
  id: string;
  role?: string;
};

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

const isAdmin = (role?: string) => String(role || '').toLowerCase() === 'admin';

const verifyUserFromToken = async (token: string): Promise<VerifiedUser | null> => {
  try {
    const response = await fetch(`${getBackendUrl()}/api/auth/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const payload = await response.json();
    if (!payload?.success || !payload?.data) return null;
    return payload.data as VerifiedUser;
  } catch {
    return null;
  }
};

const unauthorizedApi = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminRoot = pathname === '/admin' || pathname === '/admin/';
  const isAdminLogin = pathname === '/admin/login';
  const isAdminDashboard = pathname.startsWith('/admin/dashboard');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isDashboardPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (!token) {
    if (isAdminApi) return unauthorizedApi('No token, authorization denied', 401);
    if (isAdminLogin) return NextResponse.next();
    const loginUrl = new URL(isAdminPage ? '/admin/login' : '/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyUserFromToken(token);
  if (!user) {
    if (isAdminApi) return unauthorizedApi('Token is not valid', 401);
    if (isAdminLogin) return NextResponse.next();
    const loginUrl = new URL(isAdminPage ? '/admin/login' : '/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only pages and APIs.
  if (isAdminPage || isAdminApi) {
    if (!isAdmin(user.role)) {
      if (isAdminApi) return unauthorizedApi('Admin access required', 403);
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Admin logged in and opening /admin or /admin/login => land on dashboard.
    if (isAdminRoot || isAdminLogin) {
      const adminDashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(adminDashboardUrl);
    }
  }

  // /admin/dashboard remains admin-only from the block above.
  if (isAdminDashboard) return NextResponse.next();

  // /dashboard requires authentication, but not admin role.
  if (isDashboardPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/admin/:path*'],
};
