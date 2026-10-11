import { NextRequest, NextResponse } from "next/server";
import {
  MANUFACTURERS,
  MODELS_SERIES,
  PASSENGER_CARS,
  COMMERCIAL_VEHICLES,
  MOTORBIKES,
  ENGINES,
  AXLES,
} from "@/lib/tecdoc/mockDatabase.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "passenger"; // passenger | commercial | motorbike | engine | axle
  const mfaId = searchParams.get("mfaId");
  const seriesId = searchParams.get("seriesId");
  const carId = searchParams.get("carId");

  // Specific car lookup
  if (carId) {
    const cid = parseInt(carId, 10);
    const pc = PASSENGER_CARS.find((c: any) => c.PC_ID === cid);
    if (pc) {
      const mfa = MANUFACTURERS.find((m: any) => m.MFA_ID === pc.PC_MFA_ID);
      const series = MODELS_SERIES.find((s: any) => s.MS_ID === pc.PC_MS_ID);
      return NextResponse.json({
        found: true,
        type: "passenger",
        vehicle: pc,
        manufacturer: mfa,
        series: series,
      });
    }

    const cv = COMMERCIAL_VEHICLES.find((c: any) => c.CV_ID === cid);
    if (cv) {
      return NextResponse.json({
        found: true,
        type: "commercial",
        vehicle: cv,
      });
    }
  }

  // Filter series by manufacturer
  if (seriesId) {
    const sid = parseInt(seriesId, 10);
    const models = PASSENGER_CARS.filter((c: any) => c.PC_MS_ID === sid);
    return NextResponse.json({
      seriesId: sid,
      models,
    });
  }

  // Filter series by manufacturer ID
  if (mfaId) {
    const mid = parseInt(mfaId, 10);
    const series = MODELS_SERIES.filter((s: any) => s.MS_MFA_ID === mid);
    return NextResponse.json({
      mfaId: mid,
      series,
    });
  }

  // Return full sets by type
  return NextResponse.json({
    type,
    manufacturers: MANUFACTURERS,
    series: MODELS_SERIES,
    passengerCars: PASSENGER_CARS,
    commercialVehicles: COMMERCIAL_VEHICLES,
    motorbikes: MOTORBIKES,
    engines: ENGINES,
    axles: AXLES,
    counts: {
      manufacturers: MANUFACTURERS.length,
      series: MODELS_SERIES.length,
      passengerCars: PASSENGER_CARS.length,
      commercialVehicles: COMMERCIAL_VEHICLES.length,
      motorbikes: MOTORBIKES.length,
      engines: ENGINES.length,
      axles: AXLES.length,
    },
  });
}
