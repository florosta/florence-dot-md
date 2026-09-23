import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadFont(root, name, pkg, file, weight) {
  const data = await readFile(
    path.join(root, "node_modules", pkg, "files", file)
  );
  return { name, data, weight, style: "normal" };
}

export async function loadFonts(root) {
  const [serif, sans, mono] = await Promise.all([
    loadFont(
      root,
      "Instrument Serif",
      "@fontsource/instrument-serif",
      "instrument-serif-latin-400-normal.woff",
      400
    ),
    loadFont(
      root,
      "Spline Sans",
      "@fontsource/spline-sans",
      "spline-sans-latin-400-normal.woff",
      400
    ),
    loadFont(
      root,
      "Geist Mono",
      "@fontsource/geist-mono",
      "geist-mono-latin-500-normal.woff",
      500
    ),
  ]);
  return { serif, sans, mono };
}
