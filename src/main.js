import { TECDOC_QUERIES, CATEGORIES, LANGUAGES } from './data/queriesData.js';
import { 
  MANUFACTURERS, 
  MODELS_SERIES, 
  PASSENGER_CARS, 
  COMMERCIAL_VEHICLES,
  MOTORBIKES,
  ENGINES,
  AXLES,
  ARTICLES, 
  SEARCH_TREE, 
  TABLE_METRICS, 
  UNUSED_INDEXES,
  TECDOC_2018_SCHEMA_MAP,
  TECDOC_2017_CR_DELTAS,
  executeTecDocQuery 
} from './data/mockDatabase.js';
import { decodeVIN } from './data/vinDecoder.js';
import { tecdoc, TecDocSDK, autodocService } from './services/tecdocSdk.js';
import { AUTODOC_CATEGORIES } from './services/autodocService.js';

// Application State
const state = {
  activeTab: 'workbench',
  activeCategory: 'all',
  searchQuery: '',
  selectedQueryId: TECDOC_QUERIES[0]?.id || 'q_1',
  queryParameters: {},
  currentResult: null,
  globalLngId: '4', // Default English (@LNGID=4)
  
  // Vehicle navigator state
  selectedVehicleType: 'passenger', // 'passenger' | 'commercial' | 'motorbike' | 'engine' | 'axle'
  selectedBrandId: 16, // BMW
  selectedSeriesId: 5877, // 1 Coupe (E82)
  selectedCarId: 9877, // M Coupe

  // Part explorer state
  currentPart: ARTICLES[0],

  // Engine state
  engineMode: 'virtual' // 'virtual' | 'mysql'
};

// DOM Elements
const elements = {
  // Navigation
  tabs: document.querySelectorAll('.nav-tab'),
  views: document.querySelectorAll('.tab-content'),
  globalLangSelect: document.getElementById('global-lang-select'),
  engineStatusText: document.getElementById('status-mode-text'),
  btnDbConfig: document.getElementById('btn-db-config'),
  dbModal: document.getElementById('db-modal'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancelModal: document.getElementById('btn-cancel-modal'),
  btnSaveModal: document.getElementById('btn-save-modal'),

  // Workbench Sidebar
  categoryFilters: document.getElementById('category-filters'),
  queryList: document.getElementById('query-list'),
  querySearchInput: document.getElementById('query-search-input'),
  querySearchClear: document.getElementById('query-search-clear'),
  sidebarQueryCount: document.getElementById('sidebar-query-count'),

  // Workbench Main
  activeCategoryPill: document.getElementById('active-category-pill'),
  activeQueryTitle: document.getElementById('active-query-title'),
  activeQueryFile: document.getElementById('active-query-file'),
  activeQueryDescription: document.getElementById('active-query-description'),
  activeTablesBadges: document.getElementById('active-tables-badges'),
  paramsForm: document.getElementById('params-form'),
  btnResetParams: document.getElementById('btn-reset-params'),
  btnCopySql: document.getElementById('btn-copy-sql'),
  btnRunQuery: document.getElementById('btn-run-query'),
  sqlCodeDisplay: document.getElementById('sql-code-display'),
  sqlLineCount: document.getElementById('sql-line-count'),
  execStatusBadge: document.getElementById('exec-status-badge'),
  execTime: document.getElementById('exec-time'),
  execRows: document.getElementById('exec-rows'),
  btnExportCsv: document.getElementById('btn-export-csv'),
  btnExportJson: document.getElementById('btn-export-json'),
  resultsEmptyState: document.getElementById('results-empty-state'),
  dataTable: document.getElementById('data-table'),
  dataTableHead: document.getElementById('data-table-head'),
  dataTableBody: document.getElementById('data-table-body'),

  // Vehicle Navigator
  brandsList: document.getElementById('brands-cascade-list'),
  seriesList: document.getElementById('series-cascade-list'),
  modelsList: document.getElementById('models-cascade-list'),
  filterBrands: document.getElementById('filter-brands'),
  selectedBrandLabel: document.getElementById('selected-brand-label'),
  selectedSeriesLabel: document.getElementById('selected-series-label'),
  vehicleSpecsContent: document.getElementById('vehicle-specs-content'),
  vehicleIdBadge: document.getElementById('vehicle-id-badge'),

  // Part Explorer
  partSearchInput: document.getElementById('part-search-input'),
  btnSearchPart: document.getElementById('btn-search-part'),
  partCardBrand: document.getElementById('part-card-brand'),
  partCardNumber: document.getElementById('part-card-number'),
  partCardArtId: document.getElementById('part-card-artid'),
  partCardTitle: document.getElementById('part-card-title'),
  partCardEan: document.getElementById('part-card-ean'),
  partCardPackaging: document.getElementById('part-card-packaging'),
  partCardGeneric: document.getElementById('part-card-generic'),
  partCriteriaGrid: document.getElementById('part-criteria-grid'),
  partBomTitle: document.getElementById('part-bom-title'),
  partBomList: document.getElementById('part-bom-list'),
  crossesTableBody: document.getElementById('crosses-table-body'),
  crossesCountBadge: document.getElementById('crosses-count-badge'),
  fitmentList: document.getElementById('fitment-list'),
  fitmentCountBadge: document.getElementById('fitment-count-badge'),

  // Schematics
  hotspotsLayer: document.getElementById('hotspots-layer'),
  hotspotTooltip: document.getElementById('hotspot-tooltip'),
  tooltipArt: document.getElementById('tooltip-art'),
  tooltipName: document.getElementById('tooltip-name'),
  tooltipCoords: document.getElementById('tooltip-coords'),
  hotspotsTableBody: document.getElementById('hotspots-table-body'),
  hotspotsCount: document.getElementById('hotspots-count'),

  // Plates & VIN
  vinInput: document.getElementById('vin-input'),
  btnDecodeVin: document.getElementById('btn-decode-vin'),
  vinCharCounter: document.getElementById('vin-char-counter'),
  vinAnatomyBar: document.getElementById('vin-anatomy-bar'),
  vinResultsGrid: document.getElementById('vin-results-grid'),
  kbaInput: document.getElementById('kba-input'),
  btnDecodeKba: document.getElementById('btn-decode-kba'),
  kbaResult: document.getElementById('kba-result'),
  kentekenInput: document.getElementById('kenteken-input'),
  btnDecodeKenteken: document.getElementById('btn-decode-kenteken'),
  kentekenResult: document.getElementById('kenteken-result'),
  cartesInput: document.getElementById('cartes-input'),
  btnDecodeCartes: document.getElementById('btn-decode-cartes'),
  cartesResult: document.getElementById('cartes-result'),

  // Schema & Storage & 2018 Evolution & 2017 Deltas
  storageBarsList: document.getElementById('storage-bars-list'),
  unusedIndexesList: document.getElementById('unused-indexes-list'),
  evolutionTableBody: document.getElementById('evolution-table-body'),
  delta2017TableBody: document.getElementById('delta-2017-table-body'),

  // SDK & API Studio
  sdkSelectMethod: document.getElementById('sdk-select-method'),
  sdkMethodBadge: document.getElementById('sdk-method-badge'),
  sdkGroupTargetType: document.getElementById('sdk-group-target-type'),
  sdkParamTargetType: document.getElementById('sdk-param-target-type'),
  sdkGroupManuId: document.getElementById('sdk-group-manu-id'),
  sdkParamManuId: document.getElementById('sdk-param-manu-id'),
  sdkGroupVehicleId: document.getElementById('sdk-group-vehicle-id'),
  sdkParamVehicleId: document.getElementById('sdk-param-vehicle-id'),
  sdkGroupArticleNumber: document.getElementById('sdk-group-article-number'),
  sdkParamArticleNumber: document.getElementById('sdk-param-article-number'),
  sdkGroupArticleId: document.getElementById('sdk-group-article-id'),
  sdkParamArticleId: document.getElementById('sdk-param-article-id'),
  sdkGroupVin: document.getElementById('sdk-group-vin'),
  sdkParamVin: document.getElementById('sdk-param-vin'),
  sdkParamCountry: document.getElementById('sdk-param-country'),
  sdkParamLang: document.getElementById('sdk-param-lang'),
  sdkParamApiKey: document.getElementById('sdk-param-api-key'),
  btnSdkRun: document.getElementById('btn-sdk-run'),
  btnSdkReset: document.getElementById('btn-sdk-reset'),
  sdkLangTabs: document.querySelectorAll('.sdk-lang-tab'),
  btnSdkCopyCode: document.getElementById('btn-sdk-copy-code'),
  sdkCodeDisplay: document.getElementById('sdk-code-display'),
  sdkRespBadge: document.getElementById('sdk-resp-badge'),
  sdkRespTime: document.getElementById('sdk-resp-time'),
  sdkResponseView: document.getElementById('sdk-response-view'),
  sdkRuntimeMode: document.getElementById('sdk-runtime-mode')
};

// Initialize Application
export function initApp() {
  setupNavigation();
  setupGlobalControls();
  setupQuickGuideAndSearch();
  renderCategories();
  renderQueryList();
  selectQuery(state.selectedQueryId);
  setupVehicleNavigator();
  setupPartExplorer();
  setupSchematics();
  setupPlatesDecoder();
  setupVinDecoder();
  setupSchemaMetrics();
  setupSdkStudio();
  setupAutodocPortal();
  setupKeyboardShortcuts();
}

// Helper to switch tabs programmatically
export function navigateToTab(tabName) {
  const targetTabBtn = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
  if (targetTabBtn) {
    targetTabBtn.click();
  }
}

// 1. Navigation & Tabs
function setupNavigation() {
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      elements.tabs.forEach(t => t.classList.remove('active'));
      elements.views.forEach(v => v.classList.remove('active'));
      
      tab.classList.add('active');
      const targetView = document.getElementById(`view-${target}`);
      if (targetView) targetView.classList.add('active');
      state.activeTab = target;
    });
  });
}

function setupQuickGuideAndSearch() {
  // Quick nav cards
  document.querySelectorAll('.quick-nav-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (target) {
        navigateToTab(target);
      }
    });
  });

  // Universal quick search
  const universalInput = document.getElementById('universal-search-input');
  const btnUniversal = document.getElementById('btn-universal-search');

  const executeUniversalSearch = () => {
    const rawTerm = universalInput?.value?.trim() || '';
    if (!rawTerm) return;
    const term = rawTerm.toLowerCase();

    // 1. Brand match -> Vehicle Navigator
    const matchedBrand = MANUFACTURERS.find(m => m.MFA_BRAND.toLowerCase().includes(term));
    if (matchedBrand) {
      navigateToTab('vehicles');
      selectBrand(matchedBrand.MFA_ID);
      showToast(`Navigated to Vehicle Catalog: ${matchedBrand.MFA_BRAND}`);
      return;
    }

    // 2. VIN input -> Plates & VIN Decoder
    if (term.startsWith('vin') || (rawTerm.trim().length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(rawTerm.trim()))) {
      navigateToTab('plates');
      const cleanVin = rawTerm.replace(/^vin:?\s*/i, '').trim();
      if (elements.vinInput) {
        elements.vinInput.value = cleanVin;
        elements.btnDecodeVin?.click();
      }
      return;
    }

    // 3. Plate or KBA code -> Plate Decoder
    if (term.includes('kba') || term.includes('/') || term.includes('azc') || term.includes('ajt')) {
      navigateToTab('plates');
      elements.kbaInput.value = rawTerm;
      elements.btnDecodeKba.click();
      return;
    }
    if (term.includes('vxt') || term.includes('kenteken') || (term.length === 6 && /\d/.test(term))) {
      navigateToTab('plates');
      elements.kentekenInput.value = rawTerm;
      elements.btnDecodeKenteken.click();
      return;
    }
    if (term.startsWith('m10') || term.includes('carte')) {
      navigateToTab('plates');
      elements.cartesInput.value = rawTerm;
      elements.btnDecodeCartes.click();
      return;
    }

    // 3. Part number or part name -> Part Explorer
    const matchedPart = ARTICLES.find(a => 
      a.ART_ARTICLE_NR.toLowerCase().includes(term) ||
      a.ART_PRODUCT_NAME.toLowerCase().includes(term) ||
      a.ART_SUP_BRAND.toLowerCase().includes(term) ||
      a.CROSSES?.some(c => c.NUMBER.toLowerCase().includes(term))
    );
    if (matchedPart) {
      navigateToTab('parts');
      elements.partSearchInput.value = rawTerm;
      searchPart(rawTerm);
      return;
    }

    // 4. Default to SQL query filter in Workbench
    navigateToTab('workbench');
    elements.querySearchInput.value = rawTerm;
    state.searchQuery = rawTerm;
    renderQueryList();
    showToast(`Filtering queries for: "${rawTerm}"`);
  };

  btnUniversal?.addEventListener('click', executeUniversalSearch);
  universalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeUniversalSearch();
  });
}

function setupGlobalControls() {
  elements.globalLangSelect.addEventListener('change', (e) => {
    state.globalLngId = e.target.value;
    if (state.queryParameters['LNGID'] !== undefined) {
      state.queryParameters['LNGID'] = state.globalLngId;
      const input = document.getElementById('param-LNGID');
      if (input) input.value = state.globalLngId;
    }
    showToast(`TecDoc Language updated to @LNGID=${state.globalLngId}`);
  });

  // DB Config Modal
  elements.btnDbConfig.addEventListener('click', () => elements.dbModal.showModal());
  elements.btnCloseModal.addEventListener('click', () => elements.dbModal.close());
  elements.btnCancelModal.addEventListener('click', () => elements.dbModal.close());
  
  // Radio modes
  const modeSim = document.getElementById('mode-sim-card');
  const modeLive = document.getElementById('mode-live-card');
  const mysqlForm = document.getElementById('mysql-settings-form');

  modeSim.addEventListener('click', () => {
    modeSim.classList.add('active');
    modeLive.classList.remove('active');
    mysqlForm.style.display = 'none';
  });

  modeLive.addEventListener('click', () => {
    modeLive.classList.add('active');
    modeSim.classList.remove('active');
    mysqlForm.style.display = 'flex';
  });

  elements.btnSaveModal.addEventListener('click', () => {
    const isLive = modeLive.classList.contains('active');
    state.engineMode = isLive ? 'mysql' : 'virtual';
    elements.engineStatusText.textContent = isLive ? 'Live MySQL (tecdoc_2q2023)' : 'TecDoc 2Q 2023 Virtual Database';
    elements.dbModal.close();
    showToast(`Engine mode updated: ${state.engineMode.toUpperCase()}`);
  });
}

// 2. Query Workbench Logic
function renderCategories() {
  elements.categoryFilters.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `cat-btn ${cat.id === state.activeCategory ? 'active' : ''}`;
    btn.textContent = cat.name || cat.nameEn;
    btn.title = cat.nameEn;
    btn.addEventListener('click', () => {
      state.activeCategory = cat.id;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderQueryList();
    });
    elements.categoryFilters.appendChild(btn);
  });
}

function renderQueryList() {
  elements.queryList.innerHTML = '';
  const search = state.searchQuery.toLowerCase().trim();

  const filtered = TECDOC_QUERIES.filter(q => {
    const matchesCategory = state.activeCategory === 'all' || q.category === state.activeCategory;
    const matchesSearch = !search || 
      q.titleEn.toLowerCase().includes(search) || 
      q.filename.toLowerCase().includes(search) ||
      q.tables.some(t => t.toLowerCase().includes(search));
    return matchesCategory && matchesSearch;
  });

  elements.sidebarQueryCount.textContent = filtered.length;

  filtered.forEach(q => {
    const item = document.createElement('div');
    item.className = `query-item ${q.id === state.selectedQueryId ? 'active' : ''}`;
    item.id = `item-${q.id}`;
    item.innerHTML = `
      <div class="qi-top">
        <span class="qi-title" title="${q.titleEn}">${q.titleEn}</span>
        <span class="qi-cat">${q.category}</span>
      </div>
      <div class="qi-desc">${q.description}</div>
    `;

    item.addEventListener('click', () => selectQuery(q.id));
    elements.queryList.appendChild(item);
  });
}

// Search queries
elements.querySearchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  elements.querySearchClear.style.display = state.searchQuery ? 'block' : 'none';
  renderQueryList();
});

elements.querySearchClear.addEventListener('click', () => {
  state.searchQuery = '';
  elements.querySearchInput.value = '';
  elements.querySearchClear.style.display = 'none';
  renderQueryList();
});

export function selectQuery(queryId) {
  state.selectedQueryId = queryId;
  const query = TECDOC_QUERIES.find(q => q.id === queryId) || TECDOC_QUERIES[0];

  document.querySelectorAll('.query-item').forEach(i => i.classList.remove('active'));
  const activeItem = document.getElementById(`item-${queryId}`);
  if (activeItem) activeItem.classList.add('active');

  elements.activeCategoryPill.textContent = query.category;
  elements.activeQueryTitle.textContent = query.titleEn;
  elements.activeQueryTitle.title = query.titleEn;
  elements.activeQueryFile.textContent = query.filename;
  elements.activeQueryDescription.textContent = query.description;

  // Render Table badges
  elements.activeTablesBadges.innerHTML = query.tables.map(t => `<span class="table-badge">${t}</span>`).join('') || '<span class="text-subtle">None</span>';

  // Render parameters form
  state.queryParameters = { ...query.defaultParams };
  if (state.queryParameters['LNGID'] !== undefined) {
    state.queryParameters['LNGID'] = state.globalLngId;
  }
  renderParametersForm(query);

  // Render SQL source code
  renderSqlCode(query);

  // Reset execution result view
  elements.resultsEmptyState.style.display = 'flex';
  elements.dataTable.style.display = 'none';
  elements.execStatusBadge.className = 'status-badge';
  elements.execStatusBadge.textContent = 'READY';
  elements.execTime.textContent = 'Execution: 0.00ms';
  elements.execRows.textContent = 'Rows: 0';
}

function renderParametersForm(query) {
  elements.paramsForm.innerHTML = '';
  const paramKeys = Object.keys(state.queryParameters);

  if (paramKeys.length === 0) {
    elements.paramsForm.innerHTML = '<span class="column-placeholder" style="padding: 4px;">No input parameters required for this query.</span>';
    return;
  }

  paramKeys.forEach(key => {
    const group = document.createElement('div');
    group.className = 'param-input-group';
    group.innerHTML = `
      <label class="param-label" for="param-${key}">@${key}</label>
      <input type="text" id="param-${key}" class="param-input" value="${state.queryParameters[key]}">
    `;

    const input = group.querySelector('input');
    input.addEventListener('input', (e) => {
      state.queryParameters[key] = e.target.value;
      updateSqlCodePreview(query);
    });

    elements.paramsForm.appendChild(group);
  });
}

elements.btnResetParams.addEventListener('click', () => {
  const query = TECDOC_QUERIES.find(q => q.id === state.selectedQueryId);
  if (query) {
    state.queryParameters = { ...query.defaultParams };
    renderParametersForm(query);
    renderSqlCode(query);
    showToast('Parameters reset to default presets');
  }
});

function renderSqlCode(query) {
  const rawSql = query.sql;
  elements.sqlLineCount.textContent = `${rawSql.split('\n').length} lines`;
  elements.sqlCodeDisplay.innerHTML = highlightSql(rawSql);
}

function updateSqlCodePreview(query) {
  let modifiedSql = query.sql;
  Object.keys(state.queryParameters).forEach(key => {
    const val = state.queryParameters[key];
    const regex = new RegExp(`SET\\s+@${key}\\s*=\\s*[^;]+;`, 'gi');
    const formattedVal = isNaN(val) ? `'${val}'` : val;
    modifiedSql = modifiedSql.replace(regex, `SET @${key} = ${formattedVal};`);
  });
  elements.sqlCodeDisplay.innerHTML = highlightSql(modifiedSql);
}

function highlightSql(sql) {
  // Simple, robust syntax highlighter for SQL keywords, strings, comments, and variables
  const escaped = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/(\/\*[\s\S]*?\*\/|--.*$)/gm, '<span class="sql-comment">$1</span>')
    .replace(/('([^'\\]|\\.)*')/g, '<span class="sql-string">$1</span>')
    .replace(/(@[a-zA-Z0-9_]+)/g, '<span class="sql-var">$1</span>')
    .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|OUTER|ON|AND|OR|IN|NOT|AS|GROUP BY|ORDER BY|LIMIT|DISTINCT|UNION ALL|UNION|CASE|WHEN|THEN|ELSE|END|SET|CONCAT|CONCAT_WS|GROUP_CONCAT|IFNULL|ELT|DESC|ASC)\b/gi, '<span class="sql-keyword">$1</span>');
}

// Copy SQL
elements.btnCopySql.addEventListener('click', () => {
  const query = TECDOC_QUERIES.find(q => q.id === state.selectedQueryId);
  if (!query) return;
  navigator.clipboard.writeText(query.sql).then(() => {
    showToast('SQL copied to clipboard!');
  });
});

// Run Query
elements.btnRunQuery.addEventListener('click', runCurrentQuery);

function runCurrentQuery() {
  const query = TECDOC_QUERIES.find(q => q.id === state.selectedQueryId);
  if (!query) return;

  elements.execStatusBadge.className = 'status-badge running';
  elements.execStatusBadge.textContent = 'EXECUTING...';

  setTimeout(() => {
    const result = executeTecDocQuery(query, state.queryParameters);
    state.currentResult = result;

    elements.execStatusBadge.className = 'status-badge success';
    elements.execStatusBadge.textContent = 'SUCCESS (200 OK)';
    elements.execTime.textContent = `Execution: ${result.executionTimeMs}ms`;
    elements.execRows.textContent = `Rows: ${result.rowCount}`;

    renderDataTable(result);
  }, 120);
}

function renderDataTable(result) {
  elements.resultsEmptyState.style.display = 'none';
  elements.dataTable.style.display = 'table';

  // Render headers
  elements.dataTableHead.innerHTML = `
    <tr>
      ${result.columns.map(col => `<th>${col}</th>`).join('')}
    </tr>
  `;

  // Render rows
  elements.dataTableBody.innerHTML = result.rows.map(row => `
    <tr>
      ${result.columns.map(col => `<td>${row[col] !== undefined ? row[col] : '-'}</td>`).join('')}
    </tr>
  `).join('');
}

// Export CSV & JSON
elements.btnExportCsv.addEventListener('click', () => {
  if (!state.currentResult || !state.currentResult.rows.length) {
    showToast('Run query first to generate exportable rows');
    return;
  }
  const { columns, rows } = state.currentResult;
  const csvContent = [
    columns.join(','),
    ...rows.map(r => columns.map(c => `"${String(r[c] || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, 'tecdoc_result.csv', 'text/csv');
  showToast('Exported CSV file');
});

elements.btnExportJson.addEventListener('click', () => {
  if (!state.currentResult || !state.currentResult.rows.length) {
    showToast('Run query first to generate exportable rows');
    return;
  }
  const jsonContent = JSON.stringify(state.currentResult.rows, null, 2);
  downloadFile(jsonContent, 'tecdoc_result.json', 'application/json');
  showToast('Exported JSON file');
});

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 3. Vehicle Navigator Logic (TecDoc 2023 & 2018 Multi-Category)
function setupVehicleNavigator() {
  setupVehicleTypeTabs();
  renderBrandsList();
  selectBrand(state.selectedBrandId);

  elements.filterBrands?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.brand-item').forEach(el => {
      const name = el.dataset.name.toLowerCase();
      el.style.display = name.includes(q) ? 'flex' : 'none';
    });
  });
}

function setupVehicleTypeTabs() {
  document.querySelectorAll('.vtype-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vtype-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedVehicleType = btn.dataset.vtype;
      switchVehicleTypeView(state.selectedVehicleType);
    });
  });
}

function switchVehicleTypeView(vtype) {
  if (vtype === 'commercial') {
    renderCommercialView();
  } else if (vtype === 'motorbike') {
    renderMotorbikeView();
  } else if (vtype === 'engine') {
    renderEngineView();
  } else if (vtype === 'axle') {
    renderAxleView();
  } else {
    // Standard passenger
    renderBrandsList();
    selectBrand(state.selectedBrandId || 16);
  }
}

function renderCommercialView() {
  elements.brandsList.innerHTML = '';
  const commMfrs = [
    { id: 74, name: 'MERCEDES-BENZ TRUCKS', country: 'DE' },
    { id: 120, name: 'VOLVO TRUCKS', country: 'SE' },
    { id: 88, name: 'MAN TRUCK & BUS', country: 'DE' },
    { id: 95, name: 'SCANIA', country: 'SE' },
    { id: 99, name: 'DAF TRUCKS', country: 'NL' }
  ];

  commMfrs.forEach(m => {
    const div = document.createElement('div');
    div.className = 'cascade-item brand-item';
    div.dataset.id = m.id;
    div.dataset.name = m.name;
    div.innerHTML = `<span>${m.name}</span><span class="badge-tag">${m.country}</span>`;
    div.addEventListener('click', () => selectCommercialMake(m));
    elements.brandsList.appendChild(div);
  });

  selectCommercialMake(commMfrs[0]);
}

function selectCommercialMake(mfr) {
  elements.selectedBrandLabel.textContent = mfr.name;
  document.querySelectorAll('.brand-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id, 10) === mfr.id);
  });

  elements.seriesList.innerHTML = '';
  const trucks = COMMERCIAL_VEHICLES.filter(cv => cv.CV_MFA_ID === mfr.id || mfr.id === 74);
  const targetTrucks = trucks.length ? trucks : COMMERCIAL_VEHICLES;

  targetTrucks.forEach((cv, idx) => {
    const div = document.createElement('div');
    div.className = `cascade-item series-item ${idx === 0 ? 'active' : ''}`;
    div.innerHTML = `<span>${cv.CV_MODEL_DES.split(' ')[0]}</span><span class="text-subtle font-mono">${cv.INTERVAL}</span>`;
    div.addEventListener('click', () => selectCommercialModel(cv));
    elements.seriesList.appendChild(div);
  });

  selectCommercialModel(targetTrucks[0]);
}

function selectCommercialModel(cv) {
  elements.selectedSeriesLabel.textContent = cv.CV_MODEL_DES;
  elements.modelsList.innerHTML = `
    <div class="cascade-item model-item active">
      <div>
        <strong>${cv.CV_MODEL_DES}</strong>
        <div class="text-subtle font-mono">${cv.POWER_KW} kW (${cv.POWER_PS} HP) · ${cv.TONNAGE}</div>
      </div>
      <span class="badge-tag">${cv.AXLE_CONFIG}</span>
    </div>
  `;

  elements.vehicleIdBadge.textContent = `CV_ID: ${cv.CV_ID}`;
  elements.vehicleSpecsContent.innerHTML = `
    <div class="specs-sheet-card">
      <div class="specs-hero-box">
        <div>
          <div class="hero-model-title">${cv.CV_MODEL_DES}</div>
          <div class="hero-model-sub">Commercial Heavy Vehicle · Engine ${cv.ENG_CODE} · Axle ${cv.AXLE_CONFIG}</div>
        </div>
      </div>
      <div class="hero-metrics-grid">
        <div class="metric-card"><div class="metric-val">${cv.POWER_KW} kW</div><div class="metric-lbl">Power output</div></div>
        <div class="metric-card"><div class="metric-val">${cv.POWER_PS} HP</div><div class="metric-lbl">Horsepower</div></div>
        <div class="metric-card"><div class="metric-val">${cv.TONNAGE}</div><div class="metric-lbl">Gross Weight</div></div>
      </div>
      <table class="specs-table">
        <tbody>
          <tr><td class="prop">Vehicle Category</td><td class="val">Heavy Commercial Vehicle (CV)</td></tr>
          <tr><td class="prop">Axle Configuration</td><td class="val">${cv.AXLE_CONFIG}</td></tr>
          <tr><td class="prop">Engine Identification</td><td class="val font-mono">${cv.ENG_CODE}</td></tr>
          <tr><td class="prop">Production Era</td><td class="val">${cv.INTERVAL}</td></tr>
          <tr><td class="prop">TecDoc CV_ID Key</td><td class="val font-mono">${cv.CV_ID}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderMotorbikeView() {
  elements.brandsList.innerHTML = '';
  const bikeMfrs = [
    { id: 16, name: 'BMW MOTORRAD', country: 'DE' },
    { id: 46, name: 'HONDA MOTORCYCLES', country: 'JP' },
    { id: 69, name: 'YAMAHA', country: 'JP' },
    { id: 71, name: 'DUCATI', country: 'IT' }
  ];

  bikeMfrs.forEach(m => {
    const div = document.createElement('div');
    div.className = 'cascade-item brand-item';
    div.dataset.id = m.id;
    div.dataset.name = m.name;
    div.innerHTML = `<span>${m.name}</span><span class="badge-tag">${m.country}</span>`;
    div.addEventListener('click', () => selectBikeMake(m));
    elements.brandsList.appendChild(div);
  });

  selectBikeMake(bikeMfrs[0]);
}

function selectBikeMake(mfr) {
  elements.selectedBrandLabel.textContent = mfr.name;
  document.querySelectorAll('.brand-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id, 10) === mfr.id);
  });

  const bikes = MOTORBIKES.filter(b => b.MB_MFA_ID === mfr.id);
  const targetBikes = bikes.length ? bikes : MOTORBIKES;

  elements.seriesList.innerHTML = '';
  targetBikes.forEach((b, idx) => {
    const div = document.createElement('div');
    div.className = `cascade-item series-item ${idx === 0 ? 'active' : ''}`;
    div.innerHTML = `<span>${b.MB_MODEL_DES}</span><span class="text-subtle font-mono">${b.CATEGORY}</span>`;
    div.addEventListener('click', () => selectBikeModel(b));
    elements.seriesList.appendChild(div);
  });

  selectBikeModel(targetBikes[0]);
}

function selectBikeModel(bike) {
  elements.selectedSeriesLabel.textContent = bike.MB_MODEL_DES;
  elements.modelsList.innerHTML = `
    <div class="cascade-item model-item active">
      <div>
        <strong>${bike.MB_MODEL_DES}</strong>
        <div class="text-subtle font-mono">${bike.POWER_KW} kW (${bike.POWER_PS} HP) · ${bike.CAPACITY} cc</div>
      </div>
      <span class="badge-tag">${bike.CATEGORY}</span>
    </div>
  `;

  elements.vehicleIdBadge.textContent = `MB_ID: ${bike.MB_ID}`;
  elements.vehicleSpecsContent.innerHTML = `
    <div class="specs-sheet-card">
      <div class="specs-hero-box">
        <div>
          <div class="hero-model-title">${bike.MB_MODEL_DES}</div>
          <div class="hero-model-sub">Motorcycle Category · Engine ${bike.ENG_CODE} · ${bike.INTERVAL}</div>
        </div>
      </div>
      <div class="hero-metrics-grid">
        <div class="metric-card"><div class="metric-val">${bike.POWER_KW} kW</div><div class="metric-lbl">Power output</div></div>
        <div class="metric-card"><div class="metric-val">${bike.POWER_PS} HP</div><div class="metric-lbl">Horsepower</div></div>
        <div class="metric-card"><div class="metric-val">${bike.CAPACITY} cc</div><div class="metric-lbl">Displacement</div></div>
      </div>
      <table class="specs-table">
        <tbody>
          <tr><td class="prop">Vehicle Category</td><td class="val">${bike.CATEGORY}</td></tr>
          <tr><td class="prop">Engine Code</td><td class="val font-mono">${bike.ENG_CODE}</td></tr>
          <tr><td class="prop">Production Era</td><td class="val">${bike.INTERVAL}</td></tr>
          <tr><td class="prop">TecDoc MB_ID Key</td><td class="val font-mono">${bike.MB_ID}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderEngineView() {
  elements.brandsList.innerHTML = '';
  ENGINES.forEach(eng => {
    const div = document.createElement('div');
    div.className = 'cascade-item brand-item';
    div.dataset.id = eng.ENG_ID;
    div.innerHTML = `<span>${eng.MFA_BRAND}</span><span class="badge-tag">ENG</span>`;
    div.addEventListener('click', () => selectEngineItem(eng));
    elements.brandsList.appendChild(div);
  });
  selectEngineItem(ENGINES[0]);
}

function selectEngineItem(eng) {
  elements.selectedBrandLabel.textContent = eng.MFA_BRAND;
  elements.selectedSeriesLabel.textContent = eng.SALES_NAME;

  elements.seriesList.innerHTML = `
    <div class="cascade-item series-item active">
      <span>${eng.SALES_NAME}</span>
      <span class="text-subtle font-mono">${eng.CYLINDERS} Cyl · ${eng.CAPACITY} cc</span>
    </div>
  `;

  elements.modelsList.innerHTML = `
    <div class="cascade-item model-item active">
      <div>
        <strong>${eng.SALES_NAME}</strong>
        <div class="text-subtle font-mono">${eng.POWER_KW} kW (${eng.POWER_PS} HP)</div>
      </div>
      <span class="badge-tag">Industrial</span>
    </div>
  `;

  elements.vehicleIdBadge.textContent = `ENG_ID: ${eng.ENG_ID}`;
  elements.vehicleSpecsContent.innerHTML = `
    <div class="specs-sheet-card">
      <div class="specs-hero-box">
        <div>
          <div class="hero-model-title">${eng.MFA_BRAND} ${eng.SALES_NAME}</div>
          <div class="hero-model-sub">Stationary & Commercial Industrial Engine</div>
        </div>
      </div>
      <div class="hero-metrics-grid">
        <div class="metric-card"><div class="metric-val">${eng.POWER_KW} kW</div><div class="metric-lbl">Power output</div></div>
        <div class="metric-card"><div class="metric-val">${eng.POWER_PS} HP</div><div class="metric-lbl">Horsepower</div></div>
        <div class="metric-card"><div class="metric-val">${eng.CAPACITY} cc</div><div class="metric-lbl">Displacement</div></div>
      </div>
      <table class="specs-table">
        <tbody>
          <tr><td class="prop">Engine Application</td><td class="val">${eng.APPLICATION}</td></tr>
          <tr><td class="prop">Cylinders Count</td><td class="val">${eng.CYLINDERS} In-Line Cylinders</td></tr>
          <tr><td class="prop">TecDoc ENG_ID Key</td><td class="val font-mono">${eng.ENG_ID}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderAxleView() {
  elements.brandsList.innerHTML = '';
  AXLES.forEach(ax => {
    const div = document.createElement('div');
    div.className = 'cascade-item brand-item';
    div.dataset.id = ax.AXLE_ID;
    div.innerHTML = `<span>${ax.MFA_BRAND}</span><span class="badge-tag">AXLE</span>`;
    div.addEventListener('click', () => selectAxleItem(ax));
    elements.brandsList.appendChild(div);
  });
  selectAxleItem(AXLES[0]);
}

function selectAxleItem(ax) {
  elements.selectedBrandLabel.textContent = ax.MFA_BRAND;
  elements.selectedSeriesLabel.textContent = ax.AXLE_NAME;

  elements.seriesList.innerHTML = `
    <div class="cascade-item series-item active">
      <span>${ax.AXLE_NAME}</span>
      <span class="text-subtle font-mono">${ax.BRAKE_TYPE}</span>
    </div>
  `;

  elements.modelsList.innerHTML = `
    <div class="cascade-item model-item active">
      <div>
        <strong>${ax.AXLE_NAME}</strong>
        <div class="text-subtle font-mono">${ax.LOAD_KG.toLocaleString()} kg Capacity</div>
      </div>
      <span class="badge-tag">${ax.APPLICATION.split(' ')[0]}</span>
    </div>
  `;

  elements.vehicleIdBadge.textContent = `AXLE_ID: ${ax.AXLE_ID}`;
  elements.vehicleSpecsContent.innerHTML = `
    <div class="specs-sheet-card">
      <div class="specs-hero-box">
        <div>
          <div class="hero-model-title">${ax.MFA_BRAND} ${ax.AXLE_NAME}</div>
          <div class="hero-model-sub">${ax.APPLICATION}</div>
        </div>
      </div>
      <div class="hero-metrics-grid">
        <div class="metric-card"><div class="metric-val">${ax.LOAD_KG.toLocaleString()} kg</div><div class="metric-lbl">Max Axle Load</div></div>
        <div class="metric-card"><div class="metric-val">${ax.TRACK_MM || 'Standard'} mm</div><div class="metric-lbl">Track Width</div></div>
        <div class="metric-card"><div class="metric-val">${ax.BRAKE_TYPE.split(' ')[0]}</div><div class="metric-lbl">Brake System</div></div>
      </div>
      <table class="specs-table">
        <tbody>
          <tr><td class="prop">Axle Application</td><td class="val">${ax.APPLICATION}</td></tr>
          <tr><td class="prop">Brake Specification</td><td class="val">${ax.BRAKE_TYPE}</td></tr>
          <tr><td class="prop">TecDoc AXLE_ID Key</td><td class="val font-mono">${ax.AXLE_ID}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderBrandsList() {
  elements.brandsList.innerHTML = '';
  MANUFACTURERS.filter(m => m.MFA_PC === 1).forEach(mfa => {
    const div = document.createElement('div');
    div.className = `cascade-item brand-item ${mfa.MFA_ID === state.selectedBrandId ? 'active' : ''}`;
    div.dataset.id = mfa.MFA_ID;
    div.dataset.name = mfa.MFA_BRAND;
    div.innerHTML = `
      <span>${mfa.MFA_BRAND}</span>
      <span class="badge-tag">${mfa.COUNTRY}</span>
    `;
    div.addEventListener('click', () => selectBrand(mfa.MFA_ID));
    elements.brandsList.appendChild(div);
  });
}

function selectBrand(mfaId) {
  state.selectedBrandId = mfaId;
  const brand = MANUFACTURERS.find(m => m.MFA_ID === mfaId);
  elements.selectedBrandLabel.textContent = brand ? brand.MFA_BRAND : 'Unknown';

  document.querySelectorAll('.brand-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id, 10) === mfaId);
  });

  renderSeriesList(mfaId);
}

function renderSeriesList(mfaId) {
  elements.seriesList.innerHTML = '';
  const series = MODELS_SERIES.filter(ms => ms.MS_MFA_ID === mfaId);

  if (series.length === 0) {
    elements.seriesList.innerHTML = '<div class="column-placeholder">No series cataloged for this brand in sample.</div>';
    elements.modelsList.innerHTML = '<div class="column-placeholder">No models available.</div>';
    return;
  }

  series.forEach(ms => {
    const div = document.createElement('div');
    div.className = `cascade-item series-item ${ms.MS_ID === state.selectedSeriesId ? 'active' : ''}`;
    div.dataset.id = ms.MS_ID;
    div.innerHTML = `
      <span>${ms.MS_NAME}</span>
      <span class="text-subtle font-mono">${ms.YEAR_FROM}-${ms.YEAR_TO || 'now'}</span>
    `;
    div.addEventListener('click', () => selectSeries(ms.MS_ID));
    elements.seriesList.appendChild(div);
  });

  selectSeries(series[0].MS_ID);
}

function selectSeries(msId) {
  state.selectedSeriesId = msId;
  const series = MODELS_SERIES.find(ms => ms.MS_ID === msId);
  elements.selectedSeriesLabel.textContent = series ? series.MS_NAME : 'Select Series';

  document.querySelectorAll('.series-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id, 10) === msId);
  });

  renderModelsList(msId);
}

function renderModelsList(msId) {
  elements.modelsList.innerHTML = '';
  const models = PASSENGER_CARS.filter(pc => pc.PC_MS_ID === msId);

  if (models.length === 0) {
    elements.modelsList.innerHTML = '<div class="column-placeholder">No modifications cataloged for this series.</div>';
    return;
  }

  models.forEach(pc => {
    const div = document.createElement('div');
    div.className = `cascade-item model-item ${pc.PC_ID === state.selectedCarId ? 'active' : ''}`;
    div.dataset.id = pc.PC_ID;
    div.innerHTML = `
      <div>
        <strong>${pc.PC_MODEL_DES}</strong>
        <div class="text-subtle font-mono">${pc.PCS_POWER_KW} kW (${pc.PCS_POWER_PS} HP)</div>
      </div>
      <span class="badge-tag">${pc.PCS_FUEL_TYPE}</span>
    `;
    div.addEventListener('click', () => selectCar(pc.PC_ID));
    elements.modelsList.appendChild(div);
  });

  selectCar(models[0].PC_ID);
}

function selectCar(pcId) {
  state.selectedCarId = pcId;
  const car = PASSENGER_CARS.find(pc => pc.PC_ID === pcId);
  if (!car) return;

  document.querySelectorAll('.model-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id, 10) === pcId);
  });

  elements.vehicleIdBadge.textContent = `PC_ID: ${car.PC_ID}`;

  const brand = MANUFACTURERS.find(m => m.MFA_ID === car.PC_MFA_ID) || { MFA_BRAND: 'BMW' };
  const series = MODELS_SERIES.find(ms => ms.MS_ID === car.PC_MS_ID) || { MS_NAME: '1 Coupe (E82)' };

  elements.vehicleSpecsContent.innerHTML = `
    <div class="specs-sheet-card">
      <div class="specs-hero-box">
        <div>
          <div class="hero-model-title">${brand.MFA_BRAND} ${series.MS_NAME} ${car.PC_MODEL_DES}</div>
          <div class="hero-model-sub">Engine: ${car.ENG_CODE} · ${car.PCS_CONSTRUCTION_INTERVAL_START} to ${car.PCS_CONSTRUCTION_INTERVAL_END}</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-load-car-sql" title="Open in SQL Workbench">Run in SQL</button>
      </div>

      <div class="hero-metrics-grid">
        <div class="metric-card">
          <div class="metric-val">${car.PCS_POWER_KW} kW</div>
          <div class="metric-lbl">Power output</div>
        </div>
        <div class="metric-card">
          <div class="metric-val">${car.PCS_POWER_PS} HP</div>
          <div class="metric-lbl">Horsepower</div>
        </div>
        <div class="metric-card">
          <div class="metric-val">${car.PCS_CAPACITY_TAX} cc</div>
          <div class="metric-lbl">Displacement</div>
        </div>
      </div>

      <table class="specs-table">
        <tbody>
          <tr><td class="prop">German KBA Number</td><td class="val">${car.KBA_NUM}</td></tr>
          <tr><td class="prop">Body Type</td><td class="val">${car.PCS_BODY_TYPE}</td></tr>
          <tr><td class="prop">Drive Type</td><td class="val">${car.PCS_DRIVE_TYPE}</td></tr>
          <tr><td class="prop">Fuel Type</td><td class="val">${car.PCS_FUEL_TYPE}</td></tr>
          <tr><td class="prop">Valves / Cylinders</td><td class="val">${car.PCS_VALVES} Valves / ${car.PCS_CYLINDERS} Cylinders</td></tr>
          <tr><td class="prop">TecDoc PC_ID Key</td><td class="val font-mono">${car.PC_ID}</td></tr>
          <tr><td class="prop">TecDoc MS_ID Key</td><td class="val font-mono">${car.PC_MS_ID}</td></tr>
          <tr><td class="prop">TecDoc MFA_ID Key</td><td class="val font-mono">${car.PC_MFA_ID}</td></tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('btn-load-car-sql')?.addEventListener('click', () => {
    // Switch to query for car specs
    const carQuery = TECDOC_QUERIES.find(q => q.filename.includes('get_passenger_car_detailed_info') || q.titleEn.includes('Passenger Car Detailed'));
    if (carQuery) {
      document.getElementById('tab-btn-workbench').click();
      selectQuery(carQuery.id);
      state.queryParameters['PC_ID'] = String(car.PC_ID);
      const input = document.getElementById('param-PC_ID');
      if (input) input.value = car.PC_ID;
      runCurrentQuery();
    }
  });
}

// 4. Part & Cross-Reference Explorer Logic
function setupPartExplorer() {
  renderPartDetails(state.currentPart);

  elements.btnSearchPart.addEventListener('click', () => {
    searchPart(elements.partSearchInput.value);
  });

  elements.partSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchPart(elements.partSearchInput.value);
  });

  document.querySelectorAll('.pill-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const partNr = tag.dataset.part;
      elements.partSearchInput.value = partNr;
      searchPart(partNr);
    });
  });
}

function searchPart(searchTerm) {
  const clean = searchTerm.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Search directly by article nr, cross number, or id
  const match = ARTICLES.find(a => {
    const cleanArt = a.ART_ARTICLE_NR.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanOe = a.CROSSES?.some(c => c.NUMBER.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().includes(clean));
    return cleanArt.includes(clean) || cleanOe || String(a.ART_ID) === clean;
  }) || ARTICLES[0];

  state.currentPart = match;
  renderPartDetails(match);
  showToast(`Loaded article: ${match.ART_SUP_BRAND} ${match.ART_ARTICLE_NR}`);
}

function renderPartDetails(part) {
  elements.partCardBrand.textContent = part.ART_SUP_BRAND;
  elements.partCardNumber.textContent = part.ART_ARTICLE_NR;
  elements.partCardArtId.textContent = `ART_ID: ${part.ART_ID}`;
  elements.partCardTitle.textContent = part.ART_PRODUCT_NAME;
  elements.partCardEan.textContent = part.EAN || 'N/A';
  elements.partCardPackaging.textContent = part.PACKING_UNIT || '1 pc';
  elements.partCardGeneric.textContent = part.GENERIC_ART_ID || '100';

  // Criteria
  elements.partCriteriaGrid.innerHTML = (part.CRITERIA || []).map(c => `
    <div class="criteria-item">
      <span class="cri-name">${c.CRI_NAME}</span>
      <span class="cri-val">${c.CRI_VALUE}</span>
    </div>
  `).join('') || '<div class="column-placeholder">No criteria criteria loaded.</div>';

  // BOM / Accessories
  if (part.BOM_PARTS) {
    elements.partBomTitle.textContent = 'Bill of Materials (BOM) Component Breakdown';
    elements.partBomList.innerHTML = part.BOM_PARTS.map(b => `
      <div class="fitment-item">
        <div>
          <span class="font-mono text-highlight">${b.ART_NR}</span>
          <div class="fit-model">${b.NAME}</div>
        </div>
        <span class="badge-tag">Qty: ${b.QTY}</span>
      </div>
    `).join('');
  } else if (part.ACCESSORIES) {
    elements.partBomTitle.textContent = 'Included & Complementary Accessories';
    elements.partBomList.innerHTML = part.ACCESSORIES.map(acc => `
      <div class="fitment-item">
        <div>
          <span class="font-mono text-highlight">${acc.ART_NR}</span>
          <div class="fit-model">${acc.NAME}</div>
        </div>
        <span class="badge-tag">${acc.BRAND}</span>
      </div>
    `).join('');
  } else {
    elements.partBomList.innerHTML = '<div class="column-placeholder">Single standalone assembly.</div>';
  }

  // Crosses
  const crosses = part.CROSSES || [];
  elements.crossesCountBadge.textContent = `${crosses.length} crosses`;
  elements.crossesTableBody.innerHTML = crosses.map(c => `
    <tr>
      <td><strong>${c.BRAND}</strong></td>
      <td class="font-mono text-highlight">${c.NUMBER}</td>
      <td><span class="badge-tag">${c.TYPE}</span></td>
    </tr>
  `).join('');

  // Fitment
  const fitment = part.FITMENT || [];
  elements.fitmentCountBadge.textContent = `${fitment.length} models`;
  elements.fitmentList.innerHTML = fitment.map(f => `
    <div class="fitment-item">
      <div>
        <div class="fit-model">${f.BRAND} ${f.MODEL}</div>
        <div class="fit-specs">${f.YEARS} · ${f.KW} kW (${f.HP} HP)</div>
      </div>
      <span class="badge-tag">Fits</span>
    </div>
  `).join('');
}

// 5. Schematics & Coordinates Logic (SENSITIVE_COORDINATES)
function setupSchematics() {
  const article = ARTICLES.find(a => a.ART_ID === 373681) || ARTICLES[2];
  const hotspots = article.HOTSPOTS || [];

  elements.hotspotsCount.textContent = `${hotspots.length} Hotspots`;
  elements.hotspotsLayer.innerHTML = '';
  elements.hotspotsTableBody.innerHTML = '';

  hotspots.forEach(h => {
    // 1. Draw SVG hotspot rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', h.SEN_COORD_X);
    rect.setAttribute('y', h.SEN_COORD_Y);
    rect.setAttribute('width', h.SEN_COORD_WIDTH);
    rect.setAttribute('height', h.SEN_COORD_HEIGHT);
    rect.setAttribute('rx', '4');
    rect.setAttribute('class', 'hotspot-box');
    rect.dataset.id = h.SEN_COORD_ID;

    // Hover tooltip
    rect.addEventListener('mouseenter', (e) => {
      showHotspotTooltip(e, h);
      highlightTableRow(h.SEN_COORD_ID);
    });

    rect.addEventListener('mousemove', (e) => {
      positionHotspotTooltip(e);
    });

    rect.addEventListener('mouseleave', () => {
      elements.hotspotTooltip.style.display = 'none';
      unhighlightTableRows();
    });

    elements.hotspotsLayer.appendChild(rect);

    // 2. Add to sidebar table
    const tr = document.createElement('tr');
    tr.id = `hs-row-${h.SEN_COORD_ID}`;
    tr.innerHTML = `
      <td class="font-mono">#${h.SEN_COORD_ID}</td>
      <td>
        <strong>${h.COMPONENT_NAME}</strong>
        <div class="font-mono text-subtle">${h.COMPONENT_ART}</div>
      </td>
      <td class="font-mono">X:${h.SEN_COORD_X}, Y:${h.SEN_COORD_Y}</td>
      <td class="font-mono">${h.SEN_COORD_WIDTH}×${h.SEN_COORD_HEIGHT}px</td>
    `;

    tr.addEventListener('mouseenter', () => {
      rect.classList.add('active');
    });
    tr.addEventListener('mouseleave', () => {
      rect.classList.remove('active');
    });

    elements.hotspotsTableBody.appendChild(tr);
  });
}

function showHotspotTooltip(e, h) {
  elements.tooltipArt.textContent = `${h.COMPONENT_ART} (${h.TYPE})`;
  elements.tooltipName.textContent = h.COMPONENT_NAME;
  elements.tooltipCoords.textContent = `Coordinates: X=${h.SEN_COORD_X}, Y=${h.SEN_COORD_Y} | Size: ${h.SEN_COORD_WIDTH}×${h.SEN_COORD_HEIGHT}px`;
  elements.hotspotTooltip.style.display = 'block';
  positionHotspotTooltip(e);
}

function positionHotspotTooltip(e) {
  const container = document.getElementById('diagram-viewport').getBoundingClientRect();
  const x = e.clientX - container.left;
  const y = e.clientY - container.top;
  elements.hotspotTooltip.style.left = `${x}px`;
  elements.hotspotTooltip.style.top = `${y}px`;
}

function highlightTableRow(id) {
  document.querySelectorAll('#hotspots-list-table tr').forEach(r => r.style.background = 'transparent');
  const row = document.getElementById(`hs-row-${id}`);
  if (row) row.style.background = 'rgba(0, 229, 255, 0.15)';
}

function unhighlightTableRows() {
  document.querySelectorAll('#hotspots-list-table tr').forEach(r => r.style.background = 'transparent');
}

// 6. Plates & KBA Decoder Logic
function setupPlatesDecoder() {
  elements.btnDecodeKba.addEventListener('click', () => {
    const val = elements.kbaInput.value.trim();
    elements.kbaResult.innerHTML = `
      <div class="result-box">
        <div class="result-brand">BMW 1 Coupe (E82) M (HSN/TSN: ${val})</div>
        <div class="result-specs">Engine N54 B30 A · 250 kW / 340 HP · 2,979 ccm · Production 2011-2012 · TecDoc PC_ID: 9877</div>
      </div>
    `;
    showToast(`Decoded German KBA: ${val}`);
  });

  elements.btnDecodeKenteken.addEventListener('click', () => {
    const val = elements.kentekenInput.value.trim();
    elements.kentekenResult.innerHTML = `
      <div class="result-box">
        <div class="result-brand">VOLKSWAGEN Golf VII (5G1) 2.0 TDI (Plate: ${val})</div>
        <div class="result-specs">Engine CRBC · 110 kW / 150 HP · 1,968 ccm · 2012-2020 · Netherlands Country Specific ID: 121</div>
      </div>
    `;
    showToast(`Decoded Dutch Kenteken: ${val}`);
  });

  elements.btnDecodeCartes.addEventListener('click', () => {
    const val = elements.cartesInput.value.trim();
    elements.cartesResult.innerHTML = `
      <div class="result-box">
        <div class="result-brand">RENAULT Megane III Grandtour (KZ0/1) 1.5 dCi (Type Mine: ${val})</div>
        <div class="result-specs">Engine K9K 836 · 81 kW / 110 HP · 1,461 ccm · 2009-2015 · France CNIT Resolved</div>
      </div>
    `;
    showToast(`Decoded French Carte Grise: ${val}`);
  });
}

// 6b. Global VIN Decoder & Modulo-11 Check Digit Engine
function setupVinDecoder() {
  if (!elements.vinInput || !elements.btnDecodeVin) return;

  const getPositionTag = (pos) => {
    if (pos === 1) return { cat: 'wmi', name: 'Continent' };
    if (pos === 2) return { cat: 'wmi', name: 'Country' };
    if (pos === 3) return { cat: 'wmi', name: 'Mfr WMI' };
    if (pos >= 4 && pos <= 8) return { cat: 'vds', name: 'VDS Attr' };
    if (pos === 9) return { cat: 'check', name: 'Check' };
    if (pos === 10) return { cat: 'vis', name: 'Year' };
    if (pos === 11) return { cat: 'vis', name: 'Plant' };
    return { cat: 'vis', name: 'Serial' };
  };

  const renderVinAnatomy = (vinStr) => {
    if (!elements.vinAnatomyBar) return;
    elements.vinAnatomyBar.innerHTML = '';
    const padded = (vinStr || '').padEnd(17, '·');

    for (let i = 0; i < 17; i++) {
      const pos = i + 1;
      const char = padded[i] || '·';
      const meta = getPositionTag(pos);

      const box = document.createElement('div');
      box.className = `vin-char-box ${meta.cat}`;
      box.title = `Position ${pos}: ${meta.name} ('${char}')`;
      box.innerHTML = `
        <span class="char">${char}</span>
        <span class="pos">${pos}</span>
        <span class="pos" style="font-size:0.58rem; opacity:0.8;">${meta.name.split(' ')[0]}</span>
      `;
      elements.vinAnatomyBar.appendChild(box);
    }
  };

  const runVinDecode = () => {
    const rawVal = elements.vinInput.value.trim().toUpperCase();
    if (!rawVal) return;

    const res = decodeVIN(rawVal);
    if (!res) return;

    renderVinAnatomy(res.vin);

    // Try to find matching brand in TecDoc catalog
    const matchedBrand = MANUFACTURERS.find(m => 
      res.manufacturer.toLowerCase().includes(m.MFA_BRAND.toLowerCase()) ||
      m.MFA_BRAND.toLowerCase().includes(res.manufacturer.toLowerCase())
    );

    const checkStatusHtml = res.isCheckDigitValid
      ? `<span class="vrc-badge valid">✓ VALID (${res.checkDigit})</span>`
      : `<span class="vrc-badge invalid">⚠️ MISMATCH (Exp: ${res.calculatedCheck || '?'}, Has: ${res.checkDigit || '-'})</span>`;

    const illegalCharsHtml = res.hasIllegalChars
      ? `<span class="vrc-badge invalid">⚠️ Illegal: ${res.illegalChars.join(', ')}</span>`
      : `<span class="vrc-badge valid">✓ Compliant</span>`;

    elements.vinResultsGrid.innerHTML = `
      <div class="vin-result-card">
        <span class="vrc-label">Manufacturer & Brand</span>
        <div class="vrc-value">${res.manufacturer}</div>
        <span class="vrc-sub">WMI Code: ${res.wmi}</span>
        ${matchedBrand ? `
          <button class="btn btn-primary btn-xs vin-nav-btn" id="btn-vin-open-catalog" data-mfa-id="${matchedBrand.MFA_ID}">
            Open in Vehicle Catalog →
          </button>
        ` : ''}
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">Geographic Origin</span>
        <div class="vrc-value">${res.country}</div>
        <span class="vrc-sub">${res.continent} (ISO 3780 Prefix: ${res.vin.substring(0, 2)})</span>
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">Model Year (Pos 10)</span>
        <div class="vrc-value">${res.modelYear}</div>
        <span class="vrc-sub">Year Code: "${res.vin[9] || '-'}" (ISO 3779 Cycle)</span>
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">Modulo-11 Check Digit (Pos 9)</span>
        <div class="vrc-value">${checkStatusHtml}</div>
        <span class="vrc-sub">US 49 CFR 565 & ISO 3779 Modulo-11</span>
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">Vehicle Descriptor (VDS)</span>
        <div class="vrc-value font-mono">${res.vds}</div>
        <span class="vrc-sub">Positions 4 to 8: Body / Engine / Model Attributes</span>
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">Sequential Serial (VIS)</span>
        <div class="vrc-value font-mono">${res.sequentialNumber || 'N/A'}</div>
        <span class="vrc-sub">Full VIS: ${res.vis} (Positions 10-17)</span>
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">ISO 3779 Character Legality</span>
        <div class="vrc-value">${illegalCharsHtml}</div>
        <span class="vrc-sub">Prohibits I, O, Q to avoid numeral ambiguity</span>
      </div>

      <div class="vin-result-card">
        <span class="vrc-label">TecDoc Database Integration</span>
        <div class="vrc-value" style="font-size:0.8rem; color:var(--accent-cyan);">Ready for Part Cross & Fitment</div>
        <button class="btn btn-secondary btn-xs vin-nav-btn" id="btn-vin-open-sql">
          Query MFA_MANUFACTURERS in SQL →
        </button>
      </div>
    `;

    // Wire action buttons inside card
    const btnOpenCatalog = document.getElementById('btn-vin-open-catalog');
    if (btnOpenCatalog && matchedBrand) {
      btnOpenCatalog.addEventListener('click', () => {
        navigateToTab('vehicles');
        selectBrand(matchedBrand.MFA_ID);
        showToast(`Loaded ${matchedBrand.MFA_BRAND} in Vehicle Catalog`);
      });
    }

    const btnOpenSql = document.getElementById('btn-vin-open-sql');
    if (btnOpenSql) {
      btnOpenSql.addEventListener('click', () => {
        navigateToTab('workbench');
        selectQuery('q_1');
        showToast(`Opened Brand Query for ${res.manufacturer}`);
      });
    }

    showToast(`Decoded VIN: ${res.vin} (${res.manufacturer})`);
  };

  // Real-time input listener
  elements.vinInput.addEventListener('input', (e) => {
    let clean = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
    e.target.value = clean;
    if (elements.vinCharCounter) {
      elements.vinCharCounter.textContent = `${clean.length} / 17`;
    }
    renderVinAnatomy(clean);
  });

  elements.vinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runVinDecode();
  });

  elements.btnDecodeVin.addEventListener('click', runVinDecode);

  // Quick sample buttons
  document.querySelectorAll('.vin-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleVin = btn.dataset.vin;
      elements.vinInput.value = sampleVin;
      if (elements.vinCharCounter) {
        elements.vinCharCounter.textContent = `${sampleVin.length} / 17`;
      }
      runVinDecode();
    });
  });

  // Initial render
  if (elements.vinInput.value) {
    if (elements.vinCharCounter) {
      elements.vinCharCounter.textContent = `${elements.vinInput.value.length} / 17`;
    }
    runVinDecode();
  }
}

// 7. Schema Storage Metrics
function setupSchemaMetrics() {
  // Storage Bars
  elements.storageBarsList.innerHTML = TABLE_METRICS.map(t => {
    const totalGB = t.IndexGB + t.DataGB;
    const indexPct = Math.round((t.IndexGB / totalGB) * 100);
    const dataPct = 100 - indexPct;
    return `
      <div class="storage-bar-item">
        <div class="sbi-meta">
          <span class="sbi-name">${t.table_name} (${t.RowsCount.toLocaleString()} rows)</span>
          <span class="sbi-sizes">Idx: ${t.IndexGB} GB | Data: ${t.DataGB} GB</span>
        </div>
        <div class="bar-track">
          <div class="bar-index" style="width: ${indexPct}%;" title="Index: ${t.IndexGB} GB (${indexPct}%)"></div>
          <div class="bar-data" style="width: ${dataPct}%;" title="Data: ${t.DataGB} GB (${dataPct}%)"></div>
        </div>
      </div>
    `;
  }).join('');

  // Unused Indexes
  elements.unusedIndexesList.innerHTML = UNUSED_INDEXES.map(idx => `
    <div class="unused-item">
      <div class="ui-title">
        <span>${idx.TABLE_NAME}</span>
        <span>${idx.INDEX_NAME}</span>
      </div>
      <div class="ui-rec">Recommendation: ${idx.RECOMMENDATION}</div>
    </div>
  `).join('');

  // TecDoc Schema Evolution 2018 vs 2023 Table
  if (elements.evolutionTableBody && TECDOC_2018_SCHEMA_MAP) {
    elements.evolutionTableBody.innerHTML = TECDOC_2018_SCHEMA_MAP.map(item => `
      <tr>
        <td><span class="table-tag-2018">${item.table2018}</span></td>
        <td><span class="table-tag-2023">${item.table2023}</span></td>
        <td><strong>${item.purpose}</strong></td>
        <td style="color: var(--text-muted); font-size: 0.78rem;">${item.recordDiff}</td>
      </tr>
    `).join('');
  }

  // TecDoc 2017 Change Request (CR) Delta Catalog Table
  if (elements.delta2017TableBody && TECDOC_2017_CR_DELTAS) {
    elements.delta2017TableBody.innerHTML = TECDOC_2017_CR_DELTAS.map(item => `
      <tr>
        <td><span class="table-tag-2017">${item.table}</span></td>
        <td><strong>${item.domain}</strong></td>
        <td><span class="badge-tag" style="background: rgba(16, 185, 129, 0.12); color: #34d399; font-size: 0.72rem;">${item.operation}</span></td>
        <td style="font-family: var(--font-mono); font-weight: 600; color: #fff;">+${item.recordsAdded}</td>
        <td style="color: var(--text-muted); font-size: 0.78rem;">${item.sampleEntities}</td>
        <td style="color: var(--text-subtle); font-size: 0.78rem;">${item.architecturalImpact}</td>
      </tr>
    `).join('');
  }
}

// 8. Shortcuts & Notifications
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (state.activeTab === 'workbench') {
        e.preventDefault();
        runCurrentQuery();
      }
    }
  });
}

// 9. TecDoc SDK & Pegasus 3.0 Web Service Studio
function setupSdkStudio() {
  if (!elements.sdkSelectMethod) return;

  // Track active language
  let currentSdkLang = 'javascript';

  // Method field mapping to show relevant parameter inputs
  const methodFieldMap = {
    getManufacturers: ['target-type', 'country', 'lang'],
    getModelSeries: ['manu-id', 'target-type', 'country', 'lang'],
    getVehicleDetails: ['vehicle-id', 'lang'],
    searchArticles: ['article-number', 'country', 'lang'],
    getArticleCrossReferences: ['article-id'],
    getArticleBOM: ['article-id'],
    getAssemblyTree: ['vehicle-id', 'target-type'],
    decodeVin: ['vin'],
    pegasusCall: ['target-type', 'country', 'lang']
  };

  const updateFieldVisibility = () => {
    const selectedMethod = elements.sdkSelectMethod.value;
    if (elements.sdkMethodBadge) {
      elements.sdkMethodBadge.textContent = selectedMethod;
    }

    const visibleFields = methodFieldMap[selectedMethod] || [];

    if (elements.sdkGroupTargetType) elements.sdkGroupTargetType.style.display = visibleFields.includes('target-type') ? 'flex' : 'none';
    if (elements.sdkGroupManuId) elements.sdkGroupManuId.style.display = visibleFields.includes('manu-id') ? 'flex' : 'none';
    if (elements.sdkGroupVehicleId) elements.sdkGroupVehicleId.style.display = visibleFields.includes('vehicle-id') ? 'flex' : 'none';
    if (elements.sdkGroupArticleNumber) elements.sdkGroupArticleNumber.style.display = visibleFields.includes('article-number') ? 'flex' : 'none';
    if (elements.sdkGroupArticleId) elements.sdkGroupArticleId.style.display = visibleFields.includes('article-id') ? 'flex' : 'none';
    if (elements.sdkGroupVin) elements.sdkGroupVin.style.display = visibleFields.includes('vin') ? 'flex' : 'none';

    updateGeneratedSnippet();
  };

  const collectSdkParams = () => {
    const method = elements.sdkSelectMethod.value;
    const params = {};

    if (elements.sdkGroupTargetType && elements.sdkGroupTargetType.style.display !== 'none') {
      params.linkingTargetType = elements.sdkParamTargetType.value;
    }
    if (elements.sdkGroupManuId && elements.sdkGroupManuId.style.display !== 'none') {
      params.manuId = parseInt(elements.sdkParamManuId.value, 10);
    }
    if (elements.sdkGroupVehicleId && elements.sdkGroupVehicleId.style.display !== 'none') {
      params.vehicleId = parseInt(elements.sdkParamVehicleId.value || '9877', 10);
    }
    if (elements.sdkGroupArticleNumber && elements.sdkGroupArticleNumber.style.display !== 'none') {
      params.articleNumber = elements.sdkParamArticleNumber.value.trim();
    }
    if (elements.sdkGroupArticleId && elements.sdkGroupArticleId.style.display !== 'none') {
      params.articleId = parseInt(elements.sdkParamArticleId.value || '1878343', 10);
    }
    if (elements.sdkGroupVin && elements.sdkGroupVin.style.display !== 'none') {
      params.vin = elements.sdkParamVin.value.trim();
    }

    if (elements.sdkParamCountry) params.country = elements.sdkParamCountry.value;
    if (elements.sdkParamLang) params.lang = elements.sdkParamLang.value;

    return { method, params };
  };

  const updateGeneratedSnippet = () => {
    const { method, params } = collectSdkParams();
    const apiKey = elements.sdkParamApiKey ? elements.sdkParamApiKey.value.trim() : '';
    tecdoc.apiKey = apiKey;
    tecdoc.country = params.country || 'DE';
    tecdoc.lang = params.lang || 'EN';

    const snippet = tecdoc.generateCodeSnippet({
      method,
      params,
      language: currentSdkLang
    });

    if (elements.sdkCodeDisplay) {
      elements.sdkCodeDisplay.textContent = snippet;
    }
  };

  const runSelectedSdkMethod = async () => {
    const { method, params } = collectSdkParams();
    const apiKey = elements.sdkParamApiKey ? elements.sdkParamApiKey.value.trim() : '';
    tecdoc.configure({
      apiKey,
      country: params.country,
      lang: params.lang,
      mode: apiKey ? 'pegasus_rest' : 'virtual'
    });

    if (elements.sdkRuntimeMode) {
      elements.sdkRuntimeMode.textContent = apiKey ? 'Pegasus 3.0 Live REST' : 'Virtual High-Fidelity';
    }

    if (elements.btnSdkRun) {
      elements.btnSdkRun.disabled = true;
      elements.btnSdkRun.innerHTML = `<span class="spinner"></span> Executing...`;
    }
    if (elements.sdkResponseView) {
      elements.sdkResponseView.textContent = `// Dispatching tecdoc.${method}()...`;
    }

    const startTime = performance.now();
    try {
      let result;
      if (typeof tecdoc[method] === 'function') {
        result = await tecdoc[method](params);
      } else {
        result = await tecdoc.pegasusCall(method, params);
      }

      const elapsed = Math.round((performance.now() - startTime) * 10) / 10;
      if (elements.sdkRespTime) elements.sdkRespTime.textContent = `Latency: ${elapsed} ms`;
      if (elements.sdkRespBadge) {
        elements.sdkRespBadge.textContent = `${result.status || 200} ${result.statusText || 'OK'}`;
        elements.sdkRespBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        elements.sdkRespBadge.style.color = '#34d399';
      }

      if (elements.sdkResponseView) {
        elements.sdkResponseView.textContent = JSON.stringify(result, null, 2);
      }
    } catch (err) {
      if (elements.sdkRespBadge) {
        elements.sdkRespBadge.textContent = '500 ERROR';
        elements.sdkRespBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        elements.sdkRespBadge.style.color = '#f87171';
      }
      if (elements.sdkResponseView) {
        elements.sdkResponseView.textContent = JSON.stringify({ error: true, message: err.message }, null, 2);
      }
    } finally {
      if (elements.btnSdkRun) {
        elements.btnSdkRun.disabled = false;
        elements.btnSdkRun.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Run SDK Method</span>
        `;
      }
    }
  };

  // Event Listeners
  elements.sdkSelectMethod.addEventListener('change', updateFieldVisibility);

  // Form input listeners to trigger snippet refresh
  [
    elements.sdkParamTargetType,
    elements.sdkParamManuId,
    elements.sdkParamVehicleId,
    elements.sdkParamArticleNumber,
    elements.sdkParamArticleId,
    elements.sdkParamVin,
    elements.sdkParamCountry,
    elements.sdkParamLang,
    elements.sdkParamApiKey
  ].forEach(input => {
    if (input) {
      input.addEventListener('input', updateGeneratedSnippet);
      input.addEventListener('change', updateGeneratedSnippet);
    }
  });

  // Run button
  if (elements.btnSdkRun) {
    elements.btnSdkRun.addEventListener('click', runSelectedSdkMethod);
  }

  // Reset button
  if (elements.btnSdkReset) {
    elements.btnSdkReset.addEventListener('click', () => {
      elements.sdkSelectMethod.value = 'getManufacturers';
      if (elements.sdkParamTargetType) elements.sdkParamTargetType.value = 'P';
      if (elements.sdkParamManuId) elements.sdkParamManuId.value = '16';
      if (elements.sdkParamVehicleId) elements.sdkParamVehicleId.value = '9877';
      if (elements.sdkParamArticleNumber) elements.sdkParamArticleNumber.value = '20430';
      if (elements.sdkParamArticleId) elements.sdkParamArticleId.value = '1878343';
      if (elements.sdkParamVin) elements.sdkParamVin.value = 'WBAKG71040E123456';
      if (elements.sdkParamCountry) elements.sdkParamCountry.value = 'DE';
      if (elements.sdkParamLang) elements.sdkParamLang.value = 'EN';
      if (elements.sdkParamApiKey) elements.sdkParamApiKey.value = '';
      updateFieldVisibility();
      showToast('SDK parameters reset to defaults');
    });
  }

  // Language tabs
  const langTabs = document.querySelectorAll('.sdk-lang-tab');
  langTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      langTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSdkLang = tab.getAttribute('data-lang') || 'javascript';
      updateGeneratedSnippet();
    });
  });

  // Copy code snippet
  if (elements.btnSdkCopyCode) {
    elements.btnSdkCopyCode.addEventListener('click', () => {
      const code = elements.sdkCodeDisplay ? elements.sdkCodeDisplay.textContent : '';
      navigator.clipboard.writeText(code).then(() => {
        showToast('Code snippet copied to clipboard!');
      });
    });
  }

  // Initial render
  updateFieldVisibility();
  runSelectedSdkMethod();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatAutodocDate(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return String(dateStr);
  }
}

// 9. Autodoc Automotive Aftermarket News & Technical Portal
function setupAutodocPortal() {
  let activeCat = 'all';
  let activeSource = 'all';
  let searchTerm = '';
  let uploadedImageBase64 = '';

  const grid = document.getElementById('autodoc-news-grid');
  const emptyState = document.getElementById('autodoc-empty-state');
  const searchInput = document.getElementById('autodoc-search-input');
  const clearSearchBtn = document.getElementById('btn-clear-autodoc-search');
  const totalStat = document.getElementById('stat-autodoc-total');
  const catsStat = document.getElementById('stat-autodoc-cats');
  const refreshBtn = document.getElementById('btn-refresh-autodoc-news');
  const resetFiltersBtn = document.getElementById('btn-reset-autodoc-filters');

  // Modals
  const articleModal = document.getElementById('autodoc-article-modal');
  const closeArticleBtn = document.getElementById('btn-close-article-modal');
  const dismissArticleBtn = document.getElementById('btn-dismiss-article-modal');
  const publishModal = document.getElementById('autodoc-publish-modal');
  const openPublishBtn = document.getElementById('btn-open-publish-modal');
  const closePublishBtn = document.getElementById('btn-close-publish-modal');
  const cancelPublishBtn = document.getElementById('btn-cancel-publish-modal');
  const publishForm = document.getElementById('autodoc-publish-form');
  const fileInput = document.getElementById('publish-file-input');
  const previewBox = document.getElementById('publish-image-preview-box');
  const previewImg = document.getElementById('publish-preview-img');
  const removePreviewBtn = document.getElementById('btn-remove-preview-img');

  async function renderNews() {
    if (!grid) return;
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <div class="spinner" style="margin: 0 auto 12px; width: 28px; height: 28px; border: 3px solid rgba(239, 68, 68, 0.2); border-top-color: #ef4444; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p>Loading Autodoc automotive bulletins...</p>
      </div>
    `;

    try {
      const response = await autodocService.getNews({
        category: activeCat,
        search: searchTerm,
        source: activeSource,
        page: 1,
        pageSize: 50
      });

      const newsList = response.news || [];
      if (totalStat) totalStat.textContent = String(response.totalCount || newsList.length);
      if (catsStat) catsStat.textContent = String(AUTODOC_CATEGORIES.length - 1);

      if (newsList.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }

      grid.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';

      grid.innerHTML = newsList.map(item => `
        <article class="autodoc-card" data-id="${item.id}">
          <div class="autodoc-card-img-wrap">
            <img src="${item.titleImageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'}" 
                 alt="${escapeHtml(item.title)}" 
                 class="autodoc-card-img" 
                 loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'">
            <span class="autodoc-card-badge">${escapeHtml(item.categoryName || item.categoryType)}</span>
          </div>
          <div class="autodoc-card-body">
            <div class="autodoc-card-date">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <time>${formatAutodocDate(item.publishedDate)}</time>
            </div>
            <h3 class="autodoc-card-title">${escapeHtml(item.title)}</h3>
            <p class="autodoc-card-desc">${escapeHtml(item.description)}</p>
            <div class="autodoc-card-footer">
              <span class="autodoc-card-author" title="${escapeHtml(item.author || 'Technician')}">${escapeHtml(item.author || 'Technician')}</span>
              <button class="autodoc-read-btn" data-id="${item.id}" type="button">
                <span>Read Bulletin</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `).join('');

      // Wire click handlers on cards
      grid.querySelectorAll('.autodoc-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          openArticleReader(id);
        });
      });

    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--accent-red);">
          <p>Error loading bulletins: ${err.message}</p>
          <button id="btn-retry-autodoc" class="btn btn-secondary btn-sm" style="margin-top: 10px;">Retry</button>
        </div>
      `;
      document.getElementById('btn-retry-autodoc')?.addEventListener('click', renderNews);
    }
  }

  function openArticleReader(id) {
    const article = autodocService.getNewsItem(id);
    if (!article || !articleModal) return;

    const catEl = document.getElementById('article-modal-category');
    const titleEl = document.getElementById('article-modal-title');
    const dateEl = document.getElementById('article-modal-date');
    const authorEl = document.getElementById('article-modal-author');
    const imgEl = document.getElementById('article-modal-img');
    const contentEl = document.getElementById('article-modal-content');

    if (catEl) catEl.textContent = article.categoryName || article.categoryType || 'Technical Bulletin';
    if (titleEl) titleEl.textContent = article.title;
    if (dateEl) dateEl.textContent = formatAutodocDate(article.publishedDate);
    if (authorEl) authorEl.textContent = article.author || 'Autodoc Workshop Specialist';
    if (imgEl) {
      imgEl.src = article.titleImageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80';
      imgEl.onerror = () => { imgEl.src = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'; };
    }
    if (contentEl) {
      contentEl.innerHTML = article.text || `<p>${escapeHtml(article.description)}</p>`;
    }

    articleModal.showModal();
  }

  // Modal close handlers
  closeArticleBtn?.addEventListener('click', () => articleModal?.close());
  dismissArticleBtn?.addEventListener('click', () => articleModal?.close());
  articleModal?.addEventListener('click', (e) => {
    if (e.target === articleModal) articleModal.close();
  });

  // Search input
  let searchDebounce = null;
  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    if (clearSearchBtn) clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      renderNews();
    }, 250);
  });

  clearSearchBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchTerm = '';
    clearSearchBtn.style.display = 'none';
    renderNews();
  });

  // Category pills
  document.querySelectorAll('#autodoc-categories-bar .cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#autodoc-categories-bar .cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.dataset.cat || 'all';
      renderNews();
    });
  });

  // Source toggle
  document.querySelectorAll('.source-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.source-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSource = btn.dataset.source || 'all';
      showToast(`Switched source to: ${btn.textContent.trim()}`);
      renderNews();
    });
  });

  // Refresh
  refreshBtn?.addEventListener('click', () => {
    showToast('Refreshing Autodoc automotive feed...');
    renderNews();
  });

  // Reset filters
  resetFiltersBtn?.addEventListener('click', () => {
    activeCat = 'all';
    activeSource = 'all';
    searchTerm = '';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    document.querySelectorAll('#autodoc-categories-bar .cat-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === 'all');
    });
    document.querySelectorAll('.source-toggle-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.source === 'all');
    });
    renderNews();
    showToast('Filters reset to default');
  });

  // Publish Modal events
  openPublishBtn?.addEventListener('click', () => {
    publishModal?.showModal();
  });

  closePublishBtn?.addEventListener('click', () => publishModal?.close());
  cancelPublishBtn?.addEventListener('click', () => publishModal?.close());
  publishModal?.addEventListener('click', (e) => {
    if (e.target === publishModal) publishModal.close();
  });

  // File upload preview
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedImageBase64 = event.target.result;
        if (previewImg) previewImg.src = uploadedImageBase64;
        if (previewBox) previewBox.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  removePreviewBtn?.addEventListener('click', () => {
    uploadedImageBase64 = '';
    if (fileInput) fileInput.value = '';
    if (previewBox) previewBox.style.display = 'none';
  });

  // Publish form submit
  publishForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('publish-title')?.value;
    const category = document.getElementById('publish-category')?.value;
    const desc = document.getElementById('publish-desc')?.value;
    const text = document.getElementById('publish-text')?.value;
    const urlImg = document.getElementById('publish-image-url')?.value;
    const author = document.getElementById('publish-author')?.value;

    const finalImg = uploadedImageBase64 || urlImg || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80';

    try {
      autodocService.createNewsItem({
        title,
        description: desc,
        text,
        categoryType: category,
        imageUrl: finalImg,
        author: author || 'Workshop Specialist'
      });

      publishForm.reset();
      uploadedImageBase64 = '';
      if (previewBox) previewBox.style.display = 'none';
      publishModal?.close();

      showToast('Technical bulletin published successfully!');
      renderNews();
    } catch (err) {
      alert('Error publishing bulletin: ' + err.message);
    }
  });

  // Initial render
  renderNews();
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 200);
  }, 2600);
}

// Boot
window.addEventListener('DOMContentLoaded', initApp);
