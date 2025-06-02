// =============== KONFIGURASI APLIKASI ===============
const CONFIG = {
  map: {
    center: [-6.9, 107.6],
    zoom: 16,
    minZoom: 10,
    maxZoom: 22,
    maxNativeZoom: 19
  },
  thingspeak: {
    channelId: '2625391',
    apiKey: 'E22JKJFSAT9OSD7K',
    url: `https://api.thingspeak.com/channels/2625391/feeds.json?api_key=E22JKJFSAT9OSD7K&results=180`
  },
  fields: {
    count: 6,
    pointsPerField: 30
  }
};

// =============== VARIABEL GLOBAL ===============
let map;
let allPoints = [];
let markers = [];
let polygonLayer = null;
let currentField = 1;
let manualNitrogen = {};
let selectedPoint = null;
let fertilizerChart = null;
let showDistanceLabels = true;
let baseLayers = {};
let currentBasemap = 'osm';
let showPolygon = true;
let tileErrorDisplayed = false;

// =============== INISIALISASI APLIKASI ===============
document.addEventListener('DOMContentLoaded', function() {
  initApplication();
});

function initApplication() {
  initMap();
  initEventListeners();
  handleTileErrors();
  handleHighZoom();
  initTileLoadingIndicator();
  
  // Tampilkan status awal
  showEmptyState();
  
  // Mulai proses pengambilan data
  fetchData();
}

// =============== MANAJEMEN PETA ===============
function initMap() {
  try {
    map = L.map('map', {
      center: CONFIG.map.center,
      zoom: CONFIG.map.zoom,
      minZoom: CONFIG.map.minZoom,
      maxZoom: CONFIG.map.maxZoom,
      maxNativeZoom: CONFIG.map.maxNativeZoom,
      zoomControl: false
    });

    // Definisikan base layers
    baseLayers = {
      'osm': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom,
        maxNativeZoom: CONFIG.map.maxNativeZoom,
        noWrap: true
      }),
      'satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom,
        maxNativeZoom: 19,
        detectRetina: true,
        noWrap: true
      })
    };

    // Tambahkan base layer default
    baseLayers.osm.addTo(map);

    // Tambahkan kontrol zoom di pojok kanan bawah
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    console.log('Peta berhasil diinisialisasi');
  } catch (error) {
    console.error('Gagal menginisialisasi peta:', error);
    showAlert('Gagal memuat peta. Silakan refresh halaman.', 'error');
  }
}

// =============== TOGGLE POLYGON ===============
function togglePolygon() {
  showPolygon = !showPolygon;
  
  if (polygonLayer) {
    if (showPolygon) {
      polygonLayer.addTo(map);
      document.querySelector('#toggle-polygon-btn i').className = 'fas fa-vector-square';
    } else {
      map.removeLayer(polygonLayer);
      document.querySelector('#toggle-polygon-btn i').className = 'fas fa-square';
    }
  }
}

// =============== TOGGLE BASEMAP ===============
function toggleBasemap() {
  // Hapus layer basemap yang aktif
  if (currentBasemap === 'osm') {
    map.removeLayer(baseLayers.osm);
  } else {
    map.removeLayer(baseLayers.satellite);
  }
  
  // Tentukan layer baru
  let newBasemap;
  if (currentBasemap === 'osm') {
    newBasemap = baseLayers.satellite;
    currentBasemap = 'satellite';
    document.querySelector('#toggle-basemap-btn i').className = 'fas fa-map';
    
    // Set maxZoom untuk layer satelit
    map.setMaxZoom(19);
  } else {
    newBasemap = baseLayers.osm;
    currentBasemap = 'osm';
    document.querySelector('#toggle-basemap-btn i').className = 'fas fa-layer-group';
    
    // Kembalikan maxZoom ke nilai awal
    map.setMaxZoom(CONFIG.map.maxZoom);
  }
  
  // Tambahkan layer baru
  newBasemap.addTo(map);
  
  // Hapus pesan error jika ada
  hideTileError();
  
  // Jika zoom saat ini melebihi maxZoom layer baru, set zoom ke maxZoom layer
  if (map.getZoom() > map.getMaxZoom()) {
    map.setZoom(map.getMaxZoom());
  }
}

// =============== MANAJEMEN DATA ===============
async function fetchData() {
  showLoading(true);
  
  try {
    const response = await fetch(CONFIG.thingspeak.url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Debugging: Tampilkan data yang diterima
    console.log('Data from ThingSpeak:', data);
    
    if (!data.feeds || !Array.isArray(data.feeds)) {
      throw new Error('Format data tidak valid: feeds tidak ditemukan');
    }
    
    allPoints = processThingSpeakData(data.feeds);
    
    // Debugging: Tampilkan titik yang diproses
    console.log('Processed points:', allPoints);
    
    if (allPoints.length === 0) {
      throw new Error('Tidak ada titik dengan koordinat valid');
    }
    
    // PERBAIKAN 1: Muat sawah yang sedang aktif, bukan selalu sawah 1
    const currentField = document.getElementById('sawah-select').value;
    loadFieldData(parseInt(currentField));
    
  } catch (error) {
    console.error('Error fetching data:', error);
    showAlert(`Gagal memuat data: ${error.message}`, 'error');
    
    // Gunakan data mock
    allPoints = generateMockData();
    
    // PERBAIKAN 2: Tetap muat sawah yang sedang aktif
    const currentField = document.getElementById('sawah-select').value;
    loadFieldData(parseInt(currentField));
    
    if (allPoints.length === 0) {
      showAlert('Tidak ada data sawah yang tersedia', 'error');
    }
  } finally {
    showLoading(false);
  }
}

// =============== PROSES DATA THINGSPEAK ===============
function processThingSpeakData(feeds) {
  return feeds
    .map((feed, index) => {
      try {
        const lat = parseFloat(feed.field1);
        const lng = parseFloat(feed.field2);
        
        if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          console.warn(`Koordinat tidak valid untuk titik ${index + 1}:`, feed);
          return null;
        }
        
        // PERBAIKAN 6: Simpan informasi sawah jika ada di Thingspeak
        return {
          id: index + 1,
          lat: lat,
          lng: lng,
          npk: {
            nitrogen: safeParseFloat(feed.field4),
            phosphate: safeParseFloat(feed.field5),
            kalium: safeParseFloat(feed.field6)
          },
          sawah: feed.field7 || "", // PERBAIKAN: Gunakan field7 untuk nama sawah
          coords: [lat, lng]
        };
      } catch (e) {
        console.error('Error processing feed:', feed, e);
        return null;
      }
    })
    .filter(Boolean);
}

function safeParseFloat(value) {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

// =============== DATA MOCK YANG LEBIH BAIK ===============
function generateMockData() {
  const mockData = [];
  const baseLat = CONFIG.map.center[0];
  const baseLng = CONFIG.map.center[1];
  
  // Daftar nama sawah
  const fieldNames = [
    "Sawah PAK LUQMAN",
    "Sawah PAK MALIK",
    "Sawah Pak Ujang",
    "Sawah Timur",
    "Sawah Barat",
    "Sawah Utara"
  ];
  
  for (let field = 1; field <= CONFIG.fields.count; field++) {
    const fieldOffsetLat = (field - 1) * 0.01;
    
    for (let i = 0; i < CONFIG.fields.pointsPerField; i++) {
      const angle = (i / CONFIG.fields.pointsPerField) * Math.PI * 2;
      const radius = 0.001;
      
      mockData.push({
        id: mockData.length + 1,
        lat: baseLat + fieldOffsetLat + Math.cos(angle) * radius,
        lng: baseLng + Math.sin(angle) * radius,
        npk: {
          nitrogen: (5 + Math.random() * 5).toFixed(2),
          phosphate: (20 + Math.random() * 30).toFixed(2),
          kalium: (10 + Math.random() * 20).toFixed(2)
        },
        sawah: fieldNames[field-1], // PERBAIKAN: Tambahkan nama sawah
        coords: [
          baseLat + fieldOffsetLat + Math.cos(angle) * radius,
          baseLng + Math.sin(angle) * radius
        ]
      });
    }
  }
  
  return mockData;
}

// =============== PERBAIKAN BUG PEMILIHAN SAWAH ===============
function loadFieldData(fieldNumber) {
  currentField = fieldNumber;
  clearMap();
  
  // PERBAIKAN 3: Gunakan cara yang lebih fleksibel untuk memilih data sawah
  const fieldPoints = getFieldPoints(fieldNumber);
  
  console.log(`Loading field ${fieldNumber}: ${fieldPoints.length} points`);
  
  if (fieldPoints.length === 0) {
    showEmptyState();
    return;
  }
  
  plotPoints(fieldPoints);
  
  if (fieldPoints.length >= 3) {
    calculateFieldArea(fieldPoints);
  }
  
  updateFieldInfo(fieldPoints);
  updateRecommendation(fieldPoints);
  
  // Sembunyikan detail titik
  document.getElementById('point-details').style.display = 'none';
  selectedPoint = null;
  document.getElementById('delete-point-btn').disabled = true;
}

// =============== FUNGSI BARU: Ambil data berdasarkan sawah ===============
function getFieldPoints(fieldNumber) {
  const sawahName = document.getElementById('sawah-select').options[fieldNumber-1].text;
  
  // Coba filter berdasarkan nama sawah
  let fieldPoints = allPoints.filter(point => point.sawah === sawahName);
  
  // Jika tidak ditemukan, gunakan metode indeks
  if (fieldPoints.length === 0 && fieldNumber <= CONFIG.fields.count) {
    const startIdx = (fieldNumber - 1) * CONFIG.fields.pointsPerField;
    const endIdx = startIdx + CONFIG.fields.pointsPerField;
    fieldPoints = allPoints.slice(startIdx, Math.min(endIdx, allPoints.length));
  }
  
  console.log(`Mengambil sawah ${sawahName} (${fieldNumber}): ${fieldPoints.length} titik`);
  return fieldPoints;
}

// =============== MANAJEMEN TITIK ===============
function plotPoints(points) {
  // Hapus marker lama jika ada
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  points.forEach(point => {
    try {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="circle-marker">${point.id}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      const marker = L.marker(point.coords, { icon })
        .addTo(map)
        .bindPopup(createPointPopup(point));
      
      marker.on('click', () => selectPoint(point));
      
      markers.push(marker);
    } catch (e) {
      console.error('Error creating marker:', point, e);
    }
  });
  
  if (markers.length > 0) {
    try {
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
      map.fitBounds(bounds, { padding: [50, 50] });
    } catch (e) {
      console.error('Error fitting bounds:', e);
      map.setView(CONFIG.map.center, CONFIG.map.zoom);
    }
  } else {
    showAlert('Tidak ada titik yang dapat ditampilkan', 'warning');
    map.setView(CONFIG.map.center, CONFIG.map.zoom);
  }
}

function createPointPopup(point) {
  return `
    <div class="point-popup">
      <strong>Titik ${point.id}</strong>
      <div>Lat: ${point.lat.toFixed(6)}</div>
      <div>Lng: ${point.lng.toFixed(6)}</div>
      <div>N: ${point.npk.nitrogen} ton</div>
      <div>P: ${point.npk.phosphate} mg/kg</div>
      <div>K: ${point.npk.kalium} mg/kg</div>
    </div>
  `;
}

function calculateFieldArea(points) {
  if (polygonLayer) {
    map.removeLayer(polygonLayer);
  }
  
  const coords = points.map(p => [p.lng, p.lat]);
  coords.push(coords[0]);
  
  polygonLayer = L.polygon(points.map(p => p.coords), {
    color: '#2E7D32',
    weight: 2,
    fillOpacity: 0.2
  });
  
  // Tambahkan ke peta jika polygon ditampilkan
  if (showPolygon) {
    polygonLayer.addTo(map);
  }
  
  const polygon = turf.polygon([coords]);
  const area = turf.area(polygon) / 10000;
  const perimeter = turf.length(turf.lineString(coords)) * 1000;
  
  document.getElementById('land-area').textContent = area.toFixed(2) + ' Ha';
  document.getElementById('land-perimeter').textContent = perimeter.toFixed(2) + ' m';
  
  addDistanceLabels(points);
}

function addDistanceLabels(points) {
  document.querySelectorAll('.distance-label').forEach(el => el.remove());
  
  for (let i = 0; i < points.length; i++) {
    const nextIdx = (i + 1) % points.length;
    const from = points[i];
    const to = points[nextIdx];
    
    const line = turf.lineString([[from.lng, from.lat], [to.lng, to.lat]]);
    const distance = turf.length(line) * 1000;
    const midpoint = [
      (from.lat + to.lat) / 2,
      (from.lng + to.lng) / 2
    ];
    
    const label = L.tooltip({
      permanent: true,
      direction: 'center',
      className: 'distance-label'
    })
      .setContent(`${distance.toFixed(1)} m`)
      .setLatLng(midpoint);
    
    // Sembunyikan jika toggle mati
    if (!showDistanceLabels) {
      label.getElement().style.display = 'none';
    }
    
    label.addTo(map);
  }
}

// =============== TAMPILAN & UI ===============
function showEmptyState() {
  document.getElementById('rekomendasi-pupuk').innerHTML = `
    <div class="empty-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Tidak ada data untuk sawah ini</p>
      <button id="reload-data-btn" class="btn btn-primary">
        <i class="fas fa-sync"></i> Muat Ulang Data
      </button>
    </div>
  `;
  // Perbarui informasi lainnya
  document.getElementById('land-area').textContent = '0 Ha';
  document.getElementById('land-perimeter').textContent = '0 m';
  
  // Detail tab
  document.getElementById('avg-nitrogen').textContent = '0';
  document.getElementById('avg-phosphate').textContent = '0';
  document.getElementById('avg-kalium').textContent = '0';
  
  if (fertilizerChart) {
    fertilizerChart.destroy();
    fertilizerChart = null;
  }
}

function updateFieldInfo(points) {
  // Gunakan manualNitrogen untuk sawah ini jika ada
  const avgN = manualNitrogen[currentField] || calculateAverage(points, 'nitrogen');
  const avgP = calculateAverage(points, 'phosphate');
  const avgK = calculateAverage(points, 'kalium');
  
  document.getElementById('avg-nitrogen').textContent = avgN.toFixed(2);
  document.getElementById('avg-phosphate').textContent = avgP.toFixed(2);
  document.getElementById('avg-kalium').textContent = avgK.toFixed(2);
}

function calculateAverage(points, property) {
  const sum = points.reduce((total, point) => total + parseFloat(point.npk[property]), 0);
  return points.length > 0 ? sum / points.length : 0;
}

function updateRecommendation(points) {
  let avgN = manualNitrogen[currentField] || calculateAverage(points, 'nitrogen');
  let avgP = calculateAverage(points, 'phosphate');
  let avgK = calculateAverage(points, 'kalium');

  // Validasi rentang nilai
  avgN = Math.max(0, Math.min(10, avgN || 0));
  avgP = Math.max(0, Math.min(50, avgP || 0));
  avgK = Math.max(0, Math.min(30, avgK || 0));

  const area = parseFloat(document.getElementById('land-area').textContent) || 0;
  const recommendation = calculateFertilizerRecommendation(avgN, avgP, avgK, area);
  
  displayRecommendation(recommendation, area);
}

function displayRecommendation(recommendation, area) {
  const container = document.getElementById('rekomendasi-pupuk');
  
  container.innerHTML = `
    <div class="recommendation-summary">
      <h3><i class="fas fa-chart-pie"></i> Rekomendasi Pemupukan</h3>
      <div class="recommendation-grid">
        <div class="recommendation-item urea">
          <i class="fas fa-seedling"></i>
          <div class="recommendation-value">${recommendation.urea.total} kg</div>
          <div class="recommendation-label">UREA</div>
          <div class="recommendation-rate">${recommendation.urea.rate} kg/ha</div>
        </div>
        <div class="recommendation-item sp36">
          <i class="fas fa-flask"></i>
          <div class="recommendation-value">${recommendation.sp36.total} kg</div>
          <div class="recommendation-label">SP-36</div>
          <div class="recommendation-rate">${recommendation.sp36.rate} kg/ha</div>
        </div>
        <div class="recommendation-item kcl">
          <i class="fas fa-atom"></i>
          <div class="recommendation-value">${recommendation.kcl.total} kg</div>
          <div class="recommendation-label">KCL</div>
          <div class="recommendation-rate">${recommendation.kcl.rate} kg/ha</div>
        </div>
      </div>
      <div class="recommendation-meta">
        <p><i class="fas fa-ruler-combined"></i> Luas Lahan: ${area} Ha</p>
      </div>
    </div>
  `;
  
  updateChart(
    parseFloat(recommendation.urea.total),
    parseFloat(recommendation.sp36.total),
    parseFloat(recommendation.kcl.total),
    recommendation
  );
}

function updateChart(urea, sp36, kcl, recommendation) {
  const ctx = document.getElementById('fertilizer-chart').getContext('2d');
  
  if (fertilizerChart) {
    fertilizerChart.destroy();
  }
  
  fertilizerChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['UREA', 'SP-36', 'KCL'],
      datasets: [{
        data: [urea, sp36, kcl],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const rate = recommendation[label.toLowerCase()].rate;
              return `${label}: ${value.toFixed(1)} kg (${rate} kg/ha)`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Jumlah Pupuk (kg)'
          }
        }
      }
    }
  });
}

function selectPoint(point) {
  selectedPoint = point;
  document.getElementById('delete-point-btn').disabled = false;
  
  const pointDetails = document.getElementById('point-details');
  pointDetails.style.display = 'block';
  
  pointDetails.querySelector('.detail-grid').innerHTML = `
    <div><span>ID:</span> ${point.id}</div>
    <div><span>Latitude:</span> ${point.lat.toFixed(6)}</div>
    <div><span>Longitude:</span> ${point.lng.toFixed(6)}</div>
    <div><span>Nitrogen:</span> ${point.npk.nitrogen} ton</div>
    <div><span>Phosphate:</span> ${point.npk.phosphate} mg/kg</div>
    <div><span>Kalium:</span> ${point.npk.kalium} mg/kg</div>
  `;
}

function clearMap() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  if (polygonLayer) {
    map.removeLayer(polygonLayer);
    polygonLayer = null;
  }
  
  // Hapus label jarak
  document.querySelectorAll('.distance-label').forEach(el => el.remove());
  
  selectedPoint = null;
  document.getElementById('delete-point-btn').disabled = true;
}

function showLoading(show) {
  document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = `
    <i class="fas fa-${getIconByType(type)}"></i>
    <span>${message}</span>
    <button class="close-btn">&times;</button>
  `;
  
  const container = document.getElementById('sidebar');
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => {
    alertDiv.classList.add('fade-out');
    setTimeout(() => alertDiv.remove(), 300);
  }, 5000);
  
  alertDiv.querySelector('.close-btn').addEventListener('click', () => {
    alertDiv.remove();
  });
}

function getIconByType(type) {
  const icons = {
    'success': 'check-circle',
    'error': 'exclamation-circle',
    'warning': 'exclamation-triangle',
    'info': 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// =============== PENANGANAN ERROR TILE ===============
function handleTileErrors() {
  // Deteksi tile errors
  map.on('tileerror', function(e) {
    // Hanya tampilkan pesan jika belum ditampilkan
    if (!tileErrorDisplayed) {
      showTileError('Data peta tidak tersedia pada level zoom ini. Silakan zoom out.');
      tileErrorDisplayed = true;
    }
  });
  
  // Hapus pesan error saat zoom berubah
  map.on('zoomend', function() {
    // Reset status error saat zoom berubah
    tileErrorDisplayed = false;
    hideTileError();
    
    // Jika menggunakan layer satelit dan zoom > 19, fallback ke OSM
    if (currentBasemap === 'satellite' && map.getZoom() > 19) {
      // Hanya jika bukan sedang proses toggle
      if (!document.querySelector('#toggle-basemap-btn').classList.contains('processing')) {
        document.querySelector('#toggle-basemap-btn').classList.add('processing');
        setTimeout(() => {
          toggleBasemap();
          document.querySelector('#toggle-basemap-btn').classList.remove('processing');
        }, 500);
      }
    }
  });
}

function showTileError(message) {
  const container = map.getContainer();
  
  // Hapus pesan error sebelumnya
  hideTileError();
  
  // Tampilkan pesan error
  const errorMsg = document.createElement('div');
  errorMsg.className = 'tile-error-message';
  errorMsg.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <p>${message}</p>
  `;
  
  container.appendChild(errorMsg);
}

function hideTileError() {
  const container = map.getContainer();
  const existingError = container.querySelector('.tile-error-message');
  if (existingError) {
    existingError.remove();
  }
}

// =============== PENANGANAN ZOOM TINGGI ===============
function handleHighZoom() {
  map.on('zoomend', function() {
    // Jika menggunakan layer satelit dan zoom > 19
    if (currentBasemap === 'satellite' && map.getZoom() > 19) {
      // Gunakan metode overscaling
      baseLayers.satellite.setOptions({
        maxNativeZoom: map.getZoom() // Izinkan zoom lebih tinggi
      });
      
      // Refresh tiles
      baseLayers.satellite.redraw();
    }
  });
}

// =============== TILE LOADING INDICATOR ===============
function initTileLoadingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'tile-loading-indicator';
  indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat peta...';
  map.getContainer().appendChild(indicator);
  
  map.on('load', function() {
    indicator.style.display = 'none';
  });
  
  map.on('loading', function() {
    indicator.style.display = 'block';
  });
}

// =============== EVENT LISTENERS ===============
function initEventListeners() {
  // Pilih sawah
  document.getElementById('sawah-select').addEventListener('change', function() {
    loadFieldData(parseInt(this.value));
  });
  
  // Simpan nitrogen
  document.getElementById('save-n-btn').addEventListener('click', saveNitrogenValue);
  
  // Tombol peta
  document.getElementById('toggle-distance-btn').addEventListener('click', toggleDistanceLabels);
  document.getElementById('toggle-polygon-btn').addEventListener('click', togglePolygon);
  document.getElementById('toggle-basemap-btn').addEventListener('click', toggleBasemap);
  document.getElementById('zoom-in-btn').addEventListener('click', () => map.zoomIn());
  document.getElementById('zoom-out-btn').addEventListener('click', () => map.zoomOut());
  
  // Tombol aksi
  document.getElementById('delete-point-btn').addEventListener('click', deleteSelectedPoint);
  document.getElementById('print-btn').addEventListener('click', printReport);
  document.getElementById('reset-view-btn').addEventListener('click', resetMapView);
  
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Tombol reload data
  document.addEventListener('click', function(e) {
    if (e.target.id === 'reload-data-btn') {
      // PERBAIKAN 7: Simpan sawah yang sedang dipilih sebelum reload
      const currentField = document.getElementById('sawah-select').value;
      fetchData();
      
      // Setelah reload, kembalikan ke sawah yang dipilih
      setTimeout(() => {
        document.getElementById('sawah-select').value = currentField;
        loadFieldData(parseInt(currentField));
      }, 1000);
    }
  });
}

// ================= Fungsi toggle jarak ======================
function toggleDistanceLabels() {
  showDistanceLabels = !showDistanceLabels;
  const labels = document.querySelectorAll('.distance-label');
  labels.forEach(label => {
    if (showDistanceLabels) {
      label.style.display = 'block';
    } else {
      label.style.display = 'none';
    }
  });
  
  // Update icon
  const icon = document.querySelector('#toggle-distance-btn i');
  icon.className = showDistanceLabels ? 'fas fa-ruler' : 'fas fa-ruler-combined';
}

function saveNitrogenValue() {
  const input = document.getElementById('input-n');
  const value = parseFloat(input.value);
  
  if (isNaN(value) || value <= 0) {
    showAlert('Masukkan nilai hasil panen yang valid (angka positif)', 'error');
    input.focus();
    return;
  }
  
  // Simpan nilai nitrogen khusus untuk sawah saat ini
  manualNitrogen[currentField] = value;
  
  showAlert(`Nilai nitrogen ${value} ton berhasil disimpan untuk sawah ini`, 'success');
  input.value = '';
  
  const fieldPoints = getFieldPoints(currentField);
  
  if (fieldPoints.length > 0) {
    updateRecommendation(fieldPoints);
    updateFieldInfo(fieldPoints);
  }
}

function deleteSelectedPoint() {
  if (!selectedPoint) return;
  
  if (confirm(`Apakah Anda yakin ingin menghapus titik ${selectedPoint.id}?`)) {
    allPoints = allPoints.filter(p => p.id !== selectedPoint.id);
    loadFieldData(currentField);
    showAlert(`Titik ${selectedPoint.id} berhasil dihapus`, 'success');
  }
}

function printReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Header
  const sawahName = document.getElementById('sawah-select').options[document.getElementById('sawah-select').selectedIndex].text;
  doc.setFontSize(16);
  doc.text(`Laporan Pemupukan Sawah: ${sawahName}`, 15, 15);
  
  // Data rekomendasi
  const urea = document.querySelector('.recommendation-item.urea .recommendation-value').textContent;
  const sp36 = document.querySelector('.recommendation-item.sp36 .recommendation-value').textContent;
  const kcl = document.querySelector('.recommendation-item.kcl .recommendation-value').textContent;
  
  // Data rata-rata kandungan
  const avgNitrogen = document.getElementById('avg-nitrogen').textContent;
  const avgPhosphate = document.getElementById('avg-phosphate').textContent;
  const avgKalium = document.getElementById('avg-kalium').textContent;
  
  // Luas lahan
  const luasLahan = document.getElementById('land-area').textContent;
  
  // Tabel rekomendasi
  const tableData = [
    ['Jenis Pupuk', 'Jumlah (kg)', 'Dosis (kg/ha)'],
    ['UREA', urea, document.querySelector('.recommendation-item.urea .recommendation-rate').textContent.replace('kg/ha', '').trim()],
    ['SP-36', sp36, document.querySelector('.recommendation-item.sp36 .recommendation-rate').textContent.replace('kg/ha', '').trim()],
    ['KCL', kcl, document.querySelector('.recommendation-item.kcl .recommendation-rate').textContent.replace('kg/ha', '').trim()]
  ];
  
  doc.autoTable({
    startY: 25,
    head: tableData.slice(0, 1),
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [46, 125, 50] }
  });
  
  // Tabel rata-rata kandungan
  const avgData = [
    ['Parameter', 'Nilai'],
    ['Luas Lahan', `${luasLahan} Ha`],
    ['Rata-rata Nitrogen', `${avgNitrogen} ton`],
    ['Rata-rata Phosphate', `${avgPhosphate} mg/kg`],
    ['Rata-rata Kalium', `${avgKalium} mg/kg`]
  ];
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    body: avgData,
    theme: 'grid',
    headStyles: { fillColor: [2, 136, 209] }
  });
  
  // Tabel data titik
  const pointData = [['ID', 'Latitude', 'Longitude', 'N (ton)', 'P (mg/kg)', 'K (mg/kg)']];
  const startIdx = (currentField - 1) * CONFIG.fields.pointsPerField;
  const endIdx = startIdx + CONFIG.fields.pointsPerField;
  const fieldPoints = allPoints.slice(startIdx, endIdx);
  
  fieldPoints.forEach(point => {
    pointData.push([
      point.id,
      point.lat.toFixed(6),
      point.lng.toFixed(6),
      point.npk.nitrogen,
      point.npk.phosphate,
      point.npk.kalium
    ]);
  });
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: pointData.slice(0, 1),
    body: pointData.slice(1),
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [255, 160, 0] }
  });
  
  // Footer
  const date = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.text(`Dicetak pada: ${date}`, 14, doc.internal.pageSize.height - 10);
  
  // Simpan PDF
  doc.save(`laporan_pemupukan_${sawahName.replace(/\s+/g, '_')}.pdf`);
}

function resetMapView() {
  map.setView(CONFIG.map.center, CONFIG.map.zoom);
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById(`${tabId}-tab`).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

// =============== FUNGSI FUZZY SUGENO ===============
// FUNGSI INI SEKARANG BERADA DI FILE TERPISAH: fuzzySugeno.js
// JADI KITA TIDAK PERLU DEFINISIKAN LAGI DI SINI

function calculateFertilizerRecommendation(avgN, avgP, avgK, area) {
  // Panggil fungsi fuzzySugeno dari file terpisah
  const fuzzy = fuzzySugeno(avgN, avgP, avgK);
  
  return {
    urea: { 
      rate: fuzzy.urea.toFixed(1), 
      total: (fuzzy.urea * area).toFixed(1) 
    },
    sp36: { 
      rate: fuzzy.sp36.toFixed(1), 
      total: (fuzzy.sp36 * area).toFixed(1) 
    },
    kcl: { 
      rate: fuzzy.kcl.toFixed(1), 
      total: (fuzzy.kcl * area).toFixed(1) 
    }
  };
}
