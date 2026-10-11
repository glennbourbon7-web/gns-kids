/* GNS Kids: Powers Points and the avatar closet.
   Win a game and Richard Powers hands out Powers Points; spend them to unlock clothes for your avatar.
   Everything is saved in this browser (localStorage), so points stay on the device they were earned on.
   Games call PowersPoints.award(gameName, points) or PowersPoints.miss(hint) and append the element it returns. */
(function(){
  var KEY = 'gnsk-powers', START_BONUS = 25;
  var SKINS = ['#f7d7c4', '#e8b896', '#c68a5f', '#8d5a3b', '#5c3a24'];
  var HAIRS = ['#3b2416', '#141414', '#c98a3e', '#e2c26f', '#b23c1d'];

  /* ---------- Clothes ---------- */
  function tee(c, extra, line){
    var s = line ? ' stroke="' + line + '" stroke-width="2"' : '';
    return '<rect x="44" y="114" width="24" height="34" rx="10" fill="' + c + '"' + s + '/>' +
           '<rect x="132" y="114" width="24" height="34" rx="10" fill="' + c + '"' + s + '/>' +
           '<rect x="64" y="110" width="72" height="84" rx="16" fill="' + c + '"' + s + '/>' +
           '<path d="M88,110 q12,10 24,0" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="3"/>' + (extra || '');
  }
  function longTop(c, extra){
    return '<rect x="44" y="114" width="24" height="74" rx="10" fill="' + c + '"/>' +
           '<rect x="132" y="114" width="24" height="74" rx="10" fill="' + c + '"/>' +
           '<rect x="64" y="110" width="72" height="84" rx="16" fill="' + c + '"/>' + (extra || '');
  }
  function pants(c, extra, legH){
    var h = legH || 58;
    return '<rect x="66" y="180" width="68" height="24" rx="8" fill="' + c + '"/>' +
           '<rect x="74" y="190" width="24" height="' + h + '" rx="7" fill="' + c + '"/>' +
           '<rect x="102" y="190" width="24" height="' + h + '" rx="7" fill="' + c + '"/>' + (extra || '');
  }
  function shoes(c, y, h, sole){
    var t = '<rect x="70" y="' + y + '" width="30" height="' + h + '" rx="8" fill="' + c + '"/>' +
            '<rect x="100" y="' + y + '" width="30" height="' + h + '" rx="8" fill="' + c + '"/>';
    if (sole) t += '<rect x="70" y="252" width="30" height="6" rx="3" fill="' + sole + '"/><rect x="100" y="252" width="30" height="6" rx="3" fill="' + sole + '"/>';
    return t;
  }
  var GLASS = 'stroke="#2a1615" stroke-width="3"';

  var ITEMS = [
    /* Tops */
    { id:'tee-red', cat:'top', name:'Red Tee', price:0, svg: tee('#d42a2a') },
    { id:'tee-gns', cat:'top', name:'GNS Logo Tee', price:40, svg: tee('#ffffff', '<circle cx="100" cy="148" r="18" fill="#930000"/><text x="100" y="153" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="12" fill="#fff">GNS</text>', '#e3d6d4') },
    { id:'polo-green', cat:'top', name:'Green Polo', price:60, svg: tee('#2f9e57', '<path d="M86,110 l14,14 l14,-14 z" fill="#fff" opacity=".9"/><path d="M100,124 v20" stroke="#1e7a40" stroke-width="2"/><circle cx="100" cy="132" r="1.8" fill="#fff"/><circle cx="100" cy="140" r="1.8" fill="#fff"/>') },
    { id:'hoodie-blue', cat:'top', name:'Cozy Blue Hoodie', price:80, svg: longTop('#2f6fd6', '<path d="M78,113 q22,-14 44,0" fill="none" stroke="#2559b0" stroke-width="8" stroke-linecap="round"/><rect x="78" y="160" width="44" height="22" rx="8" fill="rgba(0,0,0,.15)"/><path d="M93,114 v18 M107,114 v18" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>') },
    { id:'beaver-tee', cat:'top', name:'Beaver Trapper Tee', price:100, svg: tee('#8a5a35', '<circle cx="85" cy="137" r="5" fill="#c08a5a"/><circle cx="115" cy="137" r="5" fill="#c08a5a"/><circle cx="100" cy="150" r="17" fill="#c08a5a"/><circle cx="94" cy="146" r="2.2" fill="#2a1615"/><circle cx="106" cy="146" r="2.2" fill="#2a1615"/><ellipse cx="100" cy="153" rx="4" ry="3" fill="#2a1615"/><rect x="96" y="156" width="8" height="7" fill="#fff" stroke="#2a1615" stroke-width="1"/>') },
    { id:'apron', cat:'top', name:'Cookie Baker Apron', price:120, svg: tee('#d42a2a', '<path d="M78,120 h44 v70 q-22,8 -44,0 z" fill="#fff"/><path d="M78,121 q22,-12 44,0" fill="none" stroke="#fff" stroke-width="3"/><circle cx="100" cy="158" r="12" fill="#b31212"/><circle cx="96" cy="154" r="2" fill="#fff"/><circle cx="104" cy="160" r="2" fill="#fff"/><circle cx="99" cy="164" r="1.6" fill="#fff"/>') },
    { id:'suit', cat:'top', name:'Anchor Desk Suit', price:200, svg: longTop('#1f2b4d', '<path d="M86,110 L100,150 L114,110 z" fill="#fff"/><path d="M96,116 h8 l-2,6 l4,26 l-6,6 l-6,-6 l4,-26 z" fill="#c21d1d"/><path d="M86,110 L100,150 M114,110 L100,150" stroke="#141d36" stroke-width="2"/><circle cx="100" cy="172" r="2.5" fill="#d9c27a"/>') },

    /* Bottoms */
    { id:'jeans', cat:'bottom', name:'Blue Jeans', price:0, svg: pants('#3c5a99', '<path d="M86,198 v46 M114,198 v46" stroke="rgba(255,255,255,.25)" stroke-width="2"/>') },
    { id:'shorts', cat:'bottom', name:'Khaki Shorts', price:30, svg: pants('#c9a66b', '', 26) },
    { id:'skirt', cat:'bottom', name:'Purple Skirt', price:50, svg: '<path d="M68,180 h64 l14,46 h-92 z" fill="#7a3fb5"/><path d="M68,186 h64" stroke="#5e2c90" stroke-width="3"/>' },
    { id:'plaid', cat:'bottom', name:'Plaid Pants', price:70, svg: pants('#b31212', '<path d="M74,206 h24 M102,206 h24 M74,222 h24 M102,222 h24 M74,238 h24 M102,238 h24" stroke="#2a1615" stroke-width="3" opacity=".35"/><path d="M82,190 v58 M92,190 v58 M110,190 v58 M120,190 v58" stroke="#ffd84d" stroke-width="2" opacity=".6"/>') },
    { id:'suit-pants', cat:'bottom', name:'Suit Pants', price:120, svg: pants('#1f2b4d', '<path d="M86,198 v46 M114,198 v46" stroke="#141d36" stroke-width="2"/>') },

    /* Shoes */
    { id:'sneakers', cat:'shoes', name:'Everyday Sneakers', price:0, svg: shoes('#e9e4e2', 242, 16, '#b31212') },
    { id:'hightops', cat:'shoes', name:'Red High-Tops', price:60, svg: shoes('#c21d1d', 232, 26, '#ffffff') },
    { id:'boots', cat:'shoes', name:'Riverbank Boots', price:80, svg: shoes('#6b4226', 226, 32, '#3a2416') },
    { id:'dress-shoes', cat:'shoes', name:'Shiny Dress Shoes', price:100, svg: shoes('#1b1b1b', 244, 14) + '<path d="M76,247 h10 M106,247 h10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>' },
    { id:'gold-kicks', cat:'shoes', name:'Golden Kicks', price:220, svg: shoes('#e5b73b', 240, 18, '#fff7d6') + '<path d="M78,246 l6,4 M108,246 l6,4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' },

    /* Hats */
    { id:'no-hat', cat:'hat', name:'No Hat', price:0, svg:'' },
    { id:'beanie', cat:'hat', name:'Green Beanie', price:40, svg:'<path d="M63,64 a37,36 0 0 1 74,0 z" fill="#2f9e57"/><rect x="62" y="57" width="76" height="12" rx="6" fill="#1e7a40"/><circle cx="100" cy="27" r="7" fill="#ffd84d"/>' },
    { id:'cap-gns', cat:'hat', name:'GNS Ball Cap', price:50, svg:'<path d="M64,62 a36,34 0 0 1 72,0 z" fill="#930000"/><path d="M100,60 h46 q5,7 -4,9 h-42 z" fill="#6d0000"/><circle cx="96" cy="44" r="8" fill="#fff"/><text x="96" y="47.5" font-size="9" text-anchor="middle" font-weight="900" font-family="Arial,sans-serif" fill="#930000">G</text>' },
    { id:'chef', cat:'hat', name:'Chef Hat', price:90, svg:'<rect x="72" y="40" width="56" height="22" rx="3" fill="#fff" stroke="#e3d6d4" stroke-width="2"/><circle cx="80" cy="34" r="14" fill="#fff" stroke="#e3d6d4" stroke-width="2"/><circle cx="120" cy="34" r="14" fill="#fff" stroke="#e3d6d4" stroke-width="2"/><circle cx="100" cy="26" r="16" fill="#fff" stroke="#e3d6d4" stroke-width="2"/>' },
    { id:'beaver-hat', cat:'hat', name:'Beaver Hat', price:150, svg:'<circle cx="70" cy="34" r="9" fill="#8a5a35"/><circle cx="130" cy="34" r="9" fill="#8a5a35"/><circle cx="70" cy="34" r="4" fill="#d9a77a"/><circle cx="130" cy="34" r="4" fill="#d9a77a"/><path d="M62,64 a38,38 0 0 1 76,0 z" fill="#8a5a35"/><rect x="62" y="58" width="76" height="9" rx="4" fill="#6b4226"/>' },
    { id:'top-hat', cat:'hat', name:'Mogul Top Hat', price:180, svg:'<rect x="74" y="4" width="52" height="40" rx="4" fill="#1b1b1b"/><rect x="74" y="33" width="52" height="7" fill="#930000"/><rect x="60" y="40" width="80" height="9" rx="4" fill="#1b1b1b"/>' },
    { id:'crown', cat:'hat', name:"Speaker's Crown", price:300, svg:'<path d="M68,46 l8,-28 l12,16 l12,-22 l12,22 l12,-16 l8,28 z" fill="#f2c230" stroke="#c99a12" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="36" r="4" fill="#c21d1d"/><circle cx="84" cy="39" r="3" fill="#2f6fd6"/><circle cx="116" cy="39" r="3" fill="#2f9e57"/>' },

    /* Extras */
    { id:'no-extra', cat:'extra', name:'Nothing Extra', price:0, svg:'' },
    { id:'glasses', cat:'extra', name:'Reading Glasses', price:30, svg:'<circle cx="87" cy="72" r="9" fill="rgba(255,255,255,.25)" ' + GLASS + '/><circle cx="113" cy="72" r="9" fill="rgba(255,255,255,.25)" ' + GLASS + '/><path d="M96,72 h8" ' + GLASS + '/>' },
    { id:'shades', cat:'extra', name:'Cool Shades', price:60, svg:'<rect x="76" y="65" width="21" height="14" rx="6" fill="#1b1b1b"/><rect x="103" y="65" width="21" height="14" rx="6" fill="#1b1b1b"/><path d="M97,70 h6" stroke="#1b1b1b" stroke-width="3"/><path d="M80,69 l5,0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>' },
    { id:'bowtie', cat:'extra', name:'Red Bow Tie', price:70, svg:'<path d="M100,110 l-15,-9 v18 z M100,110 l15,-9 v18 z" fill="#c21d1d"/><circle cx="100" cy="110" r="4" fill="#930000"/>' },
    { id:'press', cat:'extra', name:'Press Badge', price:80, svg:'<path d="M110,112 l7,16" stroke="#930000" stroke-width="2"/><rect x="104" y="128" width="27" height="18" rx="3" fill="#fff" stroke="#930000" stroke-width="2"/><text x="117.5" y="140" text-anchor="middle" font-size="7" font-weight="900" font-family="Arial,sans-serif" fill="#930000">PRESS</text>' },
    { id:'medal', cat:'extra', name:'Gold Medal', price:200, svg:'<path d="M90,110 l10,26 l10,-26" fill="none" stroke="#2f6fd6" stroke-width="5"/><circle cx="100" cy="142" r="10" fill="#f2c230" stroke="#c99a12" stroke-width="2"/><path d="M100,136 l1.9,4 4.3,.5 -3.2,2.9 .9,4.2 -3.9,-2.2 -3.9,2.2 .9,-4.2 -3.2,-2.9 4.3,-.5 z" fill="#fff6c8"/>' },
    { id:'cape', cat:'extra', name:'Hero Cape', price:250, back:'<path d="M70,112 L40,250 Q100,266 160,250 L130,112 z" fill="#c21d1d"/><path d="M70,112 L40,250 Q60,256 80,258 L84,118 z" fill="rgba(0,0,0,.12)"/>', svg:'<circle cx="72" cy="115" r="4.5" fill="#f2c230"/><circle cx="128" cy="115" r="4.5" fill="#f2c230"/>' }
  ];
  var BY_ID = {}; ITEMS.forEach(function(i){ BY_ID[i.id] = i; });
  var CATS = [['top', 'Tops'], ['bottom', 'Bottoms'], ['shoes', 'Shoes'], ['hat', 'Hats'], ['extra', 'Extras']];
  var DEFAULT_WEAR = { top:'tee-red', bottom:'jeans', shoes:'sneakers', hat:'no-hat', extra:'no-extra' };

  /* ---------- Saved data ---------- */
  function fresh(){
    var owned = {}; ITEMS.forEach(function(i){ if (!i.price) owned[i.id] = true; });
    return { v:1, points:START_BONUS, earned:START_BONUS, owned:owned, wear:JSON.parse(JSON.stringify(DEFAULT_WEAR)), skin:1, hair:0, isNew:true };
  }
  function load(){
    var d = null; try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(e){}
    if (!d || d.v !== 1) return fresh();
    var f = fresh();
    d.owned = d.owned || {}; Object.keys(f.owned).forEach(function(k){ d.owned[k] = true; });
    d.wear = d.wear || {}; CATS.forEach(function(c){ var w = d.wear[c[0]]; if (!BY_ID[w] || !d.owned[w]) d.wear[c[0]] = DEFAULT_WEAR[c[0]]; });
    if (!(d.skin >= 0 && d.skin < SKINS.length)) d.skin = 1;
    if (!(d.hair >= 0 && d.hair < HAIRS.length)) d.hair = 0;
    d.points = Math.max(0, d.points | 0); d.earned = Math.max(d.points, d.earned | 0); d.isNew = false;
    return d;
  }
  var D = load();
  function save(){ try { localStorage.setItem(KEY, JSON.stringify({ v:1, points:D.points, earned:D.earned, owned:D.owned, wear:D.wear, skin:D.skin, hair:D.hair })); } catch(e){} }
  save();

  /* ---------- Avatar drawing ---------- */
  function avatar(wear, label){
    var skin = SKINS[D.skin], hair = HAIRS[D.hair];
    var it = function(cat){ return BY_ID[wear[cat]] || BY_ID[DEFAULT_WEAR[cat]]; };
    var ex = it('extra');
    return '<svg viewBox="0 0 200 270" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true" focusable="false"') + '>' +
      (ex.back || '') +
      '<rect x="78" y="190" width="18" height="62" rx="8" fill="' + skin + '"/><rect x="104" y="190" width="18" height="62" rx="8" fill="' + skin + '"/>' +
      it('shoes').svg + it('bottom').svg +
      '<rect x="46" y="118" width="18" height="72" rx="9" fill="' + skin + '"/><rect x="136" y="118" width="18" height="72" rx="9" fill="' + skin + '"/>' +
      '<rect x="91" y="98" width="18" height="18" fill="' + skin + '"/>' +
      it('top').svg +
      '<circle cx="100" cy="70" r="36" fill="' + skin + '"/>' +
      '<circle cx="79" cy="83" r="5" fill="#ff8f8f" opacity=".45"/><circle cx="121" cy="83" r="5" fill="#ff8f8f" opacity=".45"/>' +
      '<circle cx="87" cy="72" r="4" fill="#2a1615"/><circle cx="113" cy="72" r="4" fill="#2a1615"/>' +
      '<path d="M88,86 q12,10 24,0" fill="none" stroke="#2a1615" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M64,68 C62,40 82,32 100,32 C118,32 138,40 136,68 C130,54 118,48 100,50 C82,48 70,54 64,68 z" fill="' + hair + '"/>' +
      it('hat').svg + ex.svg +
      '</svg>';
  }

  /* ---------- Masthead counter ---------- */
  function paintCount(bump){
    var n = document.getElementById('pp-count'); if (!n) return;
    n.textContent = D.points.toLocaleString('en-US');
    var pill = document.getElementById('pp-pill');
    if (bump && pill){ pill.classList.remove('pop'); void pill.offsetWidth; pill.classList.add('pop'); }
  }

  /* ---------- Awards (used by the games) ---------- */
  var LOGO = 'logo.png';
  function goCloset(e){
    if (e) e.preventDefault();
    var x = document.getElementById('mclose'), m = document.getElementById('modal');
    if (m && !m.hidden && x) x.click();
    var s = document.getElementById('avatar'); if (s) s.scrollIntoView({ behavior:'smooth', block:'start' });
  }
  function award(game, pts){
    pts = Math.max(0, pts | 0);
    D.points += pts; D.earned += pts; save(); paintCount(true); renderAll();
    var box = document.createElement('div'); box.className = 'pp-award'; box.setAttribute('role', 'status');
    var img = document.createElement('img'); img.src = LOGO; img.alt = 'Richard Powers'; box.appendChild(img);
    var t = document.createElement('div');
    var h = document.createElement('strong'); h.textContent = '+' + pts + ' Powers Points!'; t.appendChild(h);
    var p = document.createElement('p');
    p.textContent = '"Great work on ' + game + '! Here are ' + pts + ' Powers Points," says Richard Powers. You now have ' + D.points.toLocaleString('en-US') + '.';
    t.appendChild(p);
    var a = document.createElement('a'); a.className = 'btn'; a.href = '#avatar'; a.textContent = 'Shop my closet'; a.onclick = goCloset; t.appendChild(a);
    box.appendChild(t);
    return box;
  }
  function miss(hint){
    var box = document.createElement('div'); box.className = 'pp-miss';
    box.textContent = hint;
    return box;
  }

  /* ---------- My Avatar section ---------- */
  var cat = 'top', note = '';
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function renderAll(){
    var root = document.getElementById('avatar-app'); if (!root) return;
    var me = document.getElementById('av-me'), closet = document.getElementById('av-closet');
    if (!me){
      root.innerHTML =
        '<div class="av-me" id="av-me"></div>' +
        '<div class="av-closet"><div class="av-tabs" role="group" aria-label="Clothing types" id="av-tabs"></div>' +
        '<p class="av-note" id="av-note" role="status" aria-live="polite"></p><div class="av-items" id="av-closet"></div></div>';
      root.addEventListener('click', onClick);
      me = document.getElementById('av-me'); closet = document.getElementById('av-closet');
    }
    me.innerHTML =
      '<div class="av-figure">' + avatar(D.wear, 'Your GNS Kids avatar') + '</div>' +
      '<div class="av-bal"><span class="av-star" aria-hidden="true">★</span><b>' + D.points.toLocaleString('en-US') + '</b><span>Powers Points</span></div>' +
      '<div class="av-pick"><span class="av-lbl" id="lbl-skin">Skin</span><div class="av-sw" role="group" aria-labelledby="lbl-skin">' +
        SKINS.map(function(c, i){ return '<button type="button" data-skin="' + i + '" aria-label="Skin tone ' + (i + 1) + '" aria-pressed="' + (D.skin === i) + '" style="background:' + c + '"></button>'; }).join('') + '</div></div>' +
      '<div class="av-pick"><span class="av-lbl" id="lbl-hair">Hair</span><div class="av-sw" role="group" aria-labelledby="lbl-hair">' +
        HAIRS.map(function(c, i){ return '<button type="button" data-hair="' + i + '" aria-label="Hair color ' + (i + 1) + '" aria-pressed="' + (D.hair === i) + '" style="background:' + c + '"></button>'; }).join('') + '</div></div>' +
      '<div class="av-earn"><strong>How to earn Powers Points</strong><ul>' +
        '<li><span>From Hovel to the House</span><span>Finish the story: 50</span></li>' +
        '<li><span>GNS Fact Desk</span><span>6+ right: 20 · 8+: 40 · 10: 60</span></li>' +
        '<li><span>Beaver Trapping</span><span>15+ pts: 15 · 30+: 30 · 45+: 50</span></li>' +
        "<li><span>Big Ole' Red Cookie</span><span>1 star: 15 · 2: 30 · 3: 50</span></li>" +
        '<li><span>GNS Word Search</span><span>Find all 10 words: 40</span></li>' +
        '<li><span>GNS Crossword</span><span>Solve it yourself: 60</span></li>' +
      '</ul><p>Your points and clothes are saved on this device.</p></div>';
    document.getElementById('av-tabs').innerHTML = CATS.map(function(c){
      var n = ITEMS.filter(function(i){ return i.cat === c[0] && !D.owned[i.id]; }).length;
      return '<button type="button" data-cat="' + c[0] + '" aria-pressed="' + (cat === c[0]) + '">' + c[1] + (n ? ' <span class="av-n">' + n + ' locked</span>' : '') + '</button>';
    }).join('');
    document.getElementById('av-note').textContent = note;
    closet.innerHTML = ITEMS.filter(function(i){ return i.cat === cat; }).map(function(i){
      var w = JSON.parse(JSON.stringify(D.wear)); w[i.cat] = i.id;
      var own = !!D.owned[i.id], on = D.wear[i.cat] === i.id, btn;
      if (on) btn = '<button type="button" class="btn ghost" aria-disabled="true">Wearing ✓</button>';
      else if (own) btn = '<button type="button" class="btn" data-wear="' + i.id + '">Wear</button>';
      else if (D.points >= i.price) btn = '<button type="button" class="btn green" data-buy="' + i.id + '">Unlock for ' + i.price + '</button>';
      else btn = '<button type="button" class="btn ghost" disabled>Need ' + (i.price - D.points) + ' more</button>';
      return '<article class="av-item' + (on ? ' on' : '') + (own ? '' : ' locked') + '" data-item="' + i.id + '">' +
        '<div class="av-mini">' + avatar(w) + (own ? '' : '<span class="av-lock">★ ' + i.price + '</span>') + '</div>' +
        '<h3>' + esc(i.name) + '</h3>' + btn + '</article>';
    }).join('');
  }
  function onClick(e){
    var b = e.target.closest('button'); if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    if (b.dataset.cat){ cat = b.dataset.cat; note = ''; renderAll(); return; }
    if (b.dataset.skin){ D.skin = +b.dataset.skin; save(); renderAll(); return; }
    if (b.dataset.hair){ D.hair = +b.dataset.hair; save(); renderAll(); return; }
    var id = b.dataset.wear || b.dataset.buy, i = BY_ID[id]; if (!i) return;
    if (b.dataset.buy){
      if (D.owned[id] || D.points < i.price) return;
      D.points -= i.price; D.owned[id] = true; note = 'You unlocked the ' + i.name + '! Richard Powers says it looks sharp.';
      paintCount(true);
    } else note = 'You put on the ' + i.name + '.';
    D.wear[i.cat] = id; save(); renderAll();
    var same = document.querySelector('#av-closet [data-item="' + id + '"] button'); if (same) same.focus();
  }

  window.PowersPoints = { award: award, miss: miss, points: function(){ return D.points; } };
  function init(){
    paintCount(false); renderAll();
    if (D.isNew){ note = 'Welcome! Richard Powers gave you ' + START_BONUS + ' Powers Points to start. Win games to earn more.'; renderAll(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
