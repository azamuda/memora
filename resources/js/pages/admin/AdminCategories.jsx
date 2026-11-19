import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm]   = useState({ name: '', slug: '', icon: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);

    useEffect(() => {
        api.get('/categories')
            .then(r => setCategories(r.data))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.post('/admin/categories', form);
            setCategories(prev => [...prev, data]);
            setForm({ name: '', slug: '', icon: '' });
        } catch (_) { alert('Gagal menyimpan kategori.'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus kategori ini?')) return;
        await api.delete(`/admin/categories/${id}`);
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Kategori</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Add form */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Tambah Kategori Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {[
                            { label: 'Nama', key: 'name', placeholder: 'cth: Kondominium' },
                            { label: 'Slug', key: 'slug', placeholder: 'cth: kondominium' },
                            { label: 'Ikon (emoji)', key: 'icon', placeholder: '🏠' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                                <input
                                    type="text"
                                    value={form[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                        <button type="submit" disabled={saving}
                            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                            <PlusIcon className="w-4 h-4" />
                            {saving ? 'Menyimpan...' : 'Tambah Kategori'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400 animate-pulse">Memuat...</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Kategori</th>
                                    <th className="px-4 py-3 text-left">Slug</th>
                                    <th className="px-4 py-3 text-left">Properti</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categories.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-xl mr-2">{c.icon}</span>
                                            <span className="font-medium text-gray-900">{c.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                                        <td className="px-4 py-3 text-gray-500">{c.properties_count ?? 0}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleDelete(c.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
