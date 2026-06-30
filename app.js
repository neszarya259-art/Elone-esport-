/* ======================= ALONE ESPORT — CORE APP ======================= */

const DB_KEY = 'alone_esport_db_v1';

function uid(prefix){ return prefix + '_' + Math.random().toString(36).slice(2,9); }
function todayStr(){ return new Date().toISOString().slice(0,10); }

function seedDB(){
  return {
    guild: {
      name: 'ALONE ESPORT',
      tag: 'ALONE',
      description: 'Guild esport kompetitif yang dibangun atas dasar disiplin, kerja sama tim, dan rasa percaya. Kami berkompetisi untuk menang, dan berlatih untuk jadi lebih baik dari kemarin.',
      logo: '🎮',
      founded: '2021-08-17'
    },
    members: [
      { id: uid('m'), nama:'Arya', password:'1', role:'Owner', status:'Aktif', joined:'2021-08-17' },
      { id: uid('m'), nama:'Ipan', password:'1', role:'Owner', status:'Aktif', joined:'2021-08-17' },
      { id: uid('m'), nama:'Pian', password:'1', role:'Owner', status:'Aktif', joined:'2021-08-17' },
      { id: uid('m'), nama:'Reno', password:'reno123', role:'Admin', status:'Aktif', joined:'2022-01-10' },
      { id: uid('m'), nama:'Dimas', password:'dimas123', role:'Member', status:'Aktif', joined:'2022-03-02' },
      { id: uid('m'), nama:'Fajar', password:'fajar123', role:'Member', status:'Aktif', joined:'2022-05-19' },
      { id: uid('m'), nama:'Nadia', password:'nadia123', role:'Member', status:'Aktif', joined:'2022-07-22' },
      { id: uid('m'), nama:'Bagas', password:'bagas123', role:'Member', status:'Nonaktif', joined:'2023-01-05' },
    ],
    photos: [
      { id: uid('p'), title:'Juara Regional Cup', desc:'Momen angkat trofi setelah final.', url:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80', date: todayStr() },
      { id: uid('p'), title:'Bootcamp Squad', desc:'Sesi latihan intensif sebelum turnamen.', url:'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80', date: todayStr() },
      { id: uid('p'), title:'Gaming Setup', desc:'Setup gaming markas ALONE ESPORT.', url:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80', date: todayStr() },
    ],
    videos: [
      { id: uid('v'), title:'Highlight Final Match', desc:'Cuplikan pertandingan final musim ini.', type:'youtube', url:'https://www.youtube.com/embed/dQw4w9WgXcQ', date: todayStr() },
      { id: uid('v'), title:'Behind The Scenes', desc:'Keseharian tim di balik layar.', type:'youtube', url:'https://www.youtube.com/embed/dQw4w9WgXcQ', date: todayStr() },
    ],
    warnings: [],
    playlist: [
      { id: uid('s'), title:'Neon Drive', artist:'Synthwave Boy', url:'https://cdn.pixabay.com/audio/2022/03/15/audio_2dde668d05.mp3' },
      { id: uid('s'), title:'Night Run', artist:'Lo-Fi Lab', url:'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: uid('s'), title:'Cyber Pulse', artist:'Arcade Dreams', url:'https://cdn.pixabay.com/audio/2021/11/25/audio_00fa5b89dc.mp3' },
    ]
  };
}

function getDB(){
  let raw = localStorage.getItem(DB_KEY);
  if(!raw){
    const seeded = seedDB();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try{ return JSON.parse(raw); }catch(e){ const seeded = seedDB(); localStorage.setItem(DB_KEY, JSON.stringify(seeded)); return seeded; }
}
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

/* ---------------- Auth ---------------- */
const SESSION_KEY = 'alone_esport_session';
function getSession(){
  try{ return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); }catch(e){ return null; }
}
function setSession(member, remember){
  const payload = JSON.stringify({ id: member.id, nama: member.nama, role: member.role });
  sessionStorage.setItem(SESSION_KEY, payload);
  if(remember) localStorage.setItem(SESSION_KEY, payload);
  else localStorage.removeItem(SESSION_KEY);
}
function clearSession(){
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}
function requireAuth(){
  const s = getSession();
  if(!s){ window.location.href = 'index.html'; return null; }
  // sync session storage if only persisted in localStorage
  if(!sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}
function currentMember(){
  const s = getSession();
  if(!s) return null;
  const db = getDB();
  return db.members.find(m => m.id === s.id) || null;
}

/* ---------------- Toast ---------------- */
function ensureToastStack(){
  if(!document.getElementById('toast-stack')){
    const d = document.createElement('div');
    d.id = 'toast-stack';
    document.body.appendChild(d);
  }
}
function toast(msg, type='info'){
  ensureToastStack();
  const stack = document.getElementById('toast-stack');
  const el = document.createElement('div');
  el.className = `toast card ${type}`;
  const icon = type==='ok' ? '✅' : type==='err' ? '⚠️' : '✨';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .3s, transform .3s'; el.style.opacity='0'; el.style.transform='translateX(30px)'; setTimeout(()=>el.remove(), 300); }, 2800);
}

/* ---------------- Loading bar / page transition ---------------- */
function initLoadbar(){
  if(document.getElementById('loadbar')) return;
  const bar = document.createElement('div');
  bar.id = 'loadbar';
  document.body.appendChild(bar);
  requestAnimationFrame(()=>{ bar.style.width='70%'; });
  window.addEventListener('load', ()=>{ bar.style.width='100%'; setTimeout(()=>bar.style.opacity='0', 300); });
}
function navigateTo(url){
  const bar = document.getElementById('loadbar');
  if(bar){ bar.style.opacity='1'; bar.style.width='40%'; }
  document.body.style.transition='opacity .25s ease';
  document.body.style.opacity='0';
  setTimeout(()=>{ window.location.href = url; }, 200);
}

/* ---------------- Background + shell ---------------- */
function injectBackground(){
  if(!document.querySelector('.bg-field')){
    const f = document.createElement('div'); f.className='bg-field'; document.body.prepend(f);
  }
  if(!document.querySelector('.bg-grid')){
    const g = document.createElement('div'); g.className='bg-grid'; document.body.prepend(g);
  }
}

const NAV_ITEMS = [
  { href:'dashboard.html', label:'Dashboard', icon:'⌬' },
  { href:'anggota.html', label:'Anggota', icon:'👥' },
  { href:'admin.html', label:'Admin', icon:'🛡️' },
  { href:'foto.html', label:'Foto', icon:'🖼️' },
  { href:'video.html', label:'Video', icon:'🎬' },
  { href:'peringatan.html', label:'Peringatan', icon:'⚠️' },
  { href:'guild.html', label:'Guild', icon:'🏆' },
  { href:'settings.html', label:'Settings', icon:'⚙️' },
];

function buildShell(activeHref, pageTitle, pageSub){
  injectBackground();
  initLoadbar();
  const session = requireAuth();
  if(!session) return null;

  document.body.classList.add('page-fade');

  const shell = document.createElement('div');
  shell.className = 'app-shell';

  const isAdmin = session.role === 'Admin';
  const navHtml = NAV_ITEMS
    .filter(item => !isAdmin || ['dashboard.html','anggota.html','foto.html','video.html','peringatan.html','guild.html','settings.html'].includes(item.href))
    .map(item => `<a class="nav-link ${item.href===activeHref?'active':''}" href="${item.href}"><span>${item.icon}</span><span>${item.label}</span></a>`).join('');

  shell.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="brand">ALONE ESPORT<small>GUILD MANAGEMENT</small></div>
      ${navHtml}
      <div class="nav-spacer"></div>
      <a class="nav-link" href="#" id="logout-link"><span>⏻</span><span>Logout</span></a>
    </aside>
    <div class="main">
      <div class="topbar">
        <div style="display:flex; align-items:center; gap:14px;">
          <div class="hamburger" id="hamburger">☰</div>
          <div>
            <h1 class="page-title">${pageTitle}</h1>
            ${pageSub ? `<p class="page-sub">${pageSub}</p>` : ''}
          </div>
        </div>
        <div class="user-chip card">
          <div class="avatar">${session.nama.charAt(0).toUpperCase()}</div>
          <div>
            <div style="font-weight:700; font-size:.9rem;">${session.nama}</div>
            <div style="font-size:.72rem; color:var(--muted);">${session.role}</div>
          </div>
        </div>
      </div>
      <div id="page-content"></div>
    </div>
  `;
  document.body.appendChild(shell);

  document.getElementById('logout-link').addEventListener('click', (e)=>{
    e.preventDefault();
    clearSession();
    navigateTo('index.html');
  });
  const hb = document.getElementById('hamburger');
  if(hb) hb.addEventListener('click', ()=> document.getElementById('sidebar').classList.toggle('open'));

  initAudioPlayer();
  return session;
}

/* ---------------- Modal helper ---------------- */
function openModal(html, onMount){
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal card">${html}</div>`;
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeModal(); });
  document.body.appendChild(overlay);
  if(onMount) onMount(overlay);
}
function closeModal(){
  const el = document.getElementById('modal-overlay');
  if(el) el.remove();
}

function escapeHtml(str){
  return (str||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ======================= FLOATING AUDIO PLAYER ======================= */
let APState = { idx:0, playing:false };

function initAudioPlayer(){
  if(document.getElementById('audio-player')) return;
  const db = getDB();
  const playlist = db.playlist;
  if(!playlist || !playlist.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'card';
  wrap.id = 'audio-player';
  wrap.style.left = localStorage.getItem('ap_x') || '24px';
  wrap.style.top = localStorage.getItem('ap_y') || (window.innerHeight - 180) + 'px';

  wrap.innerHTML = `
    <div class="ap-drag" id="ap-drag">
      <div>
        <div class="ap-title" id="ap-title">${playlist[0].title}</div>
        <div class="ap-sub" id="ap-sub">${playlist[0].artist}</div>
      </div>
      <div style="cursor:pointer; color:var(--muted);" id="ap-minimize">—</div>
    </div>
    <div class="ap-controls">
      <button class="ap-btn" id="ap-prev">⏮</button>
      <button class="ap-btn play" id="ap-play">▶</button>
      <button class="ap-btn" id="ap-next">⏭</button>
      <div style="flex:1; font-size:.7rem; color:var(--muted); text-align:right;" id="ap-time">0:00</div>
    </div>
    <div class="ap-volume">
      <span style="font-size:.8rem;">🔊</span>
      <input type="range" id="ap-volume" min="0" max="100" value="60">
    </div>
  `;
  document.body.appendChild(wrap);

  const minBtn = document.createElement('div');
  minBtn.className = 'ap-min';
  minBtn.id = 'ap-min-btn';
  minBtn.innerHTML = '🎧';
  document.body.appendChild(minBtn);

  const audio = new Audio();
  audio.volume = 0.6;
  window.__alone_audio = audio;

  function loadTrack(i){
    APState.idx = (i + playlist.length) % playlist.length;
    const t = playlist[APState.idx];
    audio.src = t.url;
    document.getElementById('ap-title').textContent = t.title;
    document.getElementById('ap-sub').textContent = t.artist;
    if(APState.playing) audio.play().catch(()=>{});
  }
  loadTrack(0);

  document.getElementById('ap-play').addEventListener('click', ()=>{
    if(APState.playing){ audio.pause(); APState.playing=false; document.getElementById('ap-play').textContent='▶'; }
    else { audio.play().catch(()=> toast('Tidak dapat memutar audio (cek koneksi)','err')); APState.playing=true; document.getElementById('ap-play').textContent='⏸'; }
  });
  document.getElementById('ap-next').addEventListener('click', ()=> loadTrack(APState.idx+1));
  document.getElementById('ap-prev').addEventListener('click', ()=> loadTrack(APState.idx-1));
  audio.addEventListener('ended', ()=> loadTrack(APState.idx+1));
  audio.addEventListener('timeupdate', ()=>{
    const m = Math.floor(audio.currentTime/60), s = Math.floor(audio.currentTime%60);
    const el = document.getElementById('ap-time');
    if(el) el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  });
  document.getElementById('ap-volume').addEventListener('input', (e)=>{ audio.volume = e.target.value/100; });

  document.getElementById('ap-minimize').addEventListener('click', ()=>{
    wrap.style.display='none'; minBtn.style.display='flex';
  });
  minBtn.addEventListener('click', ()=>{
    wrap.style.display='block'; minBtn.style.display='none';
  });

  // Drag & drop
  const dragHandle = document.getElementById('ap-drag');
  let dragging=false, offX=0, offY=0;
  dragHandle.addEventListener('mousedown', (e)=>{
    dragging=true; offX = e.clientX - wrap.offsetLeft; offY = e.clientY - wrap.offsetTop;
  });
  document.addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    let x = e.clientX - offX, y = e.clientY - offY;
    x = Math.max(4, Math.min(window.innerWidth - wrap.offsetWidth - 4, x));
    y = Math.max(4, Math.min(window.innerHeight - wrap.offsetHeight - 4, y));
    wrap.style.left = x+'px'; wrap.style.top = y+'px'; wrap.style.right='auto'; wrap.style.bottom='auto';
  });
  document.addEventListener('mouseup', ()=>{
    if(dragging){ localStorage.setItem('ap_x', wrap.style.left); localStorage.setItem('ap_y', wrap.style.top); }
    dragging=false;
  });
  // touch support
  dragHandle.addEventListener('touchstart', (e)=>{
    dragging=true; const t=e.touches[0];
    offX = t.clientX - wrap.offsetLeft; offY = t.clientY - wrap.offsetTop;
  }, {passive:true});
  document.addEventListener('touchmove', (e)=>{
    if(!dragging) return;
    const t = e.touches[0];
    let x = t.clientX - offX, y = t.clientY - offY;
    x = Math.max(4, Math.min(window.innerWidth - wrap.offsetWidth - 4, x));
    y = Math.max(4, Math.min(window.innerHeight - wrap.offsetHeight - 4, y));
    wrap.style.left = x+'px'; wrap.style.top = y+'px';
  }, {passive:true});
  document.addEventListener('touchend', ()=>{
    if(dragging){ localStorage.setItem('ap_x', wrap.style.left); localStorage.setItem('ap_y', wrap.style.top); }
    dragging=false;
  });
}
