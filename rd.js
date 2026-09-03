// Gray–Scott reaction–diffusion as the hero ground, plus "lens" canvases that
// re-sample the field beneath each glass element, magnified and sharpened.
(function () {
  const c = document.getElementById('rd'); if (!c) return;
  const w = c.width, h = c.height, n = w * h, ctx = c.getContext('2d'), img = ctx.createImageData(w, h);
  const fg = [190, 208, 176], bg = [243, 238, 226], f = .026, k = .051, dA = 1, dB = .5;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = reduced ? 0 : 1;
  let frame = 0;
  let A = new Float32Array(n).fill(1), B = new Float32Array(n), A2 = new Float32Array(n), B2 = new Float32Array(n);
  for (let i = 0; i < 12; i++) { const cx = (Math.random() * w) | 0, cy = (Math.random() * h) | 0; for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) B[((cy + y + h) % h) * w + ((cx + x + w) % w)] = 1; }
  const step = () => {
    for (let y = 0; y < h; y++) { const yu = ((y - 1 + h) % h) * w, yd = ((y + 1) % h) * w, y0 = y * w;
      for (let x = 0; x < w; x++) { const xl = (x - 1 + w) % w, xr = (x + 1) % w, i = y0 + x, a = A[i], b = B[i];
        const la = (A[yu + x] + A[yd + x] + A[y0 + xl] + A[y0 + xr]) * .2 + (A[yu + xl] + A[yu + xr] + A[yd + xl] + A[yd + xr]) * .05 - a;
        const lb = (B[yu + x] + B[yd + x] + B[y0 + xl] + B[y0 + xr]) * .2 + (B[yu + xl] + B[yu + xr] + B[yd + xl] + B[yd + xr]) * .05 - b;
        const abb = a * b * b;
        A2[i] = a + (dA * la - abb + f * (1 - a)); B2[i] = b + (dB * lb + abb - (k + f) * b); } }
    [A, A2] = [A2, A]; [B, B2] = [B2, B];
  };
  const draw = () => { const d = img.data; for (let i = 0; i < n; i++) { const t = Math.min(1, Math.max(0, (A[i] - B[i]) * 1.4 - .1)), j = i * 4; d[j] = bg[0] + (fg[0] - bg[0]) * (1 - t); d[j + 1] = bg[1] + (fg[1] - bg[1]) * (1 - t); d[j + 2] = bg[2] + (fg[2] - bg[2]) * (1 - t); d[j + 3] = 255; } ctx.putImageData(img, 0, 0); };
  const lenses = [...document.querySelectorAll('.glass .lens')];
  const lens = () => lenses.forEach(lc => {
    const pr = lc.parentElement.getBoundingClientRect(), hr = c.getBoundingClientRect(); if (!pr.width || !hr.width) return;
    const W = Math.round(pr.width), H = Math.round(pr.height);
    if (lc.width !== W * 2 || lc.height !== H * 2) { lc.width = W * 2; lc.height = H * 2; }
    const m = 1.35, sw = pr.width / hr.width * w, sh = pr.height / hr.height * h;
    const cx = (pr.left - hr.left) / hr.width * w + sw / 2, cy = (pr.top - hr.top) / hr.height * h + sh / 2;
    const g = lc.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.filter = 'contrast(1.6) saturate(0.9) brightness(1.06)';
    g.drawImage(c, cx - sw / m / 2, cy - sh / m / 2, sw / m, sh / m, 0, 0, lc.width, lc.height);
    g.filter = 'none';
    const e = .09 * lc.width;
    let gr = g.createLinearGradient(0, 0, e, 0); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, e, lc.height);
    gr = g.createLinearGradient(lc.width, 0, lc.width - e, 0); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(lc.width - e, 0, e, lc.height);
  });
  for (let i = 0; i < 400; i++) step();
  draw(); lens();
  if (!speed) { addEventListener('resize', lens); return; }
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) loop(); });
  const loop = () => { if (!visible) return; step(); draw(); lens(); requestAnimationFrame(loop); };
  loop();
})();
