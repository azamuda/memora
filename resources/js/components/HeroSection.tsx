import React from 'react';
import { Play } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onOpenHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStart,
  onOpenHowItWorks,
}) => {
  return (
    <section className="relative w-full pt-6 pb-20 md:pt-10 md:pb-28 lg:pt-12 lg:pb-32 overflow-hidden bg-[#F7F3EB]">
      {/* Background delicate accent glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#F5D879]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#E8703D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Asymmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ================= Kolom Kiri (~54% width) ================= */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Pill badge kecil berborder tipis */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#D8D2C4] bg-[#F1ECE0]/70 text-[#20231F] text-xs font-semibold tracking-wider uppercase mb-7 shadow-xs">
              <span className="text-[#E8703D]">✦</span>
              <span>RUANG UNTUK SETIAP CERITA</span>
            </div>

            {/* Heading H1 besar (DM Serif Display, ~86px di desktop, line-height rapat 0.9) */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#20231F] leading-[0.92] tracking-tight mb-7">
              <span className="block">Momen kecil.</span>
              <span className="block italic text-[#E8703D] font-normal mt-1">
                Cerita besar.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-lg sm:text-xl text-[#64665F] max-w-xl leading-relaxed mb-9">
              Simpan, susun, dan hidupkan kembali setiap momen berharga bersama
              orang-orang tersayang.
            </p>

            {/* Baris CTA */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-11">
              {/* 1) Tombol solid oranye (#E8703D) */}
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E8703D] hover:bg-[#D66130] text-white text-base font-semibold rounded-[5px] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer"
              >
                <span>Mulai simpan cerita</span>
                <span className="text-xl leading-none">→</span>
              </button>

              {/* 2) Tombol sekunder: lingkaran putih berborder tipis + teks */}
              <button
                onClick={onOpenHowItWorks}
                className="inline-flex items-center gap-3 px-5 py-3 text-[#20231F] hover:text-[#E8703D] font-medium text-base rounded-[5px] transition-all duration-200 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-[#D8D2C4] shadow-xs flex items-center justify-center group-hover:border-[#E8703D] group-hover:scale-105 transition-all">
                  <Play className="w-3.5 h-3.5 text-[#20231F] group-hover:text-[#E8703D] fill-current ml-0.5" />
                </div>
                <span>Lihat cara kerja</span>
              </button>
            </div>

            {/* Social proof di bawah CTA */}
            <div className="flex items-center gap-4 pt-2 border-t border-[#E8E2D4]/70">
              {/* 4 overlapping avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F7F3EB] object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Anggota Memora 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F7F3EB] object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Anggota Memora 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F7F3EB] object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Anggota Memora 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F7F3EB] object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Anggota Memora 4"
                />
              </div>

              {/* Teks tebal 12.000+ dan keterangan */}
              <div className="text-sm">
                <span className="font-bold text-[#20231F] text-base">12.000+</span>{' '}
                <span className="text-[#64665F]">cerita telah disimpan</span>
              </div>
            </div>
          </div>

          {/* ================= Kolom Kanan (~46% width): Kolase Scrapbook / Polaroid ================= */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6 lg:py-0">
            {/* Container for the overlapping scrapbook pieces */}
            <div className="relative w-full max-w-[440px] h-[480px] sm:h-[530px]">

              {/* Teks anotasi miring kecil berwarna oranye di kanan atas foto utama */}
              <div className="absolute -top-3 sm:-top-5 right-2 z-30 font-['Caveat',cursive] text-lg sm:text-xl text-[#E8703D] font-bold tracking-wide rotate-[7deg] select-none pointer-events-none drop-shadow-xs">
                kenangan terbaik! ↗
              </div>

              {/* Sticky note kuning (#F5D879) di kiri atas sedikit miring bertuliskan tanda kutip besar + teks serif italic */}
              <div
                className="absolute top-2 -left-3 sm:-left-6 z-25 w-44 sm:w-48 p-4 bg-[#F5D879] text-[#20231F] -rotate-[5deg] rounded-xs shadow-sticky transition-transform duration-300 hover:rotate-0 hover:scale-105 cursor-pointer"
                title="Catatan Memora"
              >
                {/* Simulated Washi Tape on top */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape opacity-85 rotate-[-2deg]" />
                <div className="text-3xl leading-none font-display text-[#20231F]/40 mb-1">“</div>
                <p className="font-display italic text-sm sm:text-base leading-snug text-[#20231F]">
                  Di sinilah cerita kita dimulai.
                </p>
                <div className="mt-2 text-[10px] tracking-wider uppercase font-sans font-semibold text-[#20231F]/60">
                  MEMORA NOTE
                </div>
              </div>

              {/* Foto besar berbingkai Polaroid putih dengan rotasi (-2deg) suasana pantai/laut hangat */}
              <div
                className="absolute top-8 right-2 sm:right-4 z-10 w-[270px] sm:w-[320px] bg-white p-3.5 pb-8 rounded-sm shadow-polaroid-lg -rotate-[2deg] transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:z-30 hover:shadow-2xl cursor-pointer group"
              >
                {/* Simulated washi tape top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 washi-tape opacity-80 rotate-[1deg]" />
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xs bg-[#EAE5D9]">
                  <img
                    src="/images/jogja-friends.jpg"
                    alt="Sahabat di Jogja"
                    className="w-full h-full object-cover saturate-[1.1] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-3.5 px-1 flex items-center justify-between">
                  <span className="font-['Caveat',cursive] text-lg text-[#20231F] font-bold">
                    Pantai Jogja, senja teduh ♡
                  </span>
                  <span className="text-[11px] font-sans text-[#64665F]/80">2025</span>
                </div>
              </div>

              {/* Foto kedua Polaroid: Teduh di gua */}
              <div
                className="absolute bottom-4 left-0 sm:left-2 z-20 w-[215px] sm:w-[250px] bg-white p-3 pb-6 rounded-sm shadow-polaroid rotate-[2.5deg] transition-all duration-300 hover:rotate-0 hover:scale-[1.03] hover:z-30 hover:shadow-2xl cursor-pointer group"
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xs bg-[#EAE5D9]">
                  <img
                    src="/images/teduh-di-gua.jpg"
                    alt="Teduh di gua"
                    className="w-full h-full object-cover sepia-[0.08] contrast-[1.05] brightness-[0.98] saturate-[1.12] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-2.5 px-1 flex items-center justify-between">
                  <span className="font-['Caveat',cursive] text-lg text-[#20231F] font-bold">
                    Teduh di gua
                  </span>
                  <span className="text-[10px] text-[#E8703D] font-bold">★ #01</span>
                </div>
              </div>

              {/* Kartu tanggal kalender mini berwarna oranye (#E8703D) di pojok kanan bawah sedikit miring: label "JUNI", angka besar serif "12", dan lokasi "Bali, 2025" */}
              <div
                className="absolute bottom-2 -right-2 sm:-right-4 z-25 bg-[#E8703D] text-white p-3.5 w-28 sm:w-32 rounded-[5px] shadow-lg rotate-[5deg] transition-all duration-300 hover:rotate-0 hover:scale-110 cursor-pointer flex flex-col items-center text-center select-none"
              >
                <span className="text-[11px] font-bold tracking-widest uppercase opacity-90 border-b border-white/20 pb-1 w-full">
                  JUNI
                </span>
                <span className="font-display text-4xl sm:text-5xl font-normal leading-tight my-0.5">
                  12
                </span>
                <span className="text-[11px] font-medium tracking-wide opacity-95">
                  Jogja, 2025
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
