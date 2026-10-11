import { describe, expect, it } from "vitest";
import {
  editDistance,
  fuzzyFilter,
  looksLikePartNumber,
  matchRank,
  normalizePartNumber,
  normalizeText,
} from "@/lib/normalize";
import { search, getPartDetail, getSearchSuggestions } from "@/lib/search";
import { calculateSellPrice } from "@/lib/ingest/merger";
import { classifyInput } from "@/lib/orchestrator/classifier";
import { redactSecrets, isCircuitOpen, recordProviderFailure, recordProviderSuccess } from "@/lib/orchestrator/resilience";
import { PROVIDER_INVENTORY } from "@/lib/orchestrator/providerRegistry";

describe("Search Normalization & Helpers", () => {
  it("normalizes part numbers by stripping spaces, dashes, slashes, and dots and converting to uppercase", () => {
    expect(normalizePartNumber("0 986-494.124")).toBe("0986494124");
    expect(normalizePartNumber("hu 719/7 x")).toBe("HU7197X");
    expect(normalizePartNumber("04465-60320")).toBe("0446560320");
    expect(normalizePartNumber("04465-02220")).toBe("0446502220");
    expect(normalizePartNumber("P 83 082")).toBe("P83082");
    expect(normalizePartNumber("w 712/75")).toBe("W71275");
    expect(normalizePartNumber(" 34  11  6 780 711 ")).toBe("34116780711");
    expect(normalizeText("  Brake   DISC  Front  ")).toBe("brake disc front");
  });

  it("identifies whether input looks like a part number", () => {
    expect(looksLikePartNumber("0 986 494 124")).toBe(true);
    expect(looksLikePartNumber("04465-60320")).toBe(true);
    expect(looksLikePartNumber("W712/75")).toBe(true);
    expect(looksLikePartNumber("brake disc front 300mm")).toBe(false);
  });

  it("calculates edit distance correctly for typo tolerance", () => {
    expect(editDistance("corolla", "corola")).toBe(1);
    expect(editDistance("brembo", "brenbo")).toBe(1);
    expect(editDistance("toyota", "nissan")).toBeGreaterThan(3);
  });

  it("filters dropdown options with typo tolerance", () => {
    const list = [
      { id: 1, name: "Toyota Land Cruiser" },
      { id: 2, name: "Nissan Patrol" },
      { id: 3, name: "Brembo Prime" },
    ];
    const result = fuzzyFilter(list, "cruiser", (i) => i.name);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.name).toBe("Toyota Land Cruiser");
  });

  it("calculates match rank correctly", () => {
    expect(matchRank("0986", "0986")).toBe(3);
    expect(matchRank("0986", "0986494124")).toBe(2);
    expect(matchRank("494", "0986494124")).toBe(1);
  });
});

describe("Ingest & Business Rules (UAE Pricing & Margin)", () => {
  it("calculates UAE retail price with markup and 5% VAT correctly", () => {
    // cost 100, markup 25% (1.25), 5% VAT (1.05) -> 100 * 1.25 * 1.05 = 131.25
    const price = calculateSellPrice(100, "STANDARD_25");
    expect(price).toBe(131.25);

    // cost 200, 20% markup -> 200 * 1.20 * 1.05 = 252.00
    const price20 = calculateSellPrice(200, "MARGIN_20");
    expect(price20).toBe(252);
  });
});

describe("Unified Search Engine with Canonical Database", () => {
  it("finds a part by exact part number within 300 ms", async () => {
    const start = performance.now();
    const res = await search({
      q: "0 986 494 124",
      mode: "number",
      exact: true,
      page: 1,
      pageSize: 10,
      include: "full",
    });
    const took = performance.now() - start;

    expect(took).toBeLessThan(300);
    expect(res.total).toBeGreaterThanOrEqual(1);
    const first = res.items[0];
    expect(first?.kind).toBe("part");
    if (first?.kind === "part") {
      expect(first.partNumber).toBeDefined();
      expect(first.brand.name).toBeDefined();
      expect(first.matchedValue).toContain("0 986 494 124");
      expect(first.price).toBeDefined();
      expect(first.primaryImage).toBeDefined();
    }
  });

  it("finds parts by OE number (e.g. 04465-60320)", async () => {
    const res = await search({
      q: "04465-60320",
      mode: "number",
      exact: false,
      page: 1,
      pageSize: 10,
      include: "full",
    });

    expect(res.total).toBeGreaterThanOrEqual(1);
    const first = res.items[0];
    expect(first?.kind).toBe("part");
    if (first?.kind === "part") {
      expect(first.matchedOn).toBe("OE");
      expect(first.matchedValue).toBe("04465-60320");
    }
  });

  it("finds parts across aftermarket cross references (e.g. P 83 082)", async () => {
    const res = await search({
      q: "P 83 082",
      mode: "number",
      exact: false,
      page: 1,
      pageSize: 10,
      include: "full",
    });

    expect(res.total).toBeGreaterThanOrEqual(1);
    const first = res.items[0];
    expect(first?.kind).toBe("part");
    if (first?.kind === "part") {
      expect(first.matchedOn).toBe("EQUIVALENT");
    }
  });

  it("finds vehicles in vehicle mode", async () => {
    const res = await search({
      q: "Toyota",
      mode: "vehicle",
      exact: false,
      page: 1,
      pageSize: 10,
      include: "full",
    });

    expect(res.total).toBeGreaterThanOrEqual(1);
    const first = res.items[0];
    expect(first?.kind).toBe("vehicle");
    if (first?.kind === "vehicle") {
      expect(first.vehicle.manufacturer).toBe("Toyota");
      expect(first.partCount).toBeGreaterThan(0);
    }
  });

  it("provides typeahead search suggestions", async () => {
    const suggestions = await getSearchSuggestions("0986");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.text).toContain("0 986");
  });

  it("returns full part details with UAE AED price, verified fitment and images", async () => {
    const searchRes = await search({
      q: "0 986 494 124",
      mode: "number",
      exact: true,
      page: 1,
      pageSize: 1,
      include: "full",
    });

    const first = searchRes.items[0];
    expect(first).toBeDefined();
    if (first?.kind === "part") {
      const detail = await getPartDetail(first.id);
      expect(detail).not.toBeNull();
      expect(detail?.partNumber).toBeDefined();
      expect(detail?.oeNumbers.length).toBeGreaterThan(0);
      expect(detail?.crossReferences.length).toBeGreaterThan(0);
      expect(detail?.fitments.length).toBeGreaterThan(0);
      expect(detail?.price).toBeDefined();
      expect(detail?.price?.currency).toBe("AED");
      expect(detail?.images.length).toBeGreaterThan(0);

      // Verify internal data is NOT exposed
      expect((detail as any).cost).toBeUndefined();
      expect((detail as any).supplier).toBeUndefined();
      expect((detail as any).marginRule).toBeUndefined();
    }
  });

  it("attaches source attribution and provider statuses to search responses", async () => {
    const res = await search({
      q: "0 986 494 124",
      mode: "all",
      exact: false,
      page: 1,
      pageSize: 5,
      include: "full",
    });

    expect(res.providerStatuses).toBeDefined();
    expect(res.providerStatuses?.length).toBeGreaterThanOrEqual(4);
    const pgStatus = res.providerStatuses?.find((s) => s.providerId === "canonical_pg");
    expect(pgStatus?.status).toBe("VERIFIED_WORKING");

    const first = res.items[0];
    if (first?.kind === "part") {
      expect(first.sources).toBeDefined();
      expect(first.sources?.length).toBeGreaterThanOrEqual(1);
      expect(first.sources?.[0]?.providerName).toBeDefined();
    }
  });

  it("correctly identifies German KBA 0005/AZC and populates vehicle context", async () => {
    const res = await search({
      q: "0005/AZC",
      mode: "kba",
      exact: false,
      page: 1,
      pageSize: 5,
      include: "full",
    });

    expect(res.context?.vehicle).toBeDefined();
    expect(res.context?.vehicle?.manufacturer).toBe("BMW");
    expect(res.context?.vehicle?.name).toContain("0005/AZC");
  });

  it("correctly identifies 17-character ISO VIN and decodes manufacturer", async () => {
    const res = await search({
      q: "WBA3A5C59DF123456",
      mode: "vin",
      exact: false,
      page: 1,
      pageSize: 5,
      include: "full",
    });

    expect(res.context?.vehicle).toBeDefined();
    expect(res.context?.vehicle?.manufacturer).toContain("BMW");
  });
});

describe("Backend Orchestrator & Input Classifier", () => {

  it("preserves leading zeros and classifies supported input formats deterministically", () => {
    // 1. Article number with leading zero and spaces
    const art = classifyInput("0 986 494 124");
    expect(art.rawInput).toBe("0 986 494 124");
    expect(art.normalizedInput).toBe("0986494124");
    expect(art.category).toBe("ARTICLE_NUMBER");

    // 2. Toyota OE reference with hyphen and leading zero
    const oe = classifyInput("04465-60320");
    expect(oe.rawInput).toBe("04465-60320");
    expect(oe.normalizedInput).toBe("0446560320");
    expect(oe.category).toBe("OE_REFERENCE");

    // 3. 17-character ISO VIN
    const vin = classifyInput("JT3HN86R720123456");
    expect(vin.category).toBe("VIN");
    expect(vin.cleanedInput).toBe("JT3HN86R720123456");

    // 4. German KBA HSN/TSN
    const kba = classifyInput("0005 AZC");
    expect(kba.category).toBe("KBA");
    expect(kba.cleanedInput).toBe("0005/AZC");

    // 5. EAN barcode (13 digits)
    const ean = classifyInput("4047024823145");
    expect(ean.category).toBe("EAN_BARCODE");
    expect(ean.cleanedInput).toBe("4047024823145");

    // 6. Free text descriptive search
    const text = classifyInput("brake pad land cruiser");
    expect(text.category).toBe("DESCRIPTIVE_TEXT");
  });

  it("redacts sensitive provider credentials and tokens from diagnostic logs", () => {
    const raw = "Connecting to Pegasus with api_key=tecdoc_partner_secret_9988 and token=octaspards-admin-secret-key-2026";
    const redacted = redactSecrets(raw);
    expect(redacted).not.toContain("tecdoc_partner_secret_9988");
    expect(redacted).not.toContain("octaspards-admin-secret-key-2026");
    expect(redacted).toContain("[REDACTED_SECRET]");
  });

  it("manages circuit breaker failure tripping and recovery", () => {
    expect(isCircuitOpen("canonical_pg")).toBe(false);
    recordProviderFailure("tecdoc_pegasus", new Error("Simulated network timeout"));
    recordProviderFailure("tecdoc_pegasus", new Error("Simulated network timeout"));
    recordProviderFailure("tecdoc_pegasus", new Error("Simulated network timeout"));
    expect(isCircuitOpen("tecdoc_pegasus")).toBe(true);

    // Reset circuit
    recordProviderSuccess("tecdoc_pegasus");
    expect(isCircuitOpen("tecdoc_pegasus")).toBe(false);
  });

  it("verifies provider inventory has complete metadata and explicit states", () => {
    const providers = Object.values(PROVIDER_INVENTORY);
    expect(providers.length).toBeGreaterThanOrEqual(6);

    for (const p of providers as any[]) {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.purpose).toBeDefined();
      expect(p.actualOperations.length).toBeGreaterThan(0);
      expect(p.requiredInputs.length).toBeGreaterThan(0);
      expect(p.authLocation).toBeDefined();
      expect(p.entitlement).toBeDefined();
      expect(["VERIFIED_WORKING", "CONFIGURATION_REQUIRED", "ACCESS_UNAVAILABLE", "TEMPORARILY_FAILING"]).toContain(p.status);
    }
  });
});

