(() => {
  const loader = document.getElementById('introLoader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('done'), 850);
    window.setTimeout(() => loader?.remove(), 1800);
  });

  // Animated constellation background: lightweight canvas, no video download required.
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || reduceMotion) return;

  let width = 0, height = 0, particles = [], raf = 0;
  const pointer = { x: -1000, y: -1000 };
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const count = mobile ? 34 : 68;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .34, vy: (Math.random() - .5) * .34,
      r: Math.random() * 1.8 + .5, phase: Math.random() * Math.PI * 2
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.phase += .018;
      if (p.x < -10 || p.x > width + 10) p.vx *= -1;
      if (p.y < -10 || p.y > height + 10) p.vy *= -1;
      const dxm = p.x - pointer.x, dym = p.y - pointer.y;
      const md = Math.hypot(dxm, dym);
      if (md < 115 && md > 0) { p.x += dxm / md * .28; p.y += dym / md * .28; }
      const alpha = .35 + (Math.sin(p.phase) + 1) * .22;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(193, 154, 255, ${alpha})`; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 112) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(145, 93, 220, ${(1 - distance / 112) * .19})`;
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); }, { passive: true });
  window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduceMotion) draw();
  });
})();
