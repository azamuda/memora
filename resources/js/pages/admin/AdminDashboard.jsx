import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { UsersIcon, BuildingOffice2Icon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function StatCard({ label, value, icon: Icon, color, link }) {
    const content = (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
    return link ? <Link to={link}>{content}</Link> : content;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Pengguna"       value={stats?.total_users}      icon={UsersIcon}            color="bg-blue-500"   link="/admin/users" />
                <StatCard label="Agen Terdaftar"       value={stats?.total_agents}     icon={UsersIcon}            color="bg-indigo-500" link="/admin/users" />
                <StatCard label="Total Properti"       value={stats?.total_properties} icon={BuildingOffice2Icon}  color="bg-teal-500"   link="/admin/properties" />
                <StatCard label="Menunggu Persetujuan" value={stats?.pending_approval} icon={ClockIcon}            color="bg-yellow-500" link="/admin/properties" />
                <StatCard label="Properti Aktif"       value={stats?.approved}         icon={CheckCircleIcon}      color="bg-green-500"  link="/admin/properties" />
                <StatCard label="Total Inquiry"        value={stats?.total_inquiries}  icon={BuildingOffice2Icon}  color="bg-orange-500" />
            </div>

            {stats?.pending_approval > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-yellow-800">⚠️ Ada {stats.pending_approval} properti menunggu persetujuan</p>
                        <p className="text-sm text-yellow-600 mt-0.5">Tinjau dan setujui listing dari agen.</p>
                    </div>
                    <Link to="/admin/properties"
                        className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex-shrink-0">
                        Tinjau Sekarang
                    </Link>
                </div>
            )}
        </div>
    );
}
