import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#242720] text-white py-10 sm:py-12 border-t border-[#34382F]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Baris tunggal 3 elemen (kiri-tengah-kanan) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Kiri: Logo & wordmark "memora" (putih) */}
          <div className="flex items-center">
            <Logo variant="light" size="md" />
          </div>

          {/* Tengah: Tagline serif italic "Setiap momen punya tempat untuk kembali." */}
          <div className="text-center">
            <p className="font-display italic text-base sm:text-lg text-[#CACCC4] font-normal tracking-wide">
              “Setiap momen punya tempat untuk kembali.”
            </p>
          </div>

          {/* Kanan: "© 2025 Memora" */}
          <div className="text-sm font-sans text-[#9EA199]">
            <span>© 2025 Memora</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
