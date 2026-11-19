import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '@/api/axios';
import PropertyCard from '@/components/PropertyCard';

export default function HomePage() {
    const navigate           = useNavigate();
    const [search, setSearch] = useState('');
    const [listingType, setListingType] = useState('');
    const [properties, setProperties] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/properties?per_page=6'),
            api.get('/categories'),
        ]).then(([propRes, catRes]) => {
            setProperties(propRes.data.data ?? []);
            setCategories(catRes.data);
        }).finally(() => setLoading(false));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search)      params.set('search', search);
        if (listingType) params.set('listing_type', listingType);
        navigate(`/properties?${params.toString()}`);
    };

    return (
        <div>
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                        Temukan Properti <span className="text-yellow-300">Impian</span> Anda
                    </h1>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                        Ribuan listing rumah, apartemen, dan tanah di seluruh Indonesia tersedia di PropSpace.
                    </p>

                    {/* Search box */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari kota, kecamatan, atau nama properti..."
                            className="flex-1 px-4 py-3 text-gray-800 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={listingType}
                            onChange={e => setListingType(e.target.value)}
                            className="px-4 py-3 text-gray-700 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="sell">Dijual</option>
                            <option value="rent">Disewa</option>
                        </select>
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                            Cari
                        </button>
                    </form>

                    {/* Stats */}
                    <div className="flex justify-center gap-10 mt-10 text-sm text-blue-100">
                        <div><span className="text-2xl font-bold text-white">1.000+</span><br />Properti</div>
                        <div><span className="text-2xl font-bold text-white">500+</span><br />Agen Aktif</div>
                        <div><span className="text-2xl font-bold text-white">50+</span><br />Kota</div>
                    </div>
                </div>
            </section>

            {/* Kategori */}
            <section className="max-w-7xl mx-auto px-4 py-14">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategori Properti</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => navigate(`/properties?category_id=${cat.id}`)}
                            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <span className="text-3xl">{cat.icon}</span>
                            <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                            <span className="text-xs text-gray-400">{cat.properties_count}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Listing Terbaru */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Properti Terbaru</h2>
                    <button
                        onClick={() => navigate('/properties')}
                        className="text-sm text-blue-600 font-medium hover:underline"
                    >
                        Lihat semua →
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map(p => (
                            <PropertyCard key={p.id} property={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Agen */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Punya properti untuk dijual atau disewakan?</h2>
                    <p className="text-blue-100 mb-8">Daftarkan diri sebagai agen dan listing properti Anda secara gratis.</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Daftar Sebagai Agen
                    </button>
                </div>
            </section>
        </div>
    );
}
