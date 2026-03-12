'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllWeddings, publishWedding, unpublishWedding } from '@/lib/api/weddings';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function WeddingsPage() {
  const qc = useQueryClient();
  const { data: weddings = [], isLoading } = useQuery({ queryKey: ['weddings'], queryFn: getAllWeddings });

  const toggleMut = useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      published ? unpublishWedding(id) : publishWedding(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weddings'] }),
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Weddings</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <p className="p-5 text-sm text-gray-500">Đang tải...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Couple</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Slug</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Owner</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Ngày cưới</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {weddings.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{w.coupleName}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{w.slug}</td>
                  <td className="px-5 py-3 text-gray-500">{w.owner?.email}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(w.eventDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleMut.mutate({ id: w.id, published: w.isPublished })}
                      disabled={toggleMut.isPending}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        w.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {w.isPublished ? 'Published' : 'Unpublished'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/weddings/${w.id}`} className="text-gray-400 hover:text-gray-700">
                      <ExternalLink size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
