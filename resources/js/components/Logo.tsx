import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  showWordmark = true,
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl tracking-tight',
    lg: 'text-2xl tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 3 vertical lines inside a circle - memory/album spine metaphor */}
      <div
        className={`${iconSizes[size]} rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
          isLight
            ? 'bg-[#2A2E26] border border-[#3E4239]'
            : 'bg-[#F0ECE1] border border-[#DFD9CB]'
        }`}
      >
        <div className="flex items-center gap-[3px]">
          {/* Line 1 */}
          <span
            className={`w-[2.5px] h-3.5 rounded-full ${
              isLight ? 'bg-white/80' : 'bg-[#20231F]'
            }`}
          />
          {/* Line 2 - taller & orange accent */}
          <span className="w-[2.5px] h-5 rounded-full bg-[#E8703D]" />
          {/* Line 3 */}
          <span
            className={`w-[2.5px] h-3 rounded-full ${
              isLight ? 'bg-white/80' : 'bg-[#20231F]'
            }`}
          />
        </div>
      </div>

      {showWordmark && (
        <span
          className={`font-bold font-sans ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-[#20231F]'
          }`}
        >
          memora
        </span>
      )}
    </div>
  );
};
