'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyWedding, updateMyWedding } from '@/lib/api/weddings';
import { useState, useEffect } from 'react';

const fields: { key: string; label: string; type?: string }[] = [
  { key: 'coupleName', label: 'Tên cặp đôi' },
  { key: 'monogram', label: 'Monogram' },
  { key: 'heroMessage', label: 'Hero message' },
  { key: 'eventDate', label: 'Ngày cưới', type: 'datetime-local' },
  { key: 'venueName', label: 'Tên venue' },
  { key: 'venueAddress', label: 'Địa chỉ venue' },
  { key: 'receptionTime', label: 'Giờ tiệc' },
  { key: 'dressCode', label: 'Dress code' },
  { key: 'mapUrl', label: 'Map URL' },
  { key: 'ceremonyVenueName', label: 'Tên lễ đường' },
  { key: 'ceremonyVenueAddress', label: 'Địa chỉ lễ đường' },
  { key: 'ceremonyTime', label: 'Giờ lễ' },
  { key: 'groomName', label: 'Tên chú rể (ngắn)' },
  { key: 'groomFullName', label: 'Tên chú rể (đầy đủ)' },
  { key: 'groomDescription', label: 'Giới thiệu chú rể' },
  { key: 'groomImageUrl', label: 'Ảnh chú rể (URL)' },
  { key: 'brideName', label: 'Tên cô dâu (ngắn)' },
  { key: 'brideFullName', label: 'Tên cô dâu (đầy đủ)' },
  { key: 'brideDescription', label: 'Giới thiệu cô dâu' },
  { key: 'brideImageUrl', label: 'Ảnh cô dâu (URL)' },
  { key: 'videoId', label: 'YouTube Video ID' },
];

export default function MyWeddingPage() {
  const qc = useQueryClient();
  const { data: wedding, isLoading } = useQuery({ queryKey: ['my-wedding'], queryFn: getMyWedding });
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (wedding) {
      const initial: Record<string, string> = {};
      fields.forEach(({ key }) => {
        const val = (wedding as any)[key];
        if (key === 'eventDate' && val) {
          initial[key] = new Date(val).toISOString().slice(0, 16);
        } else {
          initial[key] = val ?? '';
        }
      });
      setForm(initial);
    }
  }, [wedding]);

  const mut = useMutation({
    mutationFn: () => updateMyWedding(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-wedding'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) return <p className="text-sm text-gray-500">Đang tải...</p>;

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900">My Wedding</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ key, label, type = 'text' }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={form[key] ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
          >
            {mut.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          {saved && <span className="text-sm text-green-600">✓ Đã lưu!</span>}
        </div>
      </div>
    </div>
  );
}
