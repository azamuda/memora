import React, { useState } from 'react';
import { X, Upload, Sparkles, Share2, CheckCircle2, Play } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAccount: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartAccount,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Kumpulkan Momen Terbaikmu',
      description:
        'Cukup seret dan letakkan foto dari smartphone atau kameramu. Memora menjaga resolusi asli tanpa kompresi yang merusak detail emosional di setiap potret.',
      icon: Upload,
      previewBadge: 'LANGKAH 1 — UNGGAH FOTO',
      image:
        'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
      caption: 'Format Polaroid otomatis terpasang dengan tanggal & lokasi',
    },
    {
      step: '02',
      title: 'Susun Jadi Scrapbook Bercerita',
      description:
        'Beri catatan tangan digital, sticky note pengingat momen, dan sticker cap analog. Ceritamu tertata bagaikan buku harian vintage yang hidup dan penuh sentuhan personal.',
      icon: Sparkles,
      previewBadge: 'LANGKAH 2 — SENTUHAN EDITORIAL',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      caption: 'Tipografi DM Serif & DM Sans berpadu hangat bagai majalah seni',
    },
    {
      step: '03',
      title: 'Bagikan & Nikmati Bersama',
      description:
        'Undang sahabat atau keluarga ke dalam album kolaboratif. Mereka dapat menyematkan foto dari sudut pandang mereka sendiri dan meninggalkan komentar hangat.',
      icon: Share2,
      previewBadge: 'LANGKAH 3 — BERBAGI HANGAT',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      caption: 'Akses privasi penuh: hanya orang terdekat yang memiliki kunci',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FBFAF6] rounded-[8px] overflow-hidden shadow-2xl border border-[#E0D9C7] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F2EDE1] border-b border-[#E3DDCF] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8703D] font-sans">
              PANDUAN INTERAKTIF
            </span>
            <h3 className="font-display text-2xl text-[#20231F]">
              Bagaimana Memora Bekerja
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#20231F]/70 hover:text-[#20231F] hover:bg-[#E3DDCF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#F7F3EB]">
          
          {/* Left Column: Interactive Step Selector */}
          <div className="md:col-span-6 space-y-4">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-[5px] border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-white border-[#E8703D] shadow-sm translate-x-1'
                      : 'bg-[#F2EDE1]/70 border-[#E0D9C7] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold tracking-wider font-mono ${
                        isSelected ? 'text-[#E8703D]' : 'text-[#64665F]'
                      }`}
                    >
                      {item.step}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#E8703D] text-white'
                          : 'bg-[#E0D9C7] text-[#20231F]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="font-display text-lg text-[#20231F] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#64665F] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Preview Card */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-full bg-white p-4 pb-6 rounded-xs shadow-polaroid border border-[#E5DFCE] relative">
              <span className="inline-block px-2.5 py-1 bg-[#20231F] text-white text-[10px] font-semibold tracking-wider uppercase rounded-[3px] mb-3">
                {steps[activeStep].previewBadge}
              </span>

              <div className="aspect-[4/3] w-full rounded-xs overflow-hidden bg-[#20231F]">
                <img
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover transition-all duration-500 saturate-[1.1]"
                />
              </div>

              <div className="mt-3.5 px-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8703D] shrink-0" />
                <span className="text-xs text-[#20231F] font-medium font-['Caveat',cursive] text-base">
                  {steps[activeStep].caption}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onStartAccount();
              }}
              className="mt-6 w-full py-3 bg-[#E8703D] hover:bg-[#D66130] text-white text-sm font-semibold rounded-[5px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Mulai Coba Sekarang — Gratis</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
