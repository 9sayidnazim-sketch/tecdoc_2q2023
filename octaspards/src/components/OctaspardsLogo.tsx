import React from "react";

export function OctaspardsLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Custom Octaspards automotive emblem: dynamic octagon with precision automotive gear & wings */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 text-primary transition-transform duration-200 hover:rotate-6"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="38"
          height="38"
          rx="10"
          className="fill-primary"
        />
        {/* Inner geometric spokes & mechanical circle */}
        <circle cx="22" cy="22" r="12" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="5" fill="#F26B3A" />
        {/* Dynamic speed teeth */}
        <path
          d="M22 6V10M22 34V38M6 22H10M34 22H38M10.5 10.5L13.5 13.5M30.5 30.5L33.5 33.5M10.5 33.5L13.5 30.5M30.5 13.5L33.5 10.5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-heading">
          OCTA<span className="text-primary">SPARDS</span>
        </span>
        <span className="text-[9px] font-semibold tracking-wider text-placeholder uppercase">
          Parts Catalogue
        </span>
      </div>
    </div>
  );
}
