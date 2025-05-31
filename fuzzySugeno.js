// =============== FUNGSI FUZZY SUGENO ===============
function calculateFertilizerRecommendation(avgN, avgP, avgK, area) {
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

function trapezoid(x, a, b, c, d) {
  if (x < a) return 0;
  if (x >= a && x < b) return (x - a) / (b - a);
  if (x >= b && x <= c) return 1;
  if (x > c && x <= d) return (d - x) / (d - c);
  return 0;
}

function fuzzySugeno(n, p, k) {
  // 1. Perbaiki rentang keanggotaan Nitrogen untuk interpolasi yang lebih baik
  const nR = trapezoid(n, 0, 0, 4, 5);    // Rendah: [0,0,4,5]
  const nS = trapezoid(n, 4, 5, 6, 7);    // Sedang: [4,5,6,7]
  const nT = trapezoid(n, 6, 7, 10, 10);  // Tinggi: [6,7,10,10]

  // 2. Hitung derajat keanggotaan untuk Phosphate (0-50 mg/kg)
  const pR = trapezoid(p, 0, 0, 19, 20);   // Rendah: [0,0,19,20]
  const pS = trapezoid(p, 19, 20, 40, 41); // Sedang: [19,20,40,41]
  const pT = trapezoid(p, 40, 41, 50, 50); // Tinggi: [40,41,50,50]

  // 3. Hitung derajat keanggotaan untuk Kalium (0-30 mg/kg)
  const kR = trapezoid(k, 0, 0, 9, 10);    // Rendah: [0,0,9,10]
  const kS = trapezoid(k, 9, 10, 20, 21);  // Sedang: [9,10,20,21]
  const kT = trapezoid(k, 20, 21, 30, 30); // Tinggi: [20,21,30,30]

  // 4. Perbaiki nilai urea pada aturan Nitrogen sedang
  const rules = [
    // Rule 1-9: Nitrogen RENDAH
    { w: Math.min(nR, pR, kR), urea: 200, sp36: 100, kcl: 100 },
    { w: Math.min(nR, pR, kS), urea: 200, sp36: 100, kcl: 50 },
    { w: Math.min(nR, pR, kT), urea: 200, sp36: 100, kcl: 50 },
    { w: Math.min(nR, pS, kR), urea: 200, sp36: 75, kcl: 100 },
    { w: Math.min(nR, pS, kS), urea: 200, sp36: 75, kcl: 50 },
    { w: Math.min(nR, pS, kT), urea: 200, sp36: 75, kcl: 50 },
    { w: Math.min(nR, pT, kR), urea: 200, sp36: 50, kcl: 100 },
    { w: Math.min(nR, pT, kS), urea: 200, sp36: 50, kcl: 50 },
    { w: Math.min(nR, pT, kT), urea: 200, sp36: 50, kcl: 50 },
    
    // Rule 10-18: Nitrogen SEDANG (urea dinaikkan menjadi 300)
    { w: Math.min(nS, pR, kR), urea: 300, sp36: 100, kcl: 100 },
    { w: Math.min(nS, pR, kS), urea: 300, sp36: 100, kcl: 50 },
    { w: Math.min(nS, pR, kT), urea: 300, sp36: 100, kcl: 50 },
    { w: Math.min(nS, pS, kR), urea: 300, sp36: 75, kcl: 100 },
    { w: Math.min(nS, pS, kS), urea: 300, sp36: 75, kcl: 50 },
    { w: Math.min(nS, pS, kT), urea: 300, sp36: 75, kcl: 50 },
    { w: Math.min(nS, pT, kR), urea: 300, sp36: 50, kcl: 100 },
    { w: Math.min(nS, pT, kS), urea: 300, sp36: 50, kcl: 50 },
    { w: Math.min(nS, pT, kT), urea: 300, sp36: 50, kcl: 50 },
    
    // Rule 19-27: Nitrogen TINGGI (urea dinaikkan menjadi 400)
    { w: Math.min(nT, pR, kR), urea: 400, sp36: 100, kcl: 100 },
    { w: Math.min(nT, pR, kS), urea: 400, sp36: 100, kcl: 50 },
    { w: Math.min(nT, pR, kT), urea: 400, sp36: 100, kcl: 50 },
    { w: Math.min(nT, pS, kR), urea: 400, sp36: 75, kcl: 100 },
    { w: Math.min(nT, pS, kS), urea: 400, sp36: 75, kcl: 50 },
    { w: Math.min(nT, pS, kT), urea: 400, sp36: 75, kcl: 50 },
    { w: Math.min(nT, pT, kR), urea: 400, sp36: 50, kcl: 100 },
    { w: Math.min(nT, pT, kS), urea: 400, sp36: 50, kcl: 50 },
    { w: Math.min(nT, pT, kT), urea: 400, sp36: 50, kcl: 50 }
  ];

  // 5. Hitung total bobot
  const totalW = rules.reduce((sum, rule) => sum + rule.w, 0);

  // 6. Jika tidak ada rule yang aktif, berikan nilai default
  if (totalW === 0) {
    return {
      urea: 200,
      sp36: 75,
      kcl: 50
    };
  }

  // 7. Hitung rata-rata tertimbang (WTAVER)
  const hasil = {
    urea: rules.reduce((sum, rule) => sum + (rule.w * rule.urea), 0) / totalW,
    sp36: rules.reduce((sum, rule) => sum + (rule.w * rule.sp36), 0) / totalW,
    kcl: rules.reduce((sum, rule) => sum + (rule.w * rule.kcl), 0) / totalW
  };

  return hasil;
}

// Perbarui fungsi getUreaFrom untuk konsistensi
function getUreaFrom(nKategori) {
  if (nKategori === "rendah") return 200;
  if (nKategori === "sedang") return 300;  // Diperbarui sesuai aturan
  return 400;  // Diperbarui sesuai aturan
}

function getSP36From(pKategori) {
  if (pKategori === "rendah") return 100;
  if (pKategori === "sedang") return 75;
  return 50;
}

function getKCLFrom(kKategori) {
  if (kKategori === "rendah") return 100;
  if (kKategori === "sedang") return 50;
  return 50;
}