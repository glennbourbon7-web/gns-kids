/* GNS Kids: Beaver Trapping + Big Ole' Red Cookie.
   Needs: window.GNS = { open(title, btn, wide), el(tag, cls, text), body() } and buttons #play-beaver, #play-cookie. */
(function(){
  var G = window.GNS; if (!G) return;
  var el = G.el;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function store(k, v){ try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch(e){ return null; } }
  function svgImg(svg){ var i = new Image(); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return i; }

  /* ---------- Characters (drawn to match GNS art) ---------- */
  // Richard Powers, as on the GNS Kids badge
  var RICHARD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150">' +
    '<rect x="51" y="88" width="18" height="22" rx="3" fill="#e9b48a"/>' +
    '<path d="M8 150C10 124 26 108 60 106c34 2 50 18 52 44z" fill="#1f2340"/>' +
    '<path d="M45 106h30l-15 36z" fill="#fff"/>' +
    '<path d="M45 106l9 0-4 9zM75 106h-9l4 9z" fill="#e8e8ee"/>' +
    '<path d="M56 107h8l-1.5 7h-5z" fill="#7e0d18"/>' +
    '<path d="M57.5 114h5l3 18-5.5 7-5.5-7z" fill="#a8121f"/>' +
    '<path d="M45 106l15 36-8 0-12-20 5-6-6-5z" fill="#2b3163"/>' +
    '<path d="M75 106l-15 36 8 0 12-20-5-6 6-5z" fill="#2b3163"/>' +
    '<circle cx="60" cy="146" r="2.2" fill="#11142a"/>' +
'<rect x="50" y="92" width="20" height="18" rx="4" fill="#f2c39c"/>' +
    '<ellipse cx="24" cy="62" rx="9" ry="12" fill="#f2c39c"/><ellipse cx="96" cy="62" rx="9" ry="12" fill="#f2c39c"/>' +
    '<rect x="22" y="22" width="76" height="80" rx="30" fill="#f6c9a3"/>' +
    '<path d="M20 52c-2-28 16-42 40-42 22 0 40 10 40 36-6-8-14-14-26-16-14 8-34 10-54 22z" fill="#3a2418"/>' +
    '<ellipse cx="46" cy="58" rx="5" ry="6" fill="#2a1a12"/><ellipse cx="76" cy="58" rx="5" ry="6" fill="#2a1a12"/>' +
    '<path d="M44 80c10 8 26 8 36-2" stroke="#2a1a12" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
  // Glenn Bourbon, as in the Vice Presidential Townhall graphic: blocky, black wavy hair, navy pinstripe suit, light blue tie
  var GLENN_HEAD = '<rect x="26" y="20" width="68" height="66" rx="9" fill="#5b3b26"/>' +
    '<path d="M22 44c0-22 14-34 38-34s40 10 40 30c-6-6-12-8-20-8 4-6 2-10-2-12-6 6-16 8-26 8-12 0-22 6-30 16z" fill="#161414"/>' +
    '<path d="M40 18c8-6 22-8 34-2" stroke="#2c2a2a" stroke-width="3" fill="none"/>' +
    '<path d="M38 50l14-2M68 48l14 2" stroke="#161414" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M42 58h10M70 58h10" stroke="#161414" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M50 74h20" stroke="#161414" stroke-width="3.5" stroke-linecap="round"/>';
  var GLENN_BODY = '<defs><pattern id="gtie" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#6d9fd0"/><rect width="2" height="2" fill="#4a7cae"/></pattern></defs>' +
    '<rect x="47" y="80" width="26" height="18" fill="#4e3221"/>' +
    '<path d="M4 160c0-46 18-66 56-68 38 2 56 22 56 68z" fill="#1d2a4a"/>' +
    '<path d="M16 160v-34M27 160v-50M38 160v-60M82 160v-60M93 160v-50M104 160v-34" stroke="#3a4b72" stroke-width="1.4"/>' +
    '<path d="M44 92h32l-16 46z" fill="#f6f6f6"/>' +
    '<path d="M44 92h10l-4 10zM76 92H66l4 10z" fill="#e2e2e6"/>' +
    '<path d="M55 93h10l-2 8h-6z" fill="#5b8cbe"/>' +
    '<path d="M57 101h6l4 24-7 9-7-9z" fill="url(#gtie)"/>' +
    '<path d="M44 92l16 46h-9L36 114l6-7-7-6z" fill="#253559"/>' +
    '<path d="M76 92l-16 46h9l15-24-6-7 7-6z" fill="#253559"/>' +
    '<path d="M40 112l13 22M80 112l-13 22" stroke="#3a4b72" stroke-width="1.2"/>' +
    '<circle cx="60" cy="144" r="2.4" fill="#0f1830"/><circle cx="60" cy="153" r="2.4" fill="#0f1830"/>';
  var GLENN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160">' + GLENN_BODY + GLENN_HEAD + '</svg>';
  var BEAVER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
    '<ellipse cx="60" cy="96" rx="44" ry="30" fill="#7a4a24"/>' +
    '<circle cx="28" cy="30" r="12" fill="#6a3d1c"/><circle cx="92" cy="30" r="12" fill="#6a3d1c"/>' +
    '<circle cx="28" cy="30" r="6" fill="#c98b5a"/><circle cx="92" cy="30" r="6" fill="#c98b5a"/>' +
    '<ellipse cx="60" cy="58" rx="40" ry="38" fill="#8b5a2b"/>' +
    '<ellipse cx="60" cy="74" rx="22" ry="16" fill="#d9a877"/>' +
    '<circle cx="45" cy="50" r="6" fill="#1b120c"/><circle cx="75" cy="50" r="6" fill="#1b120c"/>' +
    '<circle cx="47" cy="48" r="2" fill="#fff"/><circle cx="77" cy="48" r="2" fill="#fff"/>' +
    '<ellipse cx="60" cy="64" rx="8" ry="6" fill="#2a1a12"/>' +
    '<rect x="52" y="76" width="7.5" height="13" rx="2" fill="#fff" stroke="#c9b9a8"/><rect x="60.5" y="76" width="7.5" height="13" rx="2" fill="#fff" stroke="#c9b9a8"/>' +
    '<path d="M30 70h-18M30 76h-16M90 70h18M90 76h16" stroke="#3b2414" stroke-width="2" stroke-linecap="round"/></svg>';
  var GOLD = BEAVER.replace(/#8b5a2b/g, '#e2a91c').replace(/#7a4a24/g, '#c88d12').replace(/#6a3d1c/g, '#b47c0c').replace(/#d9a877/g, '#ffe08a')
    .replace('</svg>', '<path d="M42 10l6 10 12-12 12 12 6-10 2 16H40z" fill="#ffd23f" stroke="#a87808" stroke-width="2"/></svg>');
  var CAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect x="10" y="14" width="100" height="100" rx="8" fill="none" stroke="#3b3f47" stroke-width="7"/>' +
    '<path d="M30 14v100M50 14v100M70 14v100M90 14v100" stroke="#3b3f47" stroke-width="5"/><path d="M48 4h24v12H48z" fill="#3b3f47"/></svg>';
  var GLENN_SMALL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><g transform="translate(0,4) scale(1,.95)">' + GLENN_BODY + GLENN_HEAD + '</g></svg>';

  /* ---------- Shared styles (scoped to the games) ---------- */
  if (!document.getElementById('gk-games-css')){
    var css = document.createElement('style'); css.id = 'gk-games-css';
    css.textContent = [
      '.gk-hud{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-family:var(--display);font-weight:600}',
      '.gk-pill{background:var(--chip);border-radius:999px;padding:6px 14px;font-variant-numeric:tabular-nums}',
      '.gk-pill b{font-weight:700}',
      '.gk-pill.warn{background:var(--brand-2);color:#fff}',
      '.gk-river{position:relative;border-radius:18px;overflow:hidden;padding:18px 14px 22px;background:linear-gradient(180deg,#bfe6ff 0 26%,#6fae4f 26% 100%);touch-action:manipulation;-webkit-user-select:none;user-select:none}',
      '.gk-river::before{content:"";position:absolute;left:0;right:0;top:20%;height:14px;background:repeating-linear-gradient(90deg,#3f8ac4 0 22px,#62a8dc 22px 44px);opacity:.9}',
      '.gk-holes{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:14px 10px;margin-top:34px}',
      '.gk-hole{position:relative;aspect-ratio:1/0.9;max-width:100%;border:0;padding:0;background:none;cursor:pointer;overflow:hidden;border-radius:0 0 40% 40%/0 0 22% 22%}',
      '.gk-hole::before{content:"";position:absolute;left:4%;right:4%;bottom:6%;height:30%;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#1e120a 0 58%,#5a3a1c 60% 76%,#7d5a33 78%);z-index:0;pointer-events:none}',
      '.gk-hole::after{content:"";position:absolute;left:0;right:0;bottom:0;height:21%;background:#5d9c40;border-radius:0;z-index:2;pointer-events:none;box-shadow:inset 0 6px 0 #7d5a33}',
      '.gk-critter{position:absolute;left:16%;width:68%;bottom:20%;transform:translateY(125%);transition:transform .14s ease-out;z-index:1;pointer-events:none}',
      '.gk-hole.up .gk-critter{transform:translateY(0)}',
      '.gk-critter img{display:block;width:100%;height:auto}',
      '.gk-cage{position:absolute;left:12%;width:76%;bottom:16%;z-index:4;transform:translateY(-140%);transition:transform .16s ease-in;pointer-events:none}',
      '.gk-hole.caught .gk-cage{transform:translateY(0)}',
      '.gk-hole:focus-visible{outline:3px solid var(--fg);outline-offset:2px}',
      '.gk-rich{position:absolute;z-index:6;width:22%;max-width:110px;pointer-events:none;transition:left .12s,top .12s}',
      '.gk-rich img{display:block;width:100%;height:auto}',
      '.gk-pop{position:absolute;z-index:7;font-family:var(--display);font-weight:700;font-size:1.4rem;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.45);pointer-events:none;animation:gkup .8s ease-out forwards}',
      '.gk-pop.bad{color:#ffd1cc}',
      '@keyframes gkup{from{transform:translate(-50%,0);opacity:1}to{transform:translate(-50%,-46px);opacity:0}}',
      '.gk-say{position:absolute;left:12px;bottom:12px;z-index:8;background:#fff;color:#2a1615;font-weight:700;border-radius:14px;padding:8px 12px;max-width:70%;box-shadow:0 4px 0 rgba(0,0,0,.15)}',
      '.gk-intro{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center}',
      '.gk-intro img{width:96px;height:auto}',
      '.gk-intro p{margin:0}',
      '.gk-legend{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
      '.gk-legend div{background:var(--chip);border-radius:14px;padding:10px;text-align:center;font-weight:700;font-size:.92rem;display:grid;gap:4px;justify-items:center}',
      '.gk-legend img{width:54px;height:54px}',
      '.gk-cv{display:block;width:100%;height:auto;max-width:100%;border-radius:18px;touch-action:none;background:#fdf1e6}',
      '.gk-cv:focus{outline:none}.gk-cv:focus-visible{outline:3px solid var(--brand-2);outline-offset:2px}',
      '.gk-stage{display:flex;gap:8px;flex-wrap:wrap}',
      '.gk-stage span{font-family:var(--display);font-weight:600;font-size:.88rem;padding:5px 12px;border-radius:999px;background:var(--chip);color:var(--muted)}',
      '.gk-stage span.on{background:var(--brand-2);color:#fff}',
      '.gk-stage span.done{color:var(--fg)}',
      '.gk-big{font-size:1.25rem;padding:16px 26px;align-self:stretch;text-align:center}',
      '.gk-stars{font-size:2.2rem;letter-spacing:.1em;color:#e2a91c;line-height:1}',
      '.gk-tip{color:var(--muted);font-size:.95rem;margin:0}',
      '@media (max-width:520px){.gk-legend{grid-template-columns:1fr 1fr 1fr}.gk-legend img{width:42px;height:42px}.gk-intro img{width:72px}}'
    ].join('\n');
    document.head.appendChild(css);
  }
  function src(svg){ return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
  function cardArt(id, list){
    var box = document.getElementById(id); if (!box) return;
    list.forEach(function(x){ var i = document.createElement('img'); i.src = src(x[0]); i.alt = x[1]; if (x[2]) i.className = x[2]; box.appendChild(i); });
  }
  cardArt('art-beaver', [[RICHARD, 'Richard Powers'], [BEAVER, 'A beaver', 'small'], [GOLD, 'A golden beaver', 'small']]);
  var COOKIE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#c9202f" stroke="#8a0d18" stroke-width="4"/>' +
    '<circle cx="42" cy="40" r="6" fill="#fff"/><circle cx="76" cy="34" r="5" fill="#fff"/><circle cx="84" cy="70" r="6" fill="#fff"/><circle cx="50" cy="78" r="5" fill="#fff"/><circle cx="64" cy="56" r="4" fill="#fff"/><circle cx="30" cy="66" r="4" fill="#fff"/></svg>';
  cardArt('art-cookie', [[GLENN, 'Glenn Bourbon'], [COOKIE, 'A Big Ole\' Red Cookie', 'small']]);

  /* =====================================================================
     Game: Beaver Trapping (whack-a-mole)
     ===================================================================== */
  var BT = { len: 45 };
  function beaverIntro(){
    var b = G.body(); b.innerHTML = '';
    var intro = el('div', 'gk-intro'), im = el('img'); im.src = src(RICHARD); im.alt = 'Richard Powers';
    var t = el('div'); t.appendChild(el('h4', null, 'The beavers are chewing up the riverbank!'));
    t.firstChild.style.cssText = 'font-family:var(--display);font-size:1.35rem;margin:0 0 6px';
    t.appendChild(el('p', null, 'Help Richard Powers trap every beaver that pops out of its den. Tap fast! Trapped beavers get a free ride to a brand new river.'));
    intro.appendChild(im); intro.appendChild(t); b.appendChild(intro);
    var lg = el('div', 'gk-legend');
    [[BEAVER, 'Beaver', '+1'], [GOLD, 'Golden beaver', '+3'], [GLENN_SMALL, 'Glenn Bourbon', "Don't trap him! -2"]].forEach(function(x){
      var d = el('div'), i = el('img'); i.src = src(x[0]); i.alt = ''; d.appendChild(i); d.appendChild(el('span', null, x[1])); d.appendChild(el('span', null, x[2])); lg.appendChild(d);
    });
    b.appendChild(lg);
    var best = store('gnsk-beaver-best') || 0;
    if (best) b.appendChild(el('p', 'gk-tip', 'Your best: ' + best + ' beavers'));
    var go = el('button', 'btn gk-big', 'Start trapping'); go.onclick = beaverPlay; b.appendChild(go); go.focus();
  }
  function beaverPlay(){
    var b = G.body(); b.innerHTML = '';
    var hud = el('div', 'gk-hud'), sc = el('span', 'gk-pill'), tm = el('span', 'gk-pill');
    hud.appendChild(sc); hud.appendChild(tm); b.appendChild(hud);
    var river = el('div', 'gk-river'), grid = el('div', 'gk-holes'); river.appendChild(grid); b.appendChild(river);
    var rich = el('div', 'gk-rich'), ri = el('img'); ri.src = src(RICHARD); ri.alt = ''; rich.appendChild(ri); river.appendChild(rich);
    rich.style.left = '72%'; rich.style.top = '2%';
    var holes = [];
    for (var i = 0; i < 9; i++){
      var h = el('button', 'gk-hole'); h.type = 'button'; h.setAttribute('aria-label', 'Den ' + (i + 1));
      var c = el('div', 'gk-critter'), ci = el('img'); ci.alt = ''; c.appendChild(ci); h.appendChild(c);
      var cg = el('div', 'gk-cage'), cgi = el('img'); cgi.src = src(CAGE); cgi.alt = ''; cg.appendChild(cgi); h.appendChild(cg);
      h._img = ci; h._kind = null; h._t = 0; h._i = i;
      (function(h){ h.addEventListener('pointerdown', function(e){ e.preventDefault(); hit(h); }); h.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); hit(h); } }); })(h);
      grid.appendChild(h); holes.push(h);
    }
    var score = 0, caught = 0, start = performance.now(), over = false, nextAt = start + 500, raf = 0, sayT = 0;
    function paint(left){
      sc.innerHTML = 'Beavers trapped: <b>' + caught + '</b> · Score <b>' + score + '</b>';
      tm.textContent = Math.ceil(left) + 's left'; tm.className = 'gk-pill' + (left <= 10 ? ' warn' : '');
    }
    function say(t){ var old = river.querySelector('.gk-say'); if (old) old.remove(); var s = el('div', 'gk-say', t); river.appendChild(s); clearTimeout(sayT); sayT = setTimeout(function(){ s.remove(); }, 1400); }
    function pop(h, text, bad){
      var r = h.getBoundingClientRect(), rr = river.getBoundingClientRect();
      var p = el('div', 'gk-pop' + (bad ? ' bad' : ''), text); p.style.left = (r.left - rr.left + r.width / 2) + 'px'; p.style.top = (r.top - rr.top + 6) + 'px';
      river.appendChild(p); setTimeout(function(){ p.remove(); }, 820);
    }
    function moveRich(h){
      var r = h.getBoundingClientRect(), rr = river.getBoundingClientRect();
      var x = (r.left - rr.left) + r.width * 0.62, y = (r.top - rr.top) - r.height * 0.55;
      rich.style.left = Math.min(x, rr.width - rich.offsetWidth - 4) + 'px'; rich.style.top = Math.max(0, y) + 'px';
    }
    function hit(h){
      if (over || !h._kind || h.classList.contains('caught')) return;
      if (h._kind === 'glenn'){
        score = Math.max(0, score - 2); pop(h, '-2', true); say('"Hey, Richard! It\'s me, Glenn!"');
        h.classList.remove('up'); h._kind = null;
      } else {
        var pts = h._kind === 'gold' ? 3 : 1; score += pts; caught++;
        moveRich(h); h.classList.add('caught'); pop(h, '+' + pts);
        if (h._kind === 'gold') say('A golden beaver! Richard is thrilled.');
        var hh = h; setTimeout(function(){ hh.classList.remove('up', 'caught'); hh._kind = null; }, 380);
        h._kind = 'done';
      }
      paint(BT.len - (performance.now() - start) / 1000);
    }
    function spawn(now, el2){
      var free = holes.filter(function(x){ return !x._kind; }); if (!free.length) return;
      var h = free[Math.floor(Math.random() * free.length)];
      var r = Math.random(), kind = el2 > 5 && r < 0.17 ? 'glenn' : r > 0.92 ? 'gold' : 'beaver';
      h._kind = kind; h._img.src = src(kind === 'glenn' ? GLENN_SMALL : kind === 'gold' ? GOLD : BEAVER);
      var stay = Math.max(560, 1150 - el2 * 13) * (kind === 'gold' ? 0.75 : 1);
      h._t = now + stay; h.classList.add('up');
    }
    function tick(now){
      if (over) return;
      var el2 = (now - start) / 1000, left = BT.len - el2;
      if (left <= 0){ finish(); return; }
      holes.forEach(function(h){
        if (h._kind && h._kind !== 'done' && now > h._t){
          if (h._kind === 'beaver' || h._kind === 'gold') pop(h, 'Got away!', true);
          h.classList.remove('up'); h._kind = null;
        }
      });
      if (now >= nextAt){
        spawn(now, el2);
        if (el2 > 18 && Math.random() < 0.35) spawn(now, el2);
        if (el2 > 32 && Math.random() < 0.3) spawn(now, el2);
        nextAt = now + Math.max(380, 900 - el2 * 12);
      }
      paint(left); raf = requestAnimationFrame(tick);
    }
    function finish(){
      over = true; cancelAnimationFrame(raf);
      var best = store('gnsk-beaver-best') || 0, newBest = score > best; if (newBest) store('gnsk-beaver-best', score);
      b.innerHTML = '';
      b.appendChild(el('div', 'meta', 'Time\'s up'));
      b.appendChild(el('div', 'big-score', score + ' points'));
      var rank = score >= 45 ? 'Master Beaver Trapper' : score >= 30 ? 'Riverbank Hero' : score >= 15 ? 'Dam Buster' : 'Junior Trapper';
      var hd = el('h4', null, 'Your rank: ' + rank); hd.style.cssText = 'font-family:var(--display);font-size:1.5rem;margin:0'; b.appendChild(hd);
      var intro = el('div', 'gk-intro'), im = el('img'); im.src = src(RICHARD); im.alt = 'Richard Powers';
      intro.appendChild(im); intro.appendChild(el('p', null, 'You trapped ' + caught + ' beaver' + (caught === 1 ? '' : 's') + '. "The riverbank is safe again," says Richard Powers. ' + (newBest ? 'That\'s a new best score!' : 'Your best is ' + Math.max(best, score) + '.')));
      b.appendChild(intro);
      var row = el('div', 'row'), again = el('button', 'btn', 'Play again'); again.onclick = beaverPlay; row.appendChild(again); b.appendChild(row); again.focus();
    }
    G.onClose = function(){ over = true; cancelAnimationFrame(raf); };
    paint(BT.len); raf = requestAnimationFrame(tick);
  }
  var bb = document.getElementById('play-beaver');
  if (bb) bb.onclick = function(){ G.open('Beaver Trapping', this); beaverIntro(); };

  /* =====================================================================
     Game: Big Ole' Red Cookie (play as Glenn Bourbon)
     ===================================================================== */
  var ING = {
    flour:  { name: 'Flour', good: true, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M12 14h36l4 42H8z" fill="#f3efe6" stroke="#b9ad97" stroke-width="2"/><path d="M12 14l6-8h24l6 8" fill="#e6dfd0" stroke="#b9ad97" stroke-width="2"/><text x="30" y="40" font-family="Arial" font-weight="700" font-size="11" text-anchor="middle" fill="#8c7f69">FLOUR</text></svg>' },
    sugar:  { name: 'Sugar', good: true, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M10 22l20-10 20 10v26L30 58 10 48z" fill="#fff" stroke="#9fb6cf" stroke-width="2"/><path d="M10 22l20 10 20-10M30 32v26" stroke="#9fb6cf" stroke-width="2" fill="none"/><circle cx="20" cy="38" r="2" fill="#cfdceb"/><circle cx="40" cy="42" r="2" fill="#cfdceb"/></svg>' },
    butter: { name: 'Butter', good: true, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M6 30l14-10h34v18L40 48H6z" fill="#ffe27a" stroke="#c9a52a" stroke-width="2"/><path d="M6 30h34l14-10M40 30v18" stroke="#c9a52a" stroke-width="2" fill="none"/></svg>' },
    egg:    { name: 'Egg', good: true, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><ellipse cx="30" cy="33" rx="17" ry="22" fill="#fff6e8" stroke="#d8c2a0" stroke-width="2"/><ellipse cx="24" cy="24" rx="4" ry="6" fill="#fff"/></svg>' },
    red:    { name: 'Red coloring', good: true, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="18" y="20" width="24" height="34" rx="6" fill="#d11a2a" stroke="#8a0d18" stroke-width="2"/><rect x="24" y="8" width="12" height="13" rx="2" fill="#fff" stroke="#8a0d18" stroke-width="2"/><rect x="22" y="30" width="16" height="12" rx="2" fill="#fff"/><text x="30" y="40" font-family="Arial" font-weight="700" font-size="9" text-anchor="middle" fill="#d11a2a">RED</text></svg>' },
    boot:   { name: 'Old boot', good: false, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M16 6h18v28l18 8v12H10V34z" fill="#6b4a2a" stroke="#3b2414" stroke-width="2"/><path d="M10 50h42" stroke="#2a1a0e" stroke-width="5"/><path d="M20 14h10M20 22h10" stroke="#3b2414" stroke-width="2"/></svg>' },
    rotten: { name: 'Rotten egg', good: false, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><ellipse cx="30" cy="34" rx="17" ry="22" fill="#a7c35a" stroke="#617a24" stroke-width="2"/><path d="M20 20l6 8 4-6 6 8 4-6" stroke="#617a24" stroke-width="2" fill="none"/><path d="M22 6c2 4-2 4 0 8M34 4c2 4-2 4 0 8" stroke="#8fae3c" stroke-width="2" fill="none"/></svg>' }
  };
  var NEED = { flour: 3, sugar: 3, butter: 2, egg: 2, red: 3 };
  Object.keys(ING).forEach(function(k){ ING[k].img = svgImg(ING[k].svg); });
  var GLENN_IMG = svgImg(GLENN);

  function cookieStages(b, on){
    var s = el('div', 'gk-stage');
    ['1. Gather', '2. Mix', '3. Bake', 'Taste test'].forEach(function(t, i){ var x = el('span', i === on ? 'on' : i < on ? 'done' : '', t); s.appendChild(x); });
    b.appendChild(s);
  }
  function cookieIntro(){
    var b = G.body(); b.innerHTML = '';
    var intro = el('div', 'gk-intro'), im = el('img'); im.src = src(GLENN); im.alt = 'Glenn Bourbon';
    var t = el('div'), h = el('h4', null, 'Glenn Bourbon is baking a Big Ole\' Red Cookie!');
    h.style.cssText = 'font-family:var(--display);font-size:1.35rem;margin:0 0 6px'; t.appendChild(h);
    t.appendChild(el('p', null, 'You are Glenn. Catch the ingredients in your mixing bowl, stir the dough, and take the cookie out of the oven at just the right moment.'));
    intro.appendChild(im); intro.appendChild(t); b.appendChild(intro);
    b.appendChild(el('p', 'gk-tip', 'You need flour, sugar, butter, eggs and lots of red coloring. Dodge the old boots and rotten eggs!'));
    var best = store('gnsk-cookie-best'); if (best) b.appendChild(el('p', 'gk-tip', 'Your best cookie: ' + best + ' out of 100'));
    var go = el('button', 'btn gk-big', 'Start baking'); go.onclick = function(){ cookieGather(); }; b.appendChild(go); go.focus();
  }
  var CK;
  function cookieGather(){
    CK = { got: { flour: 0, sugar: 0, butter: 0, egg: 0, red: 0 }, bad: 0, mix: 0, bake: 0 };
    var b = G.body(); b.innerHTML = ''; cookieStages(b, 0);
    var hud = el('div', 'gk-hud'), tm = el('span', 'gk-pill'), lst = el('span', 'gk-pill'); hud.appendChild(tm); hud.appendChild(lst); b.appendChild(hud);
    var W = 480, H = 440, cv = el('canvas', 'gk-cv'); cv.width = W * 2; cv.height = H * 2; cv.setAttribute('aria-label', 'Catch the ingredients. Move Glenn with the arrow keys, or drag.'); cv.tabIndex = 0;
    b.appendChild(cv); b.appendChild(el('p', 'gk-tip', 'Drag or slide your finger to move Glenn. On a keyboard, use the arrow keys.'));
    var c = cv.getContext('2d'); c.scale(2, 2);
    var LEN = 25, start = performance.now(), last = start, over = false, raf = 0, keys = {}, items = [], nextAt = start + 300, flashes = [];
    var px = W / 2, target = W / 2;
    function toX(e){ var r = cv.getBoundingClientRect(); return (e.clientX - r.left) / r.width * W; }
    cv.addEventListener('pointerdown', function(e){ cv.setPointerCapture && cv.setPointerCapture(e.pointerId); target = toX(e); });
    cv.addEventListener('pointermove', function(e){ if (e.pointerType !== 'mouse' || e.buttons) target = toX(e); else target = toX(e); });
    function kd(e){ if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ keys[e.key] = e.type === 'keydown'; e.preventDefault(); } }
    document.addEventListener('keydown', kd); document.addEventListener('keyup', kd);
    function cleanup(){ over = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', kd); document.removeEventListener('keyup', kd); }
    G.onClose = cleanup;
    function need(){ var out = []; Object.keys(NEED).forEach(function(k){ out.push(ING[k].name + ' ' + Math.min(CK.got[k], NEED[k]) + '/' + NEED[k]); }); return out.join(' · '); }
    function spawn(el2){
      var keysAll = Object.keys(ING), k;
      var r = Math.random();
      if (r < 0.2 + el2 * 0.004) k = Math.random() < 0.5 ? 'boot' : 'rotten';
      else { var want = Object.keys(NEED).filter(function(x){ return CK.got[x] < NEED[x]; }); var pool = want.length && Math.random() < 0.7 ? want : Object.keys(NEED); k = pool[Math.floor(Math.random() * pool.length)]; }
      items.push({ k: k, x: 30 + Math.random() * (W - 60), y: -40, v: 120 + Math.random() * 60 + el2 * 6, r: (Math.random() - .5) * 2, a: 0 });
    }
    function draw(now){
      c.clearRect(0, 0, W, H);
      // kitchen
      c.fillStyle = '#fdf1e6'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#f6dccb'; for (var y = 0; y < H - 120; y += 40) for (var x = (y / 40) % 2 ? 20 : 0; x < W; x += 40) c.fillRect(x, y, 20, 20);
      c.fillStyle = '#8a0f1a'; c.fillRect(0, H - 104, W, 16);
      c.fillStyle = '#c9a77c'; c.fillRect(0, H - 88, W, 88);
      items.forEach(function(it){ c.save(); c.translate(it.x, it.y); c.rotate(it.a); c.drawImage(ING[it.k].img, -24, -24, 48, 48); c.restore(); });
      // Glenn + bowl
      c.drawImage(GLENN_IMG, px - 54, H - 210, 108, 144);
      c.fillStyle = '#d9dde3'; c.beginPath(); c.ellipse(px, H - 108, 62, 16, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#b7bec8'; c.beginPath(); c.moveTo(px - 62, H - 108); c.quadraticCurveTo(px, H - 40, px + 62, H - 108); c.fill();
      var tot = Object.keys(NEED).reduce(function(a, k){ return a + Math.min(CK.got[k], NEED[k]); }, 0);
      c.fillStyle = 'rgb(' + (230 - Math.min(CK.got.red, 3) * 15) + ',' + (190 - Math.min(CK.got.red, 3) * 55) + ',' + (150 - Math.min(CK.got.red, 3) * 40) + ')';
      c.beginPath(); c.ellipse(px, H - 108, 52 * Math.min(1, .2 + tot / 13), 10, 0, 0, Math.PI * 2); c.fill();
      flashes = flashes.filter(function(f){ return now - f.t < 700; });
      flashes.forEach(function(f){ var a = 1 - (now - f.t) / 700; c.globalAlpha = a; c.fillStyle = f.bad ? '#b31212' : '#1d7a3a'; c.font = '700 20px Fredoka, Arial'; c.textAlign = 'center'; c.fillText(f.text, f.x, f.y - (1 - a) * 30); c.globalAlpha = 1; });
    }
    function loop(now){
      if (over) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var el2 = (now - start) / 1000, left = LEN - el2;
      if (keys.ArrowLeft) target = px - 400 * dt; if (keys.ArrowRight) target = px + 400 * dt;
      target = Math.max(60, Math.min(W - 60, target)); px += (target - px) * Math.min(1, dt * 14);
      if (now >= nextAt){ spawn(el2); nextAt = now + Math.max(330, 700 - el2 * 12); }
      items.forEach(function(it){ it.y += it.v * dt; it.a += it.r * dt; });
      items = items.filter(function(it){
        if (it.y > H - 128 && it.y < H - 92 && Math.abs(it.x - px) < 60){
          var g = ING[it.k];
          if (g.good){ CK.got[it.k]++; flashes.push({ t: now, x: it.x, y: it.y - 20, text: '+ ' + g.name }); }
          else { CK.bad++; flashes.push({ t: now, x: it.x, y: it.y - 20, text: 'Yuck! ' + g.name, bad: true }); }
          return false;
        }
        return it.y < H + 40;
      });
      tm.textContent = Math.ceil(Math.max(0, left)) + 's left'; tm.className = 'gk-pill' + (left <= 6 ? ' warn' : '');
      lst.textContent = need();
      draw(now);
      if (left <= 0){ cleanup(); cookieMix(); return; }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop); cv.focus({ preventScroll: true });
  }
  function cookieMix(){
    var b = G.body(); b.innerHTML = ''; cookieStages(b, 1);
    var W = 480, H = 340, cv = el('canvas', 'gk-cv'); cv.width = W * 2; cv.height = H * 2; cv.setAttribute('aria-label', 'Stir the dough');
    var c = cv.getContext('2d'); c.scale(2, 2);
    var bar = el('div', 'bar'), fill = el('i'); fill.style.width = '0%'; bar.appendChild(fill);
    var hud = el('div', 'gk-hud'), tm = el('span', 'gk-pill', 'Tap Stir to start'); hud.appendChild(tm);
    b.appendChild(hud); b.appendChild(cv); b.appendChild(bar);
    var stir = el('button', 'btn gk-big', 'Stir!'); b.appendChild(stir);
    b.appendChild(el('p', 'gk-tip', 'Tap Stir as fast as you can for 8 seconds. On a keyboard, mash the space bar.'));
    var taps = 0, started = 0, over = false, raf = 0, ang = 0, LEN = 8, GOAL = 40;
    var redLvl = Math.min(CK.got.red, NEED.red) / NEED.red;
    function draw(){
      c.fillStyle = '#fdf1e6'; c.fillRect(0, 0, W, H);
      c.drawImage(GLENN_IMG, 40, 70, 150, 200);
      c.fillStyle = '#c9a77c'; c.fillRect(0, H - 60, W, 60);
      var cx = 320, cy = 220;
      c.fillStyle = '#b7bec8'; c.beginPath(); c.moveTo(cx - 110, cy); c.quadraticCurveTo(cx, cy + 120, cx + 110, cy); c.fill();
      var t = Math.min(1, taps / GOAL);
      var r0 = 236, g0 = 205, b0 = 170, r1 = 200 + 20 * (1 - redLvl), g1 = 40 + 120 * (1 - redLvl), b1 = 45 + 100 * (1 - redLvl);
      c.fillStyle = 'rgb(' + Math.round(r0 + (r1 - r0) * t) + ',' + Math.round(g0 + (g1 - g0) * t) + ',' + Math.round(b0 + (b1 - b0) * t) + ')';
      c.beginPath(); c.ellipse(cx, cy, 100, 26, 0, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 3;
      for (var i = 0; i < 3; i++){ c.beginPath(); c.ellipse(cx, cy, 30 + i * 22, 7 + i * 5, 0, ang + i, ang + i + 2.4); c.stroke(); }
      c.fillStyle = '#d9dde3'; c.beginPath(); c.ellipse(cx, cy, 110, 28, 0, Math.PI, 0, true); c.lineWidth = 6; c.strokeStyle = '#d9dde3'; c.stroke();
      // spoon
      var sx = cx + Math.cos(ang) * 50, sy = cy + Math.sin(ang) * 12;
      c.strokeStyle = '#a0703c'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 30, sy - 110); c.stroke();
    }
    function tick(now){
      if (over) return;
      var left = started ? LEN - (now - started) / 1000 : LEN;
      tm.textContent = started ? Math.ceil(Math.max(0, left)) + 's left · ' + taps + ' stirs' : 'Tap Stir to start';
      fill.style.width = Math.min(100, taps / GOAL * 100) + '%';
      draw();
      if (started && left <= 0){ over = true; CK.mix = Math.min(1, taps / GOAL); setTimeout(cookieBake, 500); stir.disabled = true; return; }
      raf = requestAnimationFrame(tick);
    }
    function doStir(){ if (over) return; if (!started) started = performance.now(); taps++; ang += 0.55; }
    stir.addEventListener('pointerdown', function(e){ e.preventDefault(); doStir(); });
    stir.addEventListener('keydown', function(e){ if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); if (!e.repeat) doStir(); } });
    G.onClose = function(){ over = true; cancelAnimationFrame(raf); };
    stir.focus(); raf = requestAnimationFrame(tick);
  }
  function cookieBake(){
    var b = G.body(); b.innerHTML = ''; cookieStages(b, 2);
    var W = 480, H = 340, cv = el('canvas', 'gk-cv'); cv.width = W * 2; cv.height = H * 2; cv.setAttribute('aria-label', 'Oven timer');
    var c = cv.getContext('2d'); c.scale(2, 2);
    b.appendChild(el('p', null, 'The cookie is in the oven! Watch the dial and take it out when the needle is in the green Perfect zone.'));
    b.appendChild(cv);
    var take = el('button', 'btn gk-big', 'Take it out!'); b.appendChild(take);
    var over = false, raf = 0, t0 = performance.now(), pos = 0, dir = 1, speed = 0.55;
    var ZONE = [0.58, 0.72];
    function draw(){
      c.fillStyle = '#fdf1e6'; c.fillRect(0, 0, W, H);
      // oven
      c.fillStyle = '#3b3f47'; c.fillRect(196, 30, 270, 280); c.fillStyle = '#23262c'; c.fillRect(214, 110, 234, 170);
      var glow = c.createRadialGradient(331, 210, 10, 331, 210, 130); glow.addColorStop(0, 'rgba(255,140,40,' + (0.35 + pos * 0.4) + ')'); glow.addColorStop(1, 'rgba(255,90,20,0)');
      c.fillStyle = glow; c.fillRect(214, 110, 234, 170);
      var shade = pos < .5 ? [214 - pos * 30, 60, 60] : [200 - (pos - .5) * 260, 50 - (pos - .5) * 60, 45 - (pos - .5) * 60];
      c.fillStyle = 'rgb(' + shade.map(function(v){ return Math.max(30, Math.round(v)); }).join(',') + ')';
      c.beginPath(); c.ellipse(331, 236, 64 + pos * 12, 17 + pos * 3, 0, 0, Math.PI * 2); c.fill();
      // dial
      var dx = 90, dy = 120, R = 70;
      c.lineWidth = 16; c.lineCap = 'butt';
      [[0, 0.58, '#f3c7a4'], [0.58, 0.72, '#2f9a4f'], [0.72, 1, '#5b2d18']].forEach(function(z){ c.strokeStyle = z[2]; c.beginPath(); c.arc(dx, dy, R, Math.PI + z[0] * Math.PI, Math.PI + z[1] * Math.PI); c.stroke(); });
      c.fillStyle = '#2a1615'; c.font = '700 12px Fredoka, Arial'; c.textAlign = 'center';
      c.fillText('RAW', dx - 54, dy + 22); c.fillText('PERFECT', dx + 8, dy - R - 14); c.fillText('BURNT', dx + 56, dy + 22);
      var a = Math.PI + pos * Math.PI; c.strokeStyle = '#b31212'; c.lineWidth = 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + Math.cos(a) * (R - 6), dy + Math.sin(a) * (R - 6)); c.stroke();
      c.fillStyle = '#2a1615'; c.beginPath(); c.arc(dx, dy, 8, 0, Math.PI * 2); c.fill();
      c.drawImage(GLENN_IMG, 20, 190, 90, 120);
    }
    function tick(now){
      if (over) return;
      var dt = Math.min(.05, (now - t0) / 1000); t0 = now;
      pos += dir * speed * dt; if (pos >= 1){ pos = 1; dir = -1; } if (pos <= 0){ pos = 0; dir = 1; }
      draw(); raf = requestAnimationFrame(tick);
    }
    function stop(){
      if (over) return; over = true; cancelAnimationFrame(raf); take.disabled = true;
      var mid = (ZONE[0] + ZONE[1]) / 2, d = Math.abs(pos - mid);
      CK.bake = pos >= ZONE[0] && pos <= ZONE[1] ? 1 - d / ((ZONE[1] - ZONE[0]) / 2) * 0.25 : Math.max(0, 0.6 - (d - .07) * 2.2);
      CK.bakePos = pos;
      setTimeout(cookieResult, 600);
    }
    take.addEventListener('click', stop);
    G.onClose = function(){ over = true; cancelAnimationFrame(raf); };
    take.focus(); raf = requestAnimationFrame(tick);
  }
  function cookieResult(){
    var b = G.body(); b.innerHTML = ''; cookieStages(b, 3);
    var ingScore = Object.keys(NEED).reduce(function(a, k){ return a + Math.min(CK.got[k], NEED[k]) / NEED[k]; }, 0) / Object.keys(NEED).length;
    var redLvl = Math.min(CK.got.red, NEED.red) / NEED.red;
    var score = Math.round(Math.max(0, Math.min(100, ingScore * 40 + CK.mix * 25 + CK.bake * 35 - CK.bad * 4)));
    var best = store('gnsk-cookie-best') || 0, newBest = score > best; if (newBest) store('gnsk-cookie-best', score);
    var W = 480, H = 300, cv = el('canvas', 'gk-cv'); cv.width = W * 2; cv.height = H * 2; cv.setAttribute('aria-label', 'Your finished cookie');
    var c = cv.getContext('2d'); c.scale(2, 2);
    c.fillStyle = '#fdf1e6'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(300, 160, 160, 120, 0, 0, Math.PI * 2); c.fill();
    var size = 60 + Object.keys(NEED).reduce(function(a, k){ return a + Math.min(CK.got[k], NEED[k]); }, 0) * 6;
    var burnt = CK.bakePos > .72 ? (CK.bakePos - .72) / .28 : 0, raw = CK.bakePos < .58 ? (.58 - CK.bakePos) / .58 : 0;
    var rr = Math.round((150 + redLvl * 70) * (1 - burnt * .6) + raw * 40), gg = Math.round((120 - redLvl * 95) * (1 - burnt * .5) + raw * 60), bb2 = Math.round((80 - redLvl * 45) * (1 - burnt * .5) + raw * 50);
    var grd = c.createRadialGradient(290, 150, 10, 300, 160, size); grd.addColorStop(0, 'rgb(' + Math.min(255, rr + 25) + ',' + (gg + 20) + ',' + (bb2 + 20) + ')'); grd.addColorStop(1, 'rgb(' + rr + ',' + gg + ',' + bb2 + ')');
    c.fillStyle = grd; c.beginPath();
    for (var i = 0; i <= 120; i++){ var a = i / 120 * Math.PI * 2, w = size * (1 + Math.sin(a * 5) * 0.025 + Math.sin(a * 3 + 1) * 0.02); c.lineTo(300 + Math.cos(a) * w, 160 + Math.sin(a) * w * 0.82); }
    c.closePath(); c.fill();
    if (burnt > 0){ c.lineWidth = 6 + burnt * 10; c.strokeStyle = 'rgba(45,20,12,' + (0.25 + burnt * 0.5) + ')'; c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.85)'; for (var s = 0; s < 14; s++){ var aa = s * 2.4, dd = (s % 5 + 1) / 6 * size * .75; c.beginPath(); c.ellipse(300 + Math.cos(aa) * dd, 160 + Math.sin(aa) * dd * .8, 5, 3, aa, 0, Math.PI * 2); c.fill(); }
    c.drawImage(GLENN_IMG, 16, 70, 132, 176);
    b.appendChild(cv);
    var stars = score >= 90 ? 3 : score >= 65 ? 2 : score >= 35 ? 1 : 0;
    b.appendChild(el('div', 'gk-stars', '★★★'.slice(0, stars) + '☆☆☆'.slice(0, 3 - stars)));
    b.appendChild(el('div', 'big-score', score + ' / 100'));
    var title = score >= 90 ? 'The Biggest Ole\' Red Cookie in Washington!' : score >= 65 ? 'A Mighty Fine Big Ole\' Red Cookie' : score >= 35 ? 'A Medium Ole\' Red Cookie' : 'A Little Ole\' Oops Cookie';
    var hd = el('h4', null, title); hd.style.cssText = 'font-family:var(--display);font-size:1.45rem;margin:0;text-wrap:balance'; b.appendChild(hd);
    var notes = [];
    notes.push(redLvl >= 1 ? 'Plenty of red coloring.' : 'It needed more red coloring.');
    notes.push(CK.mix >= .9 ? 'Mixed perfectly smooth.' : CK.mix >= .5 ? 'A few lumps in the dough.' : 'Lots of lumps. Stir faster next time!');
    notes.push(CK.bakePos >= .58 && CK.bakePos <= .72 ? 'Baked just right.' : CK.bakePos > .72 ? 'A little burnt around the edges.' : 'Still a bit doughy in the middle.');
    if (CK.bad) notes.push('Glenn caught ' + CK.bad + ' yucky thing' + (CK.bad === 1 ? '' : 's') + ' in the bowl.');
    var sayp = el('p', null, '"' + (score >= 65 ? 'Now that is a Big Ole\' Red Cookie!' : 'We will get it next time.') + '" says Glenn Bourbon. ' + notes.join(' ') + (newBest ? ' New best cookie!' : ''));
    b.appendChild(sayp);
    var row = el('div', 'row'), again = el('button', 'btn', 'Bake another'); again.onclick = cookieGather; row.appendChild(again); b.appendChild(row); again.focus();
    G.onClose = null;
  }
  var cb = document.getElementById('play-cookie');
  if (cb) cb.onclick = function(){ G.open('Big Ole\' Red Cookie', this); cookieIntro(); };
})();
