import React, { useState } from 'react';
import { X, Volume2, VolumeX, Heart, Share2, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(true);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Hari di mana kita lupa waktu.',
      location: 'Pantai Parangtritis, Jogja',
      date: '14 Juli 2025',
      time: '17:34 WITA',
      image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&q=80',
      note: 'Kami duduk di atas pasir yang mulai dingin. Tidak ada yang mengecek ponsel selama 3 jam penuh. Hanya suara ombak, tawa tentang lelucon masa kuliah, dan aroma garam laut.',
      author: 'Alya Putri',
      polaroidCaption: 'Senja terakhir sebelum kembali ke hiruk pikuk kota.',
    },
    {
      title: 'Kopi hangat & angin dermaga',
      location: 'Dermaga Sanur',
      date: '15 Juli 2025',
      time: '06:15 WITA',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      note: 'Mengejar matahari terbit dengan mata yang masih setengah mengantuk, tapi secangkir kopi susu panas dan tawa mereka membuat semuanya sempurna.',
      author: 'Bima Santoso',
      polaroidCaption: 'Tim begadang yang berhasil bangun subuh!',
    },
    {
      title: 'Jalanan berliku menuju perbukitan',
      location: 'Kintamani, Bangli',
      date: '16 Juli 2025',
      time: '11:20 WITA',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      note: 'Kaca jendela mobil diturunkan penuh, udara pegunungan masuk menerpa wajah. Playlist lagu-lagu nostalgia 2010-an diputar berulang-ulang.',
      author: 'Dian Permata',
      polaroidCaption: 'Musim panas yang tak ingin kami sudahi.',
    },
  ];

  const current = slides[activeSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#20231F]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F7F3EB] rounded-[8px] overflow-hidden shadow-2xl border border-[#E0D9C7] flex flex-col max-h-[92vh]">
        
        {/* Top Story Header Bar */}
        <div className="px-6 py-4 bg-[#F2EDE1] border-b border-[#E3DDCF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8703D] animate-ping" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E8703D] font-sans">
                ALBUM SOROTAN
              </span>
              <h4 className="font-display text-lg text-[#20231F] leading-tight">
                Liburan 2025 — Jurnal Cerita
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Ambience simulation toggle */}
            <button
              onClick={() => setIsPlayingSound(!isPlayingSound)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-xs font-medium border transition-colors ${
                isPlayingSound
                  ? 'bg-[#E8703D] text-white border-[#E8703D]'
                  : 'bg-white text-[#20231F] border-[#D9D3C5] hover:border-[#20231F]'
              }`}
              title="Suasana Audio Analog"
            >
              {isPlayingSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isPlayingSound ? 'Audio Suasana: Ombak & Angin' : 'Nyalakan Audio Suasana'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#20231F]/70 hover:text-[#20231F] hover:bg-[#E3DDCF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Columns (Photo Polaroid & Editorial Journal) */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F7F3EB]">
          
          {/* Kolom Kiri: Polaroid Photo Frame with tilt */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-lg bg-white p-4 pb-8 rounded-xs shadow-polaroid-lg -rotate-[1deg] hover:rotate-0 transition-transform duration-300">
              {/* Tape deco */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 washi-tape opacity-85 rotate-[-1deg]" />

              <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#242720]">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover saturate-[1.1]"
                />
              </div>

              <div className="mt-4 px-2 flex items-center justify-between">
                <span className="font-['Caveat',cursive] text-xl text-[#20231F] font-bold">
                  {current.polaroidCaption}
                </span>
                <span className="text-xs font-mono text-[#64665F]">
                  {current.date}
                </span>
              </div>
            </div>

            {/* Slide Navigation Dots */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                className="w-8 h-8 rounded-full bg-white border border-[#D9D3C5] flex items-center justify-center hover:border-[#20231F] text-[#20231F] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-[#64665F]">
                {activeSlide + 1} dari {slides.length} cerita
              </span>

              <button
                onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-full bg-white border border-[#D9D3C5] flex items-center justify-center hover:border-[#20231F] text-[#20231F] transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Editorial Story & Handwritten Note */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E8703D] mb-2">
                <span>📍 {current.location}</span>
                <span>•</span>
                <span>{current.time}</span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl text-[#20231F] leading-tight mb-4">
                {current.title}
              </h3>

              {/* Journal Quote Card */}
              <div className="p-5 bg-[#FBF7EE] border-l-3 border-[#E8703D] rounded-r-[5px] shadow-xs my-5">
                <p className="font-display italic text-lg text-[#20231F] leading-relaxed mb-3">
                  “{current.note}”
                </p>
                <span className="text-xs font-sans font-semibold text-[#64665F]">
                  Ditulis oleh {current.author}
                </span>
              </div>

              {/* Memory tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 bg-[#EBE5D6] text-xs font-medium text-[#20231F] rounded-[4px]">
                  #senjaJogja
                </span>
                <span className="px-2.5 py-1 bg-[#EBE5D6] text-xs font-medium text-[#20231F] rounded-[4px]">
                  #sahabatDekat
                </span>
                <span className="px-2.5 py-1 bg-[#EBE5D6] text-xs font-medium text-[#20231F] rounded-[4px]">
                  #analogMemories
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#E5DFD1] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-semibold border transition-all ${
                    isLiked
                      ? 'bg-[#FDE8E1] text-[#E8703D] border-[#E8703D]'
                      : 'bg-white text-[#20231F] border-[#D9D3C5]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#E8703D]' : ''}`} />
                  <span>{isLiked ? '28 Suka' : 'Suka'}</span>
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D9D3C5] hover:border-[#20231F] text-[#20231F] rounded-[5px] text-xs font-semibold transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </button>
              </div>

              <span className="text-[11px] font-sans text-[#8C8F87]">
                Tersimpan di Cloud Memora
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
