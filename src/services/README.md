# TecDoc SDK & Pegasus 3.0 Client Library

Modern ISO & TecAlliance compliant client SDK for automotive aftermarket parts catalogs, vehicle navigators, and e-commerce platforms.

---

## 🚀 Key Features

- **Multi-Mode Engine**: Runs in Virtual High-Fidelity in-memory mode, connects to live `tecdoc_2q2023` MySQL database servers, or queries official **TecAlliance Pegasus Web Service 3.0** REST/JSON endpoints.
- **Complete Aftermarket Taxonomy**: Full support for Passenger Cars (PC), Commercial Vehicles (CV), Trailer & Drive Axles (Axles), and Motor/Engine units.
- **Cross-Reference & Interchange**: Search by OE number, aftermarket competitor part number, or EAN-13 barcode with OEM equivalence scoring.
- **Bill-of-Materials (BOM)**: Deconstruct repair kits and composite assemblies into individual components, clamps, lubricants, and clips.
- **Global VIN Decoding**: Standardized ISO 3779 / ISO 3780 rules with modulo-11 check digit verification and 1,350+ manufacturer WMI table.
- **Multi-Language Code Generation**: Instant code generation for **JavaScript / TypeScript**, **Python** (`requests`), **PHP** (`tecdoc.class.php`), and **cURL**.

---

## 📦 Installation & Setup

Import directly in your ES Module project:

```javascript
import { TecDocSDK, tecdoc } from './src/services/tecdocSdk.js';

// Initialize custom client
const client = new TecDocSDK({
  apiKey: 'YOUR_TECALLIANCE_API_KEY', // Optional, required for live Pegasus 3.0 REST
  providerId: 2023,                    // Official TecAlliance partner provider ID
  country: 'DE',                       // Default ISO 3166 country code
  lang: 'EN',                          // Default ISO 639 language code
  mode: 'virtual'                      // 'virtual' | 'pegasus_rest' | 'mysql'
});
```

---

## 🛠️ API Reference & Examples

### 1. `getManufacturers(params)`
Retrieve list of linking target manufacturers and vehicle brands.

```javascript
const response = await tecdoc.getManufacturers({
  linkingTargetType: 'P', // 'P' (Cars), 'O' (Trucks), 'A' (Axles), 'M' (Engines)
  country: 'DE',
  lang: 'EN'
});
console.log(response.data.array);
// [ { manuId: 16, manuName: 'BMW' }, { manuId: 74, manuName: 'MERCEDES-BENZ' }, ... ]
```

### 2. `getModelSeries(params)`
Fetch model ranges and construction year intervals for a manufacturer.

```javascript
const models = await tecdoc.getModelSeries({
  manuId: 16, // BMW
  linkingTargetType: 'P'
});
console.log(models.data.array);
// [ { modelId: 5877, modelname: '1 Coupe (E82)', yearOfConstrFrom: 200701, yearOfConstrTo: 201312 }, ... ]
```

### 3. `getVehicleDetails(params)`
Retrieve exact vehicle technical specifications by K-Type ID.

```javascript
const vehicle = await tecdoc.getVehicleDetails({
  vehicleId: 9877 // BMW 1 Series M Coupe
});
console.log(vehicle.data);
// { powerKw: 250, powerHp: 340, capacityCcm: 2979, engineCode: 'N54 B30 A', kbaCode: '0005/AZC' }
```

### 4. `searchArticles(params)`
Search replacement parts by article number, OE number, or EAN barcode.

```javascript
const parts = await tecdoc.searchArticles({
  articleNumber: '20430',
  numberType: 10,       // 0: Article, 1: OE, 6: EAN, 10: Any
  searchExact: true,
  lang: 'EN'
});
console.log(parts.data.array);
```

### 5. `getArticleCrossReferences(params)`
Discover OEM and aftermarket interchangeable cross references.

```javascript
const crosses = await tecdoc.getArticleCrossReferences({
  articleId: 1878343 // SPIDAN 20430
});
console.log(crosses.crossReferences);
// [ { brand: 'AUDI / VW OE', referenceNumber: '8E0 698 151 K', type: 'OEM Original Equipment' }, ... ]
```

### 6. `getArticleBOM(params)`
Retrieve Bill-of-Materials kit constituents for composite parts.

```javascript
const bom = await tecdoc.getArticleBOM({
  articleId: 1878343
});
console.log(bom.components);
// [ { partNumber: '1763277', description: 'Rubber Boot Bellow', quantity: 1 }, ... ]
```

### 7. `decodeVin(params)`
Decode 17-character VIN with ISO 3779 / 3780 rules and modulo-11 check digit.

```javascript
const vinData = tecdoc.decodeVin({
  vin: 'WBAKG71040E123456'
});
console.log(vinData);
// { valid: true, manufacturer: 'BMW', country: 'Germany', checkDigitValid: true, modelYear: '2014' }
```

### 8. `pegasusCall(functionName, requestData)`
Dispatch any low-level official Pegasus 3.0 Web Service method.

```javascript
const raw = await tecdoc.pegasusCall('getLanguages', {
  provider: 2023
});
```

---

## 🌐 Official Pegasus 3.0 Endpoints Reference

| Service Name | Dialect | Endpoint URL | Format |
|---|---|---|---|
| **TecdocToCat** | DLB Bare | `https://webservice.tecalliance.services/pegasus-3-0/services/TecdocToCatDLB.jsonEndpoint` | JSON |
| **TecdocToCat** | DLW Wrapped | `https://webservice.tecalliance.services/pegasus-3-0/services/TecdocToCatDLW.jsonEndpoint` | JSON |
| **TecdocToBusiness** | DLB Bare | `https://webservice.tecalliance.services/pegasus-3-0/services/TecdocToBusinessDLB.jsonEndpoint` | JSON |
| **TecdocToCat SOAP** | WSDL | `https://webservice.tecalliance.services/pegasus-3-0/wsdl/TecdocToCatDLB` | XML / SOAP 1.1 |

---

## 🐍 Python Example

```python
import requests

API_KEY = "YOUR_TECALLIANCE_API_KEY"
ENDPOINT = "https://webservice.tecalliance.services/pegasus-3-0/services/TecdocToCatDLB.jsonEndpoint"

payload = {
    "getManufacturers": {
        "country": "DE",
        "lang": "EN",
        "linkingTargetType": "P",
        "provider": 2023
    }
}

headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
}

response = requests.post(ENDPOINT, json=payload, headers=headers)
print(response.json())
```

---

## 🐘 PHP Example (`tecdoc.class.php`)

```php
<?php
$ch = curl_init('https://webservice.tecalliance.services/pegasus-3-0/services/TecdocToCatDLB.jsonEndpoint');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'getManufacturers' => [
        'country' => 'DE',
        'lang' => 'EN',
        'linkingTargetType' => 'P',
        'provider' => 2023
    ]
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-Key: YOUR_TECALLIANCE_API_KEY'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);
print_r(json_decode($result, true));
```
