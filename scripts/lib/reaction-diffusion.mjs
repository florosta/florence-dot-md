import { PNG } from "pngjs";

// Same Gray-Scott reaction-diffusion field as the hero's rd.js, ported to run
// headlessly (plain typed-array math, no canvas) and rasterized to a PNG.
export function reactionDiffusionPng(w, h, softness = 0.55) {
  const n = w * h;
  const fg = [190, 208, 176];
  const bg = [243, 238, 226];
  const f = 0.026;
  const k = 0.051;
  const dA = 1;
  const dB = 0.5;

  let A = new Float32Array(n).fill(1);
  let B = new Float32Array(n);
  let A2 = new Float32Array(n);
  let B2 = new Float32Array(n);
  for (let i = 0; i < 12; i++) {
    const cx = (Math.random() * w) | 0;
    const cy = (Math.random() * h) | 0;
    for (let y = -3; y <= 3; y++)
      for (let x = -3; x <= 3; x++)
        B[((cy + y + h) % h) * w + ((cx + x + w) % w)] = 1;
  }

  const step = () => {
    for (let y = 0; y < h; y++) {
      const yu = ((y - 1 + h) % h) * w;
      const yd = ((y + 1) % h) * w;
      const y0 = y * w;
      for (let x = 0; x < w; x++) {
        const xl = (x - 1 + w) % w;
        const xr = (x + 1) % w;
        const i = y0 + x;
        const a = A[i];
        const b = B[i];
        const la =
          (A[yu + x] + A[yd + x] + A[y0 + xl] + A[y0 + xr]) * 0.2 +
          (A[yu + xl] + A[yu + xr] + A[yd + xl] + A[yd + xr]) * 0.05 -
          a;
        const lb =
          (B[yu + x] + B[yd + x] + B[y0 + xl] + B[y0 + xr]) * 0.2 +
          (B[yu + xl] + B[yu + xr] + B[yd + xl] + B[yd + xr]) * 0.05 -
          b;
        const abb = a * b * b;
        A2[i] = a + (dA * la - abb + f * (1 - a));
        B2[i] = b + (dB * lb + abb - (k + f) * b);
      }
    }
    [A, A2] = [A2, A];
    [B, B2] = [B2, B];
  };
  for (let i = 0; i < 400; i++) step();

  const R = 2;
  const scratch = new Float32Array(n);
  const blur = (from, to) => {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0,
          m = 0;
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx;
          if (xx >= 0 && xx < w) {
            s += from[y * w + xx];
            m++;
          }
        }
        scratch[y * w + x] = s / m;
      }
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0,
          m = 0;
        for (let dy = -R; dy <= R; dy++) {
          const yy = y + dy;
          if (yy >= 0 && yy < h) {
            s += scratch[yy * w + x];
            m++;
          }
        }
        to[y * w + x] = s / m;
      }
  };

  const T = new Float32Array(n);
  for (let i = 0; i < n; i++)
    T[i] = Math.min(1, Math.max(0, (A[i] - B[i]) * 1.4 - 0.1));
  const blurred = new Float32Array(n);
  const once = new Float32Array(n);
  const twice = new Float32Array(n);
  blur(T, once);
  blur(once, twice);
  blur(twice, blurred);

  const png = new PNG({ width: w, height: h });
  for (let i = 0; i < n; i++) {
    const v = blurred[i] * softness;
    const j = i * 4;
    png.data[j] = bg[0] + (fg[0] - bg[0]) * (1 - v);
    png.data[j + 1] = bg[1] + (fg[1] - bg[1]) * (1 - v);
    png.data[j + 2] = bg[2] + (fg[2] - bg[2]) * (1 - v);
    png.data[j + 3] = 255;
  }
  return PNG.sync.write(png);
}
