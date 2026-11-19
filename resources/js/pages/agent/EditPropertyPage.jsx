import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api/axios';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function EditPropertyPage() {
    const { id }            = useParams();
    const navigate          = useNavigate();
    const [form, setForm]   = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [deleteImageIds, setDeleteImageIds] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors]         = useState({});
    const [loading, setLoading]       = useState(false);
    const [fetching, setFetching]     = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/my-properties?per_page=100`),
            api.get('/categories'),
        ]).then(([propRes, catRes]) => {
            const property = propRes.data.data?.find(p => p.id === parseInt(id));
            if (!property) { navigate('/agent/properties'); return; }
            setForm({
                title: property.title, description: property.description,
                price: property.price, listing_type: property.listing_type,
                category_id: property.category_id, address: property.address,
                city: property.city, province: property.province,
                latitude: property.latitude || '', longitude: property.longitude || '',
                bedrooms: property.bedrooms, bathrooms: property.bathrooms,
                land_area: property.land_area, building_area: property.building_area,
            });
            setExistingImages(property.images || []);
            setCategories(catRes.data);
        }).finally(() => setFetching(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const toggleDeleteImage = (imgId) => {
        setDeleteImageIds(prev =>
            prev.includes(imgId) ? prev.filter(x => x !== imgId) : [...prev, imgId]
        );
    };

    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
        setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData();
        fd.append('_method', 'PUT');
        Object.entries(form).forEach(([k, v]) => v !== '' && v != null && fd.append(k, v));
        deleteImageIds.forEach(imgId => fd.append('delete_image_ids[]', imgId));
        newImages.forEach(img => fd.append('new_images[]', img));
        try {
            await api.post(`/properties/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/agent/properties');
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
        } finally { setLoading(false); }
    };

    if (fetching) return <div className="animate-pulse p-8 text-gray-400 text-center">Memuat data...</div>;
    if (!form)    return null;

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Properti</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info Dasar */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Informasi Dasar</h2>
                    {[
                        { label: 'Judul', name: 'title', type: 'text' },
                        { label: 'Harga (Rp)', name: 'price', type: 'number' },
                    ].map(f => (
                        <div key={f.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                            <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            {errors[f.name] && <p className="text-xs text-red-500 mt-1">{errors[f.name][0]}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea name="description" rows={5} value={form.description} onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Listing</label>
                            <select name="listing_type" value={form.listing_type} onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="sell">Dijual</option>
                                <option value="rent">Disewa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select name="category_id" value={form.category_id} onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Spesifikasi */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Spesifikasi & Lokasi</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['bedrooms','bathrooms','land_area','building_area'].map(name => (
                            <div key={name}>
                                <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                                    {name.replace('_', ' ')}
                                </label>
                                <input type="number" name={name} value={form[name]} onChange={handleChange} min="0"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['address','city','province'].map(name => (
                            <div key={name}>
                                <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{name}</label>
                                <input type="text" name={name} value={form[name]} onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-2">
                            {['latitude','longitude'].map(name => (
                                <div key={name}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{name}</label>
                                    <input type="number" name={name} value={form[name]} onChange={handleChange} step="any"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kelola Foto */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Kelola Foto</h2>
                    {existingImages.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Foto saat ini (klik untuk tandai hapus)</p>
                            <div className="grid grid-cols-5 gap-2">
                                {existingImages.map(img => (
                                    <div
                                        key={img.id}
                                        onClick={() => toggleDeleteImage(img.id)}
                                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                                            deleteImageIds.includes(img.id)
                                                ? 'ring-2 ring-red-500 opacity-50'
                                                : 'ring-2 ring-transparent hover:ring-gray-300'
                                        }`}
                                    >
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                        {deleteImageIds.includes(img.id) && (
                                            <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                                                <XMarkIcon className="w-6 h-6 text-red-700" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {deleteImageIds.length > 0 && (
                                <p className="text-xs text-red-500 mt-2">{deleteImageIds.length} foto akan dihapus saat disimpan.</p>
                            )}
                        </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <PhotoIcon className="w-7 h-7 text-gray-400 mb-1" />
                        <p className="text-sm text-gray-500">Tambah foto baru</p>
                        <input type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" />
                    </label>
                    {newPreviews.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 mt-3">
                            {newPreviews.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate('/agent/properties')}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Batal
                    </button>
                    <button type="submit" disabled={loading}
                        className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
