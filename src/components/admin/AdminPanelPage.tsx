'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from './AdminDashboard';


export function AdminPanelPage() {
    const router = useRouter();
    
    // This component is now a wrapper. 
    // The protection logic has been moved to the layout `src/app/admin-panel/layout.tsx`
    // to protect all admin routes, not just the main dashboard page.
    // The UI has been moved to a new component `src/components/admin/AdminDashboard.tsx`.

    return <AdminDashboard />;
}
