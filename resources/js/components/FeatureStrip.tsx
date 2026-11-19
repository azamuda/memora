import React from 'react';
import { Image as ImageIcon, Users, Lock } from 'lucide-react';

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      num: '01',
      icon: ImageIcon,
      title: 'Simpan tanpa batas',
      description: 'Semua foto terbaikmu, aman dalam satu tempat.',
    },
    {
      num: '02',
      icon: Users,
      title: 'Bagikan bersama',
      description: 'Buat album kolaboratif untuk setiap perjalanan.',
    },
    {
      num: '03',
      icon: Lock,
      title: 'Privasi terjaga',
      description: 'Kamu menentukan siapa yang boleh melihat cerita.',
    },
  ];

  return (
    <section id="fitur" className="w-full bg-[#252821] text-white py-16 md:py-20 border-y border-[#353831]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* 3 kolom sejajar dengan garis pemisah vertikal tipis di antaranya */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3C4036]">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col justify-between group transition-all duration-300 ${
                  idx === 0
                    ? 'pb-10 md:pb-0 md:pr-10 lg:pr-12'
                    : idx === 1
                    ? 'py-10 md:py-0 md:px-10 lg:px-12'
                    : 'pt-10 md:pt-0 md:pl-10 lg:pl-12'
                }`}
              >
                <div>
                  {/* Row: 01 (angka oranye kecil) + ikon galeri/pengguna/gembok oranye */}
                  <div className="flex items-center justify-between mb-7">
                    <span className="text-sm font-semibold tracking-widest text-[#E8703D] font-sans">
                      {feat.num}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#2E3229] border border-[#3D4236] flex items-center justify-center text-[#E8703D] group-hover:scale-110 group-hover:bg-[#E8703D] group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Judul DM Serif Display */}
                  <h3 className="font-display text-2xl sm:text-3xl text-white font-normal mb-3.5 tracking-tight group-hover:text-[#F5D879] transition-colors">
                    {feat.title}
                  </h3>

                  {/* Deskripsi */}
                  <p className="font-sans text-[#CACCC4] text-base leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-1 text-xs tracking-wider uppercase text-[#E8703D] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Pelajari selengkapnya</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
