'use client';

import { useQuery } from '@tanstack/react-query';
import { getWedding, getWeddingRsvps } from '@/lib/api/weddings';
import { API_BASE_URL } from '@/lib/config';
import { getAuthToken } from '@/store/auth-store';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function WeddingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const weddingId = Number(id);

  const { data: wedding, isLoading } = useQuery({ queryKey: ['wedding', weddingId], queryFn: () => getWedding(weddingId) });
  const { data: rsvps = [] } = useQuery({ queryKey: ['wedding-rsvps', weddingId], queryFn: () => getWeddingRsvps(weddingId) });

  const exportUrl = `${API_BASE_URL}/weddings/${weddingId}/rsvps/export`;

  if (isLoading) return <p className="text-sm text-gray-500">Đang tải...</p>;
  if (!wedding) return <p className="text-sm text-red-500">Wedding không tìm thấy</p>;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/weddings" className="text-gray-400 hover:text-gray-700"><ArrowLeft size={18} /></Link>
        <h1 className="text-xl font-semibold text-gray-900">{wedding.coupleName}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          wedding.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {wedding.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-2 gap-4 text-sm">
        {[
          ['Slug', wedding.slug],
          ['Ngày cưới', new Date(wedding.eventDate).toLocaleDateString('vi-VN', { dateStyle: 'long' })],
          ['Venue', wedding.venueName],
          ['Địa chỉ', wedding.venueAddress],
          ['Dress code', wedding.dressCode],
          ['Owner', wedding.owner?.email ?? '—'],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-gray-500 text-xs mb-0.5">{label}</p>
            <p className="text-gray-900 font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">RSVPs ({rsvps.length})</h2>
          <a
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              const token = getAuthToken();
              fetch(exportUrl, { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `rsvps-${weddingId}.csv`; a.click();
                });
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
          >
            <Download size={13} /> Export CSV
          </a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Tên', 'Phone', 'Trạng thái', 'Số khách', 'Ngày'].map((h) => (
                <th key={h} className="text-left px-5 py-2.5 font-medium text-gray-600 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rsvps.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-2.5 font-medium text-gray-900">{r.fullName}</td>
                <td className="px-5 py-2.5 text-gray-500">{r.phone}</td>
                <td className="px-5 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.attending === 'yes' ? 'bg-green-100 text-green-700'
                    : r.attending === 'no' ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>{r.attending}</span>
                </td>
                <td className="px-5 py-2.5 text-gray-500">{r.guestCount}</td>
                <td className="px-5 py-2.5 text-gray-500">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
