'use client';

import React from 'react';
import Link from 'next/link';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
  animated?: boolean;
  variant?: 'auto' | 'light' | 'dark';
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showText = true,
  href = '/',
  className = '',
  animated = true,
  variant = 'auto',
}) => {
  const sizeMap = {
    sm: {
      box: 'w-8 h-8',
      text: 'text-base',
      sub: 'text-[9px]',
      badge: 'text-[8px] px-1.5 py-0.5',
    },
    md: {
      box: 'w-10 h-10',
      text: 'text-xl',
      sub: 'text-[10px]',
      badge: 'text-[9px] px-2 py-0.5',
    },
    lg: {
      box: 'w-14 h-14',
      text: 'text-2xl sm:text-3xl',
      sub: 'text-xs',
      badge: 'text-[10px] px-2.5 py-1',
    },
    xl: {
      box: 'w-20 h-20',
      text: 'text-3xl sm:text-4xl',
      sub: 'text-sm',
      badge: 'text-xs px-3 py-1',
    },
  };

  const selected = sizeMap[size];

  // Text color based on variant
  const mainTextColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-slate-900'
      : 'text-slate-900 dark:text-white';

  const subTextColor =
    variant === 'light'
      ? 'text-slate-300'
      : variant === 'dark'
      ? 'text-slate-600'
      : 'text-slate-500 dark:text-slate-400';

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* 3D Glassmorphic Emblem Container */}
      <div className="relative flex items-center justify-center">
        {/* Animated Radial Plasma Aura */}
        {animated && (
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-indigo-600/30 blur-md opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
        )}

        {/* Outer Metallic Bezel */}
        <div
          className={`${selected.box} relative rounded-2xl p-[1.5px] bg-gradient-to-br from-white/40 via-cyan-400/40 to-slate-900/60 shadow-xl shadow-cyan-950/20 group-hover:scale-105 transition-transform duration-300`}
        >
          {/* Inner Chamber */}
          <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950/90 backdrop-blur-md relative flex items-center justify-center ring-1 ring-white/15">
            {/* Specular Highlight Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none group-hover:translate-x-full transition-transform duration-700 ease-out" />

            <img
              src="/logo.png"
              alt="Nexora 3D Corporate Logo"
              className="w-full h-full object-contain p-1 drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)] group-hover:rotate-2 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Modern High-End Typographic Lockup */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-wider leading-none uppercase ${mainTextColor} ${selected.text}`}>
              NEX
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                O
              </span>
              RA
            </span>

            {/* Enterprise Micro-Badge */}
            <span
              className={`font-mono font-bold tracking-widest rounded-full uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 ${selected.badge}`}
            >
              ERP
            </span>
          </div>

          <span
            className={`font-semibold tracking-widest uppercase mt-1 leading-none ${subTextColor} ${selected.sub}`}
          >
            Complete Business Management
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};
