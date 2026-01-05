document.addEventListener('DOMContentLoaded', () => {
  (async () => {
  // Default translations (fallback if data_language.txt not ready)
  const defaultTranslations = {
    en: {
      appTitle: "Wildlife Distribution Information", legendTitle: "Number of Sighting Points",
      showAll: "Show All", hideAll: "Hide All", settingsTitle: "Map Settings",
      mapType: "Map Type", mapDefault: "Default", mapSatellite: "Satellite", mapTerrain: "Terrain",
      mapScale: "Map Scale", showRoads: "Show Roads", showImages: "Show Animal Images",
      darkMode: "Dark Mode", language: "Language", mapInfo: "Map Information",
      websiteSettings: "Website Settings", gmapsButton: "Open in Google Maps",
      scale: { region: " (1:180,000)", district: " (1:90,000)", subDistrict: " (1:45,000)", local: " (1:22,000)", detail: " (1:11,000)" },
      details: { date: "Date", time: "Time", count: "Individuals", district: "District", location: "Location", habitat: "Habitat Type", activity: "Activity", coord: "Coordinate" }
    },
    id: {
      appTitle: "Informasi Sebaran Satwa", legendTitle: "Jumlah Titik Sebaran",
      showAll: "Tampilkan Semua", hideAll: "Sembunyikan Semua", settingsTitle: "Pengaturan Peta",
      mapType: "Tipe Peta", mapDefault: "Default", mapSatellite: "Satelit", mapTerrain: "Terrain",
      mapScale: "Skala Peta", showRoads: "Tampilkan Jalan", showImages: "Tampilkan Gambar Satwa",
      darkMode: "Mode Gelap", language: "Bahasa", mapInfo: "Informasi Peta",
      websiteSettings: "Pengaturan Website", gmapsButton: "Buka di Google Maps",
      scale: { region: " (1:180,000)", district: " (1:90,000)", subDistrict: " (1:45,000)", local: " (1:22,000)", detail: " (1:11,000)" },
      details: { date: "Hari/Tanggal", time: "Jam", count: "Jumlah Individu", district: "Distrik", location: "Lokasi", habitat: "Tipe Habitat", activity: "Aktivitas", coord: "Titik Koordinat" }
    }
  };

  // Helpers
  async function loadText(path, {optional=false}={}) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (optional) return null;
      throw new Error(`Gagal memuat ${path}: ${e.message}`);
    }
  }
  function cleanLines(text) {
    return text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  }
  // set nested value by dot path
  function setPath(obj, path, value) {
    const keys = path.split('.');
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
      cur = cur[k];
    }
    cur[keys[keys.length-1]] = value;
  }
  // deep merge
  function deepMerge(dst, src) {
    for (const k of Object.keys(src)) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
        if (!dst[k] || typeof dst[k] !== 'object') dst[k] = {};
        deepMerge(dst[k], src[k]);
      } else {
        dst[k] = src[k];
      }
    }
    return dst;
  }
  function parseBool(v, def = undefined) {
    if (v == null) return def;
    const s = String(v).trim().toLowerCase();
    if (['true','1','yes','y','on'].includes(s)) return true;
    if (['false','0','no','n','off'].includes(s)) return false;
    return def;
  }

  // Parse data_language.txt
  function parseLanguageIni(text) {
    const langs = {};
    let current = null;
    text.split(/\r?\n/).forEach(raw => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const sec = line.match(/^\[([^\]]+)\]$/);
      if (sec) { current = sec[1].trim(); langs[current] = langs[current] || {}; return; }
      if (!current) return;
      const kv = line.split('=');
      if (kv.length < 2) return;
      const key = kv[0].trim();
      const val = kv.slice(1).join('=').trim();
      setPath(langs[current], key, val);
    });
    return langs;
  }

  // Parse data_setting.txt (key=value)
  function parseSettings(text) {
    const out = {};
    text.split(/\r?\n/).forEach(raw => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx+1).trim();
      out[key] = val;
    });

    // Normalisasi
    const scale = parseInt(out.scale, 10);
    out.scale = Number.isFinite(scale) ? scale : undefined;

    const theme = (out.theme || '').toLowerCase();
    out.theme = (theme === 'dark' || theme === 'light') ? theme : undefined;

    const lang = (out.language || '').toLowerCase();
    out.language = (lang === 'translate' || lang === 'local') ? lang : undefined;

    const mapType = (out.mapType || '').toLowerCase();
    out.mapType = (['default','satellite','terrain'].includes(mapType)) ? mapType : undefined;

    out.showImages = parseBool(out.showImages, undefined);
    out.showRoad   = parseBool(out.showRoad,   undefined);

    return out;
  }

  // SPECIES: name | color | image 
  function parseSpecies(text) {
    const lines = cleanLines(text);
    const species = [];
    const color_map = {};
    const image_map = {};
    for (const line of lines) {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length < 3) { console.warn('Lewati baris species (butuh 3 kolom):', line); continue; }
      const [name, color, image] = parts;
      species.push(name);
      color_map[name] = color || '#000';
      image_map[name] = image || '';
    }
    return { species, color_map, image_map };
  }

  // Make DMS to decimal
  function dmsToDec(deg, min, hemi) {
    const dec = Number(deg) + Number(min) / 60;
    return (/^[SW]$/i.test(hemi)) ? -dec : dec;
  }
  // Parser coord
  function parseCoordString(s) {
    if (!s) return null;
    const txt = s.replace(/\s+/g, ' ').trim();

    // Lat: x  Long: y
    let m = txt.match(/Lat[.:]?\s*(-?\d+(?:\.\d+)?)\D+Long[.:]?\s*(-?\d+(?:\.\d+)?)/i);
    if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };

    // N dd°mm.mmm'  E ddd°mm.mmm'
    m = txt.match(/([NS])\s*(\d{1,2})[°\s]\s*(\d{1,2}(?:\.\d+)?)['’]?[,\s]+([EW])\s*(\d{1,3})[°\s]\s*(\d{1,2}(?:\.\d+)?)['’]?/i);
    if (m) {
      const lat = dmsToDec(m[2], m[3], m[1].toUpperCase());
      const lon = dmsToDec(m[5], m[6], m[4].toUpperCase());
      return { lat, lon };
    }

    // Fallback: dua angka pertama
    const nums = txt.match(/-?\d+(?:\.\d+)?/g);
    if (nums && nums.length >= 2) return { lat: parseFloat(nums[0]), lon: parseFloat(nums[1]) };
    return null;
  }

  // POINTS: 9 kolom
  // Hari/Tanggal | Jam | Jenis | Jumlah Individu | Distrik | Titik Koordinat | Tipe Habitat | Lokasi | Aktivitas
  function parsePoints(text, knownSpecies) {
    const lines = cleanLines(text);
    const points = [];
    for (const line of lines) {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length < 9) { console.warn('Lewati baris point (butuh 9 kolom):', line); continue; }

      const [date, time, species, countStr, district, coordStr, habitat, location, aktivitas] = parts;
      if (knownSpecies && !knownSpecies.includes(species)) {
        console.warn('Spesies tidak ada di data_species.txt:', species);
      }
      const coord = parseCoordString(coordStr);
      if (!coord || !Number.isFinite(coord.lat) || !Number.isFinite(coord.lon)) {
        console.warn('Koordinat tidak valid:', coordStr);
        continue;
      }
      const count = Number(countStr);
      points.push({
        species, lat: coord.lat, lon: coord.lon,
        date, time, count: Number.isFinite(count) ? count : null,
        district, habitat, location, aktivitas, coordRaw: coordStr
      });
    }
    return points;
  }

  //  Load all datas
  const [speciesTxt, pointsTxt, langTxt, settingTxt] = await Promise.all([
    loadText('data/data_species.txt'),
    loadText('data/data_mappoints.txt'),
    loadText('data/data_language.txt', {optional: true}),
    loadText('data/data_setting.txt',  {optional: true}) 
    ]);

  const meta = parseSpecies(speciesTxt);
  const points = parsePoints(pointsTxt, meta.species);

  // Translations
  let translations = JSON.parse(JSON.stringify(defaultTranslations));
  if (langTxt) {
    const parsedLangs = parseLanguageIni(langTxt);
    for (const code of Object.keys(parsedLangs)) {
      if (!translations[code]) translations[code] = {};
      deepMerge(translations[code], parsedLangs[code]);
    }
  }

  // Settings (with fallback default)
  const settings       = settingTxt ? parseSettings(settingTxt) : {};
  const initialZoom    = settings.scale ?? 12; // default 12 (≈1:180k)
  const initialTheme   = settings.theme ?? 'dark';
  const initialLang    = settings.language === 'translate' ? 'en'
  : settings.language === 'local' ? 'id' : 'id';
  const initialMapType = settings.mapType ?? 'default';
  let   showImages     = settings.showImages ?? false;
  let   showRoad       = settings.showRoad   ?? true;

  // ===== Init map =====
  const avgLat = points.reduce((s, p) => s + p.lat, 0) / (points.length || 1);
  const avgLon = points.reduce((s, p) => s + p.lon, 0) / (points.length || 1);
  const map = L.map('map').setView([avgLat || 0, avgLon || 0], initialZoom);

  const baseLayers = {
    default:   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: '&copy; Esri' }),
    terrain:   L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '&copy; OpenTopoMap' })
  };
  const roadOverlay = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', maxZoom: 20 });

  // Basemap helper and apply initial mapType
  let currentBaseLayer = baseLayers.default;
  function applyBaseLayer(type) {
    const target = baseLayers[type] || baseLayers.default;
    if (currentBaseLayer !== target) {
      map.removeLayer(currentBaseLayer);
      currentBaseLayer = target;
    }
    currentBaseLayer.addTo(map);

    // active button
    document.querySelectorAll('.map-type-btn').forEach(b => b.classList.remove('bg-white','text-indigo-600','shadow','dark:bg-gray-500'));
    const btn = document.querySelector(`.map-type-btn[data-map-type="${type}"]`);
    if (btn) btn.classList.add('bg-white','text-indigo-600','shadow','dark:bg-gray-500');
  }

  // Mini map
  const miniMapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO' });
  new L.Control.MiniMap(miniMapLayer, { position: 'bottomright', toggleDisplay: true, minimized: false, width: 150, height: 150, zoomLevelOffset: -5 }).addTo(map);

  let markerLayer = L.layerGroup().addTo(map);

  let activeSpecies = {};
  meta.species.forEach(s => activeSpecies[s] = true);

  // Theme & Language initial from settings
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.checked = (initialTheme === 'dark');

  let currentLang = initialLang;
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) langToggle.checked = (currentLang === 'en');

  // Apply initial mapType / road / images from settings
  applyBaseLayer(initialMapType);

  const roadToggle = document.getElementById('road-toggle');
  if (roadToggle) roadToggle.checked = !showRoad;  
  if (showRoad) {
    roadOverlay.addTo(map);
  } else {
    map.removeLayer(roadOverlay);
  }

  const imageToggle = document.getElementById('image-toggle');
  if (imageToggle) imageToggle.checked = !!showImages;

  // UI text
  const updateUIText = () => {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.dataset.lang;
      const txt = translations[currentLang]?.[key];
      if (typeof txt === 'string') el.textContent = txt;
    });
    document.querySelectorAll('[data-lang-scale]').forEach(el => {
      const key = el.dataset.langScale;
      const txt = translations[currentLang]?.scale?.[key];
      if (typeof txt === 'string') el.textContent = txt;
    });
    const showAllBtn = document.getElementById('show-all-btn');
    const allEnabled = Object.values(activeSpecies).every(s => s);
    showAllBtn.textContent = allEnabled
    ? (translations[currentLang]?.hideAll || 'Hide All')
    : (translations[currentLang]?.showAll || 'Show All');
  };

  // Marker & popup
  const updateMarkers = () => {
    markerLayer.clearLayers();
    const T = translations[currentLang]?.details || defaultTranslations[currentLang].details;

    points.forEach(point => {
      if (!activeSpecies[point.species]) return;

      const imgSrc = meta.image_map[point.species] || '';

      const detailHtml = `
      <div class="text-xs text-gray-500 space-y-1">
      ${point.date ? `<div><strong>${T.date}:</strong> ${point.date}</div>` : ''}
      ${point.time ? `<div><strong>${T.time}:</strong> ${point.time}</div>` : ''}
      ${Number.isFinite(point.count) ? `<div><strong>${T.count}:</strong> ${point.count}</div>` : ''}
      ${point.district ? `<div><strong>${T.district}:</strong> ${point.district}</div>` : ''}
      ${point.location ? `<div><strong>${T.location}:</strong> ${point.location}</div>` : ''}
      ${point.habitat ? `<div><strong>${T.habitat}:</strong> ${point.habitat}</div>` : ''}
      ${point.aktivitas ? `<div><strong>${T.activity}:</strong> ${point.aktivitas}</div>` : ''}
      <div><strong>${T.coord}:</strong> ${point.coordRaw || `${point.lat.toFixed(6)}, ${point.lon.toFixed(6)}`}</div>
      <div><span class="text-gray-400">Lat:</span> ${point.lat.toFixed(6)} &middot; <span class="text-gray-400">Lon:</span> ${point.lon.toFixed(6)}</div>
      </div>`;

      const popupContent = `
      <div class="font-sans space-y-2 w-40">
      ${showImages && imgSrc ? `<img src="${imgSrc}" class="w-full h-24 object-cover rounded-md mb-2" alt="${point.species}" />` : ''}
      <h3 class="font-bold text-lg">${point.species}</h3>
      ${detailHtml}
      <a href="https://www.google.com/maps?q=${point.lat},${point.lon}" target="_blank"
      class="block w-full text-center bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
      ${(translations[currentLang]?.gmapsButton) || defaultTranslations[currentLang].gmapsButton}
      </a>
      </div>`;

      if (showImages && imgSrc) {
        L.marker([point.lat, point.lon], {
          icon: L.icon({ iconUrl: imgSrc, iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40], className: 'animal-icon' })
        }).bindPopup(popupContent).addTo(markerLayer);
      } else {
        L.circleMarker([point.lat, point.lon], {
          radius: 7,
          fillColor: meta.color_map[point.species] || '#000',
          color: "#fff",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(popupContent).addTo(markerLayer);
      }
    });
  };

  // Legend
  const updateLegend = () => {
    const legendContainer = document.getElementById('legend-items');
    legendContainer.innerHTML = '';
    meta.species.forEach(species => {
      const speciesPoints = points.filter(p => p.species === species);
      if (speciesPoints.length === 0) return;

      const wrapper = document.createElement('div');
      const displayItem = (showImages && meta.image_map[species])
      ? `<img src="${meta.image_map[species]}" class="h-8 w-8 rounded-full object-cover mr-3 border" alt="${species}">`
      : `<span class="legend-dot mr-3" style="background-color: ${meta.color_map[species]};"></span>`;

      wrapper.innerHTML = `
      <div class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
      <div class="flex items-center flex-grow species-name">${displayItem}<span class="text-gray-700 dark:text-gray-200 font-medium">${species}</span></div>
      <span class="text-gray-600 dark:text-gray-300 font-semibold mx-2">${speciesPoints.length}</span>
      <label class="switch"><input type="checkbox" data-species="${species}" class="species-toggle" ${activeSpecies[species] ? 'checked' : ''}><span class="slider round"></span></label>
      </div>
      <div class="sub-list ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-600"></div>`;

      legendContainer.appendChild(wrapper);
      const subList = wrapper.querySelector('.sub-list');
      speciesPoints.forEach((point, index) => {
        const pointEl = document.createElement('div');
        pointEl.className = 'text-sm text-gray-600 dark:text-gray-400 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md cursor-pointer';
        pointEl.textContent = `${species} #${index + 1}`;
        pointEl.onclick = () => map.flyTo([point.lat, point.lon], 17);
        subList.appendChild(pointEl);
      });
      wrapper.querySelector('.species-name').onclick = () => subList.classList.toggle('expanded');
    });

    document.querySelectorAll('.species-toggle').forEach(toggle => {
      toggle.onchange = (e) => {
        activeSpecies[e.target.dataset.species] = e.target.checked;
        updateMarkers(); updateUIText();
      };
    });
  };

  // Init UI
  updateUIText();
  updateMarkers();
  updateLegend();

  // Controls 
  document.querySelectorAll('.map-type-btn').forEach(btn => {
    btn.onclick = () => applyBaseLayer(btn.dataset.mapType);
  });

  const roadToggleEl = document.getElementById('road-toggle');
  if (roadToggleEl) {
    roadToggleEl.onchange = (e) => {
      showRoad = !e.target.checked;   
      if (showRoad) {
        roadOverlay.addTo(map);
      } else {
        map.removeLayer(roadOverlay);
      }
    };
  }

  const imageToggleEl = document.getElementById('image-toggle');
  if (imageToggleEl) {
    imageToggleEl.onchange = (e) => { showImages = !!e.target.checked; updateMarkers(); updateLegend(); };
  }

  const scaleSel = document.getElementById('scale-selector');
  if (scaleSel) scaleSel.onchange = (e) => map.setZoom(parseInt(e.target.value));

  const showAllBtn = document.getElementById('show-all-btn');
  if (showAllBtn) showAllBtn.onclick = () => {
    const allEnabled = Object.values(activeSpecies).every(s => s);
    meta.species.forEach(s => activeSpecies[s] = !allEnabled);
    updateMarkers(); updateLegend(); updateUIText();
  };

  if (themeToggle) {
    themeToggle.onchange = (e) => { document.documentElement.classList.toggle('dark', e.target.checked); };
  }
  if (langToggle) {
    langToggle.onchange = (e) => { currentLang = e.target.checked ? 'en' : 'id'; updateUIText(); updateLegend(); updateMarkers(); };
  }

  // Info panel (set dropdown to initial zoom)
  const infoLat = document.getElementById('info-lat'),
  infoLon = document.getElementById('info-lon'),
  infoZoom = document.getElementById('info-zoom');
  const updateMapInfo = () => {
    const center = map.getCenter(); const zoom = map.getZoom();
    infoLat.textContent = center.lat.toFixed(6);
    infoLon.textContent = center.lng.toFixed(6);
    infoZoom.textContent = zoom;
    if (scaleSel) scaleSel.value = [...scaleSel.options].some(opt => opt.value == zoom) ? zoom : "";
  };
  map.on('moveend zoomend', updateMapInfo);
  updateMapInfo();
})();
});
