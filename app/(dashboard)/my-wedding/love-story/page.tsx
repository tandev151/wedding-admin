'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoveStory, addEvent, updateEvent, deleteEvent } from '@/lib/api/love-story';
import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';

export default function LoveStoryPage() {
  const qc = useQueryClient();
  const { data: events = [], isLoading } = useQuery({ queryKey: ['love-story'], queryFn: getLoveStory });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dateLabel: '', title: '', description: '', order: '' });
  const [editing, setEditing] = useState<{ id: number; dateLabel: string; title: string; description: string; order: string } | null>(null);

  const addMut = useMutation({
    mutationFn: () => addEvent({ ...form, order: form.order ? Number(form.order) : undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['love-story'] }); setShowForm(false); setForm({ dateLabel: '', title: '', description: '', order: '' }); },
  });

  const updateMut = useMutation({
    mutationFn: () => updateEvent(editing!.id, { dateLabel: editing!.dateLabel, title: editing!.title, description: editing!.description, order: editing!.order ? Number(editing!.order) : undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['love-story'] }); setEditing(null); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['love-story'] }),
  });

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Love Story</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700">
          <Plus size={15} /> Thêm sự kiện
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Thêm sự kiện mới</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Mốc thời gian (vd: Tháng 3, 2023)" value={form.dateLabel}
              onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <input placeholder="Tiêu đề" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <textarea placeholder="Mô tả" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" rows={3} />
            <input placeholder="Order" type="number" value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => addMut.mutate()} disabled={!form.dateLabel || !form.title || addMut.isPending}
              className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50">
              {addMut.isPending ? 'Đang thêm...' : 'Thêm'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Huỷ</button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-sm text-gray-500">Đang tải...</p> : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-5">
              {editing?.id === ev.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={editing.dateLabel} onChange={(e) => setEditing((x) => x && { ...x, dateLabel: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    <input value={editing.title} onChange={(e) => setEditing((x) => x && { ...x, title: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    <textarea value={editing.description} onChange={(e) => setEditing((x) => x && { ...x, description: e.target.value })}
                      className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" rows={3} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => updateMut.mutate()} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Check size={15} /></button>
                    <button onClick={() => setEditing(null)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg"><X size={15} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{ev.dateLabel}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{ev.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{ev.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditing({ id: ev.id, dateLabel: ev.dateLabel, title: ev.title, description: ev.description, order: String(ev.order) })}
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm('Xoá sự kiện này?')) deleteMut.mutate(ev.id); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
