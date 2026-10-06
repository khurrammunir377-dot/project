'use client';

import React from 'react';
import Link from 'next/link';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
  animated?: boolean;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showText = true,
  href = '/',
  className = '',
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subtextClasses = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Animated Logo Container */}
      <div className="relative flex items-center justify-center">
        {animated && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 blur-md opacity-40 group-hover:opacity-80 transition-opacity animate-pulse" />
        )}
        <div
          className={`${sizeClasses[size]} relative rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300 ${
            animated ? 'hover:rotate-1' : ''
          }`}
        >
          <img
            src="/logo.png"
            alt="Nexora Complete Business Management"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-white flex items-center gap-1 leading-none ${textClasses[size]}`}
          >
            NEX<span className="text-blue-400">O</span>RA
          </span>
          <span
            className={`text-slate-400 font-semibold tracking-wider uppercase block mt-0.5 ${subtextClasses[size]}`}
          >
            Complete Business Management
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
