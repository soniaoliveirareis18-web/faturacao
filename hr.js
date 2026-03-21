// ═══════════════════════════════════════════════════════════
//  HR MODULE — HORAS, FÉRIAS, FORMAÇÃO
// ═══════════════════════════════════════════════════════════
let hrData    = JSON.parse(localStorage.getItem('sr_hr')    || '{}');
// hrData[staffName] = { hours:[{id,date,total,note,approved}], vacations:[{id,dates[],status,note}], training:[{id,name,hours,date}], vacationDays:22, trainingHoursTotal:40 }
const persistHR = () => localStorage.setItem('sr_hr', JSON.stringify(hrData));

let hrTab         = 'horas';      // 'horas' | 'ferias' | 'formacao'
let hrStaff       = null;         // selected staff member
let hrCalYear     = new Date().getFullYear();
let hrCalMonth    = new Date().getMonth();

function getHR(name){
  if(!hrData[name]) hrData[name]={hours:[],vacations:[],training:[],vacationDays:22,trainingHoursTotal:40};
  return hrData[name];
}

function renderEquipa(){
  const isOwner = currentRole==='owner';
  // Always ensure hrStaff is valid for current role
  if(isOwner){
    if(!hrStaff || !staff.includes(hrStaff)) hrStaff = staff[0]||'';
  } else {
    hrStaff = currentUser;
  }
  const wrap = document.getElementById('equipa-content');
  if(!wrap) return;
  const visibleStaff = isOwner ? staff : [currentUser];

  // Build HTML without any inline onclick
  wrap.innerHTML = `
    ${isOwner ? `<div class="hr-staff-picker" id="hr-staff-picker"></div>` : `<div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--gold2);margin-bottom:16px">${currentUser}</div>`}
    <div class="hr-tabs" id="hr-tabs-bar">
      <button class="hr-tab ${hrTab==='horas'?'active':''}" data-action="hr-tab" data-tab="horas">⏱ Horas</button>
      <button class="hr-tab ${hrTab==='ferias'?'active':''}" data-action="hr-tab" data-tab="ferias">🌴 Férias</button>
      <button class="hr-tab ${hrTab==='formacao'?'active':''}" data-action="hr-tab" data-tab="formacao">📚 Formação</button>
    </div>
    <div id="hr-tab-content"></div>`;

  // Setup permanent delegation (only once)
  setupHRDelegation();

  // Staff picker HTML
  if(isOwner){
    const picker=document.getElementById('hr-staff-picker');
    if(picker){
      picker.innerHTML=visibleStaff.map(s=>`<button class="hr-staff-btn ${s===hrStaff?'active':''}" data-action="hr-staff" data-hrstaff="${s}">${s}</button>`).join('');
    }
  }
  renderHRTab();
}

function setHRTab(t){ hrTab=t; renderEquipa(); }
function setHRStaff(s){ hrStaff=s; renderEquipa(); }

// Single permanent event handler for entire equipa section
// Set up once — never destroyed, no {once:true}
let hrDelegationReady = false;

function resetHRState(){
  // Called on logout — resets state but keeps listener alive
  hrTab      = 'horas';
  hrStaff    = null;
  hrCalYear  = new Date().getFullYear();
  hrFolgaMode= false;
  // Do NOT reset hrDelegationReady — listener stays registered
}

function setupHRDelegation(){
  if(hrDelegationReady) return;
  hrDelegationReady = true;

  // Use equipa-content as the root — it always exists once owner logs in
  document.addEventListener('click', function hrHandler(e){
    if(!currentUser || !currentRole) return;
    if(!e.target.closest('#equipa-content, #staff-equipa-view, #folga-picker-overlay')) return;
    // Stop propagation so app delegation doesn't double-handle
    e.stopPropagation();

    // ── Calendar: toggle exceptional day (owner only) ──
    const excToggle = e.target.closest('[data-toggle-exceptional]');
    if(excToggle){ toggleExceptionalDay(excToggle.dataset.toggleExceptional); return; }

    // ── Calendar: exceptional day clicked by staff ──
    const excDay = e.target.closest('[data-exceptional]');
    if(excDay){ openExceptionalHoursModal(excDay.dataset.exceptional); return; }

    // ── Calendar: folga day ──
    const folgaDay = e.target.closest('[data-folga-date]');
    if(folgaDay){ showFolgaTypePicker(folgaDay.dataset.folgaDate); return; }

    // ── Calendar: vacation day ──
    const calDay = e.target.closest('.cal-day[data-date]');
    if(calDay && !calDay.classList.contains('empty')){
      toggleVacationDay(calDay.dataset.staff, calDay.dataset.date); return;
    }

    // ── Calendar nav ──
    if(e.target.id==='cal-prev'){ hrCalYear--; renderEquipa(); return; }
    if(e.target.id==='cal-next'){ hrCalYear++; renderEquipa(); return; }

    // ── All data-action buttons ──
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const {action, id, staff: s} = btn.dataset;

    // Tabs
    if(action==='hr-tab')         { setHRTab(btn.dataset.tab); return; }
    if(action==='hr-staff')       { setHRStaff(btn.dataset.hrstaff); return; }

    // Horas
    if(action==='add-hours')      { openAddHoursModal(); return; }
    if(action==='add-comp')       { openCompensationModal(); return; }
    if(action==='approve-hours')  { approveHours(s, id, true); return; }
    if(action==='reject-hours')   { approveHours(s, id, false); return; }
    if(action==='delete-hours')   { deleteHours(s, id); return; }
    if(action==='approve-comp')   { approveCompensation(s, id, true); return; }
    if(action==='reject-comp')    { approveCompensation(s, id, false); return; }

    // Férias
    if(action==='approve-vac')    { approveVacation(s, id, true); return; }
    if(action==='reject-vac')     { approveVacation(s, id, false); return; }
    if(action==='cancel-folga')   { hrFolgaMode=false; renderEquipa(); return; }

    // Saída antecipada
    if(action==='add-early')      { openEarlyDepartureModal(); return; }
    if(action==='approve-early')  { approveEarlyDeparture(s, id, true); return; }
    if(action==='reject-early')   { approveEarlyDeparture(s, id, false); return; }

    // Formação
    if(action==='add-training')   { openAddTrainingModal(); return; }
    if(action==='del-training')   { deleteTraining(s, id); return; }
  });
}

function renderHRTab(){
  const wrap=document.getElementById('hr-tab-content'); if(!wrap) return;
  const hr=getHR(hrStaff);
  const isOwner=currentRole==='owner';
  // Just update HTML — delegation is permanent on document
  if(hrTab==='horas')    wrap.innerHTML=renderHorasTab(hr, isOwner);
  if(hrTab==='ferias')   wrap.innerHTML=renderFeriasTab(hr, isOwner);
  if(hrTab==='formacao') wrap.innerHTML=renderFormacaoTab(hr, isOwner);
}

// ── HORAS ────────────────────────────────────────────────
function calcHourBalance(hr){
  const worked   = hr.hours.filter(h=>h.approved).reduce((a,h)=>a+h.total,0);
  const deducted = (hr.compensations||[]).filter(c=>c.status==='approved').reduce((a,c)=>a+c.hours,0);
  // Early departures that are approved also deduct
  const earlyDep = (hr.earlyDepartures||[]).filter(e=>e.approved).reduce((a,e)=>a+e.hours,0);
  return Math.round((worked - deducted - earlyDep)*10)/10;
}

function renderHorasTab(hr, isOwner){
  const now = new Date();
  const monthKey = now.getFullYear()+'-'+(now.getMonth()+1).toString().padStart(2,'0');
  const monthHours = hr.hours.filter(h=>h.date.startsWith(monthKey)&&h.approved);
  const totalMonth = monthHours.reduce((a,h)=>a+h.total,0);
  const pending    = hr.hours.filter(h=>!h.approved&&!h.rejected);
  const balance    = calcHourBalance(hr);
  const pendingComp= (hr.compensations||[]).filter(c=>c.status==='pending');

  let html = `
    <div class="grid2" style="margin-bottom:10px">
      <div class="card gold">
        <div class="card-label">Este mês</div>
        <div class="card-val">${totalMonth.toFixed(1)}h</div>
        <div class="card-sub">${pending.length} pendente${pending.length!==1?'s':''}</div>
      </div>
      <div class="card ${balance>=0?'green':'red'}">
        <div class="card-label">Saldo extra</div>
        <div class="card-val">${balance>=0?'+':''}${balance}h</div>
        <div class="card-sub">acumulado total</div>
      </div>
    </div>`;

  html += `<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
    <button class="hr-add-btn" style="flex:1;margin-bottom:0;min-width:140px" data-action="add-hours">+ Registar Horas</button>
    ${balance>0?`<button class="hr-add-btn" style="flex:1;margin-bottom:0;min-width:120px;border-color:var(--blue);color:var(--blue);background:var(--blue-d)" data-action="add-comp">🌙 Pedir Folga</button>`:''}
  </div>
  <button class="hr-add-btn" style="margin-bottom:10px;border-color:var(--red);color:var(--red);background:var(--red-d)" data-action="add-early">⏰ Saí mais cedo</button>`;

  // Early departures
  const pendingEarly  = (hr.earlyDepartures||[]).filter(e=>!e.approved&&!e.rejected);
  const approvedEarly = (hr.earlyDepartures||[]).filter(e=>e.approved);
  if(isOwner && pendingEarly.length){
    html+=`<div class="sec-title">🟡 Saídas Antecipadas Pendentes</div>`;
    pendingEarly.forEach(e=>{
      html+=`<div class="hr-card" style="margin-bottom:8px;border-color:var(--red)">
        <div class="hr-card-header">
          <div>
            <div style="font-size:13px;font-weight:700">⏰ Saída antecipada — ${fmtD(e.date)}</div>
            <div style="font-size:11px;color:var(--text2)">-${e.hours}h ${e.note?'· '+e.note:''}</div>
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:16px;color:var(--red)">-${e.hours}h</div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="hr-approve-btn approve" data-action="approve-early" data-id="${e.id}" data-staff="${hrStaff}">✓ Aprovar</button>
          <button class="hr-approve-btn reject" data-action="reject-early" data-id="${e.id}" data-staff="${hrStaff}">✕ Recusar</button>
        </div>
      </div>`;
    });
  }
  if(approvedEarly.length){
    html+=`<div class="sec-title">⏰ Saídas Antecipadas Aprovadas</div>`;
    approvedEarly.sort((a,b)=>b.date.localeCompare(a.date)).forEach(e=>{
      html+=`<div class="hr-card" style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-size:13px;font-weight:700">${fmtD(e.date)}</div>
          ${e.note?`<div style="font-size:10px;color:var(--text2)">${e.note}</div>`:''}</div>
          <div style="font-family:'DM Mono',monospace;font-size:15px;color:var(--red)">-${e.hours}h</div>
        </div>
      </div>`;
    });
  }

  // Pending compensations for owner to approve
  if(isOwner && pendingComp.length){
    html+=`<div class="sec-title">🟡 Pedidos de Folga Pendentes</div>`;
    pendingComp.forEach(c=>{
      html+=`<div class="hr-card" style="margin-bottom:8px;border-color:var(--gold)">
        <div class="hr-card-header">
          <div>
            <div style="font-size:13px;font-weight:700">${c.type==='full'?'Dia completo':'Meio-dia'} — ${fmtD(c.date)}</div>
            <div style="font-size:11px;color:var(--text2)">${c.hours}h a descontar do saldo</div>
            ${c.note?`<div style="font-size:10px;color:var(--text2);font-style:italic">${c.note}</div>`:''}
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:16px;color:var(--gold)">-${c.hours}h</div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="hr-approve-btn approve" data-action="approve-comp" data-id="${c.id}" data-staff="${hrStaff}">✓ Aprovar</button>
          <button class="hr-approve-btn reject" data-action="reject-comp" data-id="${c.id}" data-staff="${hrStaff}">✕ Recusar</button>
        </div>
      </div>`;
    });
  }

  // Approved compensations
  const approvedComp=(hr.compensations||[]).filter(c=>c.status==='approved');
  if(approvedComp.length){
    html+=`<div class="sec-title">✅ Folgas Aprovadas</div>`;
    approvedComp.sort((a,b)=>b.date.localeCompare(a.date)).forEach(c=>{
      html+=`<div class="hr-card" style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:13px;font-weight:700">${c.type==='full'?'Dia completo':'Meio-dia'} — ${fmtD(c.date)}</div>
            ${c.note?`<div style="font-size:10px;color:var(--text2);font-style:italic">${c.note}</div>`:''}
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:15px;color:var(--red)">-${c.hours}h</div>
        </div>
      </div>`;
    });
  }

  html+=`<div class="sec-title">📋 Registos de Horas</div>`;
  if(hr.hours.length===0){
    html+=`<div class="empty-state"><div class="empty-icon">⏱</div>Sem registos de horas ainda.</div>`;
  } else {
    const groups={};
    hr.hours.forEach(h=>{ const m=h.date.slice(0,7); (groups[m]=groups[m]||[]).push(h); });
    Object.entries(groups).sort((a,b)=>b[0].localeCompare(a[0])).forEach(([month,items])=>{
      const mTotal=items.filter(h=>h.approved).reduce((a,h)=>a+h.total,0);
      const d=new Date(month+'-01'); const mLbl=d.toLocaleDateString('pt-PT',{month:'long',year:'numeric'});
      html+=`<div class="sec-title" style="margin-top:14px">${mLbl} — ${mTotal.toFixed(1)}h aprovadas</div>`;
      items.sort((a,b)=>b.date.localeCompare(a.date)).forEach(h=>{
        const statusColor=h.approved?'var(--green)':h.rejected?'var(--red)':'var(--gold)';
        const statusLbl=h.approved?'✓ Aprovado':h.rejected?'✕ Recusado':'🟡 Pendente';
        html+=`<div class="hr-card" style="margin-bottom:8px">
          <div class="hr-card-header">
            <div>
              <div style="font-size:13px;font-weight:700">${fmtD(h.date)}</div>
              ${h.note?`<div style="font-size:11px;color:var(--text2);font-style:italic;margin-top:2px">${h.note}</div>`:''}
            </div>
            <div style="text-align:right">
              <div style="font-family:'DM Mono',monospace;font-size:18px;color:var(--gold2)">${h.total}h</div>
              <div style="font-size:10px;color:${statusColor};font-weight:700">${statusLbl}</div>
            </div>
          </div>
          ${isOwner&&!h.approved&&!h.rejected?`<div style="display:flex;gap:6px;margin-top:8px">
            <button class="hr-approve-btn approve" data-action="approve-hours" data-id="${h.id}" data-staff="${hrStaff}">✓ Aprovar</button>
            <button class="hr-approve-btn reject" data-action="reject-hours" data-id="${h.id}" data-staff="${hrStaff}">✕ Recusar</button>
            <button data-action="delete-hours" data-id="${h.id}" data-staff="${hrStaff}" style="margin-left:auto;background:none;border:none;color:var(--text3);cursor:pointer;font-size:12px">🗑</button>
          </div>`:''}
          ${isOwner&&(h.approved||h.rejected)?`<button data-action="delete-hours" data-id="${h.id}" data-staff="${hrStaff}" style="margin-top:6px;background:none;border:none;color:var(--text3);cursor:pointer;font-size:11px">🗑 Apagar</button>`:''}
          ${!isOwner&&!isWithin24h(h.date)?`<div style="font-size:10px;color:var(--text3);margin-top:6px">🔒 Bloqueado — pede à Sónia para editar</div>`:''}
        </div>`;
      });
    });
  }
  return html;
}

// Folga type config
const FOLGA_TYPES = {
  full:  { label:'Dia completo', hours:8, color:'#4a90d9', colorD:'rgba(74,144,217,.18)', emoji:'🔵' },
  manha: { label:'Manhã (9h-12h)', hours:3, color:'#9b59b6', colorD:'rgba(155,89,182,.18)', emoji:'🟣' },
  tarde: { label:'Tarde (14h-19h)', hours:5, color:'#e67e22', colorD:'rgba(230,126,34,.18)', emoji:'🟠' },
};
const WORK_DAYS     = [1,2,3,5];   // Seg/Ter/Qua/Sex — folgas por horas extra
const VACATION_DAYS = [1,2,3,5,6]; // Seg/Ter/Qua/Sex/Sáb — marcar férias

// Portuguese public holidays (MM-DD format, fixed)
const PT_HOLIDAYS_FIXED = ['01-01','04-25','05-01','06-10','08-15','10-05','11-01','12-01','12-08','12-25'];

function getPTHolidays(year){
  const h = new Set(PT_HOLIDAYS_FIXED.map(d => year+'-'+d));
  // Easter-based: Carnival(-47), Good Friday(-2), Corpus Christi(+60)
  const easter = getEaster(year);
  const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r.toISOString().slice(0,10); };
  h.add(addDays(easter, -47)); // Carnaval
  h.add(addDays(easter, -2));  // Sexta-feira Santa
  h.add(addDays(easter,  60)); // Corpo de Deus
  return h;
}

function getEaster(year){
  // Anonymous Gregorian algorithm
  const a=year%19, b=Math.floor(year/100), c=year%100;
  const d=Math.floor(b/4), e=b%4, f=Math.floor((b+8)/25);
  const g=Math.floor((b-f+1)/3), h=(19*a+b-d-g+15)%30;
  const i=Math.floor(c/4), k=c%4, l=(32+2*e+2*i-h-k)%7;
  const m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31);
  const day=((h+l-7*m+114)%31)+1;
  return new Date(year,month-1,day).toISOString().slice(0,10);
}

function isHoliday(dateStr, year){ return getPTHolidays(year).has(dateStr); }
function isWorkDay(dateStr){ return WORK_DAYS.includes(new Date(dateStr+'T12:00:00').getDay()); }
function isVacationDay(dateStr){ return VACATION_DAYS.includes(new Date(dateStr+'T12:00:00').getDay()); }

// Exceptional days: stored globally (shared across all staff)
// hrData._exceptional = { 'YYYY-MM-DD': true }
function getExceptionalDays(){ return hrData._exceptional || {}; }
function isExceptionalDay(ds){ return !!getExceptionalDays()[ds]; }
function toggleExceptionalDay(ds){
  if(!hrData._exceptional) hrData._exceptional = {};
  if(hrData._exceptional[ds]){ delete hrData._exceptional[ds]; }
  else { hrData._exceptional[ds] = true; }
  persistHR();
  renderEquipa();
}

// Called from "Pedir Folga" button — switches to férias tab showing folga calendar
function openCompensationModal(){
  const hr = getHR(hrStaff);
  const balance = calcHourBalance(hr);
  if(balance <= 0){ showToast('Sem saldo de horas extra para usar.','error'); return; }
  // Switch to férias tab — folga calendar is shown there
  hrTab = 'ferias';
  hrFolgaMode = true; // flag: folga picker mode
  renderEquipa();
  showToast('Seleciona o dia e tipo de folga no calendário 👇','success');
}

let hrFolgaMode = false; // true when in folga-picking mode

function requestFolga(dateStr, type){
  const hr = getHR(hrStaff);
  const balance = calcHourBalance(hr);
  const ft = FOLGA_TYPES[type];

  if(!isWorkDay(dateStr)){
    showToast('Folgas apenas em dias de trabalho (Seg/Ter/Qua/Sex).','error');
    return;
  }
  if(balance < ft.hours){
    showToast('Saldo insuficiente — tens '+balance+'h mas precisas de '+ft.hours+'h.','error');
    return;
  }
  // Check not already requested
  const already = (hr.compensations||[]).find(c=>c.date===dateStr&&c.status!=='rejected');
  if(already){
    showToast('Já tens um pedido de folga para este dia.','error');
    return;
  }
  hr.compensations = hr.compensations||[];
  hr.compensations.push({
    id: Date.now()+'',
    date: dateStr,
    type,
    hours: ft.hours,
    status: 'pending',
  });
  hrFolgaMode = false;
  persistHR(); renderEquipa(); updateBadges();
  showToast('🟡 Pedido de '+ft.label+' enviado para aprovação!','success');
}

function approveCompensation(name,id,approve){
  const hr=getHR(name);
  const c=(hr.compensations||[]).find(x=>x.id===id); if(!c) return;
  c.status=approve?'approved':'rejected';
  persistHR(); renderEquipa(); updateBadges();
  showToast(approve?'✓ Folga aprovada! 🌙':'Pedido recusado.', approve?'success':'error');
}

// ── Early departure ─────────────────────────────────────────
function openEarlyDepartureModal(){
  const existing = document.getElementById('early-modal-overlay');
  if(existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'early-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(10,8,6,.88);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center';
  overlay.innerHTML = `
    <div style="background:var(--s1);border:1px solid var(--border2);border-radius:24px 24px 0 0;width:100%;padding:0 0 calc(env(safe-area-inset-bottom)+16px);animation:slideUp .25s cubic-bezier(.4,0,.2,1)">
      <div style="width:36px;height:4px;background:var(--border2);border-radius:2px;margin:12px auto 16px"></div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--red);padding:0 18px 16px;border-bottom:1px solid var(--border)">⏰ Saída Antecipada</div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Data</label>
          <input id="ed-date" type="date" value="${new Date().toISOString().slice(0,10)}" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Horas que saí mais cedo</label>
          <input id="ed-hours" type="number" inputmode="decimal" step="0.5" min="0.5" max="8" placeholder="Ex: 1.5"
            style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--red);font-family:'DM Mono',monospace;font-size:22px;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Motivo (opcional)</label>
          <input id="ed-note" type="text" placeholder="Ex: consulta médica"
            style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="background:var(--red-d);border:1px solid var(--red);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--red)">
          ⚠️ Estas horas serão descontadas do teu saldo após aprovação da Sónia.
        </div>
        <button id="ed-save" style="width:100%;padding:15px;border-radius:12px;background:var(--red);border:none;color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;cursor:pointer">Submeter para Aprovação</button>
        <button id="ed-cancel" style="width:100%;padding:11px;border-radius:12px;background:none;border:1px solid var(--border2);color:var(--text2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer">Cancelar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){
    if(e.target.id==='ed-cancel'||e.target===overlay){ overlay.remove(); return; }
    if(e.target.id!=='ed-save') return;
    const date  = document.getElementById('ed-date').value;
    const hours = parseFloat(document.getElementById('ed-hours').value);
    const note  = (document.getElementById('ed-note').value||'').trim();
    if(!date){ showToast('Seleciona uma data.','error'); return; }
    if(!hours||hours<=0){ showToast('Introduz um número de horas válido.','error'); return; }
    const hr = getHR(hrStaff);
    hr.earlyDepartures = hr.earlyDepartures||[];
    const autoApprove = currentRole==='owner';
    hr.earlyDepartures.push({id:Date.now()+'',date,hours,note,approved:autoApprove,rejected:false});
    persistHR(); overlay.remove(); renderEquipa(); updateBadges();
    showToast(autoApprove?'✓ Saída registada e aprovada!':'🟡 Submetido para aprovação da Sónia!','success');
  });
}

function approveEarlyDeparture(name, id, approve){
  const hr = getHR(name);
  const e  = (hr.earlyDepartures||[]).find(x=>x.id===id); if(!e) return;
  e.approved=approve; e.rejected=!approve;
  persistHR(); renderEquipa(); updateBadges();
  showToast(approve?'✓ Saída antecipada aprovada!':'Pedido recusado.', approve?'success':'error');
}

// ── Exceptional day hours modal ───────────────────────────
function openExceptionalHoursModal(dateStr){
  const existing = document.getElementById('exc-modal-overlay');
  if(existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'exc-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(10,8,6,.88);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center';
  overlay.innerHTML = `
    <div style="background:var(--s1);border:1px solid var(--gold);border-radius:24px 24px 0 0;width:100%;padding:0 0 calc(env(safe-area-inset-bottom)+16px);animation:slideUp .25s cubic-bezier(.4,0,.2,1)">
      <div style="width:36px;height:4px;background:var(--border2);border-radius:2px;margin:12px auto 16px"></div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--gold2);padding:0 18px 16px;border-bottom:1px solid var(--border)">⭐ Dia Excecional — ${fmtD(dateStr)}</div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:12px">
        <div style="background:var(--gold-d);border:1px solid var(--gold);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--gold2)">
          ⭐ Este é um dia excecional de trabalho. As horas registadas contam como horas extra.
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Horas trabalhadas</label>
          <input id="exc-hours" type="number" inputmode="decimal" step="0.5" min="0.5" max="24" placeholder="Ex: 8"
            style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--gold2);font-family:'DM Mono',monospace;font-size:22px;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Nota (opcional)</label>
          <input id="exc-note" type="text" placeholder="Ex: evento especial"
            style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <button id="exc-save" style="width:100%;padding:15px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#100e0c;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;cursor:pointer">Registar Horas Extra</button>
        <button id="exc-cancel" style="width:100%;padding:11px;border-radius:12px;background:none;border:1px solid var(--border2);color:var(--text2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer">Cancelar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){
    if(e.target.id==='exc-cancel'||e.target===overlay){ overlay.remove(); return; }
    if(e.target.id!=='exc-save') return;
    const hours = parseFloat(document.getElementById('exc-hours').value);
    const note  = (document.getElementById('exc-note').value||'').trim();
    if(!hours||hours<=0){ showToast('Introduz um número de horas válido.','error'); return; }
    const hr = getHR(hrStaff);
    const autoApprove = currentRole==='owner';
    hr.hours.unshift({id:Date.now()+'',date:dateStr,total:hours,note:note||'Dia excecional',approved:autoApprove,rejected:false,exceptional:true});
    persistHR(); overlay.remove(); renderEquipa(); updateBadges();
    showToast(autoApprove?'✓ Horas extra registadas!':'🟡 Submetido para aprovação!','success');
  });
}

function isWithin24h(dateStr){
  const d = new Date(dateStr + 'T23:59:59');
  const diff = (new Date() - d) / 1000 / 3600;
  return diff <= 24;
}

function openAddHoursModal(){
  const isOwner = currentRole === 'owner';
  const defaultDate = new Date().toISOString().slice(0,10);

  // Build inline modal — no prompt() which blocks iOS
  const existing = document.getElementById('hours-modal-overlay');
  if(existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'hours-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(10,8,6,.88);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center';

  overlay.innerHTML = `
    <div style="background:var(--s1);border:1px solid var(--border2);border-radius:24px 24px 0 0;width:100%;padding:0 0 calc(env(safe-area-inset-bottom)+16px);animation:slideUp .25s cubic-bezier(.4,0,.2,1)">
      <div style="width:36px;height:4px;background:var(--border2);border-radius:2px;margin:12px auto 16px"></div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--gold2);padding:0 18px 16px;border-bottom:1px solid var(--border)">Registar Horas</div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Data</label>
          <input id="hm-date" type="date" value="${defaultDate}" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Total de horas</label>
          <input id="hm-total" type="number" inputmode="decimal" step="0.5" min="0.5" max="24" placeholder="Ex: 8" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--gold2);font-family:'DM Mono',monospace;font-size:22px;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Nota (opcional)</label>
          <input id="hm-note" type="text" placeholder="Ex: evento especial" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <button id="hm-save" style="width:100%;padding:15px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#100e0c;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;cursor:pointer">Guardar</button>
        <button id="hm-cancel" style="width:100%;padding:11px;border-radius:12px;background:none;border:1px solid var(--border2);color:var(--text2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer">Cancelar</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e){
    if(e.target.id === 'hm-cancel' || e.target === overlay){ overlay.remove(); return; }
    if(e.target.id !== 'hm-save') return;

    const dateVal  = document.getElementById('hm-date').value;
    const totalVal = parseFloat(document.getElementById('hm-total').value);
    const noteVal  = (document.getElementById('hm-note').value||'').trim();

    if(!dateVal){ showToast('Seleciona uma data.','error'); return; }
    if(!totalVal||totalVal<=0){ showToast('Introduz um número de horas válido.','error'); return; }

    const parsedDate = dateVal; // already YYYY-MM-DD from date input
    if(!isOwner && !isWithin24h(parsedDate)){
      showToast('Só podes registar horas das últimas 24h.','error'); return;
    }

    const hr = getHR(hrStaff);
    const autoApprove = isOwner;
    hr.hours.unshift({id:Date.now()+'',date:parsedDate,total:totalVal,note:noteVal,approved:autoApprove,rejected:false});
    persistHR();
    overlay.remove();
    renderEquipa();
    updateBadges();
    showToast(autoApprove ? '✓ Horas registadas e aprovadas!' : '✓ Horas submetidas para aprovação!','success');
  });
}

function approveHours(name,id,approve){
  const hr=getHR(name);
  const h=hr.hours.find(x=>x.id===id); if(!h) return;
  h.approved=approve; h.rejected=!approve;
  persistHR(); renderEquipa(); updateBadges();
  showToast(approve?'✓ Horas aprovadas!':'Horas recusadas.', approve?'success':'error');
}

function deleteHours(name,id){
  const hr=getHR(name);
  const h=hr.hours.find(x=>x.id===id); if(!h) return;
  if(currentRole!=='owner' && !isWithin24h(h.date)){
    showToast('Bloqueado — pede à Sónia para apagar registos antigos.','error'); 
    return;
  }
  if(!confirm('Apagar este registo?')) return;
  hr.hours=hr.hours.filter(x=>x.id!==id);
  persistHR(); renderEquipa();
}

// ── FÉRIAS ───────────────────────────────────────────────
function renderFeriasTab(hr, isOwner){
  const year=hrCalYear;
  const approved    = hr.vacations.filter(v=>v.status==='approved').flatMap(v=>v.dates);
  const pendingVac  = hr.vacations.filter(v=>v.status==='pending').flatMap(v=>v.dates);
  const totalDays   = hr.vacationDays||22;
  const usedDays    = approved.filter(d=>d.startsWith(year+'')).length;
  const remainDays  = totalDays-usedDays;

  // Folgas
  const approvedComps = (hr.compensations||[]).filter(c=>c.status==='approved');
  const pendingComps  = (hr.compensations||[]).filter(c=>c.status==='pending');
  const balance       = calcHourBalance(hr);

  let html=`
    <div class="grid3" style="margin-bottom:12px">
      <div class="card gold"><div class="card-label">Férias</div><div class="card-val">${remainDays}d</div><div class="card-sub">de ${totalDays} disponíveis</div></div>
      <div class="card ${balance>=0?'green':'red'}"><div class="card-label">Saldo horas</div><div class="card-val">${balance>=0?'+':''}${balance}h</div><div class="card-sub">para folgas</div></div>
      <div class="card blue"><div class="card-label">Folgas</div><div class="card-val">${approvedComps.length}</div><div class="card-sub">aprovadas</div></div>
    </div>`;

  if(isOwner){
    html+=`<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
      <span style="font-size:11px;color:var(--text2);font-weight:700">Dias de férias:</span>
      <input type="number" value="${totalDays}" min="0" max="60"
        style="width:60px;background:var(--s2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:'DM Mono',monospace;font-size:14px;padding:6px;outline:none;text-align:center"
        onchange="setVacationDays('${hrStaff}',this.value)"/>
    </div>`;
  }

  // Folga mode banner
  if(hrFolgaMode && !isOwner){
    html+=`<div style="background:rgba(74,144,217,.15);border:1px solid #4a90d9;border-radius:12px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:#4a90d9;margin-bottom:4px">🌙 Seleciona o dia de folga</div>
      <div style="font-size:11px;color:var(--text2)">Só dias de trabalho (Seg/Ter/Qua/Sex) estão disponíveis</div>
      <button data-action="cancel-folga" style="margin-top:8px;padding:6px 12px;background:none;border:1px solid var(--border2);border-radius:8px;color:var(--text2);font-family:'Syne',sans-serif;font-size:11px;font-weight:700;cursor:pointer">✕ Cancelar</button>
    </div>`;
  }

  // Year nav
  html+=`<div class="cal-month-nav">
    <button class="cal-nav-btn" id="cal-prev">‹</button>
    <div class="cal-month-lbl">${year}</div>
    <button class="cal-nav-btn" id="cal-next">›</button>
  </div>`;

  // Build lookup maps for fast access
  const folgaByDate = {};
  approvedComps.forEach(c=>{ folgaByDate[c.date]={...c,approved:true}; });
  pendingComps.forEach(c=>{ if(!folgaByDate[c.date]) folgaByDate[c.date]={...c,approved:false}; });

  // 12 month calendar
  for(let m=0;m<12;m++){
    const mDate=new Date(year,m,1);
    const mName=mDate.toLocaleDateString('pt-PT',{month:'long'});
    html+=`<div style="margin-bottom:14px">
      <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);margin-bottom:6px">${mName}</div>
      <div class="cal-grid">`;
    ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].forEach(d=>{ html+=`<div class="cal-day-name">${d}</div>`; });
    const firstDay=(mDate.getDay()+6)%7;
    for(let i=0;i<firstDay;i++) html+=`<div class="cal-day empty"></div>`;
    const daysInMonth=new Date(year,m+1,0).getDate();
    for(let d=1;d<=daysInMonth;d++){
      const ds       = year+'-'+(m+1).toString().padStart(2,'0')+'-'+d.toString().padStart(2,'0');
      const isToday  = ds===today();
      const isVacApp = approved.includes(ds);
      const isVacPend= pendingVac.includes(ds);
      const folga    = folgaByDate[ds];
      const wday     = new Date(ds+'T12:00:00').getDay();
      const isWork   = WORK_DAYS.includes(wday);
      const isVacOk  = VACATION_DAYS.includes(wday);
      const holiday  = isHoliday(ds, year);
      const exceptional = isExceptionalDay(ds);
      // Closed days: Thu(4) + Sun(0) unless exceptional
      const isClosed = (wday===0 || wday===4) && !exceptional;
      // Effectively open for vacations: vacation day OR exceptional, and not a holiday (unless exceptional)
      const vacOkFinal = (isVacOk || exceptional) && (!holiday || exceptional);

      let cls='', style='', label=String(d), title='', dataAttrs='';

      if(folga){
        const ft=FOLGA_TYPES[folga.type]||FOLGA_TYPES.full;
        style=`background:${ft.colorD};border:2px solid ${ft.color};opacity:${folga.approved?'1':'0.6'}`;
        cls='cal-day'; title=ft.emoji+' '+ft.label+(folga.approved?' (aprovado)':' (pendente)');
      } else if(isVacApp){
        cls='cal-day vacation-approved'; title='Férias aprovadas';
      } else if(isVacPend){
        cls='cal-day vacation-pending'; title='Férias pendentes';
      } else if(isToday){
        cls='cal-day today-d';
        if(exceptional) label='⭐'+d;
        if(holiday && !exceptional) style='opacity:0.35'; title='Feriado';
      } else if(exceptional){
        // Exceptional day (owner unlocked Thu/Sun/holiday) — show with star
        cls='cal-day'; style='background:rgba(245,200,66,.15);border:2px solid var(--gold);cursor:pointer';
        label='⭐'+d; title='Dia excecional — clica para registar horas';
        if(!isOwner) dataAttrs=`data-exceptional="${ds}" data-staff="${hrStaff}"`;
        else dataAttrs=`data-toggle-exceptional="${ds}"`;
      } else if(holiday){
        // Public holiday — blocked for staff, owner can unlock
        cls='cal-day normal'; style='opacity:0.35;cursor:'+(isOwner?'pointer':'default');
        label='🔒'+d; title='Feriado'+(isOwner?' (toca para desbloquear)':'');
        if(isOwner) dataAttrs=`data-toggle-exceptional="${ds}"`;
      } else if(isClosed){
        // Thu or Sun (closed) — owner can unlock
        cls='cal-day normal'; style='opacity:0.25;cursor:'+(isOwner?'pointer':'default');
        title='Dia encerrado'+(isOwner?' (toca para marcar como excecional)':'');
        if(isOwner) dataAttrs=`data-toggle-exceptional="${ds}"`;
      } else if(hrFolgaMode && isWork && !isOwner){
        cls='cal-day'; style='background:rgba(74,144,217,.08);border:1px solid rgba(74,144,217,.4);cursor:pointer';
        title='Tocar para pedir folga'; dataAttrs=`data-folga-date="${ds}"`;
      } else if(hrFolgaMode){
        cls='cal-day normal'; style='opacity:0.25';
      } else {
        cls='cal-day normal'; style=vacOkFinal?'':'opacity:0.25';
        if(!hrFolgaMode && vacOkFinal && !folga && !isVacApp && !isVacPend)
          dataAttrs=`data-date="${ds}" data-staff="${hrStaff}"`;
      }

      html+=`<div class="${cls}" ${dataAttrs} style="${style}" title="${title}">${label}</div>`;
    }
    html+=`</div></div>`;
  }

  // Legend
  html+=`<div class="cal-legend" style="flex-wrap:wrap;gap:8px;margin-bottom:12px">
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(107,191,142,.3);border:1px solid var(--green)"></div>Férias</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(74,144,217,.3);border:2px solid #4a90d9"></div>🔵 Folga dia (8h)</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(155,89,182,.3);border:2px solid #9b59b6"></div>🟣 Manhã (3h)</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(230,126,34,.3);border:2px solid #e67e22"></div>🟠 Tarde (5h)</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(245,200,66,.15);border:2px solid var(--gold)"></div>⭐ Excecional</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="opacity:0.35;background:var(--s2);border:1px solid var(--border)"></div>🔒 Feriado/Encerrado</div>
    ${isOwner?'<div style="font-size:10px;color:var(--text2);width:100%;margin-top:4px">💡 Toca em dias encerrados/feriados para os tornar excecionais</div>':''}
  </div>`;

  // Pending vacation approvals (owner)
  const pendingVacs=hr.vacations.filter(v=>v.status==='pending');
  if(isOwner&&pendingVacs.length){
    html+=`<div class="sec-title" style="margin-top:16px">🟡 Pedidos de Férias Pendentes</div>`;
    pendingVacs.forEach(v=>{
      html+=`<div class="hr-card" style="margin-bottom:8px">
        <div class="hr-card-header">
          <div>
            <div style="font-size:13px;font-weight:700">${v.dates.length} dia${v.dates.length!==1?'s':''}</div>
            <div style="font-size:11px;color:var(--text2)">${v.dates.map(d=>fmtD(d)).join(', ')}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="hr-approve-btn approve" data-action="approve-vac" data-id="${v.id}" data-staff="${hrStaff}">✓ Aprovar</button>
          <button class="hr-approve-btn reject" data-action="reject-vac" data-id="${v.id}" data-staff="${hrStaff}">✕ Recusar</button>
        </div>
      </div>`;
    });
  }

  // Pending folga approvals (owner)
  if(isOwner&&pendingComps.length){
    html+=`<div class="sec-title" style="margin-top:16px">🟡 Pedidos de Folga Pendentes</div>`;
    pendingComps.forEach(c=>{
      const ft=FOLGA_TYPES[c.type]||FOLGA_TYPES.full;
      html+=`<div class="hr-card" style="margin-bottom:8px;border-color:${ft.color}">
        <div class="hr-card-header">
          <div>
            <div style="font-size:13px;font-weight:700">${ft.emoji} ${ft.label} — ${fmtD(c.date)}</div>
            <div style="font-size:11px;color:var(--text2)">Desconta ${c.hours}h do saldo</div>
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:15px;color:${ft.color}">-${c.hours}h</div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="hr-approve-btn approve" data-action="approve-comp" data-id="${c.id}" data-staff="${hrStaff}">✓ Aprovar</button>
          <button class="hr-approve-btn reject" data-action="reject-comp" data-id="${c.id}" data-staff="${hrStaff}">✕ Recusar</button>
        </div>
      </div>`;
    });
  }

  html+=`<div id="cal-event-target" style="display:none"></div>`;
  return html;
}

// Folga type picker — shows inline after clicking a workday in folga mode
function showFolgaTypePicker(dateStr){
  const balance = calcHourBalance(getHR(hrStaff));
  // Build a small inline picker overlay
  const existing = document.getElementById('folga-picker-overlay');
  if(existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'folga-picker-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(10,8,6,.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px';

  const box = document.createElement('div');
  box.style.cssText = 'background:var(--s1);border:1px solid var(--border2);border-radius:20px;padding:22px;width:100%;max-width:320px';

  const types = Object.entries(FOLGA_TYPES).filter(([,ft])=>balance>=ft.hours);
  if(!types.length){
    box.innerHTML=`<div style="text-align:center;padding:10px">
      <div style="font-size:24px;margin-bottom:8px">😔</div>
      <div style="font-size:14px;font-weight:700;color:var(--text)">Saldo insuficiente</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Tens ${balance}h — mínimo necessário é 3h (manhã)</div>
      <button id="fp-cancel" style="margin-top:14px;padding:10px 20px;background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;width:100%">Fechar</button>
    </div>`;
  } else {
    const dayLabel = fmtD(dateStr);
    box.innerHTML=`
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;color:var(--gold2);margin-bottom:4px">Folga em ${dayLabel}</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:16px">Saldo disponível: ${balance}h — escolhe o tipo:</div>
      ${types.map(([type,ft])=>`
        <button data-fp-type="${type}" style="width:100%;margin-bottom:8px;padding:13px 14px;border-radius:12px;background:${ft.colorD};border:2px solid ${ft.color};color:${ft.color};font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;display:flex;justify-content:space-between;align-items:center">
          <span>${ft.emoji} ${ft.label}</span>
          <span style="font-family:'DM Mono',monospace;font-size:12px;opacity:.8">-${ft.hours}h</span>
        </button>`).join('')}
      <button id="fp-cancel" style="width:100%;padding:10px;background:none;border:1px solid var(--border2);border-radius:10px;color:var(--text2);font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;margin-top:4px">Cancelar</button>`;
  }

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Event listener on overlay
  overlay.addEventListener('click', function(e){
    if(e.target.id==='fp-cancel'||e.target===overlay){ overlay.remove(); return; }
    const btn = e.target.closest('[data-fp-type]');
    if(btn){ overlay.remove(); requestFolga(dateStr, btn.dataset.fpType); }
  });
}

function toggleVacationDay(name, dateStr){
  const hr=getHR(name);
  const existing=hr.vacations.find(v=>v.dates.includes(dateStr));
  if(existing){
    if(existing.status==='approved' && currentRole!=='owner'){
      showToast('Férias aprovadas — contacta a Sónia para alterar.','error'); return;
    }
    // Remove the day (any role can remove pending, owner can remove approved)
    existing.dates=existing.dates.filter(d=>d!==dateStr);
    if(!existing.dates.length) hr.vacations=hr.vacations.filter(v=>v.id!==existing.id);
    persistHR(); renderEquipa();
    showToast('Dia removido.','success');
    return;
  }
  // Add day — owner: approved immediately. Staff: pending approval
  const autoApprove = currentRole==='owner';
  hr.vacations.push({id:Date.now()+'',dates:[dateStr],status:autoApprove?'approved':'pending',note:''});
  persistHR(); renderEquipa(); updateBadges();
  showToast(autoApprove?'✓ Férias aprovadas!':'🟡 Pedido enviado para aprovação!','success');
}

function approveVacation(name,id,approve){
  const hr=getHR(name);
  const v=hr.vacations.find(x=>x.id===id); if(!v) return;
  v.status=approve?'approved':'rejected';
  persistHR(); renderEquipa(); updateBadges();
  showToast(approve?'✓ Férias aprovadas! 🌴':'Férias recusadas.', approve?'success':'error');
}

function setVacationDays(name, val){
  const hr=getHR(name);
  hr.vacationDays=parseInt(val)||22;
  persistHR(); renderEquipa();
}

// ── FORMAÇÃO ─────────────────────────────────────────────
function renderFormacaoTab(hr, isOwner){
  const year=new Date().getFullYear();
  const totalAllowed=hr.trainingHoursTotal||40;
  const yearTraining=hr.training.filter(t=>t.date.startsWith(year+''));
  const usedHours=yearTraining.reduce((a,t)=>a+t.hours,0);
  const remainHours=totalAllowed-usedHours;

  let html=`
    <div class="grid3" style="margin-bottom:12px">
      <div class="card gold"><div class="card-label">Total Ano</div><div class="card-val">${totalAllowed}h</div></div>
      <div class="card green"><div class="card-label">Realizadas</div><div class="card-val">${usedHours}h</div></div>
      <div class="card ${remainHours<5?'red':'blue'}"><div class="card-label">Restam</div><div class="card-val">${remainHours}h</div></div>
    </div>`;

  if(isOwner){
    html+=`<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
      <span style="font-size:11px;color:var(--text2);font-weight:700">Horas anuais:</span>
      <input type="number" value="${totalAllowed}" min="0" max="200" style="width:60px;background:var(--s2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:'DM Mono',monospace;font-size:14px;padding:6px;outline:none;text-align:center" onchange="setTrainingHours('${hrStaff}',this.value)"/>
    </div>`;
  }

  // Progress bar
  const pct=totalAllowed>0?Math.min(Math.round(usedHours/totalAllowed*100),100):0;
  html+=`<div class="goal-wrap" style="margin-bottom:14px">
    <div class="goal-header"><div class="goal-title">Progresso ${year}</div><div class="goal-pct">${pct}%</div></div>
    <div class="goal-bar"><div class="goal-fill ${pct>=100?'over':''}" style="width:${pct}%"></div></div>
    <div class="goal-nums"><span>${usedHours}h realizadas</span><span>Meta: ${totalAllowed}h</span></div>
  </div>`;

  html+=`<button class="hr-add-btn" data-action="add-training">+ Registar Formação</button>`;

  if(!hr.training.length){
    html+=`<div class="empty-state"><div class="empty-icon">📚</div>Sem formações registadas.</div>`;
  } else {
    hr.training.sort((a,b)=>b.date.localeCompare(a.date)).forEach(t=>{
      html+=`<div class="formacao-item">
        <div class="formacao-header">
          <div><div class="formacao-name">${t.name}</div><div class="formacao-meta">${fmtD(t.date)}</div></div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="formacao-hours">${t.hours}h</div>
            <button class="formacao-del" data-action="del-training" data-id="${t.id}" data-staff="${hrStaff}">🗑</button>
          </div>
        </div>
      </div>`;
    });
  }
  return html;
}

function openAddTrainingModal(){
  const defaultDate = new Date().toISOString().slice(0,10);
  const existing = document.getElementById('training-modal-overlay');
  if(existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'training-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(10,8,6,.88);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center';

  overlay.innerHTML = `
    <div style="background:var(--s1);border:1px solid var(--border2);border-radius:24px 24px 0 0;width:100%;padding:0 0 calc(env(safe-area-inset-bottom)+16px);animation:slideUp .25s cubic-bezier(.4,0,.2,1)">
      <div style="width:36px;height:4px;background:var(--border2);border-radius:2px;margin:12px auto 16px"></div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--gold2);padding:0 18px 16px;border-bottom:1px solid var(--border)">Registar Formação</div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Nome da formação</label>
          <input id="tm-name" type="text" placeholder="Ex: Curso de Manicure" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Horas de formação</label>
          <input id="tm-hours" type="number" inputmode="decimal" step="0.5" min="0.5" placeholder="Ex: 8" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--gold2);font-family:'DM Mono',monospace;font-size:22px;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2)">Data</label>
          <input id="tm-date" type="date" value="${defaultDate}" style="background:var(--s2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;padding:12px 14px;width:100%;outline:none"/>
        </div>
        <button id="tm-save" style="width:100%;padding:15px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#100e0c;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;cursor:pointer">Guardar</button>
        <button id="tm-cancel" style="width:100%;padding:11px;border-radius:12px;background:none;border:1px solid var(--border2);color:var(--text2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer">Cancelar</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e){
    if(e.target.id==='tm-cancel'||e.target===overlay){ overlay.remove(); return; }
    if(e.target.id !== 'tm-save') return;
    const name  = (document.getElementById('tm-name').value||'').trim();
    const hours = parseFloat(document.getElementById('tm-hours').value);
    const date  = document.getElementById('tm-date').value;
    if(!name){ showToast('Introduz o nome da formação.','error'); return; }
    if(!hours||hours<=0){ showToast('Introduz um número de horas válido.','error'); return; }
    if(!date){ showToast('Seleciona uma data.','error'); return; }
    const hr = getHR(hrStaff);
    hr.training.unshift({id:Date.now()+'',name,hours,date});
    persistHR();
    overlay.remove();
    renderEquipa();
    showToast('✓ Formação registada!','success');
  });
}

function deleteTraining(name,id){
  if(!confirm('Apagar esta formação?')) return;
  const hr=getHR(name);
  hr.training=hr.training.filter(x=>x.id!==id);
  persistHR(); renderEquipa();
}

function setTrainingHours(name,val){
  const hr=getHR(name);
  hr.trainingHoursTotal=parseInt(val)||40;
  persistHR(); renderEquipa();
}