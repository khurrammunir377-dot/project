'use client';

import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
  animated?: boolean;
  variant?: 'auto' | 'light' | 'dark';
  mode?: 'icon' | 'full';
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showText = true,
  href = '/',
  className = '',
  animated = true,
  mode = 'icon',
}) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate straight to landing page without triggering login redirects
    window.location.href = href || '/';
  };

  const sizeMap = {
    sm: {
      iconH: 'h-8',
      text: 'text-lg',
      sub: 'text-[8.5px] tracking-[0.2em]',
      badge: 'text-[8px] px-1.5 py-0.2',
      fullH: 'h-10',
    },
    md: {
      iconH: 'h-10',
      text: 'text-2xl',
      sub: 'text-[9.5px] tracking-[0.22em]',
      badge: 'text-[9px] px-2 py-0.5',
      fullH: 'h-12',
    },
    lg: {
      iconH: 'h-14',
      text: 'text-3xl sm:text-4xl',
      sub: 'text-[11.5px] tracking-[0.25em]',
      badge: 'text-[10px] px-2.5 py-0.5',
      fullH: 'h-20',
    },
    xl: {
      iconH: 'h-20',
      text: 'text-4xl sm:text-5xl',
      sub: 'text-xs tracking-[0.3em]',
      badge: 'text-xs px-3 py-1',
      fullH: 'h-28',
    },
  };

  const selected = sizeMap[size];

  let content: React.ReactNode;

  if (mode === 'full') {
    content = (
      <div className={`relative inline-flex items-center group select-none cursor-pointer ${className}`}>
        <img
          src="/logo-transparent.png"
          alt="Nexora Complete Business Management"
          className={`${selected.fullH} w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,145,254,0.35)] transition-transform duration-300 group-hover:scale-105`}
        />
        {/* 10-second bright light ray sweep */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div className="w-20 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[2px] animate-logo-sheen" />
        </div>
      </div>
    );
  } else {
    content = (
      <div className={`relative inline-flex items-center gap-3 group select-none cursor-pointer ${className}`}>
        {/* 10-Second Bright Light Ray Sheen Sweep Across Entire Logo */}
        <div className="absolute -inset-1.5 overflow-hidden pointer-events-none rounded-2xl z-20">
          <div className="w-24 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[2px] animate-logo-sheen" />
        </div>

        {/* 3D Ribbon 'N' Emblem with Stylish 3D Perspective Rotation */}
        <div className="relative flex items-center justify-center shrink-0 [perspective:800px]">
          {animated && (
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-500/25 via-sky-400/30 to-blue-500/25 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}
          <img
            src="/logo-icon.png"
            alt="Nexora 3D Emblem"
            className={`${selected.iconH} w-auto object-contain drop-shadow-[0_6px_16px_rgba(0,145,254,0.45)] ${
              animated ? 'animate-stylish-n' : ''
            } group-hover:scale-110 transition-all duration-300`}
          />
        </div>

        {/* High-Contrast Corporate Typography Lockup */}
        {showText && (
          <div className="flex flex-col text-left justify-center">
            <div className="flex items-center gap-2">
              <span
                className={`font-black font-sans tracking-wider leading-none uppercase ${selected.text}`}
              >
                {/* User requested: NE in WHITE with stylish rotation on N */}
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  <span className={`inline-block ${animated ? 'animate-stylish-n-text' : ''}`}>
                    N
                  </span>
                  E
                </span>
                {/* User requested: X in DARK BLUE in same 3D ribbon style as emblem N */}
                <span className="relative inline-block font-black bg-gradient-to-b from-[#38bdf8] via-[#1d4ed8] to-[#0a1931] bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(15,23,42,0.95)] drop-shadow-[0_0_8px_rgba(29,78,216,0.6)]">
                  X
                </span>
                {/* User requested: ORA in GREEN */}
                <span className="text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  ORA
                </span>
              </span>
              <span className="font-mono font-bold tracking-widest text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-sm">
                ERP
              </span>
            </div>

            <span
              className={`font-bold uppercase mt-1 leading-none text-slate-200 dark:text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${selected.sub}`}
            >
              Complete Business Management
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleLogoClick}
      title="Click to visit landing page"
      className="inline-block transition-transform active:scale-95 cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {content}
    </div>
  );
};

