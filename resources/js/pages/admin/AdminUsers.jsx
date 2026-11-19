import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AdminUsers() {
    const [users, setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/users')
            .then(r => setUsers(r.data.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    const changeRole = async (id, role) => {
        await api.patch(`/admin/users/${id}/role`, { role });
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Hapus user ini?')) return;
        await api.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const roleBadge = (role) => ({
        admin: <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">Admin</span>,
        agent: <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">Agen</span>,
        buyer: <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">Pembeli</span>,
    }[role]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Pengguna</h1>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 animate-pulse">Memuat...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Pengguna</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-left">Properti</th>
                                    <th className="px-4 py-3 text-left">Bergabung</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                                    {u.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{u.name}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{roleBadge(u.role)}</td>
                                        <td className="px-4 py-3 text-gray-500">{u.properties_count}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(u.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    value={u.role}
                                                    onChange={e => changeRole(u.id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                >
                                                    <option value="buyer">Pembeli</option>
                                                    <option value="agent">Agen</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button onClick={() => deleteUser(u.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
