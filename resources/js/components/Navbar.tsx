import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onGoToDashboard?: () => void;
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onGoToDashboard,
  isLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7F3EB]/90 backdrop-blur-md border-b border-[#E7E2D5] shadow-xs py-3'
          : 'bg-[#F7F3EB] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Kiri: Logo */}
        <a href="#" className="flex items-center group">
          <Logo variant="dark" size="md" />
        </a>

        {/* Tengah: 3 link navigasi smooth-scroll */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-[#20231F]/80">
          <a
            href="#fitur"
            className="hover:text-[#E8703D] transition-colors relative py-1 hover:underline underline-offset-8 decoration-1"
          >
            Fitur
          </a>
          <a
            href="#cerita"
            className="hover:text-[#E8703D] transition-colors relative py-1 hover:underline underline-offset-8 decoration-1"
          >
            Cerita Kami
          </a>
          <a
            href="#harga"
            className="hover:text-[#E8703D] transition-colors relative py-1 hover:underline underline-offset-8 decoration-1"
          >
            Harga
          </a>
        </nav>

        {/* Kanan: Tombol Login & Daftar */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAE4D7] hover:bg-[#DDD6C5] text-[#20231F] text-xs font-semibold rounded-[5px] transition-all cursor-pointer mr-1"
              title="Ke Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#E8703D]" />
              <span>Dashboard</span>
            </button>
          )}
          <button
            onClick={() => onOpenAuth('login')}
            className="px-3.5 py-1.5 text-sm font-semibold text-[#20231F] hover:text-[#E8703D] transition-colors cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#22251F] hover:bg-[#343831] text-white text-sm font-semibold rounded-[5px] transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <span>Daftar</span>
            <span className="text-[#E8703D]">→</span>
          </button>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#20231F] hover:text-[#E8703D] rounded-md focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E2D5] bg-[#F7F3EB] px-6 py-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3 py-2 text-base font-medium text-[#20231F]">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E8703D]"
            >
              Fitur
            </a>
            <a
              href="#cerita"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E8703D]"
            >
              Cerita Kami
            </a>
            <a
              href="#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E8703D]"
            >
              Harga
            </a>
            <div className="pt-3 border-t border-[#E7E2D5] flex flex-col gap-2.5">
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToDashboard && onGoToDashboard();
                  }}
                  className="w-full text-center py-2 bg-[#EAE4D7] text-[#20231F] rounded-[5px] text-sm font-semibold flex items-center justify-center gap-2 mb-1"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#E8703D]" />
                  <span>Buka Dashboard</span>
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full text-center py-2.5 border border-[#DDD7C8] text-[#20231F] rounded-[5px] font-semibold text-sm hover:bg-[#EAE4D7] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full text-center py-2.5 bg-[#22251F] text-white rounded-[5px] text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Daftar</span>
                  <span className="text-[#E8703D]">→</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
