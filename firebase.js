// ═══════════════════════════════════════════════════════════
//  FIREBASE — Sincronização em tempo real
//  Sónia Reis · Estética | Beleza | Formação
// ═══════════════════════════════════════════════════════════

// ── Como configurar ──────────────────────────────────────
// 1. Vai a https://console.firebase.google.com
// 2. Cria projecto → "faturacao-soniareis" (ou outro nome)
// 3. Adiciona app Web → copia as credenciais para FIREBASE_CONFIG
// 4. Activa Realtime Database → começa em modo teste
// 5. Guarda este ficheiro no GitHub e a app sincroniza automaticamente

const FIREBASE_CONFIG = {
  apiKey:            "COLE_AQUI",
  authDomain:        "COLE_AQUI",
  databaseURL:       "COLE_AQUI",
  projectId:         "COLE_AQUI",
  storageBucket:     "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId:             "COLE_AQUI"
};

// ── Estado da ligação ─────────────────────────────────────
let fbApp = null;
let fbDB  = null;
let fbActive = false;

// ── Inicialização ─────────────────────────────────────────
async function initFirebase() {
  if (FIREBASE_CONFIG.apiKey === "COLE_AQUI") {
    console.log("Firebase não configurado — a usar localStorage");
    updateSyncDot(false);
    return;
  }

  try {
    // Firebase loaded via CDN scripts in index.html
    if (typeof firebase === "undefined") {
      console.log("Firebase SDK não carregado");
      updateSyncDot(false);
      return;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    fbApp    = firebase.app();
    fbDB     = firebase.database();
    fbActive = true;

    window._fbRef    = firebase.database.ref.bind(fbDB);
    window._fbSet    = (r,d) => r.set(d);
    window._fbGet    = (r) => r.once('value');
    window._fbOnVal  = (r,cb) => r.on('value', cb);
    window._fbDB     = fbDB;

    updateSyncDot(true);
    console.log("✅ Firebase conectado");

    // ── Listeners em tempo real ───────────────────────────
    fbDB.ref( 'entries').on('value', snap => {
      if (snap.exists()) {
        entries = Object.values(snap.val()).filter(Boolean);
        entries.sort((a,b) => b.date.localeCompare(a.date));
        if (document.getElementById('owner-mode')?.style.display === 'block') renderAll();
        if (document.getElementById('staff-mode')?.style.display === 'block') renderStaffMode();
      }
    });

    fbDB.ref( 'appts').on('value', snap => {
      if (snap.exists()) {
        appts = Object.values(snap.val()).filter(Boolean);
        if (document.getElementById('view-agenda')?.classList.contains('active')) renderAgenda();
        if (document.getElementById('staff-mode')?.style.display === 'block') renderStaffMode();
      }
    });

    fbDB.ref( 'clients').on('value', snap => {
      if (snap.exists()) {
        clients = Object.values(snap.val()).filter(Boolean);
        if (document.getElementById('view-clients')?.classList.contains('active')) renderClients();
      }
    });

    fbDB.ref( 'hrData').on('value', snap => {
      if (snap.exists()) {
        hrData = snap.val();
        if (document.getElementById('view-equipa')?.classList.contains('active')) renderEquipa();
      }
    });

    fbDB.ref( 'staff').on('value', snap => {
      if (snap.exists()) {
        const s = snap.val();
        if (Array.isArray(s)) { staff = s; buildLoginScreen(); populateStaffSelects(); }
      }
    });

    fbDB.ref( 'settings').on('value', snap => {
      if (snap.exists()) {
        const s = snap.val();
        if (s.goal) { goalVal = parseFloat(s.goal) || 0; renderGoal(); }
        if (s.userPins) { userPins = s.userPins; }
      }
    });

    // Load initial data once
    await loadAllFromFirebase();

  } catch(err) {
    console.error("Firebase erro:", err);
    updateSyncDot(false);
  }
}

// ── Load all data ─────────────────────────────────────────
async function loadAllFromFirebase() {
  if (!fbActive) return;
  try {
    const snap = await fbDB.ref('/').once('value');
    if (snap.exists()) {
      const d = snap.val();
      if (d.entries) entries = Object.values(d.entries).filter(Boolean);
      if (d.appts)   appts   = Object.values(d.appts).filter(Boolean);
      if (d.clients) clients = Object.values(d.clients).filter(Boolean);
      if (d.hrData)  hrData  = d.hrData;
      if (d.staff && Array.isArray(d.staff)) { staff = d.staff; buildLoginScreen(); populateStaffSelects(); }
      if (d.settings?.goal) goalVal = parseFloat(d.settings.goal) || 0;
      if (d.settings?.userPins) userPins = d.settings.userPins;
      entries.sort((a,b) => b.date.localeCompare(a.date));
      console.log("✅ Dados carregados do Firebase");
    }
  } catch(err) {
    console.error("Erro a carregar Firebase:", err);
  }
}

// ── Sync dot indicator ────────────────────────────────────
function updateSyncDot(online) {
  const dot = document.getElementById('sync-dot');
  if (!dot) return;
  dot.className = 'sync-dot' + (online ? ' online' : '');
  dot.title = online ? 'Sincronizado com Firebase' : 'Dados locais (Firebase não configurado)';
}

// ── Save helpers — write to Firebase OR localStorage ─────
function fbSave(path, data) {
  if (fbActive && fbDB) {
    fbDB.ref(path).set(data)
      .catch(err => console.error('Firebase save error:', err));
  }
}

// Override persist functions to also sync Firebase
function persist() {
  localStorage.setItem('sr_v1', JSON.stringify(entries));
  if (fbActive) fbSave('entries', Object.fromEntries(entries.map(e => [e.id, e])));
}

function persistAppts() {
  localStorage.setItem('sr_appts', JSON.stringify(appts));
  if (fbActive) fbSave('appts', Object.fromEntries(appts.map(a => [a.id, a])));
}

function persistClients() {
  localStorage.setItem('sr_clients', JSON.stringify(clients));
  if (fbActive) fbSave('clients', Object.fromEntries(clients.map(c => [c.id, c])));
}

function persistHR() {
  localStorage.setItem('sr_hr', JSON.stringify(hrData));
  if (fbActive) fbSave('hrData', hrData);
}

function persistStaff() {
  localStorage.setItem('sr_staff', JSON.stringify(staff));
  if (fbActive) fbSave('staff', staff);
}

function persistPins() {
  localStorage.setItem('sr_pins', JSON.stringify(userPins));
  if (fbActive) fbSave('settings/userPins', userPins);
}

function persistGoal() {
  localStorage.setItem('sr_goal', goalVal);
  if (fbActive) fbSave('settings/goal', goalVal);
}
