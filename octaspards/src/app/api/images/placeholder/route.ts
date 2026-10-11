import { NextResponse } from "next/server";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EDF2F7"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1F4FE0"/>
      <stop offset="100%" stop-color="#F26B3A"/>
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="0.8"/>
    </pattern>
  </defs>

  <!-- Background with subtle technical grid -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Technical Auto Part Drawing (Brake Disc & Caliper Silhouette) -->
  <g transform="translate(200, 130)" stroke="#94A3B8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Outer Rotor -->
    <circle cx="0" cy="0" r="64" stroke="#CBD5E1" stroke-width="3"/>
    <circle cx="0" cy="0" r="58" stroke="#94A3B8" stroke-dasharray="6,4"/>
    <circle cx="0" cy="0" r="32" fill="#F1F5F9" stroke="#64748B" stroke-width="2.5"/>
    
    <!-- Hub Hat & Lug Holes -->
    <circle cx="0" cy="0" r="14" fill="#E2E8F0" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-22" r="3.5" fill="#94A3B8"/>
    <circle cx="21" cy="-7" r="3.5" fill="#94A3B8"/>
    <circle cx="13" cy="18" r="3.5" fill="#94A3B8"/>
    <circle cx="-13" cy="18" r="3.5" fill="#94A3B8"/>
    <circle cx="-21" cy="-7" r="3.5" fill="#94A3B8"/>

    <!-- Caliper Body Outline -->
    <path d="M -52 -50 C -40 -64 10 -68 54 -48 C 58 -44 56 -24 50 -20 C 40 -34 -10 -40 -44 -26 Z" fill="#1F4FE0" fill-opacity="0.12" stroke="#1F4FE0" stroke-width="2.5"/>
    <path d="M -40 -45 L -20 -40" stroke="#F26B3A" stroke-width="3"/>
  </g>

  <!-- Brand & Status Text -->
  <g text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="200" y="235" font-size="13" font-weight="700" fill="#1E293B" letter-spacing="1">OCTASPARDS CATALOGUE</text>
    <text x="200" y="255" font-size="11" font-weight="500" fill="#64748B">Technical Drawing Placeholder • GCC Verified</text>
  </g>

  <!-- Accent Bottom Border -->
  <rect x="0" y="296" width="400" height="4" fill="url(#accentGrad)"/>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
