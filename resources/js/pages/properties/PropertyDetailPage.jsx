import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import PropertyMap from '@/components/Map/PropertyMap';

function formatPrice(price) {
    const n = Number(price);
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`;
    if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function PropertyDetailPage() {
    const { slug }         = useParams();
    const { user }         = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [favorited, setFavorited] = useState(false);
    const [inquiry, setInquiry]   = useState({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
    const [sending, setSending]   = useState(false);
    const [sent, setSent]         = useState(false);
    const [errors, setErrors]     = useState({});

    useEffect(() => {
        setLoading(true);
        api.get(`/properties/${slug}`)
            .then(r => { setProperty(r.data); setFavorited(r.data.is_favorited ?? false); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    const handleFavorite = async () => {
        if (!user) { window.location.href = '/login'; return; }
        const { data } = await api.post(`/favorites/${property.id}/toggle`);
        setFavorited(data.favorited);
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        setSending(true);
        setErrors({});
        try {
            await api.post(`/properties/${property.id}/inquiries`, inquiry);
            setSent(true);
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
        } finally { setSending(false); }
    };

    if (loading) return (
        <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-6" />
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
        </div>
    );

    if (!property) return (
        <div className="text-center py-32">
            <p className="text-5xl mb-4">🏚️</p>
            <p className="text-gray-600">Properti tidak ditemukan.</p>
            <Link to="/properties" className="mt-4 inline-block text-blue-600 hover:underline">← Kembali</Link>
        </div>
    );

    const images = property.images || [];
    const currentImage = images[activeImg]?.image_url || `https://placehold.co/900x500/e2e8f0/94a3b8?text=PropSpace`;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-blue-600">Beranda</Link>
                <span className="mx-2">›</span>
                <Link to="/properties" className="hover:text-blue-600">Properti</Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900">{property.title}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Gambar + Detail */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Gallery */}
                    <div>
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                            <img src={currentImage} alt={property.title} className="w-full h-full object-cover" />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImg(i)}
                                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                            i === activeImg ? 'border-blue-500' : 'border-transparent'
                                        }`}
                                    >
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title & Price */}
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        property.listing_type === 'sell' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {property.listing_type === 'sell' ? 'Dijual' : 'Disewa'}
                                    </span>
                                    {property.category && (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                            {property.category.icon} {property.category.name}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                                <p className="text-3xl font-extrabold text-blue-600 mt-2">{formatPrice(property.price)}</p>
                            </div>
                            <button onClick={handleFavorite} className="flex-shrink-0 p-2.5 rounded-xl border border-gray-200 hover:bg-red-50 transition-colors">
                                {favorited ? <HeartSolid className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-gray-400" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 mt-3 text-sm">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{property.address}, {property.city}, {property.province}</span>
                        </div>
                    </div>

                    {/* Spesifikasi */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <h2 className="font-semibold text-gray-900 mb-4">Spesifikasi</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {property.bedrooms > 0 && (
                                <div className="text-center">
                                    <p className="text-2xl mb-1">🛏</p>
                                    <p className="text-lg font-bold text-gray-900">{property.bedrooms}</p>
                                    <p className="text-xs text-gray-500">Kamar Tidur</p>
                                </div>
                            )}
                            {property.bathrooms > 0 && (
                                <div className="text-center">
                                    <p className="text-2xl mb-1">🚿</p>
                                    <p className="text-lg font-bold text-gray-900">{property.bathrooms}</p>
                                    <p className="text-xs text-gray-500">Kamar Mandi</p>
                                </div>
                            )}
                            {property.land_area > 0 && (
                                <div className="text-center">
                                    <p className="text-2xl mb-1">📏</p>
                                    <p className="text-lg font-bold text-gray-900">{property.land_area} m²</p>
                                    <p className="text-xs text-gray-500">Luas Tanah</p>
                                </div>
                            )}
                            {property.building_area > 0 && (
                                <div className="text-center">
                                    <p className="text-2xl mb-1">📐</p>
                                    <p className="text-lg font-bold text-gray-900">{property.building_area} m²</p>
                                    <p className="text-xs text-gray-500">Luas Bangunan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <h2 className="font-semibold text-gray-900 mb-3">Deskripsi</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                    </div>

                    {/* Peta */}
                    {(property.latitude && property.longitude) && (
                        <div>
                            <h2 className="font-semibold text-gray-900 mb-3">Lokasi di Peta</h2>
                            <PropertyMap
                                properties={[property]}
                                center={[property.latitude, property.longitude]}
                                zoom={15}
                                height="350px"
                            />
                        </div>
                    )}
                </div>

                {/* Right: Agent + Inquiry */}
                <div className="space-y-6">
                    {/* Info Agen */}
                    {property.user && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h2 className="font-semibold text-gray-900 mb-4">Info Agen</h2>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {property.user.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{property.user.name}</p>
                                    <p className="text-xs text-blue-600">Agen Terverifikasi ✓</p>
                                </div>
                            </div>
                            {property.user.phone && (
                                <a
                                    href={`https://wa.me/${property.user.phone.replace(/^0/, '62').replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors mb-2"
                                >
                                    <PhoneIcon className="w-4 h-4" /> Hubungi via WhatsApp
                                </a>
                            )}
                            <p className="text-xs text-gray-400 text-center">
                                👁 {property.views_count} kali dilihat
                            </p>
                        </div>
                    )}

                    {/* Form Inquiry */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="font-semibold text-gray-900 mb-4">Kirim Pesan ke Agen</h2>
                        {sent ? (
                            <div className="text-center py-6">
                                <p className="text-4xl mb-2">✅</p>
                                <p className="font-semibold text-green-700">Pesan Terkirim!</p>
                                <p className="text-xs text-gray-500 mt-1">Agen akan segera menghubungi Anda.</p>
                                <button onClick={() => setSent(false)} className="mt-3 text-xs text-blue-600 hover:underline">
                                    Kirim pesan lain
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInquiry} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Nama Anda"
                                        value={inquiry.name}
                                        onChange={e => setInquiry(i => ({ ...i, name: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email Anda"
                                        value={inquiry.email}
                                        onChange={e => setInquiry(i => ({ ...i, email: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Nomor HP (opsional)"
                                        value={inquiry.phone}
                                        onChange={e => setInquiry(i => ({ ...i, phone: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Tulis pesan Anda di sini..."
                                        rows={4}
                                        value={inquiry.message}
                                        onChange={e => setInquiry(i => ({ ...i, message: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                    />
                                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message[0]}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                                >
                                    {sending ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
