import React, { useState } from 'react';
import { Logo } from '../Logo';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccessLogin: (userData: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('Alya Putri');
  const [email, setEmail] = useState('alya.putri@email.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessLogin({
      name: mode === 'register' ? (name || 'Alya Putri') : 'Alya Putri',
      email: email || 'alya.putri@email.com',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Dialog Card: Split Screen as seen in User Image 3 */}
      <div className="relative w-full max-w-4xl bg-[#FBFAF6] rounded-[8px] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px] border border-[#E4DEC3]/80">
        
        {/* ================= Kolom Kiri: Dark Olive Pane (#242720) ================= */}
        <div className="md:col-span-6 bg-[#242720] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute top-20 right-0 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />

          {/* Header left: Logo Memora */}
          <div className="flex items-center justify-between z-10">
            <Logo variant="light" size="md" />
            <button
              onClick={onClose}
              className="md:hidden text-white/70 hover:text-white p-1 rounded-full bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collage of Polaroid photos in Dark Pane (as in image 3) */}
          <div className="relative my-8 sm:my-10 h-64 sm:h-72 flex items-center justify-center">
            {/* Polaroid 1 (Large back) */}
            <div className="absolute top-0 right-2 w-56 sm:w-64 bg-white p-2.5 pb-6 rounded-xs shadow-2xl -rotate-[3deg] transition-transform hover:rotate-0 duration-300">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#242720]">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                  alt="Pantai & langit biru"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Polaroid 2 (Front overlapping left) */}
            <div className="absolute bottom-1 left-1 w-44 sm:w-52 bg-white p-2.5 pb-6 rounded-xs shadow-2xl rotate-[5deg] transition-transform hover:rotate-0 duration-300">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#242720]">
                <img
                  src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80"
                  alt="Sahabat di pantai"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom Quote in DM Serif Display */}
          <div className="z-10 mt-auto">
            <p className="font-display italic text-2xl sm:text-[26px] text-white leading-tight font-normal">
              “Momen terbaik selalu punya jalan untuk pulang.”
            </p>
          </div>
        </div>

        {/* ================= Kolom Kanan: Warm Cream Paper Form ================= */}
        <div className="md:col-span-6 bg-[#FBFAF6] p-8 sm:p-10 flex flex-col justify-between relative">
          {/* Close button on desktop */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 text-[#20231F]/50 hover:text-[#20231F] p-1 rounded-full hover:bg-[#EAE4D7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Eyebrow */}
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8703D] font-sans block mb-2">
              {mode === 'register' ? 'MULAI CERITAMU' : 'SELAMAT DATANG KEMBALI'}
            </span>

            {/* Title */}
            <h3 className="font-display text-3xl sm:text-[34px] text-[#20231F] leading-tight mb-2">
              {mode === 'register' ? (
                <>
                  Buat ruang untuk{' '}
                  <span className="italic text-[#E8703D] font-normal">setiap momen.</span>
                </>
              ) : (
                <>
                  Masuk ke{' '}
                  <span className="italic text-[#E8703D] font-normal">album ceritamu.</span>
                </>
              )}
            </h3>

            <p className="text-sm text-[#64665F] mb-6">
              {mode === 'register'
                ? 'Gratis selamanya. Tidak perlu kartu kredit.'
                : 'Buka kembali arsip momen indah yang telah tersimpan rapi.'}
            </p>

            {/* Google Social Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 px-4 bg-white border border-[#D9D3C5] hover:border-[#20231F] text-[#20231F] rounded-[5px] text-sm font-semibold flex items-center justify-center gap-3 shadow-xs hover:shadow transition-all mb-5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#E2DDD0] w-full" />
              <span className="bg-[#FBFAF6] px-3 text-xs text-[#8A8C84] uppercase font-medium absolute">
                atau dengan email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#20231F] mb-1.5">
                    Nama lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama kamu"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D3C5] focus:border-[#E8703D] focus:ring-1 focus:ring-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#20231F] mb-1.5">
                  Alamat email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9D3C5] focus:border-[#E8703D] focus:ring-1 focus:ring-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#20231F]">
                    Kata sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-[#64665F] hover:text-[#20231F] flex items-center gap-1"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9D3C5] focus:border-[#E8703D] focus:ring-1 focus:ring-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none transition-all"
                />
              </div>

              {mode === 'register' && (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 rounded accent-[#E8703D]"
                  />
                  <label htmlFor="terms" className="text-xs text-[#64665F] leading-tight">
                    Saya setuju dengan <a href="#" className="underline text-[#20231F]">Syarat</a> dan{' '}
                    <a href="#" className="underline text-[#20231F]">Kebijakan Privasi</a>.
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#22251F] hover:bg-[#343831] text-white text-sm font-semibold rounded-[5px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-3"
              >
                <span>{mode === 'register' ? 'Buat akun gratis' : 'Masuk sekarang'}</span>
                <span className="text-[#E8703D]">→</span>
              </button>
            </form>
          </div>

          {/* Toggle between Register & Login */}
          <div className="mt-6 pt-4 border-t border-[#EAE4D7] text-center text-xs text-[#64665F]">
            {mode === 'register' ? (
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#E8703D] hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            ) : (
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#E8703D] hover:underline"
                >
                  Daftar gratis
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
