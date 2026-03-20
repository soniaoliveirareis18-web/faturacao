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
  if(!hrStaff) hrStaff = staff[0]||'';
  const wrap = document.getElementById('equipa-content');
  if(!wrap) return;

  const isOwner = currentRole==='owner';
  const visibleStaff = isOwner ? staff : [currentUser];
  if(!isOwner) hrStaff = currentUser;

  wrap.innerHTML = `
    ${isOwner ? `<div class="hr-staff-picker" id="hr-staff-picker"></div>` : `<div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--gold2);margin-bottom:16px">${currentUser}</div>`}
    <div class="hr-tabs">
      <button class="hr-tab ${hrTab==='horas'?'active':''}" onclick="setHRTab('horas')">⏱ Horas</button>
      <button class="hr-tab ${hrTab==='ferias'?'active':''}" onclick="setHRTab('ferias')">🌴 Férias</button>
      <button class="hr-tab ${hrTab==='formacao'?'active':''}" onclick="setHRTab('formacao')">📚 Formação</button>
    </div>
    <div id="hr-tab-content"></div>`;

  if(isOwner){
    const picker=document.getElementById('hr-staff-picker');
    if(picker){
      picker.innerHTML=visibleStaff.map(s=>`<button class="hr-staff-btn ${s===hrStaff?'active':''}" onclick="setHRStaff('${s}')">${s}</button>`).join('');
    }
  }
  renderHRTab();
}

function setHRTab(t){ hrTab=t; renderEquipa(); }
function setHRStaff(s){ hrStaff=s; renderEquipa(); }

function renderHRTab(){
  const wrap=document.getElementById('hr-tab-content'); if(!wrap) return;
  const hr=getHR(hrStaff);
  const isOwner=currentRole==='owner';

  if(hrTab==='horas')    wrap.innerHTML=renderHorasTab(hr, isOwner);
  if(hrTab==='ferias'){
    wrap.innerHTML=renderFeriasTab(hr, isOwner);
    // Attach single event listener for entire calendar (avoids 365 onclick handlers)
    wrap.addEventListener('click', function calHandler(e){
      // Calendar day click
      const day = e.target.closest('.cal-day[data-date]');
      if(day && !day.classList.contains('empty')){
        toggleVacationDay(day.dataset.staff, day.dataset.date);
        return;
      }
      // Nav buttons
      if(e.target.id==='cal-prev'){ hrCalYear--; renderEquipa(); return; }
      if(e.target.id==='cal-next'){ hrCalYear++; renderEquipa(); return; }
    }, {once: true});
  }
  if(hrTab==='formacao') wrap.innerHTML=renderFormacaoTab(hr, isOwner);
}

// ── HORAS ────────────────────────────────────────────────
function calcHourBalance(hr){
  // Total approved hours worked
  const worked = hr.hours.filter(h=>h.approved).reduce((a,h)=>a+h.total,0);
  // Total hours deducted via approved compensations
  const deducted = (hr.compensations||[]).filter(c=>c.status==='approved').reduce((a,c)=>a+c.hours,0);
  return Math.round((worked - deducted)*10)/10;
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

  html += `<div style="display:flex;gap:8px;margin-bottom:10px">
    <button class="hr-add-btn" style="flex:1;margin-bottom:0" onclick="openAddHoursModal()">+ Registar Horas</button>
    ${balance>0?`<button class="hr-add-btn" style="flex:1;margin-bottom:0;border-color:var(--blue);color:var(--blue);background:var(--blue-d)" onclick="openCompensationModal()">🌙 Pedir Folga</button>`:''}
  </div>`;

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
          <button class="hr-approve-btn approve" onclick="approveCompensation('${hrStaff}','${c.id}',true)">✓ Aprovar</button>
          <button class="hr-approve-btn reject" onclick="approveCompensation('${hrStaff}','${c.id}',false)">✕ Recusar</button>
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
            <button class="hr-approve-btn approve" onclick="approveHours('${hrStaff}','${h.id}',true)">✓ Aprovar</button>
            <button class="hr-approve-btn reject" onclick="approveHours('${hrStaff}','${h.id}',false)">✕ Recusar</button>
            <button onclick="deleteHours('${hrStaff}','${h.id}')" style="margin-left:auto;background:none;border:none;color:var(--text3);cursor:pointer;font-size:12px">🗑</button>
          </div>`:''}
          ${isOwner&&(h.approved||h.rejected)?`<button onclick="deleteHours('${hrStaff}','${h.id}')" style="margin-top:6px;background:none;border:none;color:var(--text3);cursor:pointer;font-size:11px">🗑 Apagar</button>`:''}
          ${!isOwner&&!isWithin24h(h.date)?`<div style="font-size:10px;color:var(--text3);margin-top:6px">🔒 Bloqueado — pede à Sónia para editar</div>`:''}
        </div>`;
      });
    });
  }
  return html;
}

function openCompensationModal(){
  const hr=getHR(hrStaff);
  const balance=calcHourBalance(hr);
  if(balance<=0){ showToast('Sem saldo de horas extra.','error'); return; }
  const type=confirm('Dia completo? OK = Dia completo | Cancelar = Meio-dia')?'full':'half';
  const hours=type==='full'?8:4;
  if(balance<hours){ showToast(`Saldo insuficiente (${balance}h disponíveis, precisas de ${hours}h).`,'error'); return; }
  const dateRaw=prompt('Data da folga (DD/MM/AAAA):'); if(!dateRaw) return;
  const note=prompt('Nota (opcional):')||'';
  const comp={id:Date.now()+'',date:parseDate(dateRaw),type,hours,note,status:'pending'};
  hr.compensations=hr.compensations||[];
  hr.compensations.push(comp);
  persistHR(); renderEquipa();
  showToast('🟡 Pedido de folga enviado para aprovação!','success');
}

function approveCompensation(name,id,approve){
  const hr=getHR(name);
  const c=(hr.compensations||[]).find(x=>x.id===id); if(!c) return;
  c.status=approve?'approved':'rejected';
  persistHR(); renderEquipa(); updateBadges();
  showToast(approve?'✓ Folga aprovada! 🌙':'Pedido recusado.', approve?'success':'error');
}

function isWithin24h(dateStr){
  const d = new Date(dateStr + 'T23:59:59');
  const diff = (new Date() - d) / 1000 / 3600;
  return diff <= 24;
}

function openAddHoursModal(){
  const isOwner = currentRole === 'owner';
  // Staff can only register today or yesterday (within 24h)
  const defaultDate = new Date().toLocaleDateString('pt-PT');
  const date = prompt('Data (DD/MM/AAAA):', defaultDate);
  if(!date) return;
  const parsedDate = parseDate(date);
  if(!isOwner && !isWithin24h(parsedDate)){
    alert('Só podes registar horas das últimas 24h.\nPara datas anteriores, pede à Sónia.');
    return;
  }
  const total=parseFloat(prompt('Total de horas trabalhadas:'));
  if(!total||total<=0){ alert('Horas inválidas.'); return; }
  const note=prompt('Nota (opcional):')||'';
  const hr=getHR(hrStaff);
  hr.hours.unshift({id:Date.now()+'',date:parsedDate,total,note,approved:false,rejected:false});
  persistHR(); renderEquipa();
  showToast('✓ Horas submetidas para aprovação!','success');
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
    alert('Não podes apagar registos com mais de 24h.\nPede à Sónia para o fazer.');
    return;
  }
  if(!confirm('Apagar este registo?')) return;
  hr.hours=hr.hours.filter(x=>x.id!==id);
  persistHR(); renderEquipa();
}

// ── FÉRIAS ───────────────────────────────────────────────
function renderFeriasTab(hr, isOwner){
  const year=hrCalYear;
  const approved=hr.vacations.filter(v=>v.status==='approved').flatMap(v=>v.dates);
  const pending =hr.vacations.filter(v=>v.status==='pending').flatMap(v=>v.dates);
  const totalDays=hr.vacationDays||22;
  const usedDays =approved.filter(d=>d.startsWith(year+'')).length;
  const remainDays=totalDays-usedDays;

  let html=`
    <div class="grid3" style="margin-bottom:12px">
      <div class="card gold"><div class="card-label">Direito</div><div class="card-val">${totalDays}d</div></div>
      <div class="card green"><div class="card-label">Aprovados</div><div class="card-val">${usedDays}d</div></div>
      <div class="card ${remainDays<5?'red':'blue'}"><div class="card-label">Restam</div><div class="card-val">${remainDays}d</div></div>
    </div>`;

  if(isOwner){
    html+=`<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
      <span style="font-size:11px;color:var(--text2);font-weight:700">Dias de férias:</span>
      <input type="number" value="${totalDays}" min="0" max="60" style="width:60px;background:var(--s2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:'DM Mono',monospace;font-size:14px;padding:6px;outline:none;text-align:center" onchange="setVacationDays('${hrStaff}',this.value)"/>
    </div>`;
  }

  // Year calendar
  html+=`<div class="cal-month-nav">
    <button class="cal-nav-btn" id="cal-prev">‹</button>
    <div class="cal-month-lbl">${year}</div>
    <button class="cal-nav-btn" id="cal-next">›</button>
  </div>`;

  // All 12 months mini calendar
  for(let m=0;m<12;m++){
    const mDate=new Date(year,m,1);
    const mName=mDate.toLocaleDateString('pt-PT',{month:'long'});
    html+=`<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);margin-bottom:6px">${mName}</div>`;
    html+=`<div class="cal-grid">`;
    ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].forEach(d=>{ html+=`<div class="cal-day-name">${d}</div>`; });
    const firstDay=(mDate.getDay()+6)%7;
    for(let i=0;i<firstDay;i++) html+=`<div class="cal-day empty"></div>`;
    const daysInMonth=new Date(year,m+1,0).getDate();
    for(let d=1;d<=daysInMonth;d++){
      const dateStr=year+'-'+(m+1).toString().padStart(2,'0')+'-'+d.toString().padStart(2,'0');
      const isToday=dateStr===today();
      const isApproved=approved.includes(dateStr);
      const isPending=pending.includes(dateStr);
      const vac=hr.vacations.find(v=>v.dates.includes(dateStr));
      const cls=isToday?'today-d':isApproved?'vacation-approved':isPending?'vacation-pending':'normal';
      html+=`<div class="cal-day ${cls}" data-date="${dateStr}" data-staff="${hrStaff}" title="${isApproved?'Aprovado':isPending?'Pendente':'Clica para pedir'}">${d}</div>`;
    }
    html+=`</div></div>`;
  }

  html+=`<div class="cal-legend">
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(107,191,142,.3);border:1px solid var(--green)"></div>Aprovado</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(255,201,71,.2);border:1px solid #ffc947"></div>Pendente</div>
    <div class="cal-legend-item"><div class="cal-legend-dot" style="background:rgba(224,92,92,.2);border:1px solid var(--red)"></div>Recusado</div>
  </div>`;

  html += `<div id="cal-event-target" style="display:none"></div>`;

  // Pending approvals (owner only)
  const pendingVacs=hr.vacations.filter(v=>v.status==='pending');
  if(isOwner&&pendingVacs.length){
    html+=`<div class="sec-title" style="margin-top:16px">🟡 Pedidos Pendentes</div>`;
    pendingVacs.forEach(v=>{
      html+=`<div class="hr-card" style="margin-bottom:8px">
        <div class="hr-card-header">
          <div><div style="font-size:13px;font-weight:700">${v.dates.length} dia${v.dates.length!==1?'s':''}</div>
          <div style="font-size:11px;color:var(--text2)">${v.dates.map(d=>fmtD(d)).join(', ')}</div></div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="hr-approve-btn approve" onclick="approveVacation('${hrStaff}','${v.id}',true)">✓ Aprovar</button>
          <button class="hr-approve-btn reject" onclick="approveVacation('${hrStaff}','${v.id}',false)">✕ Recusar</button>
        </div>
      </div>`;
    });
  }
  return html;
}

function toggleVacationDay(name, dateStr){
  const hr=getHR(name);
  // Check if already in a vacation
  const existing=hr.vacations.find(v=>v.dates.includes(dateStr));
  if(existing){
    if(existing.status==='approved'&&currentRole!=='owner'){ showToast('Férias aprovadas — contacta a Sónia para alterar.','error'); return; }
    if(confirm('Remover este dia de férias?')){
      existing.dates=existing.dates.filter(d=>d!==dateStr);
      if(!existing.dates.length) hr.vacations=hr.vacations.filter(v=>v.id!==existing.id);
      persistHR(); renderEquipa();
    }
    return;
  }
  // Add new pending vacation day
  hr.vacations.push({id:Date.now()+'',dates:[dateStr],status:'pending',note:''});
  persistHR(); renderEquipa(); updateBadges();
  showToast('🟡 Pedido enviado para aprovação!','success');
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

  html+=`<button class="hr-add-btn" onclick="openAddTrainingModal()">+ Registar Formação</button>`;

  if(!hr.training.length){
    html+=`<div class="empty-state"><div class="empty-icon">📚</div>Sem formações registadas.</div>`;
  } else {
    hr.training.sort((a,b)=>b.date.localeCompare(a.date)).forEach(t=>{
      html+=`<div class="formacao-item">
        <div class="formacao-header">
          <div><div class="formacao-name">${t.name}</div><div class="formacao-meta">${fmtD(t.date)}</div></div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="formacao-hours">${t.hours}h</div>
            <button class="formacao-del" onclick="deleteTraining('${hrStaff}','${t.id}')">🗑</button>
          </div>
        </div>
      </div>`;
    });
  }
  return html;
}

function openAddTrainingModal(){
  const name=prompt('Nome da formação:'); if(!name) return;
  const hours=parseFloat(prompt('Horas de formação:')); if(!hours||hours<=0){ alert('Horas inválidas.'); return; }
  const dateRaw=prompt('Data (DD/MM/AAAA):', new Date().toLocaleDateString('pt-PT'));
  if(!dateRaw) return;
  const hr=getHR(hrStaff);
  hr.training.unshift({id:Date.now()+'',name:name.trim(),hours,date:parseDate(dateRaw)});
  persistHR(); renderEquipa();
  showToast('✓ Formação registada!','success');
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