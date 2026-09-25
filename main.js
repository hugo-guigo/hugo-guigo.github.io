(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(key, value) {
    if (value === undefined) {
      try { return sessionStorage.getItem(key) || localStorage.getItem(key); } catch (e) { return null; }
    }
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function isEn() { return root.lang === "en"; }

  /* ---------- Loader: Olá / Hello / Bonjour ---------- */
  var loader = document.getElementById("loader");
  var seen = false;
  try { seen = sessionStorage.getItem("intro") === "1"; } catch (e) {}
  if (reduced || seen) {
    loader.classList.add("gone");
  } else {
    var words = ["Olá", "Hello", "Bonjour", "Olá"];
    var el = document.getElementById("greet-word");
    var i = 0;
    var tick = setInterval(function () {
      i++;
      if (i < words.length) { el.textContent = words[i]; return; }
      clearInterval(tick);
      loader.classList.add("done");
      setTimeout(function () { loader.classList.add("gone"); }, 950);
      try { sessionStorage.setItem("intro", "1"); } catch (e) {}
    }, 420);
  }

  /* ---------- Idioma ---------- */
  document.getElementById("lang-toggle").addEventListener("click", function () {
    var next = isEn() ? "pt-BR" : "en";
    root.lang = next;
    store("lang", next);
    restartTyper();
  });

  /* ---------- Linha de terminal digitando ---------- */
  var phrases = {
    pt: ["inferência em edge sob restrição", "benchmarks reprodutíveis", "percepção + sVLM em tempo real", "RTP sobre QUIC para cloud gaming", "medir antes de otimizar"],
    en: ["edge inference under constraints", "reproducible benchmarks", "real-time perception + sVLM", "RTP over QUIC for cloud gaming", "measure before you optimize"]
  };
  var typed = document.getElementById("typed");
  var tTimer = null;
  function restartTyper() {
    clearTimeout(tTimer);
    var list = phrases[isEn() ? "en" : "pt"];
    if (reduced) { typed.textContent = list[0]; return; }
    var p = 0, c = 0, deleting = false;
    (function step() {
      var word = list[p];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      var wait = deleting ? 28 : 55;
      if (!deleting && c === word.length) { deleting = true; wait = 1700; }
      else if (deleting && c === 0) { deleting = false; p = (p + 1) % list.length; wait = 300; }
      tTimer = setTimeout(step, wait);
    })();
  }
  restartTyper();

  /* ---------- Fundo: rede de nós ---------- */
  var canvas = document.getElementById("net");
  var ctx = canvas.getContext("2d");
  var nodes = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(70, (W * H) / 22000));
    nodes = [];
    for (var k = 0; k < count; k++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.4 + 0.6 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var max = 130;
    for (var a = 0; a < nodes.length; a++) {
      var n = nodes[a];
      for (var b = a + 1; b < nodes.length; b++) {
        var m = nodes[b], dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
          ctx.strokeStyle = "rgba(200,245,58," + (0.13 * (1 - d / max)) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(243,241,236,0.55)";
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  function loop() {
    if (!document.hidden) {
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      draw();
    }
    requestAnimationFrame(loop);
  }
  resize();
  window.addEventListener("resize", function () { resize(); if (reduced) draw(); });
  if (reduced) draw(); else requestAnimationFrame(loop);

  /* ---------- Revelar ao rolar ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

  /* ---------- Dock: seção ativa ---------- */
  var dockLinks = document.querySelectorAll(".dock a");
  var targets = [];
  dockLinks.forEach(function (a) {
    var t = document.querySelector(a.getAttribute("href"));
    if (t) targets.push({ a: a, t: t });
  });
  function markActive() {
    var y = window.scrollY + window.innerHeight * 0.35, current = targets[0];
    targets.forEach(function (x) { if (x.t.offsetTop <= y) current = x; });
    targets.forEach(function (x) { x.a.classList.toggle("active", x === current); });
  }
  window.addEventListener("scroll", markActive, { passive: true });
  markActive();

  /* ---------- Esfera de ferramentas (arraste para girar) ---------- */
  var sphere = document.getElementById("sphere");
  var tools = [
    ["Python", "hot"], ["PyTorch", "hot"], ["C/C++", ""], ["ONNX Runtime", ""], ["Jetson", "warm"],
    ["scikit-learn", ""], ["OpenCV", ""], ["spaCy", ""], ["Transformers", ""], ["sVLM", "hot"],
    ["QUIC", "warm"], ["RTP/UDP", ""], ["Mininet", ""], ["GStreamer", ""], ["FFmpeg", ""],
    ["Wireshark", ""], ["5G SA", "warm"], ["Wi-Fi 6E", ""], ["Linux", "hot"], ["Bash", ""],
    ["Raspberry Pi", ""], ["Coral TPU", ""], ["DGX Spark", "warm"], ["Git", ""], ["LaTeX", ""],
    ["Java", ""], ["C#", ""], ["benchmarking", "hot"], ["VMAF", ""], ["bootstrap CI", ""]
  ];
  var pts = tools.map(function (t, idx) {
    var s = document.createElement("span");
    s.textContent = t[0];
    if (t[1]) s.className = t[1];
    sphere.appendChild(s);
    // Distribuição uniforme na esfera (espiral de Fibonacci)
    var y = 1 - (idx / (tools.length - 1)) * 2;
    var rad = Math.sqrt(1 - y * y);
    var th = idx * Math.PI * (3 - Math.sqrt(5));
    return { el: s, x: Math.cos(th) * rad, y: y, z: Math.sin(th) * rad };
  });
  var ax = 0.0022, ay = 0.0035, drag = false, lx = 0, ly = 0;
  function rotate(rx, ry) {
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    pts.forEach(function (p) {
      var y1 = p.y * cx - p.z * sx, z1 = p.y * sx + p.z * cx;
      var x2 = p.x * cy + z1 * sy, z2 = -p.x * sy + z1 * cy;
      p.x = x2; p.y = y1; p.z = z2;
    });
  }
  function render() {
    var R = sphere.clientWidth * 0.42;
    pts.forEach(function (p) {
      var scale = (p.z + 2) / 3;
      p.el.style.transform = "translate(-50%,-50%) translate3d(" + (p.x * R).toFixed(1) + "px," + (p.y * R).toFixed(1) + "px,0) scale(" + scale.toFixed(3) + ")";
      p.el.style.opacity = (0.25 + 0.75 * (p.z + 1) / 2).toFixed(2);
      p.el.style.zIndex = Math.round((p.z + 1) * 50);
    });
  }
  function spin() {
    if (!drag && !document.hidden) { rotate(ax, ay); render(); }
    requestAnimationFrame(spin);
  }
  sphere.addEventListener("pointerdown", function (e) { drag = true; lx = e.clientX; ly = e.clientY; sphere.setPointerCapture(e.pointerId); });
  sphere.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
    rotate(-dy * 0.008, dx * 0.008); render();
    ax = -dy * 0.0012 || ax; ay = dx * 0.0012 || ay;
  });
  function release() { drag = false; }
  sphere.addEventListener("pointerup", release);
  sphere.addEventListener("pointercancel", release);
  render();
  if (!reduced) requestAnimationFrame(spin);
  window.addEventListener("resize", render);

  /* ---------- Copiar email ---------- */
  var copyBtn = document.getElementById("copy-mail");
  copyBtn.addEventListener("click", function () {
    var mail = "hugo.guilherme.paula@gmail.com";
    var done = function () {
      var old = copyBtn.innerHTML;
      copyBtn.textContent = isEn() ? "Copied ✓" : "Copiado ✓";
      setTimeout(function () { copyBtn.innerHTML = old; }, 1600);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(mail).then(done, function () {});
  });
})();
