/* =====================================================================
   MAIN.JS · Lógica de la página
   ---------------------------------------------------------------------
   Casi todo lo que querrás cambiar (WhatsApp, mapa, imágenes, videos,
   servicios, textos del buscador) está en  js/config.js
   Este archivo solo "arma" la página con esa información.
   ===================================================================== */
(function () {
  "use strict";
  var C = window.CLINICA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDesktop = function () { return window.matchMedia("(min-width: 900px)").matches; };
  var canHover = window.matchMedia("(hover: hover)").matches;

  /* ───────────── utilidades ───────────── */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3600);
  }
  function wa(text) { return "https://wa.me/" + String(C.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(text); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function icon(id) { return '<svg class="ic"><use href="#i-' + id + '"/></svg>'; }

  /* ───────────── textos y enlaces fijos ───────────── */
  $$("[data-brand]").forEach(function (e) { e.textContent = C.nombre; });
  $("#mapBtn").href = C.mapaUrl;
  $("#igLink").href = C.redes.instagram;
  $("#ttLink").href = C.redes.tiktok;
  $("#footWa").href = wa(C.mensajes.general);

  /* ───────────── CARRITO (lista de servicios de interés) ───────────── */
  var cart = [];
  function cartMessage(extra) {
    return C.mensajes.conServicios + "\n" + cart.map(function (n) { return "• " + n; }).join("\n") + (extra ? "\n" + extra : "");
  }
  function renderCart(bump) {
    var n = cart.length;
    $("#navCtaLabel").textContent = n ? "Consultar servicios" : "Agenda tu cita";
    $("#navCart").hidden = !n; $("#navCount").textContent = n;
    $("#navCta").href = wa(n ? cartMessage() : C.mensajes.cita);
    $("#catalogLabel").textContent = n ? "Enviar mi consulta (" + n + ")" : "Ver el catálogo completo";
    $("#bookBtn").href = wa(n ? cartMessage("Quisiera agendar una cita.") : C.mensajes.cita);
    $$("[data-cart]").forEach(function (b) {
      var on = cart.indexOf(b.getAttribute("data-cart")) > -1;
      b.setAttribute("aria-pressed", on);
      if (b.classList.contains("chip")) b.textContent = on ? "✓ Agregado a mi consulta" : "Agregar a mi consulta";
    });
    if (bump) { var c = $("#navCta"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  }
  function toggleCart(name) {
    var i = cart.indexOf(name);
    if (i > -1) cart.splice(i, 1); else cart.push(name);
    renderCart(true);
  }
  $("#catalogBtn").addEventListener("click", function () {
    window.open(wa(cart.length ? cartMessage() : C.mensajes.catalogo), "_blank", "noopener");
  });

  /* ───────────── TARJETAS DE SERVICIOS ───────────── */
  var cardsBox = $("#cards");
  C.servicios.forEach(function (s, i) {
    var card = el("article", "card");
    card.innerHTML =
      '<span class="card__tag">' + esc(s.etiqueta) + '</span>' +
      '<button class="card__cart" type="button" data-cart="' + esc(s.nombre) + '" aria-pressed="false" aria-label="Agregar ' + esc(s.nombre) + ' a mi consulta">' + icon("cart") + '</button>' +
      '<div class="card__img"><img src="' + esc(s.imagen) + '" alt="" loading="lazy"></div>' +
      '<h3 class="card__title">' + esc(s.nombre) + '</h3>' +
      '<p class="card__desc">' + esc(s.descripcion) + '</p>' +
      '<a class="card__btn" target="_blank" rel="noopener" href="' + wa(C.mensajes.servicio.replace("{servicio}", s.nombre)) + '"><span>Consultar por WhatsApp</span>' + icon("chat") + '</a>';
    $(".card__cart", card).addEventListener("click", function (e) {
      toggleCart(s.nombre);
      var b = e.currentTarget; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    });
    cardsBox.appendChild(card);
  });
  renderCart();

  /* ═════════════════════════════════════════════════════════════════
     HERO 360°
     ═════════════════════════════════════════════════════════════════ */
  var hero = $("#hero"), canvas = $("#panoCanvas"), pointsBox = $("#heroPoints");
  var scenes = C.hero.escenas, sceneMap = {};
  scenes.forEach(function (s) { sceneMap[s.id] = s; });
  var current = sceneMap[C.hero.escenaInicial] || scenes[0];
  var state = "intro", pano = null, hotspots = [];

  // 👉 Texto pequeño del botón de inicio (cámbialo si quieres)
  $("#heroPillText").textContent = (canHover && isDesktop()) ? "Arrastra el mouse para explorar · Rueda del mouse para hacer zoom" : "Desliza tus dedos para explorar";
  $("#heroBack").hidden = false;
  $("#sceneName").textContent = current.nombre;

  // Video de intro (opcional)
  var hv = $("#heroVideo");
  if (C.hero.video) {
    hv.src = C.hero.video; if (C.hero.videoPoster) hv.poster = C.hero.videoPoster; hv.hidden = false;
    var pp = hv.play(); if (pp && pp.catch) pp.catch(function () {});
  }

  function showFallback() {
    var f = $("#heroFallback"); f.src = current.imagen; f.hidden = false; canvas.hidden = true;
    $("#heroPillText").textContent = "Conoce nuestro espacio";
  }

  /* Los botones del recorrido se colocan en el BORDE de la imagen, en la dirección real hacia donde está cada lugar
     (izquierda, derecha, arriba, abajo). Así nunca tapan el centro y la persona entiende hacia dónde ir. */
  function placeHotspots(pn) {
    var W = pn._w, H = pn._h, desk = isDesktop(), padX = 14, padTop = desk ? 104 : 98, padBot = desk ? 112 : 104, items = [], i, j, k;
    for (i = 0; i < hotspots.length; i++) {
      var h = hotspots[i];
      if (!h.w) { h.w = h.el.offsetWidth || 110; h.h = h.el.offsetHeight || 32; }
      var r = pn.project(h.p.yaw, h.p.pitch);
      var x0 = padX + h.w / 2, x1 = W - padX - h.w / 2, y0 = padTop + h.h / 2, y1 = H - padBot - h.h / 2;
      var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ax = Math.max(1, (x1 - x0) / 2), ay = Math.max(1, (y1 - y0) / 2);
      var vx = (W / 2 + r.nx * W / 2) - cx, vy = (H / 2 - r.ny * H / 2) - cy;
      if (Math.abs(vx) < 4 && Math.abs(vy) < 4) { vx = (i - 1) * 24; vy = -40; }       // justo enfrente: lo mandamos arriba
      var t = Math.max(Math.abs(vx) / ax, Math.abs(vy) / ay);
      items.push({ h: h, x: cx + vx / t, y: cy + vy / t, x0: x0, x1: x1, y0: y0, y1: y1 });
    }
    for (k = 0; k < 6; k++) {                                                            // si dos se pisan, los separamos
      for (i = 0; i < items.length; i++) for (j = i + 1; j < items.length; j++) {
        var a = items[i], b = items[j];
        var ox = (a.h.w + b.h.w) / 2 + 8 - Math.abs(a.x - b.x), oy = (a.h.h + b.h.h) / 2 + 8 - Math.abs(a.y - b.y);
        if (ox > 0 && oy > 0) {
          if (oy <= ox) { var dy = a.y <= b.y ? -1 : 1; a.y += dy * oy / 2; b.y -= dy * oy / 2; }
          else { var dx = a.x <= b.x ? -1 : 1; a.x += dx * ox / 2; b.x -= dx * ox / 2; }
          a.x = Math.min(a.x1, Math.max(a.x0, a.x)); a.y = Math.min(a.y1, Math.max(a.y0, a.y));
          b.x = Math.min(b.x1, Math.max(b.x0, b.x)); b.y = Math.min(b.y1, Math.max(b.y0, b.y));
        }
      }
    }
    items.forEach(function (it) {
      var e2 = it.h.el;
      if (!e2._placed) { e2.style.transition = "none"; }                              // la primera vez aparece directo en su lugar
      e2.style.transform = "translate(" + it.x.toFixed(1) + "px," + it.y.toFixed(1) + "px) translate(-50%,-50%)";
      e2.classList.add("is-visible");
      if (!e2._placed) { void e2.offsetWidth; e2.style.transition = ""; e2._placed = true; }
    });
  }

  function renderPoints() {
    pointsBox.innerHTML = ""; hotspots = [];
    current.puntos.forEach(function (p) {
      var b = el("button", "hs", "<i></i><span>" + esc(p.texto) + "</span>");
      b.type = "button"; b.setAttribute("aria-label", "Ir a " + p.texto);
      b.addEventListener("click", function () { goTo(p); });
      pointsBox.appendChild(b); hotspots.push({ el: b, p: p });
    });
  }

  if (window.Pano) {
    pano = new Pano(canvas);
    if (pano.ok) {
      pano.autoRotate = reduceMotion ? 0 : 0.035;
      pano.onFrame = function (pn) {
        if (state !== "tour" && state !== "starting") return;
        placeHotspots(pn);
      };
      // Modo ayuda: abre la página con ?editar al final y toca para ver yaw/pitch
      if (/[?&]editar/.test(location.search)) {
        pano.onTap = function (yaw, pitch) { toast("yaw: " + yaw + "  ·  pitch: " + pitch + "  (cópialos en config.js)"); console.log("yaw:", yaw, "pitch:", pitch); };
      }
      pano.show(current.imagen, current.mirarYaw, current.mirarPitch, current.angulo).then(function () {
        canvas.classList.add("is-ready"); renderPoints();
      }).catch(function (err) {
        console.warn("No se pudo iniciar el 360:", err);
        if (location.protocol === "file:") toast("Para ver el 360° abre el proyecto con Live Server (ver LEEME.md).");
        showFallback(); pano = null;
      });
    } else { showFallback(); pano = null; }
  } else { showFallback(); }

  function startTour() {
    if (state !== "intro" || !pano) return;
    state = "starting";
    hero.classList.add("hero--starting");
    // El video se acerca y se desvanece (efecto parallax) mientras entra el 360
    if (!hv.hidden) { hv.style.opacity = 0; hv.style.transform = "scale(1.28)"; }
    pano.autoRotate = 0; pano.intro();
    scenes.forEach(function (s) { if (s !== current) { var im = new Image(); im.src = s.imagen; } });   // precarga
    setTimeout(function () {
      hero.classList.remove("hero--intro", "hero--starting"); hero.classList.add("hero--tour");
      $("#heroPill").classList.remove("is-pulse"); state = "tour";
    }, 900);
  }
  function exitTour() {
    if (state !== "tour" || !pano) return;
    state = "intro";
    hero.classList.remove("hero--tour"); hero.classList.add("hero--intro");
    $("#heroPill").classList.add("is-pulse");
    if (!hv.hidden) { hv.style.opacity = 1; hv.style.transform = "none"; }
    current = sceneMap[C.hero.escenaInicial] || scenes[0];
    $("#sceneName").textContent = current.nombre;
    pano.interactive = false; pano.autoRotate = reduceMotion ? 0 : 0.035;
    pano.show(current.imagen, current.mirarYaw, current.mirarPitch, current.angulo).then(renderPoints);
  }
  function goTo(p) {
    var next = sceneMap[p.a]; if (!next || !pano || state !== "tour") return;
    state = "travel"; pointsBox.classList.add("off"); $("#heroFlash").classList.add("on");
    pano.travel(next.imagen, { lookYaw: p.yaw, lookPitch: p.pitch, yaw: next.mirarYaw, pitch: next.mirarPitch, angulo: next.angulo }).then(function () {
      current = next; $("#sceneName").textContent = next.nombre; renderPoints();
      pointsBox.classList.remove("off"); $("#heroFlash").classList.remove("on"); state = "tour";
    }).catch(function () { pointsBox.classList.remove("off"); $("#heroFlash").classList.remove("on"); state = "tour"; toast("No se pudo cargar esa vista."); });
  }

  hero.addEventListener("click", function (e) {
    if (state === "intro" && !e.target.closest(".hero__back, .hero__full, .hero__gyro")) startTour();
  });
  $("#heroBack").addEventListener("click", function (e) { e.stopPropagation(); exitTour(); });
  $("#heroFull").addEventListener("click", function (e) {
    e.stopPropagation();
    if (document.fullscreenElement) document.exitFullscreen(); else if (hero.requestFullscreen) hero.requestFullscreen();
  });

  // Giroscopio (mover el celular para mirar alrededor)
  var gyroBtn = $("#heroGyro");
  if (C.hero.botonGiroscopio && "DeviceOrientationEvent" in window && window.matchMedia("(hover: none)").matches) gyroBtn.hidden = false;
  gyroBtn.addEventListener("click", function (e) {
    e.stopPropagation(); if (!pano) return;
    if (pano.hasGyro()) { pano.disableGyro(); gyroBtn.classList.remove("is-on"); $("#gyroText").textContent = "Giroscopio"; toast("Giroscopio desactivado."); return; }
    pano.enableGyro().then(function (ok) {
      if (ok) { gyroBtn.classList.add("is-on"); $("#gyroText").textContent = "Giroscopio activo"; toast("Giroscopio activo: mueve tu celular para mirar."); }
      else toast("No se pudo activar el giroscopio en este dispositivo.");
    });
  });

  /* ═════════════════════════════════════════════════════════════════
     BUSCADOR (respuestas predeterminadas + Google Sheets opcional)
     ═════════════════════════════════════════════════════════════════ */
  var catalog = C.catalogoLocal.slice(), faqs = C.preguntasLocal.slice();

  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false, i, ch;
    for (i = 0; i < text.length; i++) {
      ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    if (!rows.length) return [];
    var head = rows.shift().map(function (h) { return norm(h).replace(/ /g, "_"); });
    return rows.filter(function (r) { return r.join("").trim(); }).map(function (r) { var o = {}; head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); }); return o; });
  }
  function loadSheet(url) { return fetch(url, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(parseCSV); }
  /* Busca el primer encabezado que exista (así puedes llamar a tus columnas de varias formas) */
  function pick(r, names) { for (var i = 0; i < names.length; i++) if (r[names[i]]) return r[names[i]]; return ""; }
  function sameName(a, b) {
    a = norm(a); b = norm(b); if (!a || !b) return false; if (a === b) return true;
    if (a.replace(/ /g, "").split("").sort().join("") === b.replace(/ /g, "").split("").sort().join("")) return true;   // tolera letras cambiadas de lugar ("Pedriatría")
    return Math.min(a.length, b.length) >= 5 && (a.indexOf(b) === 0 || b.indexOf(a) === 0);
  }
  if (C.sheetServicios) {
    loadSheet(C.sheetServicios).then(function (rows) {
      var fromSheet = [];
      rows.forEach(function (r) {
        var keys = Object.keys(r);
        var name = pick(r, ["nombre", "nombre_del_servicio", "servicio", "servicios", "producto", "nombre_servicio"]) || r[keys[0]];
        if (!name) return;
        var disp = pick(r, ["disponible", "disponibilidad", "estado", "disponibilidad_del_servicio"]) || r[keys[1]] || "";
        var local = null; C.catalogoLocal.forEach(function (l) { if (!local && sameName(l.nombre, name)) local = l; });
        var yes = /^(si|true|1|x|disponible|yes|activo|ok)/.test(norm(disp));
        fromSheet.push({
          nombre: local ? local.nombre : name,                                         // usa el nombre bien escrito de config.js si coincide
          disponible: yes,
          palabrasClave: (pick(r, ["palabras_clave", "palabras", "keywords"]) || (local ? local.palabrasClave : "")) + "," + name,
          descripcion: pick(r, ["descripcion", "descripcion_corta"]) || (local ? local.descripcion : ""),
          respuesta: pick(r, ["respuesta", "respuesta_predeterminada"]) || (local && !yes && local.disponible === false ? local.respuesta : ""),
          fromSheet: true
        });
      });
      if (fromSheet.length) {
        var rest = C.catalogoLocal.filter(function (l) { return !fromSheet.some(function (f) { return sameName(f.nombre, l.nombre); }); });
        catalog = fromSheet.concat(rest);                                              // lo que no está en la hoja usa la lista de config.js
        console.log("Hoja de servicios conectada:", fromSheet.length, "filas");
      }
    }).catch(function (e) { console.warn("Hoja de servicios no disponible, uso la lista local.", e); });
  }
  if (C.sheetPreguntas) {
    loadSheet(C.sheetPreguntas).then(function (rows) {
      var fromSheet = [];
      rows.forEach(function (r) {
        var keys = Object.keys(r);
        var q = pick(r, ["pregunta", "preguntas", "pregunta_frecuente", "consulta"]) || r[keys[0]];
        var ans = pick(r, ["respuesta", "respuestas", "respuesta_predeterminada"]);
        if (!ans) keys.forEach(function (k) { if (r[k] && r[k] !== q && r[k].length > ans.length) ans = r[k]; });   // si no hay columna "respuesta", usa el texto más largo
        if (q && ans) fromSheet.push({ pregunta: q, palabrasClave: pick(r, ["palabras_clave", "palabras", "keywords"]), respuesta: ans, fromSheet: true });
      });
      if (fromSheet.length) {
        var rest = faqs.filter(function (l) { return !fromSheet.some(function (f) { return norm(f.pregunta) === norm(l.pregunta); }); });
        faqs = fromSheet.concat(rest);
        console.log("Hoja de preguntas conectada:", fromSheet.length, "filas");
      }
    }).catch(function (e) { console.warn("Hoja de preguntas no disponible, uso la lista local.", e); });
  }

  function scoreEntry(q, terms) {
    var qt = q.split(" ").filter(function (t) { return t.length > 1; }), best = 0;
    terms.forEach(function (raw) {
      var t = norm(raw); if (!t) return;
      if (t === q) best = Math.max(best, 100);
      else if (q.length > 2 && t.indexOf(q) > -1) best = Math.max(best, 80);
      else if (t.length > 2 && q.indexOf(t) > -1) best = Math.max(best, 70);
      else {
        var tt = t.split(" "), shared = qt.filter(function (w) { return tt.some(function (x) { return x === w || (w.length >= 4 && x.length >= 4 && x.slice(0, 5) === w.slice(0, 5)); }); }).length;
        if (shared) best = Math.max(best, 40 + shared * 10);
      }
    });
    return best;
  }
  function findAnswer(query) {
    var q = norm(query), top = null, topScore = 0;
    catalog.forEach(function (s) {
      var sc = scoreEntry(q, [s.nombre].concat(String(s.palabrasClave).split(","))); if (sc && s.fromSheet) sc += 25;   // lo que escribes en la hoja tiene prioridad
      if (sc > topScore) { topScore = sc; top = { type: "servicio", data: s }; }
    });
    faqs.forEach(function (f) {
      var sc = scoreEntry(q, [f.pregunta].concat(String(f.palabrasClave).split(","))); if (sc && f.fromSheet) sc += 25;
      if (sc > topScore) { topScore = sc; top = { type: "faq", data: f }; }
    });
    return topScore >= 40 ? top : null;
  }

  var chat = $("#chat"), chips = $("#chips"), input = $("#searchInput"), sbtn = $("#searchBtn"), answered = false, lastQ = "", chatTimer;
  C.sugerencias.forEach(function (s) {
    var b = el("button", "chip", esc(s)); b.type = "button";
    b.addEventListener("click", function () { input.value = s; runSearch(s); });
    chips.appendChild(b);
  });
  function resetChat() {
    clearTimeout(chatTimer); answered = false; lastQ = ""; input.value = ""; sbtn.textContent = "Buscar";
    chat.innerHTML = ""; chat.appendChild(chips); $("#buscador").classList.remove("is-answered");
  }
  function runSearch(q) {
    q = q.trim(); if (!q) { input.focus(); return; }
    clearTimeout(chatTimer); answered = true; lastQ = q; sbtn.textContent = "Borrar";
    chat.innerHTML = "";
    chat.appendChild(el("div", "msg msg--user", esc(q)));
    var typing = el("div", "msg msg--bot msg--typing", "<i></i><i></i><i></i>"); chat.appendChild(typing);
    chatTimer = setTimeout(function () {
      typing.remove();
      var hit = findAnswer(q), html, acts = "";
      if (!hit) html = esc(C.sinResultado);
      else if (hit.type === "faq") html = esc(hit.data.respuesta);
      else {
        var s = hit.data;
        if (s.respuesta) html = esc(s.respuesta);
        else if (s.disponible) { html = "Sí, contamos con <strong>" + esc(s.nombre) + "</strong>. " + esc(s.descripcion) + " Agrégalo a tu consulta o escríbenos por WhatsApp para coordinar."; }
        else html = "Por ahora <strong>" + esc(s.nombre) + "</strong> no está disponible. Escríbenos por WhatsApp y te avisamos cuando tengamos novedades. Haz clic en el botón de abajo para ver lo que sí tenemos.";
        if (s.disponible && !s.respuesta) acts = '<button class="chip" type="button" data-cart="' + esc(s.nombre) + '" aria-pressed="false">Agregar a mi consulta</button>';
      }
      var bot = el("div", "msg msg--bot", "<div>" + html + "</div>" + (acts ? '<div class="msg__actions">' + acts + "</div>" : ""));
      var add = $("[data-cart]", bot); if (add) add.addEventListener("click", function () { toggleCart(add.getAttribute("data-cart")); });
      var back = el("div", "msg msg--back", '<button type="button">Volver</button>');       // "Volver" va en su propia burbuja
      back.addEventListener("click", resetChat);
      chat.appendChild(bot); chat.appendChild(back); renderCart();
      $("#buscador").classList.add("is-answered");
    }, 650);
  }
  $("#searchForm").addEventListener("submit", function (e) { e.preventDefault(); runSearch(input.value); });
  sbtn.addEventListener("click", function (e) { if (answered && input.value.trim() === lastQ) { e.preventDefault(); resetChat(); } });
  input.addEventListener("input", function () { if (answered && input.value.trim() !== lastQ) sbtn.textContent = "Buscar"; });

  /* ═════════════════════════════════════════════════════════════════
     ANTES Y DESPUÉS  (3 tarjetas → móvil: visor tipo TikTok · PC: se reproducen en su lugar)
     ═════════════════════════════════════════════════════════════════ */
  function autoplayUrl(u) { return /youtube|youtu\.be/.test(u) ? u + (u.indexOf("?") > -1 ? "&" : "?") + "autoplay=1&playsinline=1&rel=0" : u; }
  function makeMedia(v, o) {
    o = o || {};
    if (v.tipo === "iframe") {
      var f = document.createElement("iframe"); f.src = autoplayUrl(v.src); f.title = v.titulo || "Video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; return f;
    }
    var m = document.createElement("video"); m.src = v.src; if (v.poster) m.poster = v.poster; m.playsInline = true; m.setAttribute("playsinline", "");
    m.preload = "metadata"; m.loop = !!o.loop; m.muted = !!o.muted; m.controls = !!o.controls;
    m.addEventListener("error", function () { toast("Aún no hay video en esa ruta. Súbelo en assets/video y cámbialo en config.js"); });
    return m;
  }

  var baRow = $("#baRow"), baItems = [];
  C.videos.slice(0, 3).forEach(function (v, i) {
    var it = el("div", "ba__item"); it.tabIndex = 0; it.setAttribute("role", "button"); it.setAttribute("aria-label", "Reproducir " + (v.titulo || "video"));
    it.innerHTML = '<img src="' + esc(v.poster) + '" alt="' + esc(v.titulo || "") + '" loading="lazy"><span class="play">' + icon("play") + "</span>";
    
    // 👉 CORRECCIÓN APLICADA AQUÍ:
    function act() { 
      if (!canHover || window.innerWidth < 900) {
        openFeed(i);
      } else {
        playInPlace(it, v);
      }
    }
    
    it.addEventListener("click", act);
    it.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    baRow.appendChild(it); baItems.push(it);
  });
  function stopInPlace(it) {
    var m = $("video,iframe", it); if (m) m.remove(); it.classList.remove("is-playing");
  }
  function playInPlace(it, v) {
    if (it.classList.contains("is-playing")) return;
    baItems.forEach(stopInPlace);
    var m = makeMedia(v, { controls: true, loop: false }); it.appendChild(m); it.classList.add("is-playing");
    if (m.play) { var p = m.play(); if (p && p.catch) p.catch(function () {}); }
  }

  // Aparición aleatoria tipo carrusel (una sola vez, al llegar a la sección)
  function randBetween(a, b) { return a + Math.random() * (b - a); }
  var baSeen = false;
  function revealBA() {
    if (baSeen) return; baSeen = true;
    var order = baItems.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; });
    order.forEach(function (idx, k) {
      var it = baItems[idx], sign = Math.random() < .5 ? -1 : 1;
      it.style.setProperty("--dx", (sign * randBetween(50, 140)).toFixed(0) + "px");
      it.style.setProperty("--dr", (-sign * randBetween(8, 24)).toFixed(0) + "deg");
      it.style.setProperty("--delay", k * 170 + "ms");
      it.classList.add("in");
    });
  }

  /* Visor vertical tipo TikTok */
  var feed = $("#feed"), feedScroll = $("#feedScroll"), feedBuilt = false, feedMuted = true, feedActive = -1, feedIO, endIO, feedCloseTimer;
  function buildFeed() {
    if (feedBuilt) return; feedBuilt = true;
    C.videos.forEach(function (v, i) {
      var s = el("div", "feed__item"); s.setAttribute("data-i", i);
      s.innerHTML = '<img src="' + esc(v.poster) + '" alt="">'; feedScroll.appendChild(s);
      var tap = el("div", "feed__tap"); s.appendChild(tap);
      tap.addEventListener("click", function () { var m = $("video", s); if (m) { m.paused ? m.play() : m.pause(); } });
    });
    var end = el("div", "feed__end"); feedScroll.appendChild(end);
    feedIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) activate(+e.target.getAttribute("data-i")); });
    }, { root: feedScroll, threshold: .65 });
    $$(".feed__item", feedScroll).forEach(function (s) { feedIO.observe(s); });
    endIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && feed.classList.contains("open")) closeFeed(); }); }, { root: feedScroll, threshold: .5 });
    endIO.observe(end);
    feedScroll.addEventListener("scroll", function () { $("#feedHint").classList.add("gone"); }, { passive: true });
  }
  function clearSlides() { $$(".feed__item video, .feed__item iframe", feedScroll).forEach(function (m) { if (m.pause) m.pause(); m.remove(); }); feedActive = -1; }
  function activate(i) {
    if (i === feedActive) return; clearSlides(); feedActive = i;
    var s = $('.feed__item[data-i="' + i + '"]', feedScroll), v = C.videos[i]; if (!s) return;
    var m = makeMedia(v, { muted: feedMuted, loop: true }); s.insertBefore(m, $(".feed__tap", s));
    if (m.play) { var p = m.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function openFeed(i) {
    buildFeed(); clearTimeout(feedCloseTimer);
    feed.hidden = false; document.documentElement.classList.add("no-scroll");
    $("#feedHint").classList.remove("gone");
    feedScroll.scrollTo({ top: i * feedScroll.clientHeight, behavior: "instant" in window ? "instant" : "auto" });
    requestAnimationFrame(function () { feed.classList.add("open"); });
    activate(i);
  }
  function closeFeed() {
    feed.classList.remove("open"); document.documentElement.classList.remove("no-scroll");
    feedCloseTimer = setTimeout(function () { feed.hidden = true; clearSlides(); }, 360);
  }
  $("#feedClose").addEventListener("click", closeFeed);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !feed.hidden) closeFeed(); });
  $("#feedSound").addEventListener("click", function () {
    feedMuted = !feedMuted; var m = $(".feed__item video", feedScroll); if (m) m.muted = feedMuted;
    $("#feedSound use").setAttribute("href", feedMuted ? "#i-mute" : "#i-sound");
  });

  /* ═════════════════════════════════════════════════════════════════
     VIDEO "CONÓCENOS"
     ═════════════════════════════════════════════════════════════════ */
  var meetMedia = $("#meetMedia");
  $("#meetPoster").src = C.presentacion.poster;
  function playMeet() {
    if (meetMedia.classList.contains("is-playing")) return;
    var m = makeMedia(C.presentacion, { controls: true }); meetMedia.appendChild(m); meetMedia.classList.add("is-playing");
    if (m.play) { var p = m.play(); if (p && p.catch) p.catch(function () {}); }
  }
  meetMedia.addEventListener("click", playMeet);

  /* ═════════════════════════════════════════════════════════════════
     EFECTOS DE SCROLL
     ═════════════════════════════════════════════════════════════════ */
  // Aparición suave
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(function (n) { io.observe(n); });
    var cardIO = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { cardEls.forEach(function (c) { c.classList.add("in"); }); cardIO.disconnect(); }
    }, { threshold: .25 });
    cardIO.observe($("#cards"));
    var baIO = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { revealBA(); baIO.disconnect(); } }, { threshold: .25 });
    baIO.observe(baRow);
  } else { $$(".reveal, .card").forEach(function (n) { n.classList.add("in"); }); revealBA(); }

  // Efectos con el scroll: tarjetas (móvil), instrumentos, menú sólido y video "Conócenos" (PC)
  var imgs = $$(".card__img"), cardEls = $$(".card"), meet = $(".meet"), nav = $("#nav"), ticking = false;
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function cardsIntro() {
    // 👉 MÓVIL: cada tarjeta "se asienta" al aparecer (como un coverflow vertical) y se guarda suave bajo el menú.
    var vh = window.innerHeight, on = !isDesktop() && !reduceMotion;
    cardEls.forEach(function (c) {
      if (!on) { ["--ty", "--rx", "--sc", "--op"].forEach(function (v) { c.style.removeProperty(v); }); return; }
      var r = c.getBoundingClientRect(), e = clamp01((vh * 0.98 - r.top) / (vh * 0.42)); e = e * e * (3 - 2 * e);
      var l = clamp01((90 - r.top) / (r.height * 0.9));
      c.style.setProperty("--ty", ((1 - e) * 48 + l * 9).toFixed(1) + "px");
      c.style.setProperty("--rx", (-(1 - e) * 15).toFixed(1) + "deg");
      c.style.setProperty("--sc", (0.93 + 0.07 * e - 0.04 * l).toFixed(3));
      c.style.setProperty("--op", (0.2 + 0.8 * e - 0.3 * l).toFixed(2));
    });
  }
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    nav.classList.toggle("is-solid", window.scrollY > 40);
    cardsIntro();
    if (!reduceMotion && (!isDesktop() || !canHover)) {
      imgs.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
        img.style.transform = "translate3d(0," + (p * -8).toFixed(1) + "px,0) rotate(" + (p * 2).toFixed(2) + "deg)";   // máx. ±8px: queda dentro de su tarjeta
      });
    } else imgs.forEach(function (img) { img.style.transform = ""; });
    if (isDesktop()) {
      var r2 = meet.getBoundingClientRect();
      meet.style.setProperty("--p", Math.max(0, Math.min(1, (vh * .95 - r2.top) / (vh * .55))).toFixed(3));
    } else meet.style.removeProperty("--p");
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();