import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { HomeModernIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate     = useNavigate();
    const [step, setStep]   = useState(1);
    const [role, setRole]   = useState('');
    const [form, setForm]   = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const user = await register({ ...form, role });
            if (user.role === 'agent') navigate('/agent');
            else navigate('/');
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <HomeModernIcon className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold">Prop<span className="text-blue-600">Space</span></span>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">Buat akun baru</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {step === 1 ? (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Daftar sebagai?</h2>
                            <p className="text-sm text-gray-500 mb-6">Pilih peran yang sesuai</p>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { value: 'buyer', label: 'Pembeli', desc: 'Cari & simpan properti favorit', emoji: '🏠' },
                                    { value: 'agent', label: 'Agen',    desc: 'Posting & kelola listing properti', emoji: '💼' },
                                ].map(r => (
                                    <button
                                        key={r.value}
                                        onClick={() => setRole(r.value)}
                                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                                            role === r.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <p className="text-3xl mb-2">{r.emoji}</p>
                                        <p className="font-semibold text-gray-900 text-sm">{r.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!role}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 text-sm"
                            >
                                Lanjutkan →
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 text-sm">←</button>
                                <h2 className="text-lg font-bold text-gray-900">Lengkapi Data Diri</h2>
                                <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{role}</span>
                            </div>
                            {[
                                { key: 'name',  label: 'Nama Lengkap', type: 'text',     placeholder: 'Nama Anda' },
                                { key: 'email', label: 'Email',        type: 'email',    placeholder: 'email@contoh.com' },
                                { key: 'phone', label: 'No. HP (opsional)', type: 'tel', placeholder: '08xxxxxxxxxx' },
                                { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 karakter' },
                                { key: 'password_confirmation', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={form[f.key]}
                                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        required={f.key !== 'phone'}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key][0]}</p>}
                                </div>
                            ))}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm"
                            >
                                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
