import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

function formatPrice(price) {
    const n = Number(price);
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
    if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function AgentProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [deleting, setDeleting]     = useState(null);

    useEffect(() => {
        api.get('/my-properties?per_page=50')
            .then(r => setProperties(r.data.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus properti ini?')) return;
        setDeleting(id);
        try {
            await api.delete(`/properties/${id}`);
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (_) { alert('Gagal menghapus.'); }
        finally { setDeleting(null); }
    };

    const statusBadge = (status) => ({
        approved: <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Aktif</span>,
        pending:  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Menunggu</span>,
        rejected: <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Ditolak</span>,
    }[status]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Properti Saya</h1>
                <Link to="/agent/properties/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" /> Tambah
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 animate-pulse">Memuat...</div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-3">📭</p>
                        <p className="text-gray-500 mb-4">Belum ada listing</p>
                        <Link to="/agent/properties/add" className="text-blue-600 text-sm hover:underline">Tambah properti pertama →</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Properti</th>
                                    <th className="px-4 py-3 text-left">Harga</th>
                                    <th className="px-4 py-3 text-left">Tipe</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Views</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {properties.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {p.images?.[0]?.image_url
                                                        ? <img src={p.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full flex items-center justify-center text-gray-300">🏠</div>
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 truncate max-w-[180px]">{p.title}</p>
                                                    <p className="text-xs text-gray-400">{p.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-blue-600">{formatPrice(p.price)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                p.listing_type === 'sell' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {p.listing_type === 'sell' ? 'Dijual' : 'Disewa'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                                        <td className="px-4 py-3 text-gray-500">👁 {p.views_count}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/agent/properties/${p.id}/edit`}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    disabled={deleting === p.id}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                >
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
