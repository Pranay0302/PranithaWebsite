/* ============================================================
   Pranitha Andra - Portfolio interactions
   Renders work from PORTFOLIO, plus project viewer, nav, reveal.
   A page can request a single category via <main id="work" data-section="id">;
   with no data-section (home) it shows every collection.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Render work ---------- */
  const work = document.getElementById("work");

  if (work && typeof PORTFOLIO !== "undefined") {
    const only = work.dataset.section;
    const sections = only
      ? PORTFOLIO.sections.filter((s) => s.id === only)
      : PORTFOLIO.sections;
    const collections = sections.flatMap((s) => s.collections);

    const el = document.createElement("section");
    el.className = "section reveal";
    el.innerHTML = `<div class="wrap"><div class="grid"></div></div>`;
    const grid = el.querySelector(".grid");
    if (collections.length === 1) grid.classList.add("grid--single");

    collections.forEach((col, i) => {
      const card = document.createElement("button");
      card.className = "card reveal";
      card.type = "button";
      card.style.transitionDelay = Math.min(i * 70, 280) + "ms";
      const media = col.video
        ? `<video class="card__vid" src="${col.video}" poster="${col.cover}" muted loop autoplay playsinline preload="metadata"></video>`
        : `<img src="${col.cover}" alt="${col.title}" loading="lazy" />`;
      card.innerHTML = `
        <div class="card__frame">
          ${media}
          <div class="card__overlay">
            <h3 class="card__title">${col.title}</h3>
            <span class="card__count">${col.images.length} ${col.images.length === 1 ? "work" : "works"}</span>
          </div>
        </div>`;
      card.addEventListener("click", () => openLightbox(col));
      grid.appendChild(card);
    });

    work.appendChild(el);

    // Keep tile videos muted and playing (autoplay is only allowed when muted)
    work.querySelectorAll(".card__vid").forEach((v) => {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealables = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach((n) => n.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach((n) => io.observe(n));
  }

  /* ---------- Nav background on scroll ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile menu (button injected so every page gets it)
    const links = nav.querySelector(".nav__links");
    if (links) {
      const toggle = document.createElement("button");
      toggle.className = "nav__toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Toggle menu");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = "<span></span><span></span>";
      nav.appendChild(toggle);
      const setMenu = (open) => {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      };
      toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
      links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
      window.addEventListener("resize", () => { if (window.innerWidth > 700) setMenu(false); });
    }
  }

  /* ---------- Hero banner: cursor parallax ---------- */
  const hero = document.querySelector(".hero");
  const tilt = document.querySelector(".hero__banner-tilt");
  if (hero && tilt && !reduce) {
    let raf = null;
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        tilt.style.transform =
          `rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translate3d(${px * 22}px, ${py * 16}px, 0)`;
      });
    };
    const reset = () => { tilt.style.transform = ""; };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
  }

  /* ---------- Cursor trail: ink splots, or warm sparks on Film ---------- */
  // Base mode follows the page; the Theyyam viewer flips it to sparks on any page.
  const cursorBase = (work && work.dataset.section === "film") ? "spark" : "ink";
  let cursorMode = cursorBase;
  let inkCanvas = null;
  // Sparks must sit above the open project viewer, so raise the canvas in spark mode.
  const setCursorMode = (m) => {
    cursorMode = m;
    if (inkCanvas) inkCanvas.classList.toggle("ink-canvas--spark", m === "spark");
  };
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduce) {
    const canvas = document.createElement("canvas");
    canvas.className = "ink-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    inkCanvas = canvas;
    canvas.classList.toggle("ink-canvas--spark", cursorMode === "spark");
    const ctx = canvas.getContext("2d");
    const INK = "20, 18, 15";
    const SPARKS = ["255, 122, 24", "224, 52, 31", "255, 210, 74"]; // orange, red, yellow
    let W = 0, H = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [];
    const MAX = 90;
    const TAU = Math.PI * 2;
    let lastX = null, lastY = null, lastT = 0;

    // A comic ink splat: lumpy body + a few short tendrils + scattered droplets.
    // Geometry is stored in unit multiples of r so it scales as the splat spreads.
    // Tuned calm: tighter lumps, shorter tendrils, closer droplets.
    const makeSplat = () => {
      const lumps = [{ ux: 0, uy: 0, urr: 1 }];
      const nl = 2 + ((Math.random() * 3) | 0);
      for (let i = 0; i < nl; i++) {
        const a = Math.random() * TAU, d = 0.25 + Math.random() * 0.4;
        lumps.push({ ux: Math.cos(a) * d, uy: Math.sin(a) * d, urr: 0.4 + Math.random() * 0.42 });
      }
      const spikes = [];
      const ns = 2 + ((Math.random() * 3) | 0);
      for (let i = 0; i < ns; i++) {
        spikes.push({ a: Math.random() * TAU, ulen: 0.7 + Math.random() * 0.7, uw: 0.28 + Math.random() * 0.22 });
      }
      const drops = [];
      const nd = (Math.random() * 3) | 0;
      for (let i = 0; i < nd; i++) {
        const a = Math.random() * TAU, d = 1.2 + Math.random() * 1.8;
        drops.push({ ux: Math.cos(a) * d, uy: Math.sin(a) * d, urr: 0.06 + Math.random() * 0.18 });
      }
      return { lumps, spikes, drops };
    };

    const spawnInk = (x, y, r, alpha) => {
      if (blobs.length >= MAX) blobs.shift();
      blobs.push({
        type: "ink",
        x, y, r,
        grow: r * (0.02 + Math.random() * 0.04),
        life: 1,
        decay: 0.024 + Math.random() * 0.026,
        alpha,
        splat: makeSplat(),
      });
    };

    // A small ember: drifts outward, rises a touch, and fades fast.
    const spawnSpark = (x, y, speed) => {
      if (blobs.length >= MAX) blobs.shift();
      const a = Math.random() * TAU;
      const v = 0.4 + Math.random() * (1.2 + Math.min(speed * 2, 3));
      blobs.push({
        type: "spark",
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 0.4,          // slight upward bias
        r: 1 + Math.random() * 1.8,
        life: 1,
        decay: 0.03 + Math.random() * 0.04,
        alpha: 0.7 + Math.random() * 0.3,
        color: SPARKS[(Math.random() * SPARKS.length) | 0],
      });
    };

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY, t = e.timeStamp || performance.now();
      if (lastX === null) { lastX = x; lastY = y; lastT = t; return; }
      const dx = x - lastX, dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const speed = dist / Math.max(t - lastT, 1);       // px per ms

      if (cursorMode === "spark") {
        const count = Math.min(2 + ((dist / 12) | 0), 6);   // a little flurry
        for (let i = 0; i < count; i++) {
          const f = i / count;
          spawnSpark(lastX + dx * f, lastY + dy * f, speed);
        }
      } else {
        const count = Math.min(1 + ((dist / 34) | 0), 2);   // fling = one extra splat
        for (let i = 0; i < count; i++) {
          const f = count === 1 ? 0 : i / count;
          const px = lastX + dx * f + (Math.random() - 0.5) * 8;
          const py = lastY + dy * f + (Math.random() - 0.5) * 8;
          const r = 2 + Math.random() * 2.5 + Math.min(speed * 2, 3.5);
          spawnInk(px, py, r, 0.28 + Math.random() * 0.16);
        }
      }
      lastX = x; lastY = y; lastT = t;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const drawInk = (b) => {
      const r = b.r, s = b.splat;
      ctx.fillStyle = `rgba(${INK}, ${(b.alpha * b.life).toFixed(3)})`;

      // lumpy body
      ctx.beginPath();
      for (const c of s.lumps) {
        const cx = b.x + c.ux * r, cy = b.y + c.uy * r, rr = c.urr * r;
        ctx.moveTo(cx + rr, cy);
        ctx.arc(cx, cy, rr, 0, TAU);
      }
      ctx.fill();

      // pointed tendrils flicking outward
      for (const k of s.spikes) {
        const dx = Math.cos(k.a), dy = Math.sin(k.a), w = k.uw * r;
        const tx = b.x + dx * k.ulen * r, ty = b.y + dy * k.ulen * r;
        const cx = b.x + dx * r * 0.55, cy = b.y + dy * r * 0.55;
        ctx.beginPath();
        ctx.moveTo(b.x - dy * w, b.y + dx * w);
        ctx.quadraticCurveTo(cx, cy, tx, ty);
        ctx.quadraticCurveTo(cx, cy, b.x + dy * w, b.y - dx * w);
        ctx.closePath();
        ctx.fill();
      }

      // scattered droplets
      ctx.beginPath();
      for (const d of s.drops) {
        const cx = b.x + d.ux * r, cy = b.y + d.uy * r, rr = d.urr * r;
        ctx.moveTo(cx + rr, cy);
        ctx.arc(cx, cy, rr, 0, TAU);
      }
      ctx.fill();
    };

    const drawSpark = (b) => {
      const r = Math.max(b.r * (0.5 + b.life * 0.5), 0.4);
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r * 2.4);
      g.addColorStop(0, `rgba(${b.color}, ${(b.alpha * b.life).toFixed(3)})`);
      g.addColorStop(1, `rgba(${b.color}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r * 2.4, 0, TAU);
      ctx.fill();

      // hot pale core
      ctx.fillStyle = `rgba(255, 244, 214, ${(b.alpha * b.life * 0.9).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r * 0.6, 0, TAU);
      ctx.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        b.life -= b.decay;
        if (b.life <= 0) { blobs.splice(i, 1); continue; }
        if (b.type === "spark") {
          b.x += b.vx; b.y += b.vy;
          b.vy += 0.03;                 // gentle gravity after the initial rise
          b.vx *= 0.96; b.vy *= 0.96;
          ctx.globalCompositeOperation = "lighter";   // embers glow where they overlap
          drawSpark(b);
          ctx.globalCompositeOperation = "source-over";
        } else {
          b.r += b.grow; b.grow *= 0.9;
          drawInk(b);
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Project viewer (scrollable stack) ---------- */
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  const lbScroll = lb.querySelector(".lb__scroll");
  const lbStack = lb.querySelector(".lb__stack");
  const lbCap = lb.querySelector(".lb__cap");
  const btnClose = lb.querySelector(".lb__close");

  // Click-to-expand overlay for grid galleries (built once, reused).
  const lbZoom = document.createElement("div");
  lbZoom.className = "lb__zoom";
  lbZoom.setAttribute("aria-hidden", "true");
  lbZoom.innerHTML = '<img alt="" />';
  lb.appendChild(lbZoom);
  const lbZoomImg = lbZoom.querySelector("img");
  const closeZoom = () => {
    lbZoom.classList.remove("open");
    lbZoom.setAttribute("aria-hidden", "true");
    lbZoomImg.removeAttribute("src");
  };
  lbZoom.addEventListener("click", closeZoom);
  lbStack.addEventListener("click", (e) => {
    if (!lbStack.classList.contains("lb__stack--grid")) return;
    const img = e.target.closest(".lb__img");
    if (!img) return;
    lbZoomImg.src = img.currentSrc || img.src;
    lbZoom.classList.add("open");
    lbZoom.setAttribute("aria-hidden", "false");
  });

  let lastFocus = null;

  function openLightbox(collection) {
    lastFocus = document.activeElement;
    lbCap.innerHTML =
      `<b>${collection.title}</b>` +
      (collection.headline ? `<span class="lb__headline">${collection.headline}</span>` : "") +
      (collection.sub ? `<span class="lb__sub">${collection.sub}</span>` : "");

    const imgs = collection.images
      .map((src, i) =>
        `<img class="lb__img" src="${src}" alt="${collection.title} ${i + 1}" loading="lazy" />`)
      .join("");
    const vid = collection.video
      ? `<video class="lb__img lb__video" src="${collection.video}" muted loop autoplay playsinline controls preload="metadata"></video>`
      : "";
    lbStack.innerHTML = imgs + vid;
    lbStack.classList.toggle("lb__stack--grid", collection.layout === "grid");
    setCursorMode(collection.cursor === "spark" ? "spark" : cursorBase);

    // Fade each item in as it loads
    lbStack.querySelectorAll("img, video").forEach((el) => {
      const ready = el.tagName === "VIDEO" ? el.readyState >= 2 : el.complete;
      if (ready) el.classList.add("in");
      else el.addEventListener(el.tagName === "VIDEO" ? "loadeddata" : "load",
        () => el.classList.add("in"), { once: true });
    });

    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbScroll.scrollTop = 0;
    btnClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbStack.innerHTML = "";
    closeZoom();
    setCursorMode(cursorBase);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  btnClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target === lbScroll) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open") || e.key !== "Escape") return;
    if (lbZoom.classList.contains("open")) closeZoom();
    else closeLightbox();
  });

  // Expose for any inline callers
  window.openLightbox = openLightbox;

  // Single-project pages (e.g. Design) can open their viewer straight away.
  if (work && work.dataset.autoopen && typeof PORTFOLIO !== "undefined") {
    const sec = PORTFOLIO.sections.find((s) => s.id === work.dataset.section);
    const col = sec && sec.collections[0];
    if (col) openLightbox(col);
  }
})();
