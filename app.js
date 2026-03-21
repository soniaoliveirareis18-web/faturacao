// ═══════════════════════════════════════════════════════════
//  SERVICES CATALOGUE
// ═══════════════════════════════════════════════════════════
const SERVICES = {
  "Manicure":[
    {n:"Verniz Gel Express",p:15,v:true},{n:"Manutenção Verniz Gel",p:17,v:true},
    {n:"Gel T1 Aplicação",p:25,v:true},{n:"Gel T2 Aplicação",p:28,v:true},{n:"Gel T3 Aplicação",p:32,v:true},
    {n:"Gel T1 c/Extensão",p:35,v:true},{n:"Gel T2 c/Extensão",p:38,v:true},{n:"Gel T3 c/Extensão",p:42,v:true},
    {n:"Manicure",p:10,v:false},{n:"Manicure + Verniz Normal",p:12.5,v:false},
    {n:"Manicure Criança",p:3,v:true},{n:"Remoção + Base Fort.",p:14,v:false},{n:"Remoção + Verniz Normal",p:15,v:false},
  ],
  "Pedicure":[
    {n:"Pedicure + Base Transp.",p:25,v:false},{n:"Pedicure + Verniz Normal",p:27.5,v:false},
    {n:"Pedicure + Verniz Gel",p:30,v:false},{n:"Pedicure + Mant. V.Gel",p:32,v:false},
    {n:"Limpeza s/Pintar",p:10,v:false},{n:"Verniz Normal Pé",p:12.5,v:false},
    {n:"Verniz Gel Pé",p:15,v:false},{n:"Manutenção V.Gel Pé",p:17,v:false},
    {n:"Trat. Especializado/Unha",p:2,v:false},{n:"Tratamento de Calo",p:5,v:false},{n:"SPA Premium",p:45,v:true},
  ],
  "Pestanas & Sob.":[
    {n:"Design Sobrancelhas",p:10,v:false},{n:"Buço | Queixo",p:6,v:true},
    {n:"Design + Buço",p:15,v:false},{n:"Design + Buço + Queixo",p:20,v:false},
    {n:"Maçãs do Rosto",p:15,v:false},{n:"Rosto Completo",p:27.5,v:false},
    {n:"Design + Henna/Coloração",p:20,v:false},{n:"Lifting Pestan.+Design",p:38,v:false},
    {n:"Brow Lamination",p:30,v:false},{n:"Lifting de Pestanas",p:32,v:false},
    {n:"Combo Lamin.+Lifting",p:40,v:false},{n:"Micropigmentação F.a.F.",p:200,v:false},
  ],
  "Cera Feminino":[
    {n:"Sobrancelhas",p:6,v:false},{n:"Buço | Queixo",p:5,v:true},
    {n:"Maçãs do Rosto",p:10,v:false},{n:"Rosto Completo",p:18,v:false},{n:"Axilas",p:6,v:false},
    {n:"Virilha Normal",p:7,v:false},{n:"Virilha Parcial",p:8.5,v:false},{n:"Virilha Completa",p:10,v:false},
    {n:"Perna Inteira",p:20,v:true},{n:"Meia Perna | Braços",p:12,v:true},{n:"Entre Sobrancelhas",p:3,v:false},
  ],
  "Cera Masculino":[
    {n:"Sobrancelhas",p:8,v:false},{n:"Linha da Barba",p:6,v:false},{n:"Axilas",p:8,v:false},
    {n:"Braços|Abdómen|Peito",p:15,v:true},{n:"Peito + Abdómen",p:25,v:false},
    {n:"Perna Inteira",p:26,v:false},{n:"Meia Perna",p:16,v:false},{n:"Costas",p:20,v:false},{n:"Entre Sobrancelhas",p:3,v:false},
  ],
  "Trat. Rosto":[
    {n:"Limpeza de Pele",p:55,v:false},{n:"Detox|Hidrat. Facial",p:35,v:false},
    {n:"Vitamina C|Acne|Manchas",p:50,v:false},{n:"Trat. c/Máscara Led",p:60,v:false},
    {n:"Tratamento Led Express",p:35,v:false},{n:"Pressoterapia Ocular",p:10,v:false},
    {n:"Trat. de Gesso",p:85,v:false},{n:"Tratamento de Ouro",p:70,v:false},
  ],
  "Trat. Corpo":[
    {n:"Esfoliação+Hidrat.Corp.",p:40,v:false},{n:"Massagem Modeladora",p:50,v:true},
    {n:"Waveshape Simples",p:45,v:false},{n:"Waveshape+Ligaduras",p:70,v:false},
    {n:"Pack 4 Waveshape Simpl.",p:160,v:false},{n:"Pack 4 Wave+Ligaduras",p:250,v:false},
  ],
  "Massagem":[
    {n:"Massagem Localizada",p:25,v:false},{n:"Massagem de Relaxamento",p:45,v:false},
    {n:"Massagem Velas Quentes",p:50,v:false},{n:"Massagem de Pindas",p:65,v:false},
  ],
  "Maquilhagem":[
    {n:"Maquilhagem Social",p:35,v:false},{n:"Maquilhagem Noiva",p:120,v:false},
    {n:"Maquilhagem Jovem",p:20,v:false},{n:"Maquilhagem Criança",p:5,v:false},
  ],
};
const CATS = Object.keys(SERVICES);

// ═══════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════
let entries  = JSON.parse(localStorage.getItem('sr_v1')    || '[]');
let appts    = JSON.parse(localStorage.getItem('sr_appts') || '[]');
let clients  = JSON.parse(localStorage.getItem('sr_clients')|| '[]');
let staff    = JSON.parse(localStorage.getItem('sr_staff') || '["Sónia","Cátia","Lara"]');
let goalVal  = parseFloat(localStorage.getItem('sr_goal')  || '0');

// User sessions
const OWNER_PIN = '0000'; // Sónia's default PIN — change in CONFIG
let userPins  = JSON.parse(localStorage.getItem('sr_pins') || '{}'); // {name: pin}
let currentUser = null; // null = not logged in
let currentRole = null; // 'owner' | 'staff'

// UI state
let selType       = 'fat';
let selCat        = CATS[0];
let selSvcs       = [];
let period        = 'week';
let comparePeriod = 'month';
let histStaffFilter   = 'all';
let analiseStaffFilter= 'all';
let agSelCat      = CATS[0];
let agSelSvc      = null;
let editEntryId   = null;
let editEntryType = 'fat';
let pinBuffer     = '';
let pinTargetUser = null;
let importRows    = [];
let importHeaders = [];

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
const fmt  = v => !v ? '0€' : (v%1===0 ? v+'€' : v.toFixed(2).replace('.',',')+' €');
const today = () => new Date().toISOString().slice(0,10);
const fmtD  = d => { const o=new Date(d+'T12:00:00'); return o.toLocaleDateString('pt-PT',{weekday:'short',day:'numeric',month:'short'}); };
const fmtT  = iso => new Date(iso).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'});
const persist       = () => localStorage.setItem('sr_v1',     JSON.stringify(entries));
const persistAppts  = () => localStorage.setItem('sr_appts',  JSON.stringify(appts));
const persistClients= () => localStorage.setItem('sr_clients',JSON.stringify(clients));
const persistStaff  = () => localStorage.setItem('sr_staff',  JSON.stringify(staff));
const persistPins   = () => localStorage.setItem('sr_pins',   JSON.stringify(userPins));

// ═══════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  if(typeof setupHRDelegation === 'function') setupHRDelegation();
  setupEventDelegation();
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'numeric'});
  document.getElementById('todayLabel') && (document.getElementById('todayLabel').textContent = dateStr);
  document.getElementById('staff-mode-date') && (document.getElementById('staff-mode-date').textContent = dateStr);

  // Init pins with defaults
  if(!userPins['Sónia']) userPins['Sónia'] = '1234';
  staff.forEach(s => { if(!userPins[s]) userPins[s] = '0000'; });
  persistPins();

  buildLoginScreen();
  buildCatChips();
  renderSvcGrid();
  populateStaffSelects();
  renderStaffCfg();
});

// ═══════════════════════════════════════════════════════════
//  LOGIN SYSTEM
// ═══════════════════════════════════════════════════════════
function buildLoginScreen() {
  // Only called when staff list changes (add/remove member)
  // Normal login uses hardcoded buttons in HTML for reliability
  const wrap = document.getElementById('user-select');
  if(!wrap) return;
  const defaultStaff = ['Sónia','Cátia','Lara'];
  const currentStaff = ['Sónia', ...staff.filter(s => s !== 'Sónia')];
  const hasCustomStaff = currentStaff.some(s => !defaultStaff.includes(s)) || currentStaff.length !== defaultStaff.length;
  if(!hasCustomStaff) return; // default staff — hardcoded HTML buttons are fine

  // Custom staff — rebuild buttons
  wrap.innerHTML = '';
  currentStaff.forEach(function(name) {
    const isOwner = name === 'Sónia';
    const initials = isOwner ? 'SR' : name.slice(0,2).toUpperCase();
    const role = isOwner ? 'owner' : 'staff';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText = 'padding:20px 10px;border-radius:14px;border:2px solid '+(isOwner?'#c9a96e':'#2e2922')+';background:#1a1713;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px';
    btn.innerHTML =
      '<div style="width:48px;height:48px;border-radius:24px;background:'+(isOwner?'rgba(201,169,110,.13)':'#221f1a')+';color:'+(isOwner?'#e8cc9a':'#8a7d6e')+';border:2px solid '+(isOwner?'#c9a96e':'#2e2922')+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;font-family:monospace">'+initials+'</div>'+
      '<div style="font-size:14px;font-weight:700;color:#e8ddd0">'+name+'</div>';
    btn.onclick = function() { showPinScreen(name, role); };
    wrap.appendChild(btn);
  });
}

function showPinScreen(name, role) {
  pinBuffer = '';
  pinTargetUser = {name, role};
  const pn = document.getElementById('pin-user-name');
  const us = document.getElementById('user-select');
  const ps = document.getElementById('pin-screen');
  if(pn) pn.textContent = name;
  if(us) us.setAttribute('style','display:none!important;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:320px;margin-bottom:32px');
  if(ps) ps.setAttribute('style','display:flex!important;flex-direction:column;align-items:center;width:100%;max-width:280px;text-align:center');
  updatePinDots();
}

function showUserSelect() {
  pinBuffer = '';
  const us = document.getElementById('user-select');
  const ps = document.getElementById('pin-screen');
  if(us) us.setAttribute('style','display:grid!important;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:320px;margin-bottom:32px');
  if(ps) ps.setAttribute('style','display:none!important;flex-direction:column;align-items:center;width:100%;max-width:280px;text-align:center');
  buildLoginScreen();
  updatePinDots();
}

function pinKey(k) {
  if (pinBuffer.length >= 4) return;
  pinBuffer += k;
  updatePinDots();
  if (pinBuffer.length === 4) {
    setTimeout(() => checkPin(), 150);
  }
}

function pinDel() {
  pinBuffer = pinBuffer.slice(0,-1);
  updatePinDots();
}

function updatePinDots(error=false) {
  for (let i=0;i<4;i++) {
    const d = document.getElementById('pd'+i);
    if (!d) return;
    d.className = 'pin-dot' + (i < pinBuffer.length ? (error ? ' error' : ' filled') : '');
  }
}

function checkPin() {
  const {name, role} = pinTargetUser;
  const correctPin = userPins[name] || (role==='owner' ? '1234' : '0000');
  if (pinBuffer === correctPin) {
    currentUser = name;
    currentRole = role;
    document.getElementById('login-screen').style.display = 'none';
    if (role === 'owner') {
      document.getElementById('owner-mode').style.display = 'block';
      if(typeof setupHRDelegation === 'function') setupHRDelegation();
      setupEventDelegation();
      renderAll();
      setTimeout(showPendingAlert, 300);
    } else {
      document.getElementById('staff-mode').style.display = 'block';
      document.getElementById('staff-mode-topname').textContent = 'Olá, ' + name + '!';
      renderStaffMode();
    }
  } else {
    updatePinDots(true);
    setTimeout(() => { pinBuffer = ''; updatePinDots(); }, 800);
  }
}

function doLogout() {
  currentUser = null; currentRole = null;
  // Reset HR state so next login starts fresh
  if(typeof resetHRState === 'function') resetHRState();
  document.getElementById('owner-mode').style.display = 'none';
  document.getElementById('staff-mode').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  showUserSelect();
}

// ═══════════════════════════════════════════════════════════
//  STAFF MODE (simplified)
// ═══════════════════════════════════════════════════════════
function renderStaffMode() {
  const myEntries = entries.filter(e => e.date===today() && e.staff===currentUser);
  const myTotal   = myEntries.reduce((a,e)=>a+e.val,0);
  const totalEl = document.getElementById('staff-my-total');
  if(totalEl) totalEl.textContent = fmt(myTotal);

  const list = document.getElementById('staff-today-list');
  if(list) list.innerHTML = myEntries.length
    ? myEntries.map(e => `<div class="entry-item">
        <div class="entry-left">
          <div class="entry-svc">${e.isProduct?'📦 ':''} ${e.svc}</div>
          <div class="entry-meta"><span class="entry-time">${fmtT(e.ts)}</span><span class="pill ${e.type==='fat'?'fat':'nfat'}">${e.type==='fat'?'Fat.':'N.Fat.'}</span></div>
        </div>
        <div class="entry-val">${fmt(e.val)}</div>
      </div>`).join('')
    : '<div class="empty-state"><div class="empty-icon">✦</div>Sem registos hoje.</div>';

  // Staff agenda — show own appointments with confirm/noshow
  const myAppts = appts.filter(a => a.date===today() && a.staff===currentUser).sort((a,b)=>a.time.localeCompare(b.time));
  const agList  = document.getElementById('staff-agenda-list');
  if(agList) agList.innerHTML = myAppts.length
    ? myAppts.map(a => `<div class="appt-card ${a.status==='done'?'status-done':a.status==='noshow'?'status-noshow':''}" id="sappt-${a.id}">
        <div class="appt-header" style="cursor:default">
          <div class="appt-time">${a.time}</div>
          <div class="appt-info">
            <div class="appt-name">${a.name}</div>
            <div class="appt-svc">${a.svc}</div>
          </div>
          <div class="appt-price">${fmt(a.paid||a.price||0)}</div>
          <div class="status-badges">
            <div class="status-badge ${a.status==='done'?'active-done':''}" data-action="staff-done" data-id="${a.id}" title="Veio">✓</div>
            <div class="status-badge ${a.status==='noshow'?'active-noshow':''}" data-action="staff-noshow" data-id="${a.id}" title="Não veio">✕</div>
          </div>
          ${a.status==='done'||a.status==='noshow'?`<div style="margin-top:8px;display:flex;align-items:center;gap:8px">
            <label style="font-size:11px;color:var(--text2);font-weight:700;white-space:nowrap">Pagamento:</label>
            <select data-action="staff-pay" data-id="${a.id}" style="flex:1;background:var(--s2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:'Syne',sans-serif;font-size:12px;padding:6px 8px;outline:none">
              ${['Dinheiro','MB/Multibanco','MB Way','Transferência Bancária'].map(p=>`<option value="${p}" ${(a.payType||'Dinheiro')===p?'selected':''}>${p}</option>`).join('')}
            </select>
          </div>`:''}
        </div>
      </div>`).join('')
    : '<div class="empty-state" style="padding:20px"><div class="empty-icon">📅</div>Sem marcações hoje.</div>';
}

function staffSetApptStatus(id, status) {
  const a = appts.find(x => x.id === id); if(!a) return;
  a.status = a.status === status ? 'pending' : status;
  persistAppts();
  renderStaffMode();
  showToast(status==='done' ? '✓ Marcado como veio!' : '✕ Marcado como não veio.', status==='done'?'success':'error');
}

function staffSetApptPayType(id, payType) {
  const a = appts.find(x => x.id === id); if(!a) return;
  a.payType = payType;
  persistAppts();
  showToast('✓ Método de pagamento guardado!','success');
}

function showStaffEquipa(){
  const ev=document.getElementById('staff-equipa-view');
  const mv=document.getElementById('staff-main-view');
  if(!ev||!mv) return;
  if(ev.style.display==='none'){
    ev.style.display='block'; mv.style.display='none';
    hrStaff=currentUser; hrTab='horas';
    ev.innerHTML=`<button onclick="hideStaffEquipa()" style="margin-bottom:14px;background:none;border:1px solid var(--border2);border-radius:8px;color:var(--text2);font-family:'Syne',sans-serif;font-size:12px;font-weight:700;padding:7px 12px;cursor:pointer">← Voltar</button><div id="equipa-content"></div>`;
    renderEquipa();
  }
}
function hideStaffEquipa(){
  const ev=document.getElementById('staff-equipa-view');
  const mv=document.getElementById('staff-main-view');
  if(ev) ev.style.display='none';
  if(mv) mv.style.display='block';
}

// ═══════════════════════════════════════════════════════════
//  NAV (owner)
// ═══════════════════════════════════════════════════════════
function showView(name) {
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.getElementById('nb-'+name).classList.add('active');
  if (name==='analise') renderAnalise();
  if (name==='hist')    renderHist();
  if (name==='cfg')     renderCfg();
  if (name==='agenda')  renderAgenda();
  if (name==='clients') renderClients();
  if (name==='equipa')  renderEquipa();
}

// ═══════════════════════════════════════════════════════════
//  ENTRY MODAL
// ═══════════════════════════════════════════════════════════
function openModal() {
  selSvcs = [];
  document.querySelectorAll('.service-btn').forEach(b=>b.classList.remove('selected'));
  renderBasket();
  // populate client datalist
  const dl=document.getElementById('clients-datalist');
  if(dl) dl.innerHTML=clients.map(c=>`<option value="${c.name}">`).join('');
  if(document.getElementById('entry-client-name')) document.getElementById('entry-client-name').value='';
  if(document.getElementById('free-svc-name')) document.getElementById('free-svc-name').value='';
  if(document.getElementById('free-svc-val')) document.getElementById('free-svc-val').value='';
  const epSel=document.getElementById('entry-pay-method');
  if(epSel) epSel.value='Dinheiro';
  document.getElementById('modal-bg').classList.add('open');
}
function closeModal() { document.getElementById('modal-bg').classList.remove('open'); }
function bgClick(e)   { if(e.target===document.getElementById('modal-bg')) closeModal(); }

function setType(t) {
  selType = t;
  document.getElementById('btn-fat').className  = 'type-btn'+(t==='fat' ?' active-fat':'');
  document.getElementById('btn-nfat').className = 'type-btn'+(t==='nfat'?' active-nfat':'');
}

function buildCatChips() {
  const wrap = document.getElementById('cat-chips');
  if (!wrap) return;
  wrap.innerHTML='';
  CATS.forEach(cat=>{
    const b=document.createElement('button');
    b.className='cat-chip'+(cat===selCat?' active':'');
    b.textContent=cat;
    b.onclick=()=>{ selCat=cat; document.querySelectorAll('#cat-chips .cat-chip').forEach(c=>c.classList.toggle('active',c.textContent===cat)); renderSvcGrid(); };
    wrap.appendChild(b);
  });
}

function renderSvcGrid() {
  const grid=document.getElementById('svc-grid'); if(!grid) return;
  grid.innerHTML='';
  (SERVICES[selCat]||[]).forEach(s=>{
    const b=document.createElement('button');
    b.className='service-btn'+(selSvcs.find(x=>x.svc.n===s.n)?' selected':'');
    b.innerHTML=`<span class="svc-name">${s.n}</span><span class="svc-price">${s.v?'desde ':''} ${fmt(s.p)}</span>`;
    b.onclick=()=>pickSvc(s,b);
    grid.appendChild(b);
  });
}

function pickSvc(svc, btn) {
  const idx = selSvcs.findIndex(x=>x.svc.n===svc.n);
  if (idx>=0) { selSvcs.splice(idx,1); btn.classList.remove('selected'); }
  else {
    const staffSel=document.getElementById('staff-select');
    selSvcs.push({svc, val:svc.p, staff: currentRole==='staff' ? currentUser : (staffSel?staffSel.value:(staff[0]||''))});
    btn.classList.add('selected');
  }
  renderBasket();
}

function renderBasket() {
  const wrap=document.getElementById('basket'); if(!wrap) return;
  if (!selSvcs.length) { wrap.innerHTML='<span class="basket-empty">Nenhum serviço selecionado</span>'; return; }
  const total=selSvcs.reduce((a,x)=>a+x.val,0);
  const staffOpts=staff.map(s=>`<option value="${s}">${s}</option>`).join('');
  wrap.innerHTML = selSvcs.map((x,i)=>`
    <div class="basket-row">
      <div style="display:flex;align-items:center;gap:6px;width:100%">
        <span class="basket-svc">${x.svc.n}</span>
        <input type="number" inputmode="decimal" step="0.5" min="0" class="basket-val-input" value="${x.val}" onchange="updateBasketVal(${i},this.value)"/>
        <button class="basket-del" data-action="del-basket" data-idx="${i}">✕</button>
      </div>
      ${currentRole!=='staff'?`<div class="basket-staff-row">
        <span class="basket-staff-lbl">Funcionária</span>
        <select class="basket-staff-sel" onchange="updateBasketStaff(${i},this.value)">
          ${staff.map(s=>`<option value="${s}" ${(x.staff||staff[0])===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>`:''}
    </div>`).join('')+
  `<div class="basket-total"><span class="basket-total-lbl">Total</span><span class="basket-total-val">${fmt(total)}</span></div>`;
}

function updateBasketVal(i,v){ selSvcs[i].val=parseFloat(v)||0; renderBasket(); }
function updateBasketStaff(i,v){ selSvcs[i].staff=v; }
function removeFromBasket(i){
  const n=selSvcs[i].svc.n; selSvcs.splice(i,1);
  document.querySelectorAll('#svc-grid .service-btn').forEach(b=>{ if(b.querySelector('.svc-name')?.textContent===n) b.classList.remove('selected'); });
  renderBasket();
}

function addFreeService(){
  const name=(document.getElementById('free-svc-name')?.value||'').trim();
  const val=parseFloat(document.getElementById('free-svc-val')?.value||0);
  if(!name){ showToast('Escreve o nome do serviço ou produto.','error'); return; }
  if(!val||val<=0){ showToast('Introduz um valor válido.','error'); return; }
  selSvcs.push({svc:{n:name,p:val,v:true},val,staff:staff[0]||''});
  document.getElementById('free-svc-name').value='';
  document.getElementById('free-svc-val').value='';
  renderBasket();
}

function saveEntry() {
  if (!selSvcs.length) { showToast('Adiciona pelo menos um serviço.','error'); return; }
  const invalid=selSvcs.find(x=>!x.val||x.val<=0);
  if (invalid) { showToast('Valor inválido: '+invalid.svc.n,'error'); return; }
  const clientName=(document.getElementById('entry-client-name')?.value||'').trim();
  const payMethod=(document.getElementById('entry-pay-method')?.value)||'Dinheiro';
  const now=new Date().toISOString();
  selSvcs.forEach((x,i)=>{
    const e={id:Date.now()+i+Math.random(),date:today(),ts:now,type:selType,cat:selCat,svc:x.svc.n,val:x.val,staff:x.staff||(staff[0]||''),clientName,payMethod};
    entries.unshift(e);
    if(clientName) upsertClientByName(clientName, e);
  });
  persist();
  renderAll();
  if (currentRole==='staff') renderStaffMode();
  closeModal();
  showToast('✓ '+selSvcs.length+' serviço'+(selSvcs.length>1?'s':'')+' guardado'+(selSvcs.length>1?'s':'')+'!','success');
}

function upsertClientByName(name, e){
  let c=clients.find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(!c){ c={id:Date.now()+Math.random(),name,phone:'',notes:'',birthday:'',history:[]}; clients.push(c); }
  c.history=c.history||[];
  const dup=c.history.find(h=>h.date===e.date&&h.svc===e.svc&&h.val===e.val);
  if(!dup) c.history.unshift({date:e.date,svc:e.svc,cat:e.cat,val:e.val,staff:e.staff});
  c.lastVisit=c.history[0]?.date||e.date;
  c.totalSpent=c.history.reduce((a,h)=>a+h.val,0);
  c.vip=c.totalSpent>=250;
  persistClients();
}

// ═══════════════════════════════════════════════════════════
//  EDIT ENTRY
// ═══════════════════════════════════════════════════════════
function openEditModal(id) {
  const e=entries.find(x=>String(x.id)===String(id)); if(!e) return;
  editEntryId=id; editEntryType=e.type;
  document.getElementById('edit-date').value=e.date;
  document.getElementById('edit-time').value=fmtT(e.ts);
  document.getElementById('edit-svc').value=e.svc;
  document.getElementById('edit-val').value=e.val;
  const catSel=document.getElementById('edit-cat');
  catSel.innerHTML=CATS.map(c=>`<option value="${c}" ${c===e.cat?'selected':''}>${c}</option>`).join('');
  const staffSel=document.getElementById('edit-staff');
  staffSel.innerHTML=staff.map(s=>`<option value="${s}" ${s===e.staff?'selected':''}>${s}</option>`).join('');
  setEditType(e.type);
  const editPaySel=document.getElementById('edit-pay-method');
  if(editPaySel){
    editPaySel.innerHTML=PAYMENT_METHODS.map(p=>`<option value="${p}" ${(e.payMethod||'Dinheiro')===p?'selected':''}>${p}</option>`).join('');
  }
  document.getElementById('edit-modal-bg').classList.add('open');
}
function closeEditModal(){ document.getElementById('edit-modal-bg').classList.remove('open'); }
function editBgClick(e){ if(e.target===document.getElementById('edit-modal-bg')) closeEditModal(); }
function setEditType(t){
  editEntryType=t;
  document.getElementById('edit-btn-fat').className ='type-btn'+(t==='fat' ?' active-fat':'');
  document.getElementById('edit-btn-nfat').className='type-btn'+(t==='nfat'?' active-nfat':'');
}
function saveEditEntry(){
  const e=entries.find(x=>x.id===editEntryId); if(!e) return;
  const d=document.getElementById('edit-date').value;
  const t=document.getElementById('edit-time').value||'12:00';
  e.date=d;
  e.ts=d+'T'+t+':00.000Z';
  e.svc=document.getElementById('edit-svc').value.trim()||e.svc;
  e.cat=document.getElementById('edit-cat').value;
  e.val=parseFloat(document.getElementById('edit-val').value)||e.val;
  e.type=editEntryType;
  e.staff=document.getElementById('edit-staff').value;
  e.payMethod=document.getElementById('edit-pay-method')?.value||e.payMethod||'Dinheiro';
  persist(); renderAll();
  const hist=document.getElementById('view-hist');
  if(hist?.classList.contains('active')) renderHist();
  closeEditModal();
  showToast('✓ Registo atualizado!','success');
}

// ═══════════════════════════════════════════════════════════
//  DELETE ENTRY
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════════
let prodType = 'fat';

function openProductModal(){
  prodType = 'fat';
  document.getElementById('prod-btn-fat').className = 'type-btn active-fat';
  document.getElementById('prod-btn-nfat').className = 'type-btn';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-val').value  = '';
  // populate staff
  const sel = document.getElementById('prod-staff');
  if(sel) sel.innerHTML = staff.map(s=>`<option value="${s}">${s}</option>`).join('');
  // hide staff field for staff mode
  const field = document.getElementById('prod-staff-field');
  if(field) field.style.display = currentRole==='staff' ? 'none' : '';
  document.getElementById('product-modal-bg').classList.add('open');
}
function closeProductModal(){ document.getElementById('product-modal-bg').classList.remove('open'); }
function productModalBgClick(e){ if(e.target===document.getElementById('product-modal-bg')) closeProductModal(); }
function setProdType(t){
  prodType = t;
  document.getElementById('prod-btn-fat').className  = 'type-btn'+(t==='fat' ?' active-fat':'');
  document.getElementById('prod-btn-nfat').className = 'type-btn'+(t==='nfat'?' active-nfat':'');
}
function saveProduct(){
  const desc = (document.getElementById('prod-desc').value||'').trim();
  const val  = parseFloat(document.getElementById('prod-val').value);
  if(!desc){ showToast('Introduz a descrição do produto.','error'); return; }
  if(!val||val<=0){ showToast('Introduz um valor válido.','error'); return; }
  const sel = document.getElementById('prod-staff');
  const workerVal = currentRole==='staff' ? currentUser : (sel?sel.value:(staff[0]||''));
  const prodPay = document.getElementById('prod-pay-method')?.value || 'Dinheiro';
  const entry = {
    id:      Date.now()+Math.random(),
    date:    today(),
    ts:      new Date().toISOString(),
    type:    prodType,
    cat:     'Produto',
    svc:     desc,
    val,
    staff:   workerVal,
    isProduct: true,
    payMethod: prodPay,
  };
  entries.unshift(entry);
  persist();
  renderAll();
  if(currentRole==='staff') renderStaffMode();
  closeProductModal();
  showToast('✓ Produto registado!','success');
}

function deleteEntry(id){
  if(!confirm('Apagar este registo?')) return;
  entries=entries.filter(e=>String(e.id)!==String(id));
  persist(); renderAll();
  const hist=document.getElementById('view-hist');
  if(hist?.classList.contains('active')) renderHist();
}

// ═══════════════════════════════════════════════════════════
//  ENTRY HTML
// ═══════════════════════════════════════════════════════════
function entryHTML(e) {
  const editBtn = currentRole==='owner'
    ? `<button class="entry-btn" data-action="edit-entry" data-id="${e.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>` : '';
  return `<div class="entry-item">
    <div class="entry-left">
      <div class="entry-svc">${e.svc}</div>
      <div class="entry-meta">
        <span class="entry-time">${fmtT(e.ts)} · ${e.cat}${e.payMethod?' · '+e.payMethod:''}</span>
        <span class="pill ${e.type==='fat'?'fat':'nfat'}">${e.type==='fat'?'Faturado':'Não Fat.'}</span>
        ${e.staff?`<span style="font-size:9px;color:var(--text2);font-weight:700">${e.staff}</span>`:''}
      </div>
    </div>
    <div class="entry-val">${fmt(e.val)}</div>
    <div class="entry-actions">
      ${editBtn}
      <button class="entry-btn del" data-action="del-entry" data-id="${e.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
//  RENDER HOJE
// ═══════════════════════════════════════════════════════════
function renderHoje(){
  const tod  =entries.filter(e=>e.date===today());
  const fat  =tod.filter(e=>e.type==='fat');
  const nfat =tod.filter(e=>e.type==='nfat');
  const sFat =fat.reduce((a,e)=>a+e.val,0);
  const sNfat=nfat.reduce((a,e)=>a+e.val,0);
  const total=sFat+sNfat;
  const pF   =total?Math.round(sFat/total*100):0;
  document.getElementById('h-fat').textContent   =fmt(sFat);
  document.getElementById('h-fat-n').textContent =fat.length+(fat.length===1?' registo':' registos');
  document.getElementById('h-nfat').textContent  =fmt(sNfat);
  document.getElementById('h-nfat-n').textContent=nfat.length+(nfat.length===1?' registo':' registos');
  document.getElementById('h-total-lbl').textContent='Total: '+fmt(total);
  document.getElementById('h-ratio-g').style.width=pF+'%';
  document.getElementById('h-pct-f').textContent=pF+'% fat.';
  document.getElementById('h-pct-n').textContent=(100-pF)+'% n.fat.';
  const list=document.getElementById('hoje-list');
  list.innerHTML=tod.length?tod.map(entryHTML).join(''):`<div class="empty-state"><div class="empty-icon">✦</div>Sem registos hoje.<br>Toca no <strong>+</strong> para adicionar.</div>`;
  renderGoal();
}

function renderGoal(){
  const now=new Date();
  const monthStart=now.getFullYear()+'-'+(now.getMonth()+1).toString().padStart(2,'0')+'-01';
  const monthTotal=entries.filter(e=>e.date>=monthStart&&e.type==='fat').reduce((a,e)=>a+e.val,0);
  const pct=goalVal>0?Math.min(Math.round(monthTotal/goalVal*100),999):0;
  document.getElementById('goal-pct').textContent=pct+'%';
  const fill=document.getElementById('goal-fill');
  fill.style.width=Math.min(pct,100)+'%';
  fill.className='goal-fill'+(pct>=100?' over':'');
  document.getElementById('goal-current').textContent=fmt(monthTotal)+' este mês';
  document.getElementById('goal-target').textContent='Meta: '+(goalVal>0?fmt(goalVal):'não definida');
}

function editGoal(){
  const v=window.prompt('Objetivo mensal de faturação (€):',goalVal||'');
  if(v===null) return;
  goalVal=parseFloat(v)||0;
  localStorage.setItem('sr_goal',goalVal);
  if(typeof persistGoal === 'function') persistGoal();
  renderGoal();
}

// ═══════════════════════════════════════════════════════════
//  RENDER ANÁLISE
// ═══════════════════════════════════════════════════════════
function setPeriod(p,btn){
  period=p;
  document.querySelectorAll('.period-toggle .period-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderAnalise();
}
function setComparePeriod(p,btn){
  comparePeriod=p;
  document.querySelectorAll('#view-analise .period-toggle:nth-of-type(2) .period-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderComparison();
}

function getDateRange(p){
  const days={week:7,month:30,quarter:90,year:365}[p]||7;
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-days+1);
  return cutoff.toISOString().slice(0,10);
}

function renderAnalise(){
  const cutStr=getDateRange(period);
  const sub=entries.filter(e=>e.date>=cutStr);
  const fat=sub.filter(e=>e.type==='fat');
  const nfat=sub.filter(e=>e.type==='nfat');
  document.getElementById('a-fat').textContent   =fmt(fat.reduce((a,e)=>a+e.val,0));
  document.getElementById('a-fat-n').textContent =fat.length+' registos';
  document.getElementById('a-nfat').textContent  =fmt(nfat.reduce((a,e)=>a+e.val,0));
  document.getElementById('a-nfat-n').textContent=nfat.length+' registos';
  renderBarChart(cutStr);
  renderComparison();
  renderCatRank(sub);
  renderProductsAnalysis(sub);
  renderBestSeller();
  renderStaffAnalysis(sub);
}

function renderProductsAnalysis(sub){
  const wrap = document.getElementById('products-analysis'); if(!wrap) return;
  const products = sub.filter(e=>e.isProduct);
  if(!products.length){
    wrap.innerHTML = '<div class="empty-state" style="padding:20px"><div class="empty-icon">📦</div>Sem produtos registados neste período.</div>';
    return;
  }
  const total    = products.reduce((a,e)=>a+e.val,0);
  const fat      = products.filter(e=>e.type==='fat').reduce((a,e)=>a+e.val,0);
  const nfat     = products.filter(e=>e.type==='nfat').reduce((a,e)=>a+e.val,0);
  const count    = products.length;

  // By staff
  const byStaff = {};
  products.forEach(e=>{ byStaff[e.staff]=(byStaff[e.staff]||0)+e.val; });
  const staffRows = Object.entries(byStaff).sort((a,b)=>b[1]-a[1])
    .map(([s,v])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="color:var(--text2)">${s}</span>
      <span style="font-family:'DM Mono',monospace;color:var(--gold2)">${fmt(v)}</span>
    </div>`).join('');

  // By month (last 6 months)
  const byMonth = {};
  products.forEach(e=>{ const m=e.date.slice(0,7); byMonth[m]=(byMonth[m]||0)+e.val; });
  const monthRows = Object.entries(byMonth).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6)
    .map(([m,v])=>{
      const d=new Date(m+'-01'); const lbl=d.toLocaleDateString('pt-PT',{month:'short',year:'2-digit'});
      return `<div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text2)">${lbl}</span>
        <span style="font-family:'DM Mono',monospace;color:var(--gold2)">${fmt(v)}</span>
      </div>`;
    }).join('');

  wrap.innerHTML = `
    <div class="grid2" style="margin-bottom:10px">
      <div class="card gold"><div class="card-label">Total Produtos</div><div class="card-val">${fmt(total)}</div><div class="card-sub">${count} venda${count!==1?'s':''}</div></div>
      <div class="card green"><div class="card-label">Faturado</div><div class="card-val">${fmt(fat)}</div><div class="card-sub">${fmt(nfat)} n.fat.</div></div>
    </div>
    <div class="hr-card" style="margin-bottom:10px">
      <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);margin-bottom:10px">Por Colaboradora</div>
      ${staffRows||'<div style="font-size:11px;color:var(--text3)">Sem dados</div>'}
    </div>
    <div class="hr-card">
      <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);margin-bottom:10px">Por Mês</div>
      ${monthRows||'<div style="font-size:11px;color:var(--text3)">Sem dados</div>'}
    </div>`;
}

function renderBestSeller(){
  const wrap = document.getElementById('best-seller-wrap'); if(!wrap) return;
  const now = new Date();
  const monthStart = now.getFullYear()+'-'+(now.getMonth()+1).toString().padStart(2,'0')+'-01';
  const monthProducts = entries.filter(e=>e.isProduct && e.date>=monthStart);
  if(!monthProducts.length){
    wrap.innerHTML = '<div class="empty-state" style="padding:16px"><div class="empty-icon">🏅</div>Sem vendas de produtos este mês.</div>';
    return;
  }
  const byStaff = {};
  monthProducts.forEach(e=>{ byStaff[e.staff]=(byStaff[e.staff]||0)+e.val; });
  const sorted = Object.entries(byStaff).sort((a,b)=>b[1]-a[1]);
  const [winner, winVal] = sorted[0];
  const mName = now.toLocaleDateString('pt-PT',{month:'long'});
  wrap.innerHTML = `
    <div style="background:linear-gradient(135deg,var(--gold-d),rgba(201,169,110,.05));border:2px solid var(--gold);border-radius:16px;padding:18px;text-align:center">
      <div style="font-size:32px;margin-bottom:8px">🥇</div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;color:var(--gold2);margin-bottom:4px">${winner}</div>
      <div style="font-family:'DM Mono',monospace;font-size:22px;color:var(--gold2);margin-bottom:6px">${fmt(winVal)}</div>
      <div style="font-size:11px;color:var(--text2);font-weight:700;letter-spacing:1px;text-transform:uppercase">em produtos · ${mName}</div>
      ${sorted.length>1?`<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border2);display:flex;justify-content:center;gap:20px">
        ${sorted.slice(1).map(([s,v],i)=>`<div style="text-align:center"><div style="font-size:16px">${i===0?'🥈':'🥉'}</div><div style="font-size:12px;font-weight:700;color:var(--text2)">${s}</div><div style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${fmt(v)}</div></div>`).join('')}
      </div>`:''}
    </div>`;
}

function renderBarChart(cutStr){
  const wrap=document.getElementById('bar-chart'); wrap.innerHTML='';
  const allDays=[];
  let d=new Date(cutStr);
  while(d.toISOString().slice(0,10)<=today()){ allDays.push(d.toISOString().slice(0,10)); d=new Date(d); d.setDate(d.getDate()+1); }
  const show=allDays.length>31?allDays.filter((_,i)=>i%Math.ceil(allDays.length/30)===0):allDays;
  const maxV=Math.max(1,...show.map(k=>entries.filter(e=>e.date===k).reduce((a,e)=>a+e.val,0)));
  show.forEach(k=>{
    const dayE=entries.filter(e=>e.date===k);
    const fat=dayE.filter(e=>e.type==='fat').reduce((a,e)=>a+e.val,0);
    const nfat=dayE.filter(e=>e.type==='nfat').reduce((a,e)=>a+e.val,0);
    const total=fat+nfat;
    const h=total>0?Math.max(4,Math.round(total/maxV*96)):2;
    const hF=total>0?Math.round(h*fat/total):0;
    const hN=h-hF;
    const lbl=show.length<=7?new Date(k+'T12:00:00').toLocaleDateString('pt-PT',{weekday:'short'}).slice(0,3):(show.indexOf(k)%5===0?new Date(k+'T12:00:00').getDate()+'':'');
    const col=document.createElement('div'); col.className='bar-col';
    col.innerHTML=`<div class="bar-stack" style="height:${h}px"><div class="bar-fat" style="height:${hF}px;flex:none"></div><div class="bar-nfat" style="height:${hN}px;flex:none"></div></div><div class="bar-label">${lbl}</div>`;
    wrap.appendChild(col);
  });
}

function renderComparison(){
  const wrap=document.getElementById('compare-wrap'); if(!wrap) return;
  const now=new Date();
  let periods=[];
  if(comparePeriod==='month'){
    const m0=new Date(now.getFullYear(),now.getMonth(),1);
    const m1=new Date(now.getFullYear(),now.getMonth()-1,1);
    const m2=new Date(now.getFullYear(),now.getMonth()-2,1);
    periods=[
      {label:'2 meses atrás', start:m2.toISOString().slice(0,10), end:m1.toISOString().slice(0,10)},
      {label:'Mês passado',   start:m1.toISOString().slice(0,10), end:m0.toISOString().slice(0,10)},
      {label:'Este mês',      start:m0.toISOString().slice(0,10), end:today(), current:true},
    ];
  } else if(comparePeriod==='quarter'){
    for(let i=2;i>=0;i--){
      const s=new Date(now); s.setMonth(s.getMonth()-i*3); s.setDate(1);
      const e2=new Date(s); e2.setMonth(e2.getMonth()+3);
      periods.push({label:`T${Math.ceil((s.getMonth()+1)/3)} ${s.getFullYear()}`, start:s.toISOString().slice(0,10), end:e2.toISOString().slice(0,10), current:i===0});
    }
  } else {
    for(let i=2;i>=0;i--){
      const y=now.getFullYear()-i;
      periods.push({label:y+'', start:y+'-01-01', end:(y+1)+'-01-01', current:i===0});
    }
  }
  const totals=periods.map(p=>entries.filter(e=>e.date>=p.start&&e.date<p.end&&e.type==='fat').reduce((a,e)=>a+e.val,0));
  const maxT=Math.max(1,...totals);
  const colors=['var(--text3)','var(--text2)','var(--gold)'];
  const barsHTML=periods.map((p,i)=>{
    const h=Math.max(4,Math.round(totals[i]/maxT*52));
    return `<div class="compare-bar-wrap">
      <div class="compare-bar-val">${fmt(totals[i])}</div>
      <div class="compare-bar" style="height:${h}px;background:${colors[i]};width:100%;border-radius:6px 6px 0 0"></div>
      <div class="compare-bar-lbl">${p.label}</div>
    </div>`;
  }).join('');
  const delta=totals[2]-totals[1];
  const deltaHTML=totals[1]>0?`<div class="compare-delta ${delta>=0?'delta-up':'delta-down'}">${delta>=0?'↑':'↓'} ${fmt(Math.abs(delta))} vs período anterior</div>`:'';
  wrap.innerHTML=`<div class="compare-row"><div class="compare-label">Faturação — ${periods[2].label}</div><div class="compare-bars">${barsHTML}</div>${deltaHTML}</div>`;
}

function renderCatRank(sub){
  const totals={},counts={};
  // Exclude products from service ranking
  sub.filter(e=>!e.isProduct).forEach(e=>{ totals[e.cat]=(totals[e.cat]||0)+e.val; counts[e.cat]=(counts[e.cat]||0)+1; });
  const sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  const max=sorted.length?sorted[0][1]:1;
  const wrap=document.getElementById('cat-rank');
  const medals=['🥇','🥈','🥉'];
  wrap.innerHTML=sorted.length?sorted.map(([cat,total],i)=>`
    <div class="cat-rank-item">
      <div class="cat-rank-header"><div class="cat-rank-name">${medals[i]||''} ${cat}</div><div class="cat-rank-total">${fmt(total)}</div></div>
      <div class="cat-rank-bar"><div class="cat-rank-fill" style="width:${Math.round(total/max*100)}%"></div></div>
      <div class="cat-rank-sub">${counts[cat]} venda${counts[cat]!==1?'s':''} · média ${fmt(total/counts[cat])}</div>
    </div>`).join('')
  :`<div class="empty-state"><div class="empty-icon">✦</div>Sem dados neste período.</div>`;
}

// ═══════════════════════════════════════════════════════════
//  STAFF ANALYSIS
// ═══════════════════════════════════════════════════════════
function buildStaffFilterChips(containerId, current, onSelectFn){
  const wrap=document.getElementById(containerId); if(!wrap) return;
  const all=['all',...staff];
  wrap.innerHTML='';
  all.forEach(s=>{
    const btn=document.createElement('button');
    btn.className='staff-chip'+(s===current?' active':'');
    btn.textContent=s==='all'?'Todas':s;
    btn.onclick=()=>{ onSelectFn(s); };
    wrap.appendChild(btn);
  });
}

function renderStaffAnalysis(sub){
  buildStaffFilterChips('analise-staff-filter', analiseStaffFilter, s=>{ analiseStaffFilter=s; renderStaffAnalysis(sub); });
  const filtered=analiseStaffFilter==='all'?sub:sub.filter(e=>e.staff===analiseStaffFilter);
  const wrap=document.getElementById('staff-cards'); if(!wrap) return;
  const members=analiseStaffFilter==='all'?staff:[analiseStaffFilter];
  const maxT=Math.max(1,...members.map(s=>filtered.filter(e=>e.staff===s).reduce((a,e)=>a+e.val,0)));
  wrap.innerHTML=members.map((s,idx)=>{
    const se=filtered.filter(e=>e.staff===s);
    const total=se.reduce((a,e)=>a+e.val,0);
    const fat=se.filter(e=>e.type==='fat').reduce((a,e)=>a+e.val,0);
    const svcT={};
    se.forEach(e=>{ svcT[e.svc]=(svcT[e.svc]||0)+e.val; });
    const top=Object.entries(svcT).sort((a,b)=>b[1]-a[1]).slice(0,4);
    const colors=['var(--gold)','var(--blue)','var(--green)'];
    return `<div class="staff-card sc${idx}">
      <div class="staff-header"><div class="staff-name">${s}</div><div class="staff-total">${fmt(total)}</div></div>
      <div class="staff-meta">${se.length} serviço${se.length!==1?'s':''} · fat. ${fmt(fat)}</div>
      <div class="staff-bar"><div class="staff-fill" style="width:${Math.round(total/maxT*100)}%;background:${colors[idx%3]}"></div></div>
      ${top.length?`<div class="staff-svcs">${top.map(([svc,val])=>`<div class="staff-svc-row"><span class="staff-svc-name">${svc}</span><span class="staff-svc-val">${fmt(val)}</span></div>`).join('')}</div>`:'<div style="font-size:11px;color:var(--text2)">Sem registos.</div>'}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════
//  HISTÓRICO
// ═══════════════════════════════════════════════════════════
// Pagination state for history
let histPage = 0;
const HIST_PER_PAGE = 5; // days per page

function renderHist(resetPage=true){
  if(resetPage) histPage = 0;
  buildStaffFilterChips('hist-staff-filter', histStaffFilter, s=>{ histStaffFilter=s; histPage=0; renderHist(); });
  const filtered = histStaffFilter==='all' ? entries : entries.filter(e=>e.staff===histStaffFilter);
  const list = document.getElementById('hist-list');
  if(!list) return;
  if(!filtered.length){
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">✦</div>Sem registos${histStaffFilter!=='all'?' para '+histStaffFilter:''}.</div>`;
    return;
  }

  // Group by date, sort desc
  const groups={};
  filtered.forEach(e=>{ (groups[e.date]=groups[e.date]||[]).push(e); });
  const sortedDates = Object.keys(groups).sort((a,b)=>b.localeCompare(a));
  const totalDays   = sortedDates.length;
  const pageStart   = histPage * HIST_PER_PAGE;
  const pageEnd     = Math.min(pageStart + HIST_PER_PAGE, totalDays);
  const pageDates   = sortedDates.slice(pageStart, pageEnd);

  // Render only this page's dates
  const html = pageDates.map(date => {
    const es  = groups[date];
    const tot = es.reduce((a,e)=>a+e.val,0);
    return `<div class="sec-title" style="margin-top:16px">${fmtD(date)} — ${fmt(tot)}</div>`
      + es.map(entryHTML).join('');
  }).join('');

  // Pagination controls
  const hasPrev = histPage > 0;
  const hasNext = pageEnd < totalDays;
  const pageInfo = `${pageStart+1}–${pageEnd} de ${totalDays} dias`;

  const pagination = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0 8px;gap:8px">
      <button id="hist-prev" style="padding:9px 16px;border-radius:10px;background:var(--s2);border:1px solid var(--border2);color:${hasPrev?'var(--text)':'var(--text3)'};font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:${hasPrev?'pointer':'default'}" ${hasPrev?'data-action="hist-prev"':''}>← Anterior</button>
      <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text2)">${pageInfo}</span>
      <button id="hist-next" style="padding:9px 16px;border-radius:10px;background:var(--s2);border:1px solid var(--border2);color:${hasNext?'var(--text)':'var(--text3)'};font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:${hasNext?'pointer':'default'}" ${hasNext?'data-action="hist-next"':''}>Seguinte →</button>
    </div>`;

  list.innerHTML = html + (totalDays > HIST_PER_PAGE ? pagination : '');
}

// ═══════════════════════════════════════════════════════════
//  CLIENTS
// ═══════════════════════════════════════════════════════════
function upsertClientFromEntry(e){
  if(!e.svc||!e.date) return;
  // Try to find client name from appts (same date/svc/staff)
  const appt=appts.find(a=>a.date===e.date&&a.svc===e.svc&&a.staff===e.staff);
  const name=appt?appt.name:null;
  if(!name) return;
  let c=clients.find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(!c){
    c={id:Date.now()+Math.random(),name,phone:'',notes:'',birthday:'',history:[]};
    clients.push(c);
  }
  c.history=c.history||[];
  const already=c.history.find(h=>h.date===e.date&&h.svc===e.svc&&h.val===e.val);
  if(!already) c.history.unshift({date:e.date,svc:e.svc,cat:e.cat,val:e.val,staff:e.staff});
  c.lastVisit=c.history[0]?.date||e.date;
  c.totalSpent=c.history.reduce((a,h)=>a+h.val,0);
  c.vip=c.totalSpent>=250;
  persistClients();
}

function upsertClientFromZappy(name, appt){
  if(!name) return;
  let c=clients.find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(!c){
    c={id:Date.now()+Math.random(),name,phone:'',notes:'',birthday:'',history:[]};
    clients.push(c);
  }
  persistClients();
}

// Pagination state for clients
let clientsPage = 0;
const CLIENTS_PER_PAGE = 20;

function renderClients(resetPage=true){
  if(resetPage) clientsPage = 0;
  const q = (document.getElementById('client-search')?.value||'').toLowerCase();
  const filtered = clients
    .filter(c=>!q||c.name.toLowerCase().includes(q))
    .sort((a,b)=>(b.totalSpent||0)-(a.totalSpent||0));
  const wrap = document.getElementById('clients-list');
  if(!wrap) return;

  if(!filtered.length){
    wrap.innerHTML=`<div class="empty-state"><div class="empty-icon">👥</div>${q?'Nenhum cliente encontrado.':'Sem clientes ainda.<br>São criados automaticamente ao confirmar marcações do Zappy.'}</div>`;
    return;
  }

  const totalClients = filtered.length;
  const pageStart    = clientsPage * CLIENTS_PER_PAGE;
  const pageEnd      = Math.min(pageStart + CLIENTS_PER_PAGE, totalClients);
  const pageClients  = filtered.slice(pageStart, pageEnd);
  const todayMD      = today().slice(5);

  const html = pageClients.map(c=>{
    const bdayToday = c.birthday && c.birthday.slice(5)===todayMD;
    return `<div class="client-card" data-action="open-client" data-id="${c.id}">
      <div class="client-header">
        <div class="client-name">${c.name} ${bdayToday?'🎂':''}</div>
        ${c.vip?'<span class="client-vip">⭐ VIP</span>':''}
      </div>
      <div class="client-meta">${c.lastVisit?'Última visita: '+fmtD(c.lastVisit):'Sem visitas registadas'}</div>
      <div class="client-stats">
        <div class="client-stat"><div class="client-stat-val">${fmt(c.totalSpent||0)}</div><div class="client-stat-lbl">Total gasto</div></div>
        <div class="client-stat"><div class="client-stat-val">${(c.history||[]).length}</div><div class="client-stat-lbl">Visitas</div></div>
      </div>
      ${c.notes?`<div class="client-note">📝 ${c.notes}</div>`:''}
    </div>`;
  }).join('');

  const hasPrev = clientsPage > 0;
  const hasNext = pageEnd < totalClients;
  const pageInfo = totalClients > CLIENTS_PER_PAGE
    ? `${pageStart+1}–${pageEnd} de ${totalClients} clientes` : `${totalClients} cliente${totalClients!==1?'s':''}`;

  const pagination = totalClients > CLIENTS_PER_PAGE ? `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0 8px;gap:8px">
      <button style="padding:9px 16px;border-radius:10px;background:var(--s2);border:1px solid var(--border2);color:${hasPrev?'var(--text)':'var(--text3)'};font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:${hasPrev?'pointer':'default'}" ${hasPrev?'data-action="clients-prev"':''}>← Anterior</button>
      <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text2)">${pageInfo}</span>
      <button style="padding:9px 16px;border-radius:10px;background:var(--s2);border:1px solid var(--border2);color:${hasNext?'var(--text)':'var(--text3)'};font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:${hasNext?'pointer':'default'}" ${hasNext?'data-action="clients-next"':''}>Seguinte →</button>
    </div>` : '';

  wrap.innerHTML = html + pagination;
}

function openClientModal(id){
  const c=clients.find(x=>x.id==id); if(!c) return;
  document.getElementById('client-modal-title').textContent=c.name+(c.vip?' ⭐':'');
  const body=document.getElementById('client-modal-body');
  const staffOpts=staff.map(s=>`<option value="${s}">${s}</option>`).join('');
  body.innerHTML=`
    <div class="field"><label>Telefone</label><input class="finput" id="cm-phone" type="tel" value="${c.phone||''}" placeholder="+351 9xx xxx xxx"/></div>
    <div class="field"><label>Aniversário</label><input class="finput" id="cm-bday" type="date" value="${c.birthday||''}"/></div>
    <div class="field"><label>Notas (alergias, preferências...)</label><textarea class="finput" id="cm-notes" rows="3" style="resize:none">${c.notes||''}</textarea></div>
    <button class="save-btn" data-action="save-client" data-id="${c.id}">Guardar</button>
    <div class="sec-title" style="margin-top:16px">Histórico de Visitas</div>
    ${(c.history||[]).length?c.history.map(h=>`
      <div class="client-history-item">
        <div><div class="client-hist-svc">${h.svc}</div><div class="client-hist-meta">${fmtD(h.date)} · ${h.staff||''}</div></div>
        <div class="client-hist-val">${fmt(h.val)}</div>
      </div>`).join('')
    :`<div style="font-size:12px;color:var(--text2);padding:12px 0">Sem histórico ainda.</div>`}
  `;
  document.getElementById('client-modal-bg').classList.add('open');
}
function closeClientModal(){ document.getElementById('client-modal-bg').classList.remove('open'); }
function clientModalBgClick(e){ if(e.target===document.getElementById('client-modal-bg')) closeClientModal(); }
function saveClientModal(id){
  const c=clients.find(x=>x.id==id); if(!c) return;
  c.phone   =document.getElementById('cm-phone').value.trim();
  c.birthday=document.getElementById('cm-bday').value;
  c.notes   =document.getElementById('cm-notes').value.trim();
  persistClients();
  closeClientModal();
  renderClients();
  showToast('✓ Cliente guardado!','success');
}

// ═══════════════════════════════════════════════════════════
//  AGENDA
// ═══════════════════════════════════════════════════════════
function renderAgenda(){
  const todayAppts=appts.filter(a=>a.date===today()).sort((a,b)=>a.time.localeCompare(b.time));
  const done=todayAppts.filter(a=>a.status==='done');
  const revenue=done.reduce((s,a)=>s+(a.paid||0)+(a.extras||[]).reduce((x,e)=>x+e.val,0),0);
  document.getElementById('ag-total').textContent=todayAppts.length;
  document.getElementById('ag-done').textContent=done.length;
  document.getElementById('ag-revenue').textContent=fmt(revenue);
  const list=document.getElementById('agenda-list');
  if(!todayAppts.length){
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">📅</div>Sem marcações hoje.<br>Toca no <strong>+</strong> para adicionar ou importa o CSV do Zappy.<div style="margin-top:14px"><div class="zappy-note"><strong>Como exportar do Zappy:</strong><br>Zappy → Relatórios → Marcações → filtrar por hoje → Exportar CSV.<div class="zappy-cols">Colunas: date · client_name · item_name · category · service_provider · price_final</div></div></div></div>`;
    return;
  }
  list.innerHTML=todayAppts.map(apptCardHTML).join('');
}

function apptCardHTML(a){
  const extras=(a.extras||[]);
  const totalPaid=(a.paid||0)+extras.reduce((s,e)=>s+e.val,0);
  const statusClass=a.status==='done'?'status-done':a.status==='noshow'?'status-noshow':'';
  const payOpts=['Dinheiro','MB/Multibanco','MB Way','Transferência Bancária'].map(p=>`<option value="${p}" ${a.payType===p?'selected':''}>${p}</option>`).join('');
  return `<div class="appt-card ${statusClass}" id="appt-${a.id}">
    <div class="appt-header" data-action="toggle" data-id="${a.id}">
      <div class="appt-time">${a.time}</div>
      <div class="appt-info">
        <div class="appt-name">${a.name||'Cliente'}</div>
        <div class="appt-svc">${a.svc} · ${a.cat}</div>
        ${a.notes?`<div style="font-size:10px;color:var(--gold);margin-top:2px">📝 ${a.notes}</div>`:''}
        ${a.discount>0?`<div style="font-size:10px;color:var(--red)">Desc: -${fmt(a.discount)}</div>`:''}
      </div>
      <div class="appt-price">${fmt(totalPaid||a.price||0)}</div>
      <div class="status-badges">
        <div class="status-badge ${a.status==='done'?'active-done':''}" data-action="done" data-id="${a.id}">✓</div>
        <div class="status-badge ${a.status==='noshow'?'active-noshow':''}" data-action="noshow" data-id="${a.id}">✕</div>
      </div>
    </div>
    <div class="appt-body">
      <div class="appt-row"><label>Valor pago</label><input class="appt-input price-f" type="number" inputmode="decimal" value="${a.paid||a.price||''}" placeholder="0,00" onchange="updateApptPaid('${a.id}',this.value)"/></div>
      <div class="appt-row"><label>Pagamento</label><select class="appt-select" onchange="updateApptPayType('${a.id}',this.value)">${payOpts}</select></div>
      <div class="appt-row"><label>Funcionária</label><select class="appt-select" onchange="updateApptStaff('${a.id}',this.value)">${staff.map(s=>`<option value="${s}" ${a.staff===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="appt-row"><label>Faturado</label><select class="appt-select" onchange="updateApptBilled('${a.id}',this.value)"><option value="fat" ${a.billed!=='nfat'?'selected':''}>✓ Sim</option><option value="nfat" ${a.billed==='nfat'?'selected':''}>✕ Não faturado</option></select></div>
      ${extras.length?`<div class="extras-list">${extras.map((e,i)=>`<div class="extra-row"><span class="extra-svc">${e.svc}</span><span class="extra-val">${fmt(e.val)}</span><button class="extra-del" data-action="del-extra" data-id="${a.id}" data-idx="${i}">✕</button></div>`).join('')}</div>`:''}
      <div class="appt-actions">
        <button class="appt-add-extra" data-action="add-extra" data-id="${a.id}">+ Extra</button>
        <button class="appt-save-btn" data-action="finalize" data-id="${a.id}">${a.status==='done'?'↻ Atualizar':'✓ Confirmar e registar'}</button>
        <button class="appt-del-btn" data-action="del-appt" data-id="${a.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
      </div>
    </div>
  </div>`;
}

function toggleAppt(id){ document.getElementById('appt-'+id)?.classList.toggle('expanded'); }
function setApptStatus(e,id,s){
  e.stopPropagation();
  const a=appts.find(x=>x.id===id); if(!a) return;
  a.status=a.status===s?'pending':s;
  if(a.status==='noshow') a.paid=0;
  persistAppts(); renderAgenda();
  setTimeout(()=>{ if(a.status!=='noshow') document.getElementById('appt-'+id)?.classList.add('expanded'); },30);
}
function updateApptPaid(id,v){ const a=appts.find(x=>x.id===id); if(a){ a.paid=parseFloat(v)||0; persistAppts(); } }
function updateApptPayType(id,v){ const a=appts.find(x=>x.id===id); if(a){ a.payType=v; persistAppts(); } }
function updateApptStaff(id,v){ const a=appts.find(x=>x.id===id); if(a){ a.staff=v; persistAppts(); } }
function updateApptBilled(id,v){ const a=appts.find(x=>x.id===id); if(a){ a.billed=v; persistAppts(); } }
function addExtraToAppt(id){
  const svcName=window.prompt('Serviço extra:'); if(!svcName) return;
  const val=parseFloat(window.prompt('Valor (€):')); if(!val||val<=0){ showToast('Valor inválido.','error'); return; }
  const a=appts.find(x=>x.id===id); if(!a) return;
  a.extras=a.extras||[];
  a.extras.push({svc:svcName.trim(),val});
  persistAppts(); renderAgenda();
  setTimeout(()=>document.getElementById('appt-'+id)?.classList.add('expanded'),30);
}
function removeExtra(id,idx){
  const a=appts.find(x=>x.id===id); if(!a) return;
  a.extras.splice(idx,1); persistAppts(); renderAgenda();
  setTimeout(()=>document.getElementById('appt-'+id)?.classList.add('expanded'),30);
}
function finalizeAppt(id){
  const a=appts.find(x=>x.id===id); if(!a) return;
  if(a.status==='noshow'){ showToast('Cliente marcada como faltou.','error'); return; }
  const paid=a.paid||a.price||0;
  const type=a.billed==='nfat'?'nfat':'fat';
  entries=entries.filter(e=>e.apptId!==id);
  if(paid>0){
    const e={id:Date.now()+Math.random(),apptId:id,date:a.date,ts:a.date+'T'+a.time+':00.000Z',type,cat:a.cat,svc:a.svc,val:paid,staff:a.staff||(staff[0]||'')};
    entries.unshift(e);
    upsertClientFromEntry({...e, svc:a.svc, date:a.date, staff:a.staff});
  }
  (a.extras||[]).forEach((ex,i)=>{
    entries.unshift({id:Date.now()+i+Math.random(),apptId:id,date:a.date,ts:a.date+'T'+a.time+':00.000Z',type,cat:a.cat,svc:ex.svc,val:ex.val,staff:a.staff||(staff[0]||'')});
  });
  a.status='done'; persistAppts(); persist(); renderAgenda(); renderHoje();
  showToast('✓ Registo guardado!','success');
}
function deleteAppt(id){
  if(!confirm('Apagar esta marcação?')) return;
  appts=appts.filter(a=>a.id!==id); entries=entries.filter(e=>e.apptId!==id);
  persistAppts(); persist(); renderAgenda(); renderHoje();
}

// Agenda add modal
function openAgAddModal(){
  agSelSvc=null;
  document.getElementById('ag-name').value='';
  document.getElementById('ag-price').value='';
  document.getElementById('ag-time').value=new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'});
  buildAgCatChips(); renderAgSvcGrid();
  document.getElementById('ag-add-modal-bg').classList.add('open');
}
function closeAgAddModal(){ document.getElementById('ag-add-modal-bg').classList.remove('open'); }
function agAddBgClick(e){ if(e.target===document.getElementById('ag-add-modal-bg')) closeAgAddModal(); }

function buildAgCatChips(){
  const wrap=document.getElementById('ag-cat-chips'); wrap.innerHTML='';
  CATS.forEach(cat=>{
    const b=document.createElement('button'); b.className='cat-chip'+(cat===agSelCat?' active':''); b.textContent=cat;
    b.onclick=()=>{ agSelCat=cat; document.querySelectorAll('#ag-cat-chips .cat-chip').forEach(c=>c.classList.toggle('active',c.textContent===cat)); document.getElementById('ag-price').value=''; renderAgSvcGrid(); };
    wrap.appendChild(b);
  });
}
function renderAgSvcGrid(){
  const grid=document.getElementById('ag-svc-grid'); grid.innerHTML='';
  (SERVICES[agSelCat]||[]).forEach(s=>{
    const b=document.createElement('button'); b.className='service-btn';
    b.innerHTML=`<span class="svc-name">${s.n}</span><span class="svc-price">${s.v?'desde ':''} ${fmt(s.p)}</span>`;
    b.onclick=()=>{ agSelSvc=s; document.querySelectorAll('#ag-svc-grid .service-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); document.getElementById('ag-price').value=s.p; };
    grid.appendChild(b);
  });
}
function saveAgAppointment(){
  if(!agSelSvc){ showToast('Seleciona um serviço.','error'); return; }
  const agStaff=document.getElementById('ag-staff')?.value||(staff[0]||'');
  const appt={
    id:Date.now()+'',date:today(),time:document.getElementById('ag-time').value||'10:00',
    name:document.getElementById('ag-name').value.trim()||'Cliente',
    svc:agSelSvc.n,cat:agSelCat,price:parseFloat(document.getElementById('ag-price').value)||0,
    paid:parseFloat(document.getElementById('ag-price').value)||0,
    status:'pending',payType:'Dinheiro',billed:'fat',extras:[],staff:agStaff,
  };
  appts.push(appt);
  upsertClientFromZappy(appt.name, appt);
  persistAppts(); closeAgAddModal(); renderAgenda();
  showToast('✓ Marcação adicionada!','success');
}

// ═══════════════════════════════════════════════════════════
//  GLOBAL EVENT DELEGATION
// ═══════════════════════════════════════════════════════════
let _eventDelegationReady = false;
function setupEventDelegation() {
  if(_eventDelegationReady) return;
  _eventDelegationReady = true;
  // Single listener on document for all data-action elements
  document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    // Do NOT stopPropagation — HR module needs events to bubble
    const {action, id, idx} = el.dataset;

    // Agenda actions
    if (action==='toggle')      { toggleAppt(id); return; }
    if (action==='done')        { setApptStatus(e, id, 'done'); return; }
    if (action==='noshow')      { setApptStatus(e, id, 'noshow'); return; }
    if (action==='add-extra')   { addExtraToAppt(id); return; }
    if (action==='del-extra')   { removeExtra(id, parseInt(idx)); return; }
    if (action==='finalize')    { finalizeAppt(id); return; }
    if (action==='del-appt')    { deleteAppt(id); return; }

    // Entry actions
    if (action==='edit-entry')  { openEditModal(id); return; }
    if (action==='del-entry')   { deleteEntry(id); return; }

    // Client actions
    if (action==='open-client') { openClientModal(id); return; }
    if (action==='save-client') { saveClientModal(id); return; }

    // Basket
    if (action==='del-basket')  { removeFromBasket(parseInt(idx)); return; }

    // Product modal type toggle (handled via onclick in HTML, but guard here)
    if (action==='prod-fat')  { setProdType('fat'); return; }
    if (action==='prod-nfat') { setProdType('nfat'); return; }

    // Pagination
    if (action==='hist-prev')     { histPage--;    renderHist(false); return; }
    if (action==='hist-next')     { histPage++;    renderHist(false); return; }
    if (action==='clients-prev')  { clientsPage--; renderClients(false); return; }
    if (action==='clients-next')  { clientsPage++; renderClients(false); return; }

    // Staff agenda
    if (action==='staff-done')  { staffSetApptStatus(id, 'done'); return; }
    if (action==='staff-noshow'){ staffSetApptStatus(id, 'noshow'); return; }
    if (action==='staff-pay')   { staffSetApptPayType(id, el.value); return; }
  });
}

// ═══════════════════════════════════════════════════════════
//  ZAPPY IMPORT
// ═══════════════════════════════════════════════════════════
function matchZappyCat(raw){
  if(!raw) return CATS[0];
  const s=raw.toLowerCase();
  if(s.includes('gel')&&s.includes('verniz')) return 'Manicure';
  if(s.includes('unhas')&&s.includes('gel'))  return 'Manicure';
  if(s.includes('manicure')||s.includes('remoç')) return 'Manicure';
  if(s.includes('pedicure')) return 'Pedicure';
  if(s.includes('linha')||s.includes('threading')) return 'Pestanas & Sob.';
  if(s.includes('pestana')||s.includes('sobranc')||s.includes('brow')) return 'Pestanas & Sob.';
  if(s.includes('cera')&&(s.includes('fem')||!s.includes('masc'))) return 'Cera Feminino';
  if(s.includes('cera')&&s.includes('masc')) return 'Cera Masculino';
  if(s.includes('rosto')||s.includes('facial')||s.includes('limpeza')) return 'Trat. Rosto';
  if(s.includes('corpo')||s.includes('wave')) return 'Trat. Corpo';
  if(s.includes('massagem')) return 'Massagem';
  if(s.includes('maquilh')) return 'Maquilhagem';
  return CATS[0];
}

function handleZappyImport(input){
  const file=input.files[0]; if(!file) return; input.value='';
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      let rows=[];
      const fname=file.name.toLowerCase();
      if(fname.endsWith('.csv')){
        let text='';
        try{ text=new TextDecoder('utf-8').decode(new Uint8Array(e.target.result)); }
        catch(x){ text=new TextDecoder('iso-8859-1').decode(new Uint8Array(e.target.result)); }
        rows=parseCSV(text);
      } else {
        const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
        rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:false});
      }
      rows=rows.filter(r=>r.some(c=>c));
      if(rows.length<2){ showToast('Ficheiro vazio.','error'); return; }
      const headers=rows[0].map(h=>String(h||'').trim().toLowerCase());
      const dataRows=rows.slice(1);
      const col=n=>{ let i=headers.indexOf(n); if(i>=0) return i; return headers.findIndex(h=>h.includes(n)); };
      const iDate=col('date'); const iStatus=col('status'); const iName=col('client_name')>=0?col('client_name'):col('client');
      const iSvc=col('item_name')>=0?col('item_name'):col('servi'); const iCat=col('category');
      const iStaff=col('service_provider')>=0?col('service_provider'):col('staff');
      const iPrice=col('price_final')>=0?col('price_final'):col('price_base');
      const iDiscount=col('discount'); const iNotes=col('notes');
      let added=0,skipped=0,cancelled=0;
      dataRows.forEach(r=>{
        const rawDate=iDate>=0?String(r[iDate]||'').trim():'';
        const dateStr=rawDate.slice(0,10); const timeStr=rawDate.slice(11,16)||'09:00';
        const status=iStatus>=0?String(r[iStatus]||'').trim().toLowerCase():'';
        if(status==='cancelada'||status==='cancelled'){ cancelled++; return; }
        const clientName=iName>=0?String(r[iName]||'').trim():'Cliente';
        const svcRaw=iSvc>=0?String(r[iSvc]||'').trim():'Serviço';
        const catRaw=iCat>=0?String(r[iCat]||'').trim():'';
        const staffRaw=iStaff>=0?String(r[iStaff]||'').trim():(staff[0]||'');
        const notesRaw=iNotes>=0?String(r[iNotes]||'').trim():'';
        const discount=iDiscount>=0?parseVal(r[iDiscount]):0;
        const price=iPrice>=0?parseVal(r[iPrice]):0;
        if(price<=0){ skipped++; return; }
        const dup=appts.some(a=>a.date===dateStr&&a.time===timeStr&&a.name===clientName&&a.svc===svcRaw);
        if(dup){ skipped++; return; }
        const matchedStaff=staff.find(s=>staffRaw.toLowerCase().includes(s.toLowerCase())||s.toLowerCase().includes(staffRaw.split(' ')[0].toLowerCase()))||staffRaw||(staff[0]||'');
        const appt={id:Date.now()+Math.random()+'',date:dateStr,time:timeStr,name:clientName,svc:svcRaw,cat:matchZappyCat(catRaw),price,paid:price-discount,status:'pending',payType:'Dinheiro',billed:'fat',extras:[],staff:matchedStaff,notes:notesRaw,discount};
        appts.push(appt);
        upsertClientFromZappy(clientName, appt);
        added++;
      });
      persistAppts(); renderAgenda(); renderClients();
      showToast(`✓ ${added} marcação${added!==1?'s':''} importada${added!==1?'s':''}${cancelled?' · '+cancelled+' cancelada'+(cancelled!==1?'s':''):''}${skipped?' · '+skipped+' ignorada'+(skipped!==1?'s':''):''}`, 'success');
    } catch(err){ console.error(err); showToast('Erro ao ler ficheiro Zappy.','error'); }
  };
  reader.readAsArrayBuffer(file);
}

// ═══════════════════════════════════════════════════════════
//  CSV IMPORT (general)
// ═══════════════════════════════════════════════════════════
function parseCSV(text){
  const delim=text.includes(';')?';':',';
  return text.split(/\r?\n/).map(line=>{
    const cells=[]; let cur='',inQ=false;
    for(let i=0;i<line.length;i++){ const c=line[i]; if(c==='"'){ inQ=!inQ; } else if(c===delim&&!inQ){ cells.push(cur.trim()); cur=''; } else { cur+=c; } }
    cells.push(cur.trim()); return cells;
  }).filter(r=>r.length>1);
}
function parseVal(raw){ if(!raw) return 0; const n=parseFloat(String(raw).replace(/[€$\s]/g,'').replace(',','.')); return isNaN(n)?0:n; }

function handleImportFile(input){
  const file=input.files[0]; if(!file) return; input.value='';
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      let rows=[];
      if(file.name.toLowerCase().endsWith('.csv')){
        let text=''; try{ text=new TextDecoder('utf-8').decode(new Uint8Array(e.target.result)); } catch(x){ text=new TextDecoder('iso-8859-1').decode(new Uint8Array(e.target.result)); }
        rows=parseCSV(text);
      } else {
        const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array',cellDates:true});
        rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:false,dateNF:'YYYY-MM-DD'});
      }
      rows=rows.filter(r=>r.some(c=>c!==''&&c!=null));
      if(rows.length<2){ showToast('Ficheiro sem dados.','error'); return; }
      importHeaders=rows[0].map(h=>String(h||'').trim());
      importRows=rows.slice(1);
      buildColMap(); updatePreview();
      document.getElementById('import-modal-bg').classList.add('open');
    } catch(err){ console.error(err); showToast('Erro ao ler ficheiro.','error'); }
  };
  reader.readAsArrayBuffer(file);
}

const FIELD_DEFS=[
  {id:'f-date',label:'Data',required:true, hint:['data','date','dia']},
  {id:'f-svc', label:'Serviço',required:true, hint:['servi','service','descri','nome','item']},
  {id:'f-val', label:'Valor',required:true, hint:['valor','value','preco','preço','total','price_final','price']},
  {id:'f-type',label:'Tipo',required:false,hint:['tipo','type','fatur']},
  {id:'f-cat', label:'Categoria',required:false,hint:['categ','category']},
  {id:'f-staff',label:'Funcionária',required:false,hint:['staff','funcion','provider','colabor']},
];

function bestGuess(hints){ for(let h=0;h<importHeaders.length;h++){ const l=importHeaders[h].toLowerCase(); if(hints.some(hint=>l.includes(hint))) return h; } return -1; }
function buildColMap(){
  const wrap=document.getElementById('col-map'); wrap.innerHTML='';
  FIELD_DEFS.forEach(f=>{
    const guess=bestGuess(f.hint);
    const row=document.createElement('div'); row.className='col-row';
    const opts=importHeaders.map((h,i)=>`<option value="${i}" ${i===guess?'selected':''}>${h||'(col '+(i+1)+')'}</option>`).join('');
    row.innerHTML=`<div class="col-label">${f.label}${f.required?' *':''}</div><select class="col-select" id="${f.id}" onchange="updatePreview()">${!f.required?'<option value="-1">— ignorar —</option>':''}${opts}</select>`;
    wrap.appendChild(row);
  });
  document.getElementById('import-sub').textContent=`${importHeaders.length} colunas · ${importRows.length} linhas`;
}
function getColIdx(id){ return parseInt(document.getElementById(id)?.value??'-1'); }
function updatePreview(){
  const iDate=getColIdx('f-date'),iSvc=getColIdx('f-svc'),iVal=getColIdx('f-val');
  const sample=importRows.slice(0,3);
  let html=`${importRows.length} linhas encontradas\n\n`;
  sample.forEach((r,i)=>{ html+=`Linha ${i+1}: ${iDate>=0?r[iDate]||'—':'—'}  |  ${iSvc>=0?r[iSvc]||'—':'—'}  |  ${iVal>=0?r[iVal]||'—':'—'}€\n`; });
  if(importRows.length>3) html+=`… e mais ${importRows.length-3} linhas`;
  document.getElementById('import-preview').textContent=html;
  document.getElementById('import-confirm-btn').disabled=!(iDate>=0&&iSvc>=0&&iVal>=0);
}
function closeImportModal(){ document.getElementById('import-modal-bg').classList.remove('open'); }
function parseDate(raw){
  if(!raw) return today();
  const s=String(raw).trim();
  if(/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0,10);
  const m=s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if(m){ const y=m[3].length===2?'20'+m[3]:m[3]; return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; }
  return today();
}
function confirmImport(){
  const iDate=getColIdx('f-date'),iSvc=getColIdx('f-svc'),iVal=getColIdx('f-val'),iType=getColIdx('f-type'),iCat=getColIdx('f-cat'),iStaff=getColIdx('f-staff');
  let imported=0,skipped=0;
  importRows.forEach(r=>{
    const val=parseVal(r[iVal]); if(!val||val<=0){ skipped++; return; }
    const svcName=String(r[iSvc]||'').trim()||'Importado';
    const date=parseDate(r[iDate]);
    const type=iType>=0?(String(r[iType]||'').toLowerCase().includes('não')||String(r[iType]||'').toLowerCase().includes('nfat')?'nfat':'fat'):'fat';
    const cat=iCat>=0?matchZappyCat(r[iCat]):CATS[0];
    const staffVal=iStaff>=0?(staff.find(s=>String(r[iStaff]||'').toLowerCase().includes(s.toLowerCase()))||String(r[iStaff]||'').trim()||(staff[0]||'')):(staff[0]||'');
    const dup=entries.some(e=>e.date===date&&e.svc===svcName&&e.val===val);
    if(dup){ skipped++; return; }
    entries.push({id:Date.now()+Math.random(),date,ts:date+'T12:00:00.000Z',type,cat,svc:svcName,val,staff:staffVal});
    imported++;
  });
  entries.sort((a,b)=>b.date.localeCompare(a.date));
  persist(); renderAll(); closeImportModal();
  showToast(`✓ ${imported} registos importados${skipped?' ('+skipped+' ignorados)':''}`, 'success');
}

// ═══════════════════════════════════════════════════════════
//  STAFF MANAGEMENT
// ═══════════════════════════════════════════════════════════
function populateStaffSelects(){
  const opts=staff.map(s=>`<option value="${s}">${s}</option>`).join('');
  ['staff-select','ag-staff'].forEach(id=>{ const el=document.getElementById(id); if(el) el.innerHTML=opts; });
}
function addStaffMember(){
  const inp=document.getElementById('new-staff-input');
  const name=inp.value.trim(); if(!name) return;
  if(staff.includes(name)){ showToast('Funcionária já existe.','error'); return; }
  staff.push(name);
  if(!userPins[name]) userPins[name]='0000';
  persistStaff(); persistPins(); inp.value='';
  renderStaffCfg(); populateStaffSelects(); buildLoginScreen();
  showToast('✓ '+name+' adicionada! PIN padrão: 0000','success');
}
function renderStaffCfg(){
  const wrap=document.getElementById('staff-list-cfg'); if(!wrap) return;
  wrap.innerHTML='';
  staff.forEach(name=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;justify-content:space-between;background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:12px 16px;gap:10px';
    const left=document.createElement('div');
    const pin=userPins[name]||'0000';
    left.innerHTML=`<div style="font-size:15px;font-weight:700;color:var(--text)">${name}</div><div style="font-size:11px;color:var(--text2);font-family:'DM Mono',monospace;margin-top:2px">PIN: ${name==='Sónia'?'(definido)':pin}</div>`;
    const actions=document.createElement('div');
    actions.style.cssText='display:flex;gap:6px';
    const pinBtn=document.createElement('button');
    pinBtn.textContent='✎ PIN';
    pinBtn.style.cssText='padding:7px 12px;background:var(--gold-d);border:1px solid var(--gold);border-radius:8px;color:var(--gold2);font-family:Syne,sans-serif;font-size:11px;font-weight:700;cursor:pointer';
    pinBtn.onclick=()=>changePin(name);
    const delBtn=document.createElement('button');
    delBtn.textContent='Apagar';
    delBtn.style.cssText='padding:7px 12px;background:var(--red-d);border:1px solid var(--red);border-radius:8px;color:var(--red);font-family:Syne,sans-serif;font-size:12px;font-weight:700;cursor:pointer';
    delBtn.onclick=()=>removeStaffMember(name);
    if(name==='Sónia') delBtn.style.display='none';
    actions.appendChild(pinBtn); actions.appendChild(delBtn);
    row.appendChild(left); row.appendChild(actions);
    wrap.appendChild(row);
  });
}
function changePin(name){
  const existing = document.getElementById('pin-change-overlay');
  if(existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'pin-change-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(10,8,6,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `
    <div style="background:var(--s1);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:300px;padding:24px">
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;color:var(--gold2);margin-bottom:14px">PIN de ${name}</div>
      <input id="pc-pin" type="number" inputmode="numeric" maxlength="4" placeholder="4 dígitos"
        style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--gold2);font-family:'DM Mono',monospace;font-size:28px;padding:12px 14px;width:100%;outline:none;text-align:center;letter-spacing:8px;margin-bottom:12px"/>
      <button id="pc-save" style="width:100%;padding:13px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#100e0c;font-family:'Syne',sans-serif;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:8px">Guardar PIN</button>
      <button id="pc-cancel" style="width:100%;padding:10px;border-radius:10px;background:none;border:1px solid var(--border2);color:var(--text2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer">Cancelar</button>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(()=>document.getElementById('pc-pin')?.focus(),100);
  overlay.addEventListener('click', function(e){
    if(e.target.id==='pc-cancel'||e.target===overlay){ overlay.remove(); return; }
    if(e.target.id!=='pc-save') return;
    const val = (document.getElementById('pc-pin').value||'').trim();
    if(val.length!==4||!/^\d{4}$/.test(val)){ showToast('PIN deve ter exactamente 4 dígitos.','error'); return; }
    userPins[name]=val; persistPins();
    overlay.remove();
    renderStaffCfg();
    showToast('✓ PIN de '+name+' atualizado!','success');
  });
}
function removeStaffMember(name){
  if(!confirm('Apagar "'+name+'"?')) return;
  staff=staff.filter(s=>s!==name);
  persistStaff(); renderStaffCfg(); populateStaffSelects(); buildLoginScreen();
  showToast(name+' removida.','success');
}

// ═══════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════
function renderCfg(){
  const tot=entries.reduce((a,e)=>a+e.val,0);
  document.getElementById('cfg-count').textContent=entries.length+' registos · '+fmt(tot)+' total';
  // Firebase status
  const fbCfg=JSON.parse(localStorage.getItem('sr_firebase')||'{}');
  if(fbCfg.apiKey){
    document.getElementById('firebase-status').textContent='✅ Configurado — '+fbCfg.projectId;
    document.getElementById('firebase-status').style.color='var(--green)';
  }
}
function saveFirebaseConfig(){
  const cfg={
    apiKey:document.getElementById('fb-apiKey').value.trim(),
    databaseURL:document.getElementById('fb-dbURL').value.trim(),
    projectId:document.getElementById('fb-projectId').value.trim(),
    appId:document.getElementById('fb-appId').value.trim(),
  };
  if(!cfg.apiKey||!cfg.databaseURL){ showToast('Preenche pelo menos API Key e Database URL.'); return; }
  localStorage.setItem('sr_firebase',JSON.stringify(cfg));
  showToast('✓ Firebase guardado! Recarrega a app para ativar.','success');
  renderCfg();
}

// ═══════════════════════════════════════════════════════════
//  EXPORT CSV
// ═══════════════════════════════════════════════════════════
function exportCSV(){
  const rows=[['Data','Hora','Funcionária','Tipo','Categoria','Serviço','Valor (€)']];
  entries.forEach(e=>rows.push([e.date,fmtT(e.ts),e.staff||'',e.type==='fat'?'Faturado':'Não Faturado',e.cat,e.svc,e.val.toFixed(2).replace('.',',')]));
  const csv=rows.map(r=>r.map(c=>`"${c}"`).join(';')).join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
  a.download='faturacao_sr_'+today()+'.csv'; a.click();
}

// ═══════════════════════════════════════════════════════════
//  CLEAR DATA
// ═══════════════════════════════════════════════════════════
function confirmClear(){
  if(!confirm('Apagar TODOS os registos?\nEsta ação não pode ser desfeita.')) return;
  entries=[]; appts=[]; clients=[];
  persist(); persistAppts(); persistClients(); renderAll();
  showToast('Todos os dados apagados.','error');
}

// ═══════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════
function showToast(msg,type='success'){
  const t=document.createElement('div'); t.className='toast '+type; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),3200);
}

// ═══════════════════════════════════════════════════════════
//  RENDER ALL
// ═══════════════════════════════════════════════════════════
function renderAll(){ renderHoje(); renderCfg(); updateBadges(); }

function countPendingHR(){
  let total=0;
  staff.forEach(s=>{
    const hr=getHR(s);
    total += hr.hours.filter(h=>!h.approved&&!h.rejected).length;
    total += (hr.vacations||[]).filter(v=>v.status==='pending').length;
    total += (hr.compensations||[]).filter(c=>c.status==='pending').length;
  });
  return total;
}

function updateBadges(){
  if(currentRole!=='owner') return;
  const count=countPendingHR();
  // Remove existing badges
  document.querySelectorAll('.nav-badge').forEach(b=>b.remove());
  if(count>0){
    const btn=document.getElementById('nb-equipa');
    if(btn){
      const badge=document.createElement('div');
      badge.className='nav-badge';
      badge.textContent=count>9?'9+':count;
      btn.appendChild(badge);
    }
  }
}

function showPendingAlert(){
  try {
    if(currentRole!=='owner') return;
    const count=countPendingHR();
    if(count===0) return;
    const list=document.getElementById('hoje-list');
    if(!list) return;
    const existing=document.getElementById('pending-alert-banner');
    if(existing) existing.remove();
    const banner=document.createElement('div');
    banner.id='pending-alert-banner';
    banner.className='alert-banner';
    banner.innerHTML='<div class="alert-banner-icon">🔔</div><div><div class="alert-banner-text">'+count+' pedido'+(count!==1?'s':'')+' pendente'+(count!==1?'s':'')+'</div><div class="alert-banner-sub">Horas, férias ou folgas a aguardar aprovação</div></div><div style="font-size:12px;color:var(--gold);font-weight:700">Ver →</div>';
    banner.onclick=function(){ showView('equipa'); };
    list.parentNode.insertBefore(banner, list);
  } catch(e) { console.log('alert error:', e); }
}