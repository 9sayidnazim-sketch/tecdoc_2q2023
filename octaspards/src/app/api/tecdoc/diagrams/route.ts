import { NextRequest, NextResponse } from "next/server";
import { ARTICLES } from "@/lib/tecdoc/mockDatabase.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleNr = searchParams.get("articleNr");

  // Pre-configured exploded diagram sets
  const diagrams = [
    {
      id: "diag_exhaust",
      title: "Exhaust System & Silencer Assembly",
      subtitle: "Assembly Diagram No. 032025 · Exhaust Manifold to Tailpipe",
      system: "Exhaust",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
      viewBox: "0 0 850 450",
      hotspots: [
        { id: 101, x: 140, y: 190, width: 85, height: 60, callout: "1", componentArt: "032025-01", name: "Front Exhaust Flange & Gasket", price: 24.50 },
        { id: 102, x: 290, y: 170, width: 120, height: 80, callout: "2", componentArt: "032025-02", name: "Intermediate Resonator Section", price: 119.00 },
        { id: 103, x: 500, y: 140, width: 140, height: 95, callout: "3", componentArt: "032025-03", name: "Rear Main Silencer Box", price: 185.00 },
        { id: 104, x: 670, y: 190, width: 80, height: 45, callout: "4", componentArt: "032025-04", name: "Polished Chrome Tailpipe Tip", price: 39.00 },
        { id: 105, x: 440, y: 250, width: 65, height: 45, callout: "5", componentArt: "032025-05", name: "Heavy-Duty Rubber Exhaust Hangers", price: 14.50 },
      ]
    },
    {
      id: "diag_brake",
      title: "Front Axle Ventilated Disc Brake & Caliper Assembly",
      subtitle: "Diagram No. 045110 · Caliper Carrier, Slide Pins & Rotor Assembly",
      system: "Braking",
      imageUrl: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1200&q=80",
      viewBox: "0 0 850 450",
      hotspots: [
        { id: 201, x: 180, y: 150, width: 110, height: 110, callout: "1", componentArt: "0 986 479 042", name: "Brake Disc Rotor (Ventilated 330mm)", price: 89.00 },
        { id: 202, x: 330, y: 140, width: 95, height: 75, callout: "2", componentArt: "0 986 424 797", name: "Brake Pad Set (Front Axle Low-Metallic)", price: 48.00 },
        { id: 203, x: 460, y: 130, width: 110, height: 90, callout: "3", componentArt: "0 986 474 120", name: "Brake Caliper Housing & Single Piston", price: 142.00 },
        { id: 204, x: 600, y: 160, width: 70, height: 50, callout: "4", componentArt: "1 987 476 100", name: "Brake Pad Wear Sensor Cable", price: 16.50 },
        { id: 205, x: 410, y: 240, width: 80, height: 45, callout: "5", componentArt: "1 987 474 990", name: "Anti-Rattle Guide Springs & Shims", price: 19.00 },
      ]
    },
    {
      id: "diag_engine",
      title: "Cylinder Head & Valve Timing Chain Drive",
      subtitle: "Diagram No. 028100 · Camshaft Sprockets, Hydraulic Tensioner & Guides",
      system: "Engine",
      imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80",
      viewBox: "0 0 850 450",
      hotspots: [
        { id: 301, x: 160, y: 130, width: 100, height: 90, callout: "1", componentArt: "553 0123 10", name: "Intake Camshaft VVT Sprocket / Phaser", price: 210.00 },
        { id: 302, x: 300, y: 125, width: 95, height: 90, callout: "2", componentArt: "553 0124 10", name: "Exhaust Camshaft VVT Sprocket", price: 195.00 },
        { id: 303, x: 430, y: 150, width: 80, height: 120, callout: "3", componentArt: "553 0125 10", name: "Duplex Timing Chain Assembly", price: 74.00 },
        { id: 304, x: 550, y: 170, width: 75, height: 60, callout: "4", componentArt: "553 0126 10", name: "Hydraulic Chain Tensioner Unit", price: 58.00 },
        { id: 305, x: 370, y: 260, width: 100, height: 50, callout: "5", componentArt: "553 0127 10", name: "Curved Tensioner Guide Rail", price: 32.00 },
      ]
    }
  ];

  if (articleNr) {
    const art = ARTICLES.find((a: any) => a.ART_ARTICLE_NR === articleNr);
    if (art && art.HOTSPOTS) {
      return NextResponse.json({
        article: art,
        hotspots: art.HOTSPOTS
      });
    }
  }

  return NextResponse.json({
    total: diagrams.length,
    diagrams
  });
}
