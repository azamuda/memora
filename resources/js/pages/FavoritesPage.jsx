import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import PropertyCard from '@/components/PropertyCard';

export default function FavoritesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        api.get('/favorites')
            .then(r => setProperties(r.data.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    const handleFavoriteToggle = (id, favorited) => {
        if (!favorited) setProperties(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">❤️ Properti Favorit</h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-6xl mb-4">💔</p>
                    <p className="text-gray-500 text-lg mb-2">Belum ada properti favorit</p>
                    <p className="text-gray-400 text-sm mb-6">Klik ikon hati di properti mana saja untuk menyimpannya di sini.</p>
                    <Link to="/properties" className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">
                        Jelajahi Properti
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(p => (
                        <PropertyCard
                            key={p.id}
                            property={{ ...p, is_favorited: true }}
                            onFavoriteToggle={handleFavoriteToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
