import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

function formatPrice(price) {
    const n = Number(price);
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
    if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function AdminProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [filter, setFilter]         = useState('pending');

    useEffect(() => {
        setLoading(true);
        api.get('/admin/properties')
            .then(r => setProperties(r.data.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    const approve = async (id) => {
        await api.patch(`/admin/properties/${id}/approve`);
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    };

    const reject = async (id) => {
        await api.patch(`/admin/properties/${id}/reject`);
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    };

    const destroy = async (id) => {
        if (!window.confirm('Hapus permanen properti ini?')) return;
        await api.delete(`/admin/properties/${id}`);
        setProperties(prev => prev.filter(p => p.id !== id));
    };

    const filtered = filter === 'all' ? properties : properties.filter(p => p.status === filter);

    const statusBadge = (status) => ({
        approved: <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Aktif</span>,
        pending:  <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">Menunggu</span>,
        rejected: <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">Ditolak</span>,
    }[status] || null);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kelola Properti</h1>
                <div className="flex gap-2">
                    {['all','pending','approved','rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}>
                            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : f === 'approved' ? 'Aktif' : 'Ditolak'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 animate-pulse">Memuat...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-2">🏘️</p>
                        <p className="text-sm">Tidak ada properti dengan status ini</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Properti</th>
                                    <th className="px-4 py-3 text-left">Agen</th>
                                    <th className="px-4 py-3 text-left">Harga</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.title}</p>
                                            <p className="text-xs text-gray-400">{p.city}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-gray-700">{p.user?.name}</p>
                                            <p className="text-xs text-gray-400">{p.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-blue-600">{formatPrice(p.price)}</td>
                                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {p.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => approve(p.id)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Setujui">
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => reject(p.id)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Tolak">
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {p.status === 'rejected' && (
                                                    <button onClick={() => approve(p.id)}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-xs font-medium px-2">
                                                        Aktifkan
                                                    </button>
                                                )}
                                                <button onClick={() => destroy(p.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
