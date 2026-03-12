'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGallery, addPhoto, updatePhoto, deletePhoto } from '@/lib/api/gallery';
import { uploadImage } from '@/lib/api/upload';
import { useState, useRef } from 'react';
import { Plus, Trash2, Pencil, Check, X, ImagePlus } from 'lucide-react';
import type { GalleryPhoto } from '@/types';
import Image from 'next/image';

export default function GalleryPage() {
  const qc = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({ queryKey: ['gallery'], queryFn: getGallery });

  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [order, setOrder] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAlt, setEditAlt] = useState('');
  const [editOrder, setEditOrder] = useState('');

  const addMut = useMutation({
    mutationFn: async () => {
      if (!selectedFile) return;
      setUploading(true);
      const url = await uploadImage(selectedFile);
      setUploading(false);
      await addPhoto({ imageUrl: url, alt: alt || undefined, order: order ? Number(order) : undefined });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery'] });
      setShowForm(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setAlt('');
      setOrder('');
    },
    onError: () => setUploading(false),
  });

  const updateMut = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      updatePhoto(id, { alt: editAlt || undefined, order: editOrder ? Number(editOrder) : undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gallery'] }); setEditingId(null); },
  });

  const deleteMut = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleCancelForm() {
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setAlt('');
    setOrder('');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Gallery</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700"
        >
          <Plus size={15} /> Thêm ảnh
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Thêm ảnh mới</h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-colors overflow-hidden"
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="preview" fill className="object-cover" unoptimized />
            ) : (
              <>
                <ImagePlus size={28} className="text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Nhấn để chọn ảnh</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="Order (số)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              type="number"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <input
              placeholder="Alt text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addMut.mutate()}
              disabled={!selectedFile || addMut.isPending}
              className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
            >
              {uploading ? 'Đang tải ảnh lên...' : addMut.isPending ? 'Đang thêm...' : 'Thêm'}
            </button>
            <button
              onClick={handleCancelForm}
              className="px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-sm text-gray-500">Đang tải...</p> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                <Image src={p.imageUrl} alt={p.alt ?? ''} fill className="object-cover" unoptimized />
              </div>
              <div className="p-3">
                {editingId === p.id ? (
                  <div className="space-y-2">
                    <input value={editAlt} onChange={(e) => setEditAlt(e.target.value)} placeholder="Alt"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-rose-300" />
                    <input value={editOrder} onChange={(e) => setEditOrder(e.target.value)} placeholder="Order" type="number"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-rose-300" />
                    <div className="flex gap-1">
                      <button onClick={() => updateMut.mutate({ id: p.id })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={13} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded"><X size={13} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 truncate">{p.alt || '—'}</p>
                      <p className="text-xs text-gray-400">#{p.order}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingId(p.id); setEditAlt(p.alt ?? ''); setEditOrder(String(p.order)); }}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded"><Pencil size={13} /></button>
                      <button onClick={() => { if (confirm('Xoá ảnh này?')) deleteMut.mutate(p.id); }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 size={13} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
