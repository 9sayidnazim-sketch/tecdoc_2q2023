# TecDoc 2Q 2023 / 2018 / 2017 - Automotive Aftermarket Database & SDK Platform

Complete TecDoc database catalog, Pegasus 3.0 Web Service API SDK, VIN Decoder, and Interactive SQL Workbench.

## Overview

**TecDoc 2Q 2023** is a comprehensive automotive aftermarket parts and vehicle database. It provides cross-referenced parts data across global vehicle manufacturers and aftermarket suppliers:
- **Part Numbers & Descriptions**: Multi-language article descriptions and specifications.
- **Technical Criteria**: Dimensions, voltage, fitting positions, threads, and material specs.
- **High-Definition WebP Media**: Component photos, technical drawings, and exploded assembly schematics.
- **Cross-References (OE & Aftermarket)**: OE part replacements, competitor interchanges, and supersessions.
- **EAN Codes & Trade Numbers**: Barcode identifiers and industry trade reference numbers.
- **Accessories & Bills of Materials (BOM)**: Repair kits, assemblies, and optional component lists.
- **Vehicle Linkage & Fitment**: Passenger car and commercial vehicle compatibility linkages.
- **Standardized Assembly Tree**: Hierarchical categorization trees for quick component navigation.

## Multi-Schema Support

1. **TecDoc 2Q 2023 (Standard)**: Comprehensive relational schema (`ARTICLES`, `PASSENGER_CARS`, `COMMERCIAL_VEHICLES`, `SEARCH_TREE`, `LINK_ART_GA`, etc.).
2. **TecDoc 2018 (Legacy)**: Legacy lowercase schema with multi-vehicle type classification (`ispassengercar`, `iscommercialvehicle`, `ismotorbike`, `isengine`, `isaxle`).
3. **TecDoc 2017 (Historical)**: Normalized 2017 schema with vehicle type ID filters and engine designations.

## Features & Modules

- **Interactive Vehicle Navigator**: Drill-down from Make -> Model Series -> Engine / Generation -> Vehicle Specifications.
- **Part & Cross-Reference Explorer**: Search parts by number (e.g. `20430`, `5302`, `1878343`), view OEM crosses, fitment, and specs.
- **Interactive Assembly Schematics**: Hotspot-enabled exploded diagrams with interactive coordinates and part highlights.
- **License Plate & KBA Decoder**: Vehicle identification by German KBA HSN/TSN, Dutch Kenteken, and French Cartes Grises Type Mines.
- **ISO 3779 VIN Decoder**: 17-character VIN number validator and decoder (WMI, VDS, VIS, year, plant, check digit).
- **TecDoc SDK & Pegasus 3.0 Web Service Studio**: Production client library (`TecDocClient`) supporting REST, JSON-RPC, and Pegasus 3.0 protocols with interactive code generation in JavaScript, TypeScript, Python, PHP, and cURL.
- **Autodoc Automotive News & Technical Portal**: Automotive engineering news, workshop service bulletins, component analysis, category filtering, and technical bulletin publisher with image preview and local storage persistence.
- **SQL Query Workbench**: 42 curated queries with syntax highlighting, parameter controls, table references, and execution evaluation.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Development Server
```bash
npm install
npm run dev
```
The application will launch at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

### TecDoc SDK Usage Example
```javascript
import { TecDocClient, autodocService } from './src/services/tecdocSdk.js';

const client = new TecDocClient({
  providerId: '20240',
  country: 'DE',
  language: 'EN'
});

// Search for passenger car manufacturers
const makes = await client.getManufacturers({ type: 'passenger' });

// Get vehicle details
const car = await client.getVehicleDetails(9877);

// Resolve crosses and OE numbers
const crosses = await client.getPartCrosses(1878343);

// Fetch Autodoc technical bulletins and workshop news
const bulletins = await client.getAutodocNews({ category: 'Technical' });
```

### Autodoc Automotive News Portal Service
```javascript
import { autodocService } from './src/services/autodocService.js';

// Query technical bulletins (supports Category, Search, and Source filters)
const news = await autodocService.getNews({
  category: 'Service',
  query: 'brake',
  source: 'all',
  page: 1,
  pageSize: 10
});

// Publish a custom workshop technical bulletin
const bulletin = autodocService.createNewsItem({
  title: 'Calibrating Electronic Parking Brake (EPB) after Disc Replacement',
  category: 'Service',
  summary: 'Step-by-step diagnostic OBD-II routine for pad bedding and calibration.',
  text: 'Detailed procedure for engaging service mode before caliper retraction...',
  imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
  author: 'Workshop Master Tech'
});
```

## License & Data Credits
TecDoc is a registered trademark of TecAlliance GmbH. Data schemas and structures are provided for catalog exploration and integration development.

