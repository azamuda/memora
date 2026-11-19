import React from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onRegister: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onRegister }) => {
  const planFeatures = [
    'Album tanpa batas',
    'Berbagi dengan keluarga',
    'Kualitas foto asli',
  ];

  return (
    <section id="harga" className="w-full py-20 md:py-28 lg:py-32 bg-[#E9E4D9] relative overflow-hidden">
      {/* Delicate background elements */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Layout 2 Kolom Seimbang */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Kolom Kiri */}
          <div className="flex flex-col items-start">
            {/* Label uppercase oranye "MULAI CERITAMU HARI INI" */}
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#E8703D] font-sans mb-4">
              MULAI CERITAMU HARI INI
            </span>

            {/* Judul H2 besar DM Serif Display */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[66px] text-[#20231F] leading-[1.05] tracking-tight mb-6">
              <span className="block">Kenanganmu layak</span>
              <span className="block italic text-[#E8703D] font-normal">
                punya rumah.
              </span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#64665F] max-w-md leading-relaxed mb-8">
              Mulai secara cuma-cuma tanpa perlu memasukkan kartu kredit. Nikmati
              kemudahan mengumpulkan foto-foto terindahmu kapan pun kamu ingin
              mengingatnya kembali.
            </p>

            <div className="inline-flex items-center gap-3 text-xs sm:text-sm text-[#20231F]/80 bg-[#DFD9CB]/60 px-4 py-2 rounded-[5px] border border-[#D0C9BA]">
              <span className="w-2 h-2 rounded-full bg-[#E8703D] animate-pulse" />
              <span>Dukungan penyimpanan cloud terenkripsi & tanpa kompresi rusak</span>
            </div>
          </div>

          {/* Kolom Kanan: Kartu putih (#FBFAF6) dengan shadow halus dan padding lega */}
          <div className="w-full max-w-lg lg:ml-auto">
            <div className="bg-[#FBFAF6] p-8 sm:p-11 rounded-[5px] shadow-[0_10px_35px_-5px_rgba(32,35,31,0.08)] border border-[#EDE8DC] relative transition-transform hover:-translate-y-1 duration-300">
              
              {/* Top pill/label uppercase oranye "GRATIS SELAMANYA" */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest uppercase text-[#E8703D] font-sans">
                  GRATIS SELAMANYA
                </span>
                <span className="text-xs font-medium text-[#64665F] bg-[#F1ECE0] px-2.5 py-1 rounded-[4px]">
                  Paket Dasar
                </span>
              </div>

              {/* Angka besar DM Serif Display "5 GB" */}
              <div className="mb-2">
                <div className="font-display text-5xl sm:text-6xl text-[#20231F] tracking-tight">
                  5 GB
                </div>
              </div>

              {/* Subteks "Ruang untuk ribuan momen terbaikmu." */}
              <p className="font-sans text-[#64665F] text-base mb-7">
                Ruang untuk ribuan momen terbaikmu.
              </p>

              {/* Garis pemisah horizontal tipis */}
              <hr className="border-t border-[#EAE4D7] mb-7" />

              {/* Daftar 3 fitur dengan tanda centang (✓) berwarna oranye */}
              <ul className="space-y-4 mb-9">
                {planFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3.5 text-base text-[#20231F]">
                    <div className="w-5 h-5 rounded-full bg-[#FCECE3] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#E8703D] stroke-[2.5]" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Tombol full-width gelap (#22251F): "Buat akun gratis →" */}
              <button
                onClick={onRegister}
                className="w-full py-4 bg-[#22251F] hover:bg-[#343831] text-white text-base font-semibold rounded-[5px] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
              >
                <span>Buat akun gratis</span>
                <span className="text-[#E8703D] text-lg leading-none">→</span>
              </button>

              <div className="mt-4 text-center">
                <span className="text-xs text-[#64665F]">
                  Tidak perlu kartu kredit • Bisa dibatalkan atau upgrade kapan saja
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
