/**
 * Import your own catalogue data.
 *
 *   npm run import -- ./data/catalogue.json        # one JSON file with any of the sections
 *   npm run import -- ./data/csv                    # a folder of CSV files named after the sections
 *   npm run import -- ./parts.csv --section parts   # a single CSV for one section
 *
 * Sections (imported in this order): manufacturers, models, vehicleTypes, brands, assemblyGroups,
 * productGroups, parts, oeNumbers, crossReferences, fitments. See README.md for the columns.
 */
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { importDataset, sections, type Dataset, type Section } from "../src/lib/importer";

function readCsv(file: string): Record<string, string>[] {
  return parse(readFileSync(file, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];
}

/** Accept "vehicleTypes.csv", "vehicle_types.csv" or "vehicle-types.csv". */
function sectionFromFilename(file: string): Section | undefined {
  const base = path.basename(file, path.extname(file)).toLowerCase().replace(/[-_]/g, "");
  return sections.find((s) => s.toLowerCase() === base);
}

function loadDataset(target: string, section?: string): Dataset {
  if (!existsSync(target)) throw new Error(`Not found: ${target}`);
  const stat = statSync(target);

  if (stat.isDirectory()) {
    const dataset: Dataset = {};
    for (const file of readdirSync(target)) {
      if (!file.toLowerCase().endsWith(".csv")) continue;
      const s = sectionFromFilename(file);
      if (!s) {
        console.warn(`Skipping ${file}: file name does not match a section (${sections.join(", ")})`);
        continue;
      }
      (dataset as Record<string, unknown[]>)[s] = readCsv(path.join(target, file));
    }
    return dataset;
  }

  if (target.toLowerCase().endsWith(".json")) {
    const json = JSON.parse(readFileSync(target, "utf8")) as unknown;
    if (Array.isArray(json)) {
      if (!section) throw new Error("A JSON array needs --section <name>");
      return { [section]: json } as Dataset;
    }
    return json as Dataset;
  }

  if (target.toLowerCase().endsWith(".csv")) {
    const s = (section as Section | undefined) ?? sectionFromFilename(target);
    if (!s || !sections.includes(s)) throw new Error(`Use --section <${sections.join("|")}> for ${target}`);
    return { [s]: readCsv(target) } as Dataset;
  }

  throw new Error("Expected a .json file, a .csv file or a folder of .csv files");
}

async function main() {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith("--"));
  const sectionIdx = args.indexOf("--section");
  const section = sectionIdx >= 0 ? args[sectionIdx + 1] : undefined;
  if (!target) {
    console.error("Usage: npm run import -- <file.json | file.csv | csv-folder> [--section <name>]");
    process.exit(1);
  }

  const dataset = loadDataset(path.resolve(target), section);
  const counts = sections.map((s) => `${s}=${dataset[s]?.length ?? 0}`).join(" ");
  console.log(`Importing ${target}\n  rows: ${counts}`);

  const prisma = new PrismaClient();
  const started = Date.now();
  try {
    const stats = await importDataset(prisma, dataset, (m) => console.log(m));
    console.log(`\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s. New records:`);
    console.table(stats.created);
    if (stats.errors.length) {
      console.warn(`${stats.errors.length} row(s) skipped:`);
      stats.errors.slice(0, 50).forEach((e) => console.warn(`  - ${e}`));
      if (stats.errors.length > 50) console.warn(`  ... and ${stats.errors.length - 50} more`);
      process.exitCode = 2;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
