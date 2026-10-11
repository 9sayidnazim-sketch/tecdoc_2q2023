# Octaspards — Automotive Spare-Parts Catalogue & Finder

**Octaspards** is a production-ready automotive spare-parts catalogue and cross-reference finder built with Next.js (App Router), TypeScript, Tailwind CSS, and PostgreSQL + Prisma with full-text search (`pg_trgm` and `tsvector`).

It visually mirrors the layout and workflow of industry-standard automotive portals (TecDoc-style) using the **Octaspards** identity, custom mechanical emblem, and an English / Arabic (RTL) toggle.

---

## Architecture & Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript (strict mode enabled, zero `any`, zero warnings)
- **Styling**: Tailwind CSS with custom CSS variables & Roboto font
- **Database**: PostgreSQL 16 (in Docker Compose) + Prisma ORM 6
- **Search Engine**:
  - `pg_trgm` (trigram similarity and GIN indexes)
  - `tsvector` with language-neutral full-text indexing
  - Normalized part number indexing (spaces, dashes, dots, and case are stripped)
  - Sub-300ms query response times
- **Internationalization**: Bilingual English (LTR) and Arabic (RTL) with instant UI direction toggle
- **Testing**:
  - **Unit tests**: Vitest for search normalisation, typo tolerance, OE lookup, and crosses
  - **End-to-End tests**: Playwright (Chrome) covering cascading dropdowns, number search, exact search, and recent search persistence

---

## Color Palette & Design Tokens

Defined in [`src/app/globals.css`](./src/app/globals.css) and [`tailwind.config.ts`](./tailwind.config.ts):

| Token | Hex Value | Usage |
|---|---|---|
| **Primary Blue** | `#1F4FE0` | Navigation pill, active buttons, part links, brand accents |
| **Primary Hover** | `#183EB5` | Hover state for primary buttons |
| **Disabled Blue** | `#7FA6F5` | Disabled state for "Find parts" button |
| **Accent Orange** | `#F26B3A` | Search submit button, promo highlights |
| **Accent Hover** | `#DE5A2A` | Hover state for search button |
| **Background** | `#FFFFFF` / `#F8FAFC` | Page body and card background |
| **Headings** | `#111827` | Section titles and part numbers |
| **Placeholder / Muted** | `#6B7280` | Input placeholder text and sub-labels |
| **Borders** | `#E5E7EB` / `#E2E8F0` | 1px card and divider borders |
| **Typography** | `Roboto` (EN) / `Cairo` (AR) | Clean modern automotive typography |

---

## Layout & Features

1. **Top Nav**:
   - Active pill "Home Page", followed by *Products & Solutions*, *Catalogues*, *Careers*, *Newsletter*, *Feedback*, *Contact Us*, *About us* (with dropdown chevrons).
   - Quick link to the promo banners management panel (`/admin/banners`).
2. **Header**:
   - Custom SVG Octaspards emblem with geometric gear and speed teeth.
   - Global search bar with blue mode dropdown (*Number search*, *Vehicle search*, *Brand search*).
   - Text input supporting OE numbers, part numbers, and cross-references.
   - "Exact search" checkbox.
   - Accent orange search button with magnifying glass icon.
   - User account icon, country selector dropdown, and bilingual EN / AR toggle.
3. **Find Parts Card** (~2/3 width):
   - **Cascading vehicle dropdowns**: Manufacturer &rarr; Model type &rarr; Type (engine code, power, fuel). Each dropdown is disabled until the previous is selected.
   - **Brand and Product group**: Searchable dropdowns placed side by side.
   - **Assembly Group**: Searchable dropdown filtering product groups.
   - **Find parts button**: Disabled (`#7FA6F5`) until a valid selection is made, active in primary blue (`#1F4FE0`).
4. **Promo Carousel** (~1/3 width):
   - Promotional slider with editable banners from the admin panel (`/admin/banners`).
   - Prev/next arrows, dot indicators, and pause-on-hover.
5. **Recent Search Row**:
   - Circular brand badges (*Buick, Chevrolet, Honda, Isuzu, Kia, Mazda, Mercedes-Benz, Nissan, Suzuki, Toyota, BMW, Volkswagen...*).
   - Persisted per user in PostgreSQL via cookie identifier (`oct_uid`).
   - Expandable via "Load More" / "Show Less" toggle.
6. **Search Results & Fitment**:
   - Cards displaying part number, brand, product group, assembly group, and matched reason badge (`PART`, `OE`, `EQUIVALENT`, `SUPERSEDES`, `SUPERSEDED_BY`).
   - OE equivalents and cross-reference previews.
   - Number of compatible vehicles.
   - "View Details" modal with complete technical specifications, full OE numbers, clickable cross-references, and vehicle fitment lists.
   - Server-side pagination.

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://octaspards:octaspards@localhost:5433/octaspards?schema=public"

# Token for managing banners at /admin/banners or POST /api/banners
ADMIN_TOKEN="octaspards-admin"
```

---

## Setup & Running Locally

### 1. Start the Database
The project includes a `docker-compose.yml` configured on port `5433`:
```bash
docker compose up -d db
```

### 2. Apply Migrations & Seed Sample Data
```bash
npm run db:migrate
npm run db:seed
```
The seed script loads:
- **16 manufacturers** (Toyota, Lexus, Nissan, Honda, Hyundai, Kia, Mazda, Mercedes-Benz, BMW, Volkswagen, Chevrolet, Buick, Isuzu, Suzuki, Ford, Mitsubishi)
- **49 models** & **96 vehicle types**
- **33 aftermarket brands** (Bosch, Brembo, TRW, Mann-Filter, Mahle, Denso, NGK, KYB, Sachs, Lemförder, Gates, ContiTech, Valeo, SKF, Hella...)
- **12 assembly groups** & **26 product groups** (with English & Arabic names)
- **300 parts** with technical specifications
- **539 OE numbers**
- **1,084 cross-references and supersessions**
- **1,699 vehicle fitments**

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## How to Import Your Own Data

The project includes a high-performance importer in [`src/lib/importer.ts`](./src/lib/importer.ts) and a CLI in [`scripts/import.ts`](./scripts/import.ts). Rows match on natural keys (names and part numbers), so importing is safe to run repeatedly.

### Import Commands

```bash
# 1. Import a complete JSON catalogue file
npm run import -- ./data/my-catalogue.json

# 2. Import a folder of CSV files
npm run import -- ./data/csv-folder

# 3. Import a single CSV file for a specific section
npm run import -- ./parts.csv --section parts
```

### CSV Folder Format
When pointing to a folder, the CLI reads CSV files matching section names:
- `manufacturers.csv`
- `models.csv`
- `vehicleTypes.csv`
- `brands.csv`
- `assemblyGroups.csv`
- `productGroups.csv`
- `parts.csv`
- `oeNumbers.csv`
- `crossReferences.csv`
- `fitments.csv`

Sample CSV files are provided in [`data/sample-import/`](./data/sample-import/).

#### `parts.csv` Column Example
```csv
brand,partNumber,name,nameAr,description,productGroup,assemblyGroup,specs
Valeo,301 563,Brake Pad Set Front Axle,طقم تيل فرامل أمامي,Low-dust ceramic compound,Brake Pad Set,Braking System,"{""Width [mm]"":131.6,""Thickness [mm]"":18.4}"
```

#### `oeNumbers.csv` Column Example
```csv
brand,partNumber,number,manufacturer
Valeo,301 563,1612293880,Peugeot
```

#### `crossReferences.csv` Column Example
```csv
brand,partNumber,crossBrand,number,type
Valeo,301 563,Bosch,0 986 494 863,EQUIVALENT
Valeo,301 563,Valeo,301 450,SUPERSEDES
```

#### `fitments.csv` Column Example
```csv
brand,partNumber,manufacturer,model,vehicleType
Valeo,301 563,Peugeot,208 II,1.2 PureTech 100
```

---

## API Reference

### 1. `GET /api/search`
Unified search endpoint used by the global search bar and vehicle filters.

**Parameters**:
- `q`: Search string (part number, OE number, vehicle name, brand)
- `mode`: `"number"` | `"vehicle"` | `"brand"` (default: `"number"`)
- `exact`: `true` | `false` (default: `false`)
- `page`: Page number (default: `1`)
- `pageSize`: Results per page (default: `20`, max: `50`)
- `manufacturerId`, `modelId`, `vehicleTypeId`: Filter by vehicle hierarchy
- `brandId`, `productGroupId`, `assemblyGroupId`: Filter by parts classification

### 2. `GET /api/catalog`
Provides cascading options for dropdown menus.

**Parameters**:
- `kind`: `"manufacturers"` | `"models"` | `"types"` | `"brands"` | `"product-groups"` | `"assembly-groups"`
- `manufacturerId`: Required when `kind=models`
- `modelId`: Required when `kind=types`
- `assemblyGroupId`: Optional filter for product groups
- `vehicleTypeId`: Optional filter to list only compatible brands and groups

### 3. `GET /api/recents` & `POST /api/recents`
- `GET`: Returns the user's recently searched manufacturers (backfilled from catalog if fewer than limit).
- `POST`: `{ "manufacturerId": 1 }` records a user search and moves the brand to the top.

### 4. `GET /api/parts/:id`
Returns full part specifications, all OE numbers with manufacturers, cross-references with supersession links, and all vehicle fitments.

### 5. `GET /api/banners` & `POST /api/banners`
- `GET`: Active promo banners.
- `POST`: Create banner (requires `x-admin-token: octaspards-admin`).

---

## Testing & Quality Verification

Run the full verification suite:

```bash
# 1. Vitest unit tests (normalization, typo tolerance, database queries)
npm test

# 2. Playwright end-to-end tests (cascading dropdowns, search, RTL toggle)
npm run test:e2e

# 3. TypeScript type check
npm run typecheck

# 4. ESLint check (zero warnings)
npm run lint
```
