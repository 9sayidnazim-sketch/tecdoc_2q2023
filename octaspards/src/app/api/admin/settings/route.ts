import { NextRequest, NextResponse } from "next/server";
import { PROVIDER_INVENTORY, testProviderConnection } from "@/lib/orchestrator/providerRegistry";
import type { ProviderId } from "@/lib/orchestrator/types";

function checkAdminAuth(req: NextRequest): boolean {
  const token =
    req.headers.get("x-admin-token") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(req.url).searchParams.get("token");
  const adminToken = process.env.ADMIN_TOKEN || "octaspards-admin-secret-key-2026";
  return Boolean(token && token === adminToken);
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator authorization required to inspect integration settings." },
      { status: 401 }
    );
  }

  const providers = Object.values(PROVIDER_INVENTORY);
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalProviders: providers.length,
    providers,
    settings: {
      defaultCurrency: process.env.DEFAULT_CURRENCY || "AED",
      uaeVatPercent: parseFloat(process.env.UAE_VAT_PERCENT || "5.0"),
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      tecdocKeyConfigured: Boolean(process.env.TECDOC_API_KEY && !process.env.TECDOC_API_KEY.includes("placeholder")),
      oemEpcConfigured: Boolean(process.env.OEM_EPC_API_KEY && !process.env.OEM_EPC_API_KEY.includes("placeholder")),
      autodocConfigured: Boolean(process.env.AUTODOC_FEED_API_KEY && !process.env.AUTODOC_FEED_API_KEY.includes("placeholder")),
      dubaiSupplierConfigured: Boolean(process.env.DUBAI_SUPPLIER_FEED_KEY && !process.env.DUBAI_SUPPLIER_FEED_KEY.includes("placeholder")),
    },
  });
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator authorization required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, providerId } = body;

    if (action === "test_connection") {
      if (!providerId || !PROVIDER_INVENTORY[providerId as ProviderId]) {
        return NextResponse.json(
          { error: `Invalid providerId: ${providerId}` },
          { status: 400 }
        );
      }

      const testResult = await testProviderConnection(providerId as ProviderId);
      return NextResponse.json({
        providerId,
        ...testResult,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "test_all") {
      const results: Record<string, any> = {};
      const keys = Object.keys(PROVIDER_INVENTORY) as ProviderId[];
      for (const k of keys) {
        results[k] = await testProviderConnection(k);
      }
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        results,
      });
    }

    return NextResponse.json(
      { error: `Unsupported admin action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process admin request" },
      { status: 500 }
    );
  }
}
