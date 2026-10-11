/**
 * Deterministic Input Classifier for Automotive Parts Identification
 * Preserves leading zeros, spaces, and punctuation nuances.
 */

import type { InputClassification } from "./types";
import { normalizePartNumber, looksLikePartNumber } from "../normalize";

export function classifyInput(rawQuery: string, _countryContext?: string): InputClassification {
  const original = rawQuery || "";
  const trimmed = original.trim();
  const upper = trimmed.toUpperCase();

  // Strip excessive whitespace but preserve single spaces
  const cleaned = trimmed.replace(/\s+/g, " ");
  // Normalized format (uppercase alphanumeric only)
  const normalized = normalizePartNumber(cleaned);

  const variantsSet = new Set<string>();
  // 1. Always preserve original
  variantsSet.add(original);
  if (cleaned !== original) variantsSet.add(cleaned);
  // 2. Add upper variant
  variantsSet.add(upper);
  // 3. Add normalized alphanumeric (if non-empty)
  if (normalized) variantsSet.add(normalized);
  // 4. Add hyphenated and unhyphenated variants
  if (cleaned.includes("-")) {
    variantsSet.add(cleaned.replace(/-/g, " "));
    variantsSet.add(cleaned.replace(/-/g, ""));
  }
  if (cleaned.includes("/")) {
    variantsSet.add(cleaned.replace(/\//g, " "));
    variantsSet.add(cleaned.replace(/\//g, "-"));
    variantsSet.add(cleaned.replace(/\//g, ""));
  }
  if (cleaned.includes(".")) {
    variantsSet.add(cleaned.replace(/\./g, ""));
  }

  const variants = Array.from(variantsSet).filter(Boolean);

  // 1. Check for explicit prefix
  if (/^VIN:\s*/i.test(cleaned)) {
    const vinCode = cleaned.replace(/^VIN:\s*/i, "").trim().toUpperCase();
    return {
      category: "VIN",
      rawInput: original,
      cleanedInput: vinCode,
      normalizedInput: normalizePartNumber(vinCode),
      variants: [vinCode],
      isAmbiguous: false,
    };
  }

  if (/^KBA:\s*/i.test(cleaned)) {
    const kbaCode = cleaned.replace(/^KBA:\s*/i, "").trim().replace(/[\s-]+/g, "/").toUpperCase();
    return {
      category: "KBA",
      rawInput: original,
      cleanedInput: kbaCode,
      normalizedInput: normalizePartNumber(kbaCode),
      variants: [kbaCode],
      isAmbiguous: false,
    };
  }

  if (/^(OE|OEM):\s*/i.test(cleaned)) {
    const oeCode = cleaned.replace(/^(OE|OEM):\s*/i, "").trim();
    return {
      category: "OE_REFERENCE",
      rawInput: original,
      cleanedInput: oeCode,
      normalizedInput: normalizePartNumber(oeCode),
      variants,
      isAmbiguous: false,
    };
  }

  // 2. ISO 3779 standard 17-char VIN
  // No letters I, O, Q allowed in ISO VIN
  if (/^[A-HJ-NPR-Z0-9]{17}$/i.test(cleaned)) {
    return {
      category: "VIN",
      rawInput: original,
      cleanedInput: upper,
      normalizedInput: normalizePartNumber(upper),
      variants: [upper],
      isAmbiguous: false,
    };
  }

  // 3. German KBA HSN / TSN format (4 digits, delimiter, 3 alphanumeric chars)
  // Example: 0005/AZC, 0005 AZC, 0005-AZC, 0005AZC
  const kbaMatch = cleaned.match(/^(\d{4})[\s/-]([A-Za-z0-9]{3})$/i);
  if (kbaMatch && kbaMatch[1] && kbaMatch[2]) {
    const hsn = kbaMatch[1];
    const tsn = kbaMatch[2].toUpperCase();
    const canonicalKba = `${hsn}/${tsn}`;
    return {
      category: "KBA",
      rawInput: original,
      cleanedInput: canonicalKba,
      normalizedInput: `${hsn}${tsn}`,
      variants: [canonicalKba, `${hsn} ${tsn}`, `${hsn}-${tsn}`],
      isAmbiguous: false,
    };
  }

  // 4. GTIN / EAN Barcode (8, 12, 13, 14 purely numeric digits)
  if (/^\d{8}$|^\d{12,14}$/.test(cleaned)) {
    // Note: Some pure numeric article numbers exist (e.g. 0986494124 has 10 digits).
    // An 8 or 13-digit number is primarily an EAN/GTIN barcode, but could also be an OE/article number.
    const isStandardEan13 = cleaned.length === 13;
    return {
      category: isStandardEan13 ? "EAN_BARCODE" : "AMBIGUOUS_NUMBER",
      rawInput: original,
      cleanedInput: cleaned,
      normalizedInput: normalized,
      variants,
      isAmbiguous: !isStandardEan13,
      ambiguousCandidates: [
        { type: "EAN_BARCODE", label: `EAN / GTIN Barcode (${cleaned})`, variant: cleaned },
        { type: "ARTICLE_NUMBER", label: `Manufacturer Article Number (${cleaned})`, variant: cleaned },
        { type: "OE_REFERENCE", label: `OE Reference (${cleaned})`, variant: cleaned },
      ],
    };
  }

  // 5. Registration mark with country context
  // Dutch Kenteken (e.g. 12-AB-34 or 12-ABC-3)
  if (/^\d{2}-[A-Za-z]{2,3}-\d{1,2}$|^\d{2}-[A-Za-z]{2}-[A-Za-z]{2}$/i.test(cleaned)) {
    return {
      category: "REGISTRATION_MARK",
      rawInput: original,
      cleanedInput: upper,
      normalizedInput: normalized,
      countryContext: "NL",
      variants: [upper, normalized],
      isAmbiguous: false,
    };
  }
  // French Cartes Grises (e.g. AB-123-CD)
  if (/^[A-Za-z]{2}-\d{3}-[A-Za-z]{2}$/i.test(cleaned)) {
    return {
      category: "REGISTRATION_MARK",
      rawInput: original,
      cleanedInput: upper,
      normalizedInput: normalized,
      countryContext: "FR",
      variants: [upper, normalized],
      isAmbiguous: false,
    };
  }

  // 6. Typical OE Reference format (contains hyphen, dot, or typical automaker spacing)
  // e.g. 04465-60320 (Toyota), 90915-YZZD2, 11 42 7 566 327 (BMW), 06A 115 561 B (VAG)
  if (/^[0-9A-Za-z]{3,7}-[0-9A-Za-z]{3,7}$/i.test(cleaned) || /^\d{2}\s\d{2}\s\d{1}\s\d{3}\s\d{3}$/.test(cleaned)) {
    return {
      category: "OE_REFERENCE",
      rawInput: original,
      cleanedInput: cleaned,
      normalizedInput: normalized,
      variants,
      isAmbiguous: false,
    };
  }

  // 7. Typical Manufacturer Article Number (TecDoc style)
  // e.g. 0 986 494 124 (Bosch), W 712/75 (Mann), ILKAR5E43 (NGK), 343 315 (KYB), P 83 150 (Brembo)
  if (
    looksLikePartNumber(cleaned) ||
    /^[A-Za-z0-9]{1,4}([\s/-][A-Za-z0-9]{1,6})+$/i.test(cleaned) ||
    /^[A-Za-z]{2,6}\d{2,6}[A-Za-z0-9]*$/i.test(cleaned)
  ) {
    return {
      category: "ARTICLE_NUMBER",
      rawInput: original,
      cleanedInput: cleaned,
      normalizedInput: normalized,
      variants,
      isAmbiguous: false,
    };
  }

  // 8. Ambiguous numeric or alphanumeric strings (e.g. "0986", "60320", "AZC", "12345")
  if (/^[A-Za-z0-9]{3,12}$/i.test(cleaned)) {
    return {
      category: "AMBIGUOUS_NUMBER",
      rawInput: original,
      cleanedInput: cleaned,
      normalizedInput: normalized,
      variants,
      isAmbiguous: true,
      ambiguousCandidates: [
        { type: "ARTICLE_NUMBER", label: `Article Number (${cleaned})`, variant: cleaned },
        { type: "OE_REFERENCE", label: `Genuine OE Reference (${cleaned})`, variant: cleaned },
        { type: "DESCRIPTIVE_TEXT", label: `Product / Model Keyword ("${cleaned}")`, variant: cleaned },
      ],
    };
  }

  // 9. Free-text descriptive search (e.g. "brake pad land cruiser", "mann oil filter", "spark plug")
  return {
    category: "DESCRIPTIVE_TEXT",
    rawInput: original,
    cleanedInput: cleaned,
    normalizedInput: normalized,
    variants: [cleaned, upper],
    isAmbiguous: false,
  };
}
