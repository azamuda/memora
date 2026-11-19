import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import PropertyCard from '@/components/PropertyCard';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function PropertiesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [meta, setMeta]             = useState(null);
    const [loading, setLoading]       = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [categories, setCategories] = useState([]);

    const [filters, setFilters] = useState({
        search:       searchParams.get('search')      || '',
        listing_type: searchParams.get('listing_type')|| '',
        category_id:  searchParams.get('category_id') || '',
        city:         searchParams.get('city')        || '',
        min_price:    searchParams.get('min_price')   || '',
        max_price:    searchParams.get('max_price')   || '',
        bedrooms:     searchParams.get('bedrooms')    || '',
        page:         searchParams.get('page')        || 1,
    });

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        const params = Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== '' && v != null)
        );
        try {
            const { data } = await api.get('/properties', { params });
            setProperties(data.data);
            setMeta(data.meta ?? { current_page: data.current_page, last_page: data.last_page, total: data.total });
        } catch (_) {}
        finally { setLoading(false); }
    }, [filters]);

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data));
    }, []);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);

    const applyFilter = (key, value) => {
        setFilters(f => ({ ...f, [key]: value, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({ search: '', listing_type: '', category_id: '', city: '', min_price: '', max_price: '', bedrooms: '', page: 1 });
        setSearchParams({});
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Semua Properti</h1>

            {/* Filter bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Cari nama, kota..."
                            value={filters.search}
                            onChange={e => applyFilter('search', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <select
                        value={filters.listing_type}
                        onChange={e => applyFilter('listing_type', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="sell">Dijual</option>
                        <option value="rent">Disewa</option>
                    </select>
                    <select
                        value={filters.category_id}
                        onChange={e => applyFilter('category_id', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Harga Min"
                        value={filters.min_price}
                        onChange={e => applyFilter('min_price', e.target.value)}
                        className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="number"
                        placeholder="Harga Max"
                        value={filters.max_price}
                        onChange={e => applyFilter('max_price', e.target.value)}
                        className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        value={filters.bedrooms}
                        onChange={e => applyFilter('bedrooms', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Kamar Tidur</option>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ KT</option>)}
                    </select>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Result count */}
            {meta && (
                <p className="text-sm text-gray-500 mb-4">
                    Menampilkan {properties.length} dari {meta.total} properti
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                            <div className="aspect-[4/3] bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-5xl mb-4">🏘️</p>
                    <p className="text-gray-500">Tidak ada properti ditemukan.</p>
                    <button onClick={resetFilters} className="mt-4 text-blue-600 hover:underline text-sm">Reset filter</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    {[...Array(meta.last_page)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                            className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                                (meta.current_page || filters.page) === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
