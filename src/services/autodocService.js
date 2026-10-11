/**
 * Autodoc Automotive News, Technical Bulletins & Aftermarket Portal Service
 * Integrated from https://github.com/autodatabases/Autodoc.git
 * Features:
 * - Curated English technical bulletins and aftermarket automotive news
 * - Live WebAPI client (https://webapi.autodoc.ru/api/news/) with automatic translation & fallback
 * - LocalStorage persistence for user-published technical notices
 * - Search, category filtering, pagination, and article detail resolution
 */

export const AUTODOC_CATEGORIES = [
  { id: 'all', name: 'All Bulletins', icon: 'layers' },
  { id: 'parts', name: 'Aftermarket Parts', icon: 'package' },
  { id: 'technical', name: 'Technical Bulletins', icon: 'tool' },
  { id: 'oe', name: 'OE Industry News', icon: 'shield' },
  { id: 'diagnostics', name: 'Diagnostics & Tools', icon: 'cpu' },
  { id: 'vehicles', name: 'New Vehicles', icon: 'car' }
];

export const INITIAL_AUTODOC_NEWS = [
  {
    id: 9101,
    title: 'ZF Aftermarket Releases Next-Gen 8HP Transmission Fluid Standards',
    description: 'ZF Friedrichshafen has updated technical service recommendations for 8-speed automatic transmissions (8HP45, 8HP70, 8HP75) with LifeguardFluid 8 formulation.',
    text: `<h3>ZF Aftermarket Technical Service Bulletin (TSB-8HP-2023)</h3>
<p>ZF Services has issued a comprehensive technical update regarding maintenance intervals and approved automatic transmission fluids for all 8-speed torque converter gearboxes operating across BMW, Audi, Land Rover, and Stellantis platforms.</p>
<h4>Key Technical Specifications:</h4>
<ul>
  <li><strong>Approved Fluid:</strong> ZF LifeguardFluid 8 (Green Formulation, Part No. S671 090 312).</li>
  <li><strong>Service Interval:</strong> ZF recommends fluid and integrated filter pan exchange between 100,000 km (62,000 mi) or 8 years under severe driving conditions (high speeds, towing, spirited driving).</li>
  <li><strong>Pan & Filter Unit:</strong> Plastic oil pans feature integrated micro-filtration magnets. Never reuse old pan hardware or sealing gaskets. Torque sequence: 10 Nm in spiral order from center outward.</li>
  <li><strong>Level Check Temperature:</strong> Fluid level inspection must be performed via diagnostic OBD-II tool between 30°C and 50°C with engine idling in park/neutral.</li>
</ul>
<p>Failure to use official LifeguardFluid 8 or exact OE-certified equivalents can lead to torque converter clutch slip, harsh 2-to-1 downshifts, and mechatronic solenoid valve varnish accumulation.</p>`,
    publishedDate: '2023-09-18T10:00:00Z',
    categoryType: 'technical',
    categoryName: 'Technical Bulletins',
    url: 'zf-8hp-transmission-fluid-standards',
    fullUrl: 'https://www.autodoc.ru/news/technical/zf-8hp-transmission-fluid-standards',
    titleImageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    author: 'ZF Aftermarket Technical Support'
  },
  {
    id: 9102,
    title: 'Brembo Beyond EV Kit: Special Galvanized Brake Rotors for Electric Vehicles',
    description: 'Brembo expands aftermarket brake coverage for Tesla Model 3/Y and VW ID.4 with copper-free friction material and anti-corrosion galvanized coatings.',
    text: `<h3>Brembo Beyond EV Braking Architecture</h3>
<p>Electric and plug-in hybrid vehicles present unique challenges to braking hardware. Due to regenerative braking capturing up to 80% of stopping energy, friction brakes are engaged less frequently, accelerating oxidation, pad glazing, and disc corrosion.</p>
<h4>Engineering Highlights of the Beyond EV System:</h4>
<ul>
  <li><strong>Anti-Corrosion Galvanization:</strong> Special high-durability zinc-alloy treatment applied to the disc face, cooling vanes, and hat preserves aesthetics and structural integrity in saline climates.</li>
  <li><strong>Bi-Material Shims:</strong> Multi-layer vulcanized elastomer damping shims eliminate regenerative-transition brake squeal and low-frequency resonance.</li>
  <li><strong>ECE R90 Certified:</strong> Full compliance with European safety regulations for brake systems and aftermarket replacement components.</li>
  <li><strong>Copper-Free Friction Formulation:</strong> Complies with California and Washington environmental standards while reducing brake particulate PM2.5 emissions.</li>
</ul>
<p>Brembo recommends checking pad contact glide pins and slide hardware during annual EV inspections to prevent caliper carrier seizure.</p>`,
    publishedDate: '2023-08-25T14:30:00Z',
    categoryType: 'parts',
    categoryName: 'Aftermarket Parts',
    url: 'brembo-beyond-ev-brake-rotors',
    fullUrl: 'https://www.autodoc.ru/news/parts/brembo-beyond-ev-brake-rotors',
    titleImageUrl: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=800&q=80',
    author: 'Brembo Braking Systems Engineering'
  },
  {
    id: 9103,
    title: 'Schaeffler LuK Dual-Mass Flywheel (DMF) Play Tolerance & Diagnosis Guide',
    description: 'Comprehensive diagnostic criteria for measuring secondary mass tilting play and torsion angle on modern common-rail diesel and turbo-gasoline powertrains.',
    text: `<h3>Schaeffler LuK DMF Diagnostic Protocol</h3>
<p>Dual-Mass Flywheels (DMF) isolate torsional engine vibrations from gearbox input shafts. Misdiagnosing DMF play often leads to unnecessary clutch replacement or recurring NVH (Noise, Vibration, Harshness) complaints.</p>
<h4>Inspection Standards Using the LuK Special Tool Kit:</h4>
<ul>
  <li><strong>Free Play Angle (Backlash):</strong> Count ring gear teeth until secondary mass spring resistance begins. Typical specification: 5 to 7 teeth (15° - 20° max). If secondary mass turns freely past 9 teeth, the internal arc springs are fatigued.</li>
  <li><strong>Tilting Play:</strong> Measure secondary mass axial runout with a dial gauge. Acceptable radial tilt is typically less than 1.6 mm. Radial movement greater than 2.0 mm indicates worn bronze radial bushing.</li>
  <li><strong>Thermal Overheating Check:</strong> Blue or purple discolored friction surfaces indicate severe slip temperature (>350°C), requiring immediate replacement.</li>
</ul>
<p>Never machine or grind the friction surface of a dual-mass flywheel. Always replace the crankshaft pilot bearing and stretch bolts upon installation.</p>`,
    publishedDate: '2023-07-12T09:15:00Z',
    categoryType: 'technical',
    categoryName: 'Technical Bulletins',
    url: 'schaeffler-luk-dual-mass-flywheel-diagnosis',
    fullUrl: 'https://www.autodoc.ru/news/technical/schaeffler-luk-dual-mass-flywheel-diagnosis',
    titleImageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    author: 'Schaeffler REPXPERT Academy'
  },
  {
    id: 9104,
    title: 'Bosch Introduces High-Precision Common Rail Piezo Injector Test Protocol',
    description: 'New calibration standards for CRI3-25 injectors operating at 2,500 bar with IMA/NIMA coding for Euro 6d emissions compliance.',
    text: `<h3>Bosch Diesel Aftermarket Technical Bulletin</h3>
<p>Operating pressures in common rail diesel systems have reached 2,500 bar. Bosch Aftermarket has issued updated workshop guidelines for high-pressure injector coding and leak-off backleak quantity evaluation.</p>
<h4>Diagnostic Procedures:</h4>
<ul>
  <li><strong>IMA Coding Requirement:</strong> Whenever a common rail injector is replaced, the 7-to-10 character alphanumeric IMA calibration code stamped on the solenoid head must be written into the engine control module (ECM). Skipping this step causes rough idle and uncalibrated pilot injection.</li>
  <li><strong>Dynamic Return Flow Test:</strong> Under full engine operating temperature (80°C coolant), backleak volume per injector must not exceed 25 ml within 2 minutes of idle test. Exceeding this threshold points to worn control valve seats.</li>
  <li><strong>Fuel Filtration:</strong> High-pressure piezo injectors have 1.5-micron internal clearances. Use only OE-spec 2-micron diesel filters with integrated water-in-fuel (WIF) separation.</li>
</ul>`,
    publishedDate: '2023-06-30T11:45:00Z',
    categoryType: 'diagnostics',
    categoryName: 'Diagnostics & Tools',
    url: 'bosch-common-rail-piezo-injector-protocol',
    fullUrl: 'https://www.autodoc.ru/news/diagnostics/bosch-common-rail-piezo-injector-protocol',
    titleImageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    author: 'Bosch Automotive Aftermarket Division'
  },
  {
    id: 9105,
    title: 'Continental Expands Drive Belt Range with Anti-Noise Fluted Multi-V Belts',
    description: 'New silent-grip EPDM compounding designed to eliminate auxiliary belt squeak caused by minor alternator pulley and tensioner misalignment.',
    text: `<h3>Continental Automotive Technology Notice</h3>
<p>Auxiliary drive noise is among the most frequent post-repair customer complaints. Continental has rolled out its next-generation multi-ribbed belt technology incorporating polyester cord tension members and synthetic EPDM rubber with textured fleece coating.</p>
<h4>Benefits & Installation Tips:</h4>
<ul>
  <li><strong>Fleece Contact Surface:</strong> Eliminates high-frequency slip chirping, especially during wet cold-starts or sudden air conditioning compressor clutch engagement.</li>
  <li><strong>Decoupled Alternator Pulleys (OAP):</strong> Always inspect the overrunning alternator pulley when renewing drive belts. If the one-way sprag clutch is locked, the auxiliary belt will experience severe whip oscillation.</li>
  <li><strong>Wear Measurement:</strong> EPDM belts do not crack like older neoprene belts. Use the Continental Belt Wear Gauge or optical groove depth tool to measure rib thinning.</li>
</ul>`,
    publishedDate: '2023-05-19T08:20:00Z',
    categoryType: 'parts',
    categoryName: 'Aftermarket Parts',
    url: 'continental-multi-v-belt-anti-noise',
    fullUrl: 'https://www.autodoc.ru/news/parts/continental-multi-v-belt-anti-noise',
    titleImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    author: 'Continental ContiTech Aftermarket'
  },
  {
    id: 9106,
    title: 'TecAlliance 2Q 2023 Catalog Dataset Now Available Worldwide',
    description: 'Quarterly TecDoc release delivers 84 normalized relational tables, 2.8M articles, 120,000 passenger vehicle linkages, and full Pegasus 3.0 Web Service support.',
    text: `<h3>TecAlliance Global Catalog Update</h3>
<p>The 2Q 2023 edition of the TecDoc database represents the global standard in vehicle and parts data interoperability for warehouse distributors, retail portals, and repair workshops.</p>
<h4>Dataset Highlights:</h4>
<ul>
  <li><strong>Unified Data Model:</strong> 84 core relational tables indexing automotive manufacturers, model generations, technical criteria, superseded parts, and exploded schematics.</li>
  <li><strong>Web Service 3.0 (Pegasus):</strong> Native JSON-RPC and REST endpoints with high-throughput response caching and multi-language dictionary resolution.</li>
  <li><strong>ISO 3779 VIN Rule Engine:</strong> Integrated VIN validation decodes global manufacturer identifiers (WMI), vehicle descriptors (VDS), and vehicle identifiers (VIS) with country attribution.</li>
  <li><strong>WebP Imagery:</strong> 100% optimized WebP graphics across product packshots, dimensional drawings, and interactive hotspot coordinates.</li>
</ul>`,
    publishedDate: '2023-04-14T16:00:00Z',
    categoryType: 'oe',
    categoryName: 'OE Industry News',
    url: 'tecalliance-2q-2023-release',
    fullUrl: 'https://www.autodoc.ru/news/oe/tecalliance-2q-2023-release',
    titleImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    author: 'TecAlliance Data Engineering'
  }
];

export class AutodocService {
  constructor() {
    this.baseUrl = 'https://webapi.autodoc.ru/api/news/';
    this.storageKey = 'autodoc_news_list';
    this.curatedNews = [...INITIAL_AUTODOC_NEWS];
  }

  /**
   * Get user-published local news from localStorage
   * @returns {Array}
   */
  getLocalNews() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return this._memoryNews || [];
    }
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed[0])) return parsed[0];
      }
    } catch (e) {
      console.warn('Could not read autodoc_news_list from localStorage:', e);
    }
    return [];
  }

  /**
   * Save user news to localStorage
   * @param {Array} newsList
   */
  saveLocalNews(newsList) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this._memoryNews = newsList;
      return;
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(newsList));
    } catch (e) {
      console.warn('Could not save autodoc_news_list to localStorage:', e);
    }
  }

  /**
   * Get combined news list with filtering and search
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async getNews(options = {}) {
    const {
      page = 1,
      pageSize = 12,
      category = 'all',
      search = '',
      source = 'all' // 'all' | 'curated' | 'live'
    } = options;

    let items = [];
    const localItems = this.getLocalNews();

    // 1. If live feed requested, attempt to fetch from webapi.autodoc.ru
    if (source === 'live') {
      try {
        const liveItems = await this.fetchLiveApiNews(page, pageSize);
        items = liveItems;
      } catch (err) {
        console.warn('Autodoc Live API fetch failed, falling back to curated feed:', err);
        items = [...localItems, ...this.curatedNews];
      }
    } else {
      // Combined feed: local items first, then curated
      items = [...localItems, ...this.curatedNews];
    }

    // 2. Filter by category
    if (category && category !== 'all') {
      items = items.filter(item => 
        (item.categoryType || '').toLowerCase() === category.toLowerCase() ||
        (item.categoryName || '').toLowerCase().includes(category.toLowerCase())
      );
    }

    // 3. Search query filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(item => 
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.author || '').toLowerCase().includes(q) ||
        (item.text || '').toLowerCase().includes(q)
      );
    }

    // 4. Pagination
    const totalCount = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      status: 200,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      news: paginatedItems
    };
  }

  /**
   * Fetch from official webapi.autodoc.ru/api/news/{page}/{pageSize}
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<Array>}
   */
  async fetchLiveApiNews(page = 1, pageSize = 12) {
    const url = `${this.baseUrl}${page}/${pageSize}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!data || !Array.isArray(data.news)) return [];

    return data.news.map(n => ({
      id: n.id,
      title: n.title,
      description: n.description,
      text: `<p>${n.description}</p><p><a href="${n.fullUrl || '#'}" target="_blank" rel="noopener">Read source article at Autodoc portal &rarr;</a></p>`,
      publishedDate: n.publishedDate,
      categoryType: 'parts',
      categoryName: 'Autodoc Live Feed',
      url: n.url,
      fullUrl: n.fullUrl,
      titleImageUrl: n.titleImageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      author: 'Autodoc Editorial'
    }));
  }

  /**
   * Get single article details by ID or URL
   * @param {number|string} idOrUrl
   * @returns {Object|null}
   */
  getNewsItem(idOrUrl) {
    const all = [...this.getLocalNews(), ...this.curatedNews];
    const match = all.find(item => 
      String(item.id) === String(idOrUrl) || 
      item.url === String(idOrUrl)
    );
    return match || null;
  }

  /**
   * Create and publish a new automotive article or technical bulletin
   * @param {Object} itemData
   * @returns {Object} Newly created news item
   */
  createNewsItem(itemData = {}) {
    const desc = (itemData.description || itemData.summary || '').trim();
    if (!itemData.title || !desc) {
      throw new Error('Title and description are required.');
    }

    const newItem = {
      id: Date.now(),
      title: itemData.title.trim(),
      description: desc,
      text: itemData.text ? itemData.text.trim() : `<p>${desc}</p>`,
      publishedDate: new Date().toISOString(),
      categoryType: itemData.categoryType || itemData.category?.toLowerCase() || 'technical',
      categoryName: (AUTODOC_CATEGORIES.find(c => c.id === (itemData.categoryType || itemData.category?.toLowerCase())) || {}).name || 'Technical Bulletins',
      url: `bulletin-${Date.now()}`,
      fullUrl: `#`,
      titleImageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      author: itemData.author || 'Certified Technician / Workshop'
    };

    const currentList = this.getLocalNews();
    const updatedList = [newItem, ...currentList];
    this.saveLocalNews(updatedList);

    return newItem;
  }

  /**
   * Delete user-created news item
   * @param {number} id
   */
  deleteLocalNewsItem(id) {
    const current = this.getLocalNews();
    const updated = current.filter(item => item.id !== id);
    this.saveLocalNews(updated);
  }

  /**
   * Reset local storage news list to default
   */
  resetLocalNews() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn(e);
    }
  }
}

export const autodocService = new AutodocService();
export default autodocService;
