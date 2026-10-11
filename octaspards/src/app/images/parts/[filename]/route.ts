import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const lower = filename.toLowerCase();
  const cleanName = filename
    .replace(/\.(webp|png|jpg|jpeg|svg)$/i, "")
    .replace(/_/g, " ")
    .toUpperCase();

  let illustrationSvg = "";
  let categoryLabel = "GENUINE AUTO SPARE PART";

  if (
    lower.includes("04465") ||
    lower.includes("0986") ||
    lower.includes("d1060") ||
    lower.includes("a000420") ||
    lower.includes("brake") ||
    lower.includes("pad")
  ) {
    categoryLabel = "FRONT AXLE CERAMIC BRAKE PADS";
    illustrationSvg = `
    <!-- Realistic Brake Pad Pair -->
    <g transform="translate(140, 115)">
      <!-- Backing Plate (Left Pad) -->
      <path d="M -45 -35 C -15 -45 15 -45 45 -35 C 55 -15 55 15 45 35 C 15 42 -15 42 -45 35 C -55 15 -55 -15 -45 -35 Z" fill="#334155" stroke="#1E293B" stroke-width="2.5"/>
      <!-- Friction Material SA210 Chamfered -->
      <path d="M -36 -26 C -12 -34 12 -34 36 -26 C 44 -10 44 10 36 26 C 12 32 -12 32 -36 26 C -44 10 -44 -10 -36 -26 Z" fill="#64748B" stroke="#475569" stroke-width="1.5"/>
      <!-- Expansion Gas Slot -->
      <line x1="0" y1="-26" x2="0" y2="26" stroke="#1E293B" stroke-width="3"/>
      <!-- Stainless Steel Anti-Rattle Clip -->
      <rect x="-48" y="-12" width="6" height="24" rx="2" fill="#CBD5E1" stroke="#94A3B8"/>
      <rect x="42" y="-12" width="6" height="24" rx="2" fill="#CBD5E1" stroke="#94A3B8"/>
    </g>
    <g transform="translate(260, 115)">
      <!-- Right Pad Shim Side -->
      <path d="M -45 -35 C -15 -45 15 -45 45 -35 C 55 -15 55 15 45 35 C 15 42 -15 42 -45 35 C -55 15 -55 -15 -45 -35 Z" fill="#1E293B" stroke="#0F172A" stroke-width="2.5"/>
      <!-- Rubber-Coated Anti-Noise Shim -->
      <path d="M -38 -28 C -12 -36 12 -36 38 -28 C 45 -12 45 12 38 28 C 12 34 -12 34 -38 28 C -45 12 -45 -12 -38 -28 Z" fill="#1F4FE0" fill-opacity="0.25" stroke="#1F4FE0" stroke-width="1.5"/>
      <circle cx="-16" cy="0" r="4.5" fill="#CBD5E1"/>
      <circle cx="16" cy="0" r="4.5" fill="#CBD5E1"/>
      <!-- Acoustic Wear Indicator Sensor Clip -->
      <path d="M 44 20 L 58 35 L 54 40 L 40 25 Z" fill="#F26B3A" stroke="#C2410C" stroke-width="1.5"/>
    </g>`;
  } else if (
    lower.includes("90915") ||
    lower.includes("w712") ||
    lower.includes("1142") ||
    lower.includes("filter")
  ) {
    categoryLabel = "HEAVY-DUTY ENGINE OIL FILTER";
    illustrationSvg = `
    <!-- Oil Filter Canister -->
    <g transform="translate(200, 120)">
      <!-- Filter Body Cylindrical -->
      <rect x="-42" y="-50" width="84" height="100" rx="10" fill="#1E293B" stroke="#0F172A" stroke-width="2.5"/>
      <path d="M -42 25 L -42 45 C -42 52 42 52 42 45 L 42 25 Z" fill="#0F172A"/>
      <!-- Grip Flutes at Top -->
      <line x1="-32" y1="-50" x2="-32" y2="-30" stroke="#334155" stroke-width="3"/>
      <line x1="-16" y1="-50" x2="-16" y2="-30" stroke="#334155" stroke-width="3"/>
      <line x1="0" y1="-50" x2="0" y2="-30" stroke="#334155" stroke-width="3"/>
      <line x1="16" y1="-50" x2="16" y2="-30" stroke="#334155" stroke-width="3"/>
      <line x1="32" y1="-50" x2="32" y2="-30" stroke="#334155" stroke-width="3"/>
      <!-- Blue Accent Brand Band -->
      <rect x="-42" y="-12" width="84" height="24" fill="#1F4FE0" fill-opacity="0.85"/>
      <!-- Base Plate Gasket -->
      <ellipse cx="0" cy="46" rx="38" ry="10" fill="#F26B3A" stroke="#C2410C" stroke-width="2"/>
      <ellipse cx="0" cy="46" rx="20" ry="5" fill="#334155"/>
      <circle cx="0" cy="46" r="6" fill="#0F172A"/>
    </g>`;
  } else if (
    lower.includes("spark") ||
    lower.includes("ilkar") ||
    lower.includes("ngk") ||
    lower.includes("94124")
  ) {
    categoryLabel = "LASER IRIDIUM SPARK PLUG";
    illustrationSvg = `
    <!-- Spark Plug -->
    <g transform="translate(200, 120) rotate(-35)">
      <!-- Terminal Stud -->
      <rect x="-4" y="-68" width="8" height="14" rx="2" fill="#CBD5E1" stroke="#64748B"/>
      <!-- Ceramic Ribbed Insulator Body -->
      <rect x="-9" y="-54" width="18" height="42" rx="3" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
      <line x1="-9" y1="-46" x2="9" y2="-46" stroke="#CBD5E1" stroke-width="2"/>
      <line x1="-9" y1="-38" x2="9" y2="-38" stroke="#CBD5E1" stroke-width="2"/>
      <line x1="-9" y1="-30" x2="9" y2="-30" stroke="#CBD5E1" stroke-width="2"/>
      <!-- Hexagon Nut Steel Shell -->
      <path d="M -13 -12 L 13 -12 L 10 12 L -10 12 Z" fill="#64748B" stroke="#334155" stroke-width="2"/>
      <!-- Threaded Metal Section -->
      <rect x="-8" y="12" width="16" height="38" fill="#475569" stroke="#1E293B" stroke-width="2"/>
      <line x1="-8" y1="18" x2="8" y2="18" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="-8" y1="26" x2="8" y2="26" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="-8" y1="34" x2="8" y2="34" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="-8" y1="42" x2="8" y2="42" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Ground Electrode & Iridium Tip -->
      <rect x="-1" y="50" width="2" height="10" fill="#38BDF8"/>
      <path d="M -6 50 L -6 64 L 2 64" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
    </g>`;
  } else if (
    lower.includes("kyb") ||
    lower.includes("343315") ||
    lower.includes("shock") ||
    lower.includes("absorber")
  ) {
    categoryLabel = "GAS-CHARGED SHOCK ABSORBER";
    illustrationSvg = `
    <!-- Shock Absorber Strut -->
    <g transform="translate(200, 120)">
      <!-- Chrome Piston Rod -->
      <rect x="-5" y="-62" width="10" height="55" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Top Eyelet Mount & Bushing -->
      <circle cx="0" cy="-68" r="14" fill="#334155" stroke="#1E293B" stroke-width="2.5"/>
      <circle cx="0" cy="-68" r="6" fill="#F26B3A" stroke="#C2410C"/>
      <!-- Main Damper Cylinder Body -->
      <rect x="-18" y="-10" width="36" height="85" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="2.5"/>
      <!-- Dust Boot Bellow Cover -->
      <path d="M -15 -28 C -8 -24 8 -24 15 -28 L 15 -10 L -15 -10 Z" fill="#475569"/>
      <!-- Lower Eyelet Mount -->
      <circle cx="0" cy="80" r="14" fill="#334155" stroke="#1E293B" stroke-width="2.5"/>
      <circle cx="0" cy="80" r="6" fill="#1F4FE0" stroke="#1D4ED8"/>
    </g>`;
  } else if (lower.includes("20430") || lower.includes("boot") || lower.includes("bellow")) {
    categoryLabel = "THERMOPLASTIC CV BOOT KIT";
    illustrationSvg = `
    <!-- CV Boot Accordion -->
    <g transform="translate(200, 120)">
      <path d="M -16 -45 L 16 -45 L 22 -30 L -22 -30 Z" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
      <path d="M -26 -30 L 26 -30 L 34 -12 L -34 -12 Z" fill="#334155" stroke="#0F172A" stroke-width="2"/>
      <path d="M -38 -12 L 38 -12 L 44 8 L -44 8 Z" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
      <path d="M -46 8 L 46 8 L 48 35 L -48 35 Z" fill="#334155" stroke="#0F172A" stroke-width="2"/>
      <!-- Ear Clamps -->
      <rect x="-17" y="-47" width="34" height="6" fill="#CBD5E1" stroke="#64748B"/>
      <rect x="-49" y="32" width="98" height="6" fill="#CBD5E1" stroke="#64748B"/>
    </g>`;
  } else {
    // Default high-precision disc & caliper assembly
    illustrationSvg = `
    <g transform="translate(200, 120)" stroke="#94A3B8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="0" cy="0" r="64" stroke="#CBD5E1" stroke-width="3"/>
      <circle cx="0" cy="0" r="58" stroke="#94A3B8" stroke-dasharray="6,4"/>
      <circle cx="0" cy="0" r="32" fill="#F1F5F9" stroke="#64748B" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="14" fill="#E2E8F0" stroke="#475569" stroke-width="2"/>
      <circle cx="0" cy="-22" r="3.5" fill="#94A3B8"/>
      <circle cx="21" cy="-7" r="3.5" fill="#94A3B8"/>
      <circle cx="13" cy="18" r="3.5" fill="#94A3B8"/>
      <circle cx="-13" cy="18" r="3.5" fill="#94A3B8"/>
      <circle cx="-21" cy="-7" r="3.5" fill="#94A3B8"/>
      <path d="M -52 -50 C -40 -64 10 -68 54 -48 C 58 -44 56 -24 50 -20 C 40 -34 -10 -40 -44 -26 Z" fill="#1F4FE0" fill-opacity="0.12" stroke="#1F4FE0" stroke-width="2.5"/>
      <path d="M -40 -45 L -20 -40" stroke="#F26B3A" stroke-width="3"/>
    </g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1F4FE0"/>
      <stop offset="100%" stop-color="#F26B3A"/>
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="0.8"/>
    </pattern>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Category Badge at Top -->
  <g transform="translate(200, 28)" text-anchor="middle">
    <rect x="-120" y="-12" width="240" height="24" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <text y="4" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#1F4FE0" letter-spacing="0.8">${categoryLabel}</text>
  </g>

  <!-- High-Fidelity Illustration -->
  <g filter="url(#dropShadow)">
    ${illustrationSvg}
  </g>

  <!-- Title & Specification footer -->
  <g text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="200" y="235" font-size="12" font-weight="800" fill="#0F172A" letter-spacing="0.5">${cleanName}</text>
    <text x="200" y="254" font-size="10" font-weight="500" fill="#64748B">TecDoc Verified • GCC Market Spec • UAE Stock</text>
  </g>

  <rect x="0" y="295" width="400" height="5" fill="url(#accentGrad)"/>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
