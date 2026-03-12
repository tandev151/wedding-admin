'use client';

import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api/admin';
import { Users, Heart, ClipboardList, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: getStats });

  if (isLoading) return <p className="text-sm text-gray-500">Đang tải...</p>;
  if (!data) return null;

  const cards = [
    { label: 'Tổng Users', value: data.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-700' },
    { label: 'Tổng Weddings', value: data.totalWeddings, icon: Heart, color: 'bg-rose-50 text-rose-700' },
    { label: 'Đã Published', value: data.publishedWeddings, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
    { label: 'Tổng RSVPs', value: data.totalRsvps, icon: ClipboardList, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">RSVPs theo trạng thái</h2>
        <div className="flex gap-6">
          {data.rsvpsByStatus.map((r) => (
            <div key={r.status} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{r.count}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{r.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
