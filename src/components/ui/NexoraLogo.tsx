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
  mode?: 'icon' | 'full';
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showText = true,
  href = '/',
  className = '',
  animated = true,
  variant = 'auto',
  mode = 'icon',
}) => {
  const sizeMap = {
    sm: {
      iconH: 'h-8',
      text: 'text-lg',
      sub: 'text-[8px] tracking-[0.2em]',
      badge: 'text-[8px] px-1.5 py-0.2',
      fullH: 'h-10',
    },
    md: {
      iconH: 'h-10',
      text: 'text-2xl',
      sub: 'text-[9px] tracking-[0.22em]',
      badge: 'text-[9px] px-2 py-0.5',
      fullH: 'h-12',
    },
    lg: {
      iconH: 'h-14',
      text: 'text-3xl sm:text-4xl',
      sub: 'text-[11px] tracking-[0.25em]',
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

  // Text color based on variant
  const mainTextColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-slate-950'
      : 'text-slate-900 dark:text-white';

  const subTextColor =
    variant === 'light'
      ? 'text-slate-300'
      : variant === 'dark'
      ? 'text-slate-500'
      : 'text-slate-500 dark:text-slate-400';

  let content: React.ReactNode;

  if (mode === 'full') {
    content = (
      <div className={`inline-flex items-center group select-none ${className}`}>
        <img
          src="/logo-transparent.png"
          alt="Nexora Complete Business Management"
          className={`${selected.fullH} w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,145,254,0.25)] transition-transform duration-300 group-hover:scale-105`}
        />
      </div>
    );
  } else {
    content = (
      <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
        {/* Transparent 3D Ribbon 'N' Emblem */}
        <div className="relative flex items-center justify-center shrink-0">
          {animated && (
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}
          <img
            src="/logo-icon.png"
            alt="Nexora 3D Emblem"
            className={`${selected.iconH} w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,145,254,0.3)] group-hover:scale-105 group-hover:rotate-1 transition-all duration-300`}
          />
        </div>

        {/* Corporate Typography Lockup */}
        {showText && (
          <div className="flex flex-col text-left justify-center">
            <div className="flex items-center gap-2">
              <span
                className={`font-black font-sans tracking-wider leading-none uppercase ${mainTextColor} ${selected.text}`}
              >
                NE
                <span className="bg-gradient-to-tr from-blue-600 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
                  X
                </span>
                ORA
              </span>
              <span className="font-mono font-bold tracking-widest text-[9px] px-1.5 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400">
                ERP
              </span>
            </div>

            <span
              className={`font-bold uppercase mt-1 leading-none ${subTextColor} ${selected.sub}`}
            >
              Complete Business Management
            </span>
          </div>
        )}
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};
