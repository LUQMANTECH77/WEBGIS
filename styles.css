/* =============== VARIABLES & RESET =============== */
:root {
  --primary: #2E7D32;
  --primary-light: #4CAF50;
  --primary-dark: #1B5E20;
  --secondary: #0288D1;
  --accent: #FFA000;
  --danger: #D32F2F;
  --light: #F5F5F5;
  --light-gray: #EEEEEE;
  --medium-gray: #BDBDBD;
  --dark: #212121;
  --white: #FFFFFF;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--dark);
  background-color: var(--light);
  overflow: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

body, input, select, button {
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

button, .btn {
  min-height: 40px;
  font-size: 1rem;
  width: 100%;
  padding: 0.75rem;
}

/* =============== LAYOUT =============== */
#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

#app-header {
  height: 70px;
  background: linear-gradient(135deg, #1b5e20, #2e7d32);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 var(--space-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

#app-header .container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  position: relative;
}

#app-header h1 {
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icons {
  display: flex;
  gap: 15px;
}

.header-icon {
  font-size: 1.8rem;
  color: var(--accent);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

#main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

#sidebar {
  width: 380px;
  min-width: 380px;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e9 100%);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #c8e6c9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: var(--space-md);
  position: relative;
  z-index: 500;
}

.sidebar-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.sidebar-header h2 {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

#map-container {
  flex: 1;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
  background: #f0f2f5;
}

/* =============== COMPONENTS =============== */
.card {
  background: var(--white);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
  margin-bottom: var(--space-md);
  border: 1px solid #e0f2e9;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-normal);
  text-align: center;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--medium-gray);
  color: var(--dark);
}

.btn-secondary:hover {
  background-color: #757575;
  color: var(--white);
}

.btn-danger {
  background-color: var(--danger);
  color: var(--white);
}

.btn-danger:hover {
  background-color: #c62828;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--medium-gray);
  color: var(--dark);
}

.btn-outline:hover {
  background: var(--light-gray);
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
  font-weight: 500;
  color: var(--dark);
  font-size: var(--text-sm);
}

.form-group label i {
  color: var(--primary);
  width: 16px;
  text-align: center;
  font-size: var(--text-base);
}

.form-control {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--medium-gray);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  transition: var(--transition-normal);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
}

.tab-group {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: var(--space-md);
  overflow: hidden;
  border: 1px solid #e0f2e9;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #e0f2e9;
  background: #f1f8e9;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 500;
  color: #4a6b57;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(46, 125, 50, 0.1);
}

.tab-btn.active {
  color: #2e7d32;
  border-bottom: 3px solid #2e7d32;
  font-weight: 600;
  background: white;
}

.tab-content {
  display: none;
  padding: var(--space-md);
  flex-grow: 1;
  overflow-y: auto;
}

.tab-content.active {
  display: flex;
  flex-direction: column;
}

#map-controls {
  position: absolute;
  bottom: var(--space-md);
  right: var(--space-md);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.map-control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--white);
  border: 1px solid var(--light-gray);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  font-size: var(--text-sm);
}

.map-control-btn:hover {
  background: var(--light-gray);
  transform: scale(1.05);
}

.circle-marker {
  background: var(--primary);
  color: var(--white);
  font-weight: bold;
  font-size: var(--text-sm);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.circle-marker:hover {
  transform: scale(1.1);
  background: var(--primary-dark);
}

/* =============== UTILITY COMPONENTS =============== */
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  text-align: center;
}

.spinner {
  border: 4px solid rgba(46, 125, 50, 0.2);
  border-radius: 50%;
  border-top: 4px solid var(--primary);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-sm);
}

.alert {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  animation: slideIn 0.3s ease-out;
  position: relative;
  overflow: hidden;
  font-size: var(--text-sm);
}

.alert::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.alert-success {
  background: #E8F5E9;
  color: var(--primary-dark);
}

.alert-success::before {
  background: var(--primary-dark);
}

.alert-error {
  background: #FFEBEE;
  color: var(--danger);
}

.alert-error::before {
  background: var(--danger);
}

.alert-warning {
  background: #FFF8E1;
  color: #FF8F00;
}

.alert-warning::before {
  background: #FF8F00;
}

.alert-info {
  background: #E3F2FD;
  color: var(--secondary);
}

.alert-info::before {
  background: var(--secondary);
}

.empty-state {
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  color: var(--medium-gray);
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-md);
  margin: var(--space-md) 0;
}

.empty-state i {
  font-size: 3rem;
  color: var(--light-gray);
  margin-bottom: var(--space-md);
  display: block;
  animation: pulse 2s infinite;
}

.empty-state p {
  font-size: var(--text-lg);
  font-weight: 500;
}

.land-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  margin: var(--space-md) 0;
}

.info-item {
  background: var(--light);
  border-radius: var(--radius-sm);
  padding: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.info-item i {
  font-size: 1rem;
  color: var(--primary);
  width: 20px;
  text-align: center;
}

.info-item .label {
  display: block;
  font-size: 0.7rem;
  color: var(--medium-gray);
}

.info-item .value {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--dark);
}

.recommendation-card {
  padding: var(--space-md) 0;
}

.recommendation-content {
  margin-bottom: var(--space-md);
}

.chart-container {
  height: 200px;
  min-height: 200px;
  margin-top: var(--space-md);
  position: relative;
  overflow: visible;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
  margin-top: auto;
  padding: var(--space-sm);
  background: var(--white);
  border-top: 1px solid var(--light-gray);
  position: sticky;
  bottom: 0;
  z-index: 100;
}

/* =============== PERBAIKAN TAMPILAN REKOMENDASI =============== */
.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin: var(--space-md) 0;
  flex-shrink: 0;
}

.recommendation-item {
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
  transition: transform 0.3s ease;
}

.recommendation-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.recommendation-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.recommendation-item.urea::after {
  background-color: var(--primary-light);
}
.recommendation-item.sp36::after {
  background-color: var(--secondary);
}
.recommendation-item.kcl::after {
  background-color: var(--accent);
}

.recommendation-item i {
  font-size: 1.2rem;
  margin-bottom: var(--space-xs);
  display: block;
  color: inherit;
}

.recommendation-value {
  font-weight: bold;
  font-size: var(--text-lg);
  margin: var(--space-xs) 0;
  color: var(--dark);
}

.recommendation-label {
  font-size: var(--text-sm);
  color: var(--medium-gray);
  margin-bottom: 2px;
}

.recommendation-rate {
  font-size: var(--text-sm);
  color: var(--dark);
  font-weight: 500;
}

/* =============== PERBAIKAN TAB DETAIL =============== */
.field-summary {
  background: #f1f8e9;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #dcedc8;
}

.field-summary h3 {
  font-size: var(--text-base);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}

.summary-grid > div {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 6px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.summary-grid i {
  color: var(--primary);
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.point-detail {
  background: white;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
  border: 1px solid #e0f2e9;
}

.point-detail h3 {
  font-size: var(--text-base);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  font-size: var(--text-sm);
}

.detail-grid > div {
  padding: var(--space-xs) 0;
  border-bottom: 1px solid var(--light-gray);
}

.detail-grid span:first-child {
  font-weight: 500;
  color: var(--dark);
  display: inline-block;
  min-width: 90px;
}

/* =============== ANIMATIONS =============== */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* =============== ELEGAN SIDEBAR =============== */
.sidebar-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.form-group.card {
  border-left: 4px solid var(--primary);
  box-shadow: var(--shadow-md);
  padding: var(--space-sm);
}

.tab-group {
  border: 1px solid #c8e6c9;
  box-shadow: var(--shadow-sm);
}

/* =============== ICON PADI & JAGUNG =============== */
.crop-icon-header {
  font-size: 1.8rem;
  color: #FFD700;
  text-shadow: 0 0 5px rgba(0,0,0,0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

/* =============== PERBAIKAN TOMBOL CETAK =============== */
#print-btn {
  background-color: #ff9800;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

#print-btn:hover {
  background-color: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

#print-btn i {
  margin-right: 5px;
}

/* =============== RESPONSIVE DESIGN =============== */
/* Perangkat mobile - orientasi portrait */
@media (max-width: 768px) {
  #app-container {
    height: 100vh;
    overflow: hidden;
  }
  
  #main-content {
    flex-direction: column;
    height: calc(100vh - 70px);
  }
  
  #sidebar {
    width: 100%;
    height: 45%;
    order: 2;
    padding: 12px;
    min-width: unset;
    border-right: none;
    border-top: 1px solid #c8e6c9;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  #map-container {
    width: 100%;
    height: 55%;
    order: 1;
  }
  
  #map {
    height: 100%;
  }
  
  /* PERBAIKAN UTAMA: Struktur sidebar */
  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 12px;
    overflow: hidden;
  }
  
  /* Fixed section (atas) */
  .sidebar-fixed {
    flex-shrink: 0;
  }
  
  /* Scrollable section (tengah) */
  .sidebar-scrollable {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
  
  /* Action buttons (bawah) */
  .action-buttons {
    flex-shrink: 0;
    margin-top: auto;
  }
  
  /* Perbaikan tab group */
  .tab-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
  
  /* Rekomendasi */
  .recommendation-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .land-info, .summary-grid, .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 120px;
    min-height: 120px;
  }
  
  #app-header h1 {
    font-size: 1.1rem;
    white-space: normal;
    padding: 0 5px;
    line-height: 1.3;
  }
  
  .header-icons {
    display: none;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  #map-controls {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    bottom: 10px;
    right: 10px;
  }
  
  .map-control-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

/* Perangkat mobile kecil (contoh: iPhone 5/SE) */
@media (max-width: 480px) {
  #app-header {
    height: auto;
    padding: 8px 5px;
  }
  
  #app-header h1 {
    font-size: 0.9rem;
  }
  
  #sidebar {
    height: 45%;
    padding: 8px;
  }
  
  #map-container {
    height: 55%;
  }
  
  .tab-btn {
    font-size: 0.85rem;
    padding: 8px 5px;
  }
  
  .btn {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .form-control {
    padding: 0.5rem;
  }
  
  .chart-container {
    height: 100px;
    min-height: 100px;
  }
  
  .recommendation-value {
    font-size: 1.1rem;
  }
  
  .recommendation-rate {
    font-size: 0.85rem;
  }
}

/* Perangkat mobile - orientasi landscape */
@media (max-width: 768px) and (orientation: landscape) {
  #sidebar {
    height: 60%;
  }
  
  #map-container {
    height: 40%;
  }
}

/* Perbaikan untuk tablet kecil */
@media (min-width: 481px) and (max-width: 768px) {
  #sidebar {
    height: 40%;
  }
  
  #map-container {
    height: 60%;
  }
}

/* Perbaikan umum untuk semua perangkat mobile */
@media (max-width: 768px) {
  .sidebar-content {
    gap: 12px;
  }
  
  .form-group {
    margin-bottom: 12px;
  }
  
  .point-detail {
    max-height: 25vh;
    overflow-y: auto;
  }
  
  .empty-state p {
    font-size: 1rem;
  }
}
