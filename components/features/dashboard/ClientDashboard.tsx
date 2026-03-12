'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyWedding, getMyRsvps } from '@/lib/api/weddings';
import { Heart, ClipboardList, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export default function ClientDashboard() {
  const { data: wedding, isLoading: loadingWedding } = useQuery({ queryKey: ['my-wedding'], queryFn: getMyWedding });
  const { data: rsvps = [], isLoading: loadingRsvps } = useQuery({ queryKey: ['my-rsvps'], queryFn: getMyRsvps });

  if (loadingWedding || loadingRsvps) return <p className="text-sm text-gray-500">Đang tải...</p>;

  const yes = rsvps.filter((r) => r.attending === 'yes').length;
  const no = rsvps.filter((r) => r.attending === 'no').length;
  const maybe = rsvps.filter((r) => r.attending === 'maybe').length;
  const totalGuests = rsvps.filter((r) => r.attending === 'yes').reduce((a, r) => a + r.guestCount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      {wedding && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
          <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
            <Heart size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{wedding.coupleName}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(wedding.eventDate).toLocaleDateString('vi-VN', { dateStyle: 'full' })} · {wedding.venueName}
            </p>
            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              wedding.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {wedding.isPublished ? 'Đã published' : 'Chưa published'}
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng RSVPs', value: rsvps.length, icon: ClipboardList, color: 'bg-purple-50 text-purple-700' },
          { label: 'Tham dự', value: yes, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
          { label: 'Không đến', value: no, icon: XCircle, color: 'bg-red-50 text-red-700' },
          { label: 'Tổng khách', value: totalGuests, icon: HelpCircle, color: 'bg-blue-50 text-blue-700' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
