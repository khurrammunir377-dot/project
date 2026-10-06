'use client';

import React from 'react';

export const WavingPakistanFlag: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Wave animation style */}
      <style jsx>{`
        @keyframes flagWave {
          0% {
            transform: scale(1.05) translate(0%, 0%) skewY(0deg);
            filter: drop-shadow(0 20px 30px rgba(1, 65, 28, 0.4));
          }
          25% {
            transform: scale(1.08) translate(-1.5%, 1%) skewY(-0.8deg);
          }
          50% {
            transform: scale(1.06) translate(1%, -1%) skewY(1deg);
          }
          75% {
            transform: scale(1.09) translate(1.5%, 1.2%) skewY(-0.5deg);
          }
          100% {
            transform: scale(1.05) translate(0%, 0%) skewY(0deg);
            filter: drop-shadow(0 20px 30px rgba(1, 65, 28, 0.4));
          }
        }

        @keyframes waveRipples {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .flag-cloth {
          animation: flagWave 10s ease-in-out infinite;
          transform-origin: center center;
        }

        .flag-light-sheen {
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.12) 25%,
            rgba(0, 0, 0, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 200%;
          animation: waveRipples 8s ease infinite;
        }
      `}</style>

      {/* Flag Canvas Wrapper */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25">
        <div className="relative w-full h-full flag-cloth">
          <svg
            viewBox="0 0 900 600"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Radial gradient for cloth depth */}
              <linearGradient id="clothSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#01411C" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#015223" stopOpacity="1" />
                <stop offset="100%" stopColor="#002d13" stopOpacity="0.95" />
              </linearGradient>

              {/* Shading filter */}
              <filter id="waveDistort" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.015 0.02"
                  numOctaves="3"
                  result="noise"
                >
                  <animate
                    attributeName="baseFrequency"
                    values="0.015 0.02;0.02 0.025;0.015 0.02"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" />
              </filter>
            </defs>

            {/* Group with waving displacement filter */}
            <g filter="url(#waveDistort)">
              {/* Green Field (3/4 of the flag width on the right) */}
              <rect x="0" y="0" width="900" height="600" fill="url(#clothSheen)" />

              {/* White Vertical Stripe on Hoist (1/4 width = 225px) */}
              <rect x="0" y="0" width="225" height="600" fill="#f8fafc" />

              {/* Center of green field is x = 225 + (900-225)/2 = 562.5, y = 300 */}
              {/* Crescent Moon */}
              <g transform="translate(562.5, 300) rotate(-40)">
                {/* Outer Crescent Circle */}
                <circle cx="0" cy="0" r="160" fill="#ffffff" />
                {/* Inner Cutout Circle shifted up-right to form the Islamic Crescent */}
                <circle cx="45" cy="-35" r="148" fill="#01411C" />
              </g>

              {/* 5-Pointed Star tilted towards the crescent tip */}
              <g transform="translate(620, 240) rotate(15)">
                <polygon
                  points="
                    0,-65
                    19,-20
                    62,-20
                    27,8
                    40,52
                    0,25
                    -40,52
                    -27,8
                    -62,-20
                    -19,-20
                  "
                  fill="#ffffff"
                />
              </g>
            </g>
          </svg>

          {/* Dynamic Light Sheen Wave Overlay */}
          <div className="absolute inset-0 flag-light-sheen pointer-events-none" />
        </div>
      </div>

      {/* Subtle bottom fade to blend with next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900" />
    </div>
  );
};
