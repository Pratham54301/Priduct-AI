# Admin Access Guide

This project uses JWT cookie auth plus role-based authorization for admin access.

## 1) Create an Admin User

You can assign admin in MongoDB directly, or use the provided seed script.

### Option A: Seed Script (recommended)

From `backend`:

```bash
npm run seed:admin
```

Seeded account credentials come from `.env`:

```json
{
  "name": "ADMIN_NAME (optional, default: Admin)",
  "email": "ADMIN_EMAIL",
  "role": "admin"
}
```

Password used by script: `ADMIN_PASSWORD` from `.env`.

### Option B: Manual DB Update

Set the user role field to `admin` in `users` collection:

```json
{
  "role": "admin"
}
```

## 2) Login as Admin

Use the normal login page with the admin account credentials.

## 3) Access Admin Panel

- URL: `/admin`
- Only authenticated users with `role: "admin"` are allowed.

## 4) Route Protection

Backend:

- `auth` middleware validates JWT/cookie.
- `requireAdmin` middleware ensures `user.role === "admin"`.
- Protected admin APIs are mounted under `/api/admin/*`.

Frontend:

- `src/app/admin/layout.tsx` checks authenticated user role.
- Non-admin users are redirected away from admin pages.

## 5) Admin Capabilities

Admin dashboard can:

- View all users
- View prediction logs/history
- Update user role (`user` / `admin`)
- Update membership (`free` / `premium` / `lifetime`)
- Delete users (with safety checks)

## 6) Permission Tests

1. Login as normal user and open `/admin` -> should redirect / deny.
2. Login as admin and open `/admin` -> should load.
3. Call `/api/admin/users` as normal user -> should return 403.
4. Update user role/membership from admin UI -> should persist.
