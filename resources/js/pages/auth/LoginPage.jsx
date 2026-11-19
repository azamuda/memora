import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { HomeModernIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const { login }   = useAuth();
    const navigate    = useNavigate();
    const location    = useLocation();
    const from        = location.state?.from?.pathname || '/';

    const [form, setForm]   = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(form.email, form.password);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'agent') navigate('/agent');
            else navigate(from);
        } catch (err) {
            setError(err.response?.data?.message || 'Email atau password salah.');
        } finally { setLoading(false); }
    };

    const fillDemo = (role) => {
        const demos = {
            admin: { email: 'admin@propspace.id', password: 'password' },
            agent: { email: 'agen@propspace.id',  password: 'password' },
            buyer: { email: 'buyer@propspace.id', password: 'password' },
        };
        setForm(demos[role]);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <HomeModernIcon className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold">Prop<span className="text-blue-600">Space</span></span>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">Masuk ke akun Anda</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {/* Demo logins */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-2 text-center">Demo login cepat:</p>
                        <div className="flex gap-2">
                            {['admin','agent','buyer'].map(r => (
                                <button key={r} onClick={() => fillDemo(r)}
                                    className="flex-1 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors capitalize">
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="email@contoh.com"
                                required
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 pr-11 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm"
                        >
                            {loading ? 'Memuat...' : 'Masuk'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
