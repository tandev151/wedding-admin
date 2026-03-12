'use client';

import { useAuthStore } from '@/store/auth-store';
import AdminDashboard from '@/components/features/dashboard/AdminDashboard';
import ClientDashboard from '@/components/features/dashboard/ClientDashboard';

export default function DashboardPage() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === 'ADMIN') return <AdminDashboard />;
  return <ClientDashboard />;
}
