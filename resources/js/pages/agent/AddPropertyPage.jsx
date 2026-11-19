import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const INITIAL = {
    title: '', description: '', price: '', listing_type: 'sell',
    category_id: '', address: '', city: '', province: '',
    latitude: '', longitude: '', bedrooms: '', bathrooms: '',
    land_area: '', building_area: '',
};

export default function AddPropertyPage() {
    const navigate          = useNavigate();
    const [form, setForm]   = useState(INITIAL);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        if (errors[name]) setErrors(e => { const n = { ...e }; delete n[name]; return n; });
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        const total = images.length + files.length;
        if (total > 10) { alert('Maksimal 10 gambar.'); return; }
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (i) => {
        URL.revokeObjectURL(previews[i]);
        setImages(prev => prev.filter((_, idx) => idx !== i));
        setPreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) { setErrors({ images: ['Minimal 1 gambar diperlukan.'] }); return; }
        setLoading(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v));
        images.forEach(img => fd.append('images[]', img));
        try {
            await api.post('/properties', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/agent/properties');
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
        } finally { setLoading(false); }
    };

    const Field = ({ label, name, type = 'text', required = true, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
            <input
                type={type} name={name} value={form[name]}
                onChange={handleChange} required={required}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...props}
            />
            {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name][0]}</p>}
        </div>
    );

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tambah Properti Baru</h1>
                <p className="text-gray-500 text-sm mt-1">Properti akan ditinjau admin sebelum ditampilkan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info Dasar */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Informasi Dasar</h2>
                    <Field label="Judul Properti" name="title" placeholder="cth: Rumah Minimalis Modern di Kebayoran" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                        <textarea
                            name="description" rows={5} value={form.description}
                            onChange={handleChange} required
                            placeholder="Deskripsikan keunggulan properti Anda..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Listing *</label>
                            <select name="listing_type" value={form.listing_type} onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="sell">Dijual</option>
                                <option value="rent">Disewa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                            <select name="category_id" value={form.category_id} onChange={handleChange} required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="">Pilih kategori</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                            </select>
                            {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id[0]}</p>}
                        </div>
                    </div>
                    <Field label="Harga (Rp)" name="price" type="number" placeholder="cth: 1500000000" min="0" />
                </div>

                {/* Lokasi */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Lokasi</h2>
                    <Field label="Alamat Lengkap" name="address" placeholder="Jl. Contoh No. 123" />
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Kota" name="city" placeholder="Jakarta Selatan" />
                        <Field label="Provinsi" name="province" placeholder="DKI Jakarta" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Latitude" name="latitude" type="number" required={false} placeholder="-6.2088" step="any" />
                        <Field label="Longitude" name="longitude" type="number" required={false} placeholder="106.8456" step="any" />
                    </div>
                    <p className="text-xs text-gray-400">💡 Cari koordinat di <a href="https://www.openstreetmap.org" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenStreetMap</a>, klik kanan → "Tampilkan Alamat"</p>
                </div>

                {/* Spesifikasi */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Spesifikasi</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field label="Kamar Tidur" name="bedrooms" type="number" min="0" placeholder="0" />
                        <Field label="Kamar Mandi" name="bathrooms" type="number" min="0" placeholder="0" />
                        <Field label="Luas Tanah (m²)" name="land_area" type="number" min="0" placeholder="0" />
                        <Field label="Luas Bangunan (m²)" name="building_area" type="number" min="0" placeholder="0" />
                    </div>
                </div>

                {/* Upload Gambar */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Foto Properti *</h2>
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Maks. 2MB per file, 10 gambar</p>
                        <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                    </label>
                    {errors.images && <p className="text-xs text-red-500 mt-2">{errors.images[0]}</p>}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {previews.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    {i === 0 && (
                                        <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 text-white text-[10px] text-center py-0.5">
                                            Utama
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/agent/properties')}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan & Submit untuk Review'}
                    </button>
                </div>
            </form>
        </div>
    );
}
