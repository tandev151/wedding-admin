'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { getMyRsvps, getMyRsvpsExportUrl } from '@/lib/api/weddings';
import { getStats } from '@/lib/api/admin';
import { getAllWeddings, getWeddingRsvps } from '@/lib/api/weddings';
import { useState } from 'react';
import { Download } from 'lucide-react';
import type { Rsvp } from '@/types';
import { API_BASE_URL } from '@/lib/config';
import { getAuthToken } from '@/store/auth-store';

function RsvpTable({ rsvps, exportUrl }: { rsvps: Rsvp[]; exportUrl: string }) {
  const handleExport = () => {
    const token = getAuthToken();
    fetch(exportUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'rsvps.csv'; a.click();
      });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700">{rsvps.length} RSVPs</p>
        <button onClick={handleExport} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900">
          <Download size={13} /> Export CSV
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Tên', 'Phone', 'Trạng thái', 'Số khách', 'Tin nhắn', 'Ngày'].map((h) => (
              <th key={h} className="text-left px-5 py-2.5 font-medium text-gray-600 text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rsvps.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium text-gray-900">{r.fullName}</td>
              <td className="px-5 py-3 text-gray-500">{r.phone}</td>
              <td className="px-5 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  r.attending === 'yes' ? 'bg-green-100 text-green-700'
                  : r.attending === 'no' ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}>{r.attending}</span>
              </td>
              <td className="px-5 py-3 text-gray-500">{r.guestCount}</td>
              <td className="px-5 py-3 text-gray-400 text-xs max-w-40 truncate">{r.message ?? '—'}</td>
              <td className="px-5 py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminRsvps() {
  const { data: weddings = [] } = useQuery({ queryKey: ['weddings'], queryFn: getAllWeddings });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const weddingId = selectedId ?? weddings[0]?.id;

  const { data: rsvps = [], isLoading } = useQuery({
    queryKey: ['wedding-rsvps', weddingId],
    queryFn: () => getWeddingRsvps(weddingId!),
    enabled: !!weddingId,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={weddingId ?? ''}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          {weddings.map((w) => (
            <option key={w.id} value={w.id}>{w.coupleName}</option>
          ))}
        </select>
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Đang tải...</p> : (
        weddingId && <RsvpTable rsvps={rsvps} exportUrl={`${API_BASE_URL}/weddings/${weddingId}/rsvps/export`} />
      )}
    </div>
  );
}

function ClientRsvps() {
  const { data: rsvps = [], isLoading } = useQuery({ queryKey: ['my-rsvps'], queryFn: getMyRsvps });
  if (isLoading) return <p className="text-sm text-gray-500">Đang tải...</p>;
  return <RsvpTable rsvps={rsvps} exportUrl={`${API_BASE_URL}/weddings/me/rsvps/export`} />;
}

export default function RsvpsPage() {
  const role = useAuthStore((s) => s.user?.role);
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">RSVPs</h1>
      {role === 'ADMIN' ? <AdminRsvps /> : <ClientRsvps />}
    </div>
  );
}
