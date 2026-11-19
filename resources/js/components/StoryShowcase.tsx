import React from 'react';
import { Star, ArrowRight, Sparkles } from 'lucide-react';

interface StoryShowcaseProps {
  onOpenStory: () => void;
}

export const StoryShowcase: React.FC<StoryShowcaseProps> = ({ onOpenStory }) => {
  return (
    <section id="cerita" className="w-full py-20 md:py-28 lg:py-32 bg-[#F7F3EB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Bagian:
            - di kiri bawah terdapat label uppercase oranye kecil "CERITA YANG TERASA DEKAT"
            - sejajar dengan judul H2 rata kanan berukuran besar (~66px):
              "Bukan sekadar foto."
              "Ini adalah perjalananmu." (italic, warna #E8703D)
        */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="pb-2">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#E8703D] font-sans">
              CERITA YANG TERASA DEKAT
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-[66px] text-[#20231F] md:text-right leading-[1.05] tracking-tight">
            <span className="block">Bukan sekadar foto.</span>
            <span className="block italic text-[#E8703D] font-normal">
              Ini adalah perjalananmu.
            </span>
          </h2>
        </div>

        {/* Bento Grid 2 Kolom (~58% kiri, ~42% kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* ================= Kartu Kiri (~58% / 7 cols) =================
              Foto Besar Tinggi Penuh:
              - Foto sekelompok sahabat di pantai berbatu
              - Overlay gradient gelap di bagian bawah
              - Label uppercase "LIBURAN 2025"
              - Judul DM Serif Display putih "Hari di mana kita lupa waktu."
              - Tombol/link "Buka cerita →"
          */}
          <div className="lg:col-span-7 group relative min-h-[460px] sm:min-h-[520px] rounded-[5px] overflow-hidden shadow-polaroid cursor-pointer bg-[#20231F]">
            {/* Background Image: Sahabat di pantai berbatu */}
            <img
              src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&q=80"
              alt="Sekelompok sahabat di pantai berbatu"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark gradient overlay at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#20231F]/95 via-[#20231F]/40 to-transparent" />

            {/* Top badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold tracking-widest uppercase rounded-[4px] border border-white/20">
                SOROTAN UTAMA
              </span>
            </div>

            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9 z-10">
              <span className="block text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#F5D879] mb-2 font-sans">
                LIBURAN 2025
              </span>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight mb-5 drop-shadow-sm">
                Hari di mana kita lupa waktu.
              </h3>

              <button
                onClick={onOpenStory}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white text-white hover:text-[#20231F] backdrop-blur-md rounded-[5px] text-sm font-semibold transition-all duration-200 border border-white/25 group-hover:border-white cursor-pointer"
              >
                <span>Buka cerita</span>
                <span className="text-[#E8703D] group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* ================= Kartu Kanan (~42% / 5 cols) ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
            
            {/* 1) Kartu Kanan Atas: Kartu Kutipan Mustard #E8C85F */}
            <div className="relative bg-[#E8C85F] text-[#20231F] p-8 sm:p-9 rounded-[5px] shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
              {/* Subtle background decoration */}
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div>
                {/* Ikon bintang kecil */}
                <div className="w-8 h-8 rounded-full bg-[#20231F]/10 flex items-center justify-center text-[#20231F] mb-6">
                  <Star className="w-4 h-4 fill-[#20231F]" />
                </div>

                {/* Blockquote DM Serif Display */}
                <blockquote className="font-display text-2xl sm:text-3xl text-[#20231F] leading-snug font-normal mb-6">
                  “Foto mengingatkan kita bahwa kita pernah sebahagia itu.”
                </blockquote>
              </div>

              {/* Atribusi "— Catatan Memora" */}
              <div className="pt-4 border-t border-[#20231F]/15 flex items-center justify-between">
                <span className="font-sans text-sm font-semibold tracking-wide text-[#20231F]/80">
                  — Catatan Memora
                </span>
                <span className="font-['Caveat',cursive] text-lg text-[#20231F]/70 font-bold">
                  vol. 04
                </span>
              </div>
            </div>

            {/* 2) Kartu Kanan Bawah: Kartu Film / Kolase Musim Panas */}
            <div className="relative min-h-[220px] sm:min-h-[250px] rounded-[5px] overflow-hidden shadow-polaroid group cursor-pointer bg-[#20231F]">
              {/* Foto bergaya analog/film-strip musim panas */}
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
                alt="Musim panas '24"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out saturate-[1.15]"
              />

              {/* Subtle analog film grain & vintage vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Film Sprocket decorative perforations indicator on right */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-xs rounded text-[10px] font-mono tracking-widest text-[#CACCC4] uppercase">
                ISO 400 • 35mm
              </div>

              {/* Label putih miring di pojok kiri bawah bertuliskan "Musim panas ‘24" */}
              <div className="absolute bottom-5 left-5 z-10">
                <span className="inline-block px-3 py-1 bg-white text-[#20231F] font-['Caveat',cursive] font-bold text-lg sm:text-xl rounded-[3px] shadow-md -rotate-[3deg] group-hover:rotate-0 transition-transform duration-300">
                  Musim panas ‘24 ☀
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
