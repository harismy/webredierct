/*!
 * Redirect 1forcrvpn.store -> 1forcrkuota.com
 * Statis, tanpa backend. Ubah TARGET_URL & REDIRECT_SECONDS sesuai kebutuhan.
 */
(() => {
  "use strict";

  const TARGET_URL = "https://1forcrkuota.com/";
  const REDIRECT_SECONDS = 30;
  const DURATION_MS = REDIRECT_SECONDS * 1000;
  const RING_RADIUS = 54;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mode pratinjau: buka dengan "?preview" untuk melihat halaman tanpa redirect otomatis.
  const previewMode = new URLSearchParams(window.location.search).has("preview");

  const ring = document.getElementById("ring");
  const numberEl = document.getElementById("countdownNumber");
  const cta = document.getElementById("cta");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  let hasRedirected = false;

  function redirectNow() {
    if (hasRedirected) return;
    hasRedirected = true;
    document.body.classList.add("leaving");
    window.setTimeout(() => window.location.replace(TARGET_URL), 500);
  }

  /* ---------- Countdown + progress ring ---------- */

  if (ring) {
    ring.style.strokeDasharray = `${RING_CIRCUMFERENCE}px`;
    ring.style.strokeDashoffset = "0px";
  }

  let startedAt = null;

  function tick(now) {
    if (startedAt === null) {
      startedAt = now;
    }

    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const remainingMs = Math.max(DURATION_MS - elapsed, 0);

    if (ring) {
      ring.style.strokeDashoffset = `${(RING_CIRCUMFERENCE * progress).toFixed(2)}px`;
    }
    if (numberEl) {
      numberEl.textContent = String(Math.max(1, Math.ceil(remainingMs / 1000)));
    }

    if (progress >= 1) {
      redirectNow();
      return;
    }

    window.requestAnimationFrame(tick);
  }

  if (previewMode) {
    // Pratinjau: ring tetap penuh, tanpa hitungan & tanpa redirect otomatis.
    if (ring) ring.style.strokeDashoffset = "0px";
  } else {
    window.requestAnimationFrame(tick);

    // Pengaman: tetap alihkan meski tab sempat tidak aktif / rAF tertunda.
    window.setTimeout(redirectNow, DURATION_MS + 800);
  }

  // Tombol: langsung pindah tanpa menunggu hitungan selesai.
  if (cta) {
    cta.addEventListener("click", (event) => {
      event.preventDefault();
      redirectNow();
    });
  }

  /* ---------- Partikel latar (canvas) ---------- */

  const canvas = document.getElementById("particles");
  if (canvas && !prefersReducedMotion) {
    startParticles(canvas);
  }

  function startParticles(canvasEl) {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const COLORS = ["139, 92, 246", "34, 211, 238", "244, 114, 182", "255, 255, 255"];
    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;

    function spawn(anywhere) {
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 8 + Math.random() * 24,
        radius: 0.6 + Math.random() * 2.1,
        speed: 0.12 + Math.random() * 0.38,
        drift: (Math.random() - 0.5) * 0.22,
        phase: Math.random() * Math.PI * 2,
        baseAlpha: 0.25 + Math.random() * 0.5,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvasEl.clientWidth;
      height = canvasEl.clientHeight;
      canvasEl.width = Math.max(1, Math.floor(width * dpr));
      canvasEl.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter";

      const target = Math.min(90, Math.max(30, Math.round((width * height) / 18000)));
      particles = new Array(target).fill(null).map(() => spawn(true));
    }

    function draw() {
      if (hasRedirected) return;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += 0.012;
        p.y -= p.speed;
        p.x += p.drift + Math.sin(p.phase) * 0.18;

        if (p.y < -10 || p.x < -20 || p.x > width + 20) {
          Object.assign(p, spawn(false));
        }

        const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase * 1.7));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else if (rafId === null && !hasRedirected) {
        draw();
      }
    });

    resize();
    draw();
  }
})();
