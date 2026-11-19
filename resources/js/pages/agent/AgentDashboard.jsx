import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import {
    BuildingOffice2Icon, EyeIcon, ChatBubbleLeftRightIcon,
    ClockIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';

function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}

export default function AgentDashboard() {
    const { user }         = useAuth();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/agent/stats'),
            api.get('/my-properties?per_page=5'),
        ]).then(([s, p]) => {
            setStats(s.data);
            setRecent(p.data.data ?? []);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {user?.name} 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Berikut ringkasan aktivitas Anda</p>
                </div>
                <Link
                    to="/agent/properties/add"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    Tambah Properti
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Properti"   value={stats?.total_properties} icon={BuildingOffice2Icon} color="bg-blue-500" />
                    <StatCard label="Disetujui"         value={stats?.approved}         icon={BuildingOffice2Icon} color="bg-green-500" />
                    <StatCard label="Total Views"       value={stats?.total_views}       icon={EyeIcon}            color="bg-purple-500" />
                    <StatCard label="Pesan Masuk"       value={stats?.total_inquiries}   icon={ChatBubbleLeftRightIcon} color="bg-orange-500" />
                </div>
            )}

            {/* Recent listings */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Listing Terbaru</h2>
                    <Link to="/agent/properties" className="text-sm text-blue-600 hover:underline">Lihat semua</Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {recent.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-4xl mb-2">📭</p>
                            <p className="text-sm">Belum ada listing</p>
                        </div>
                    ) : recent.map(p => (
                        <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                            <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {p.images?.[0]?.image_url
                                    ? <img src={p.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🏠</div>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{p.title}</p>
                                <p className="text-xs text-gray-500">{p.city}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    p.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {p.status === 'approved' ? 'Aktif' : p.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                                </span>
                                <p className="text-xs text-gray-400 mt-1">👁 {p.views_count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
