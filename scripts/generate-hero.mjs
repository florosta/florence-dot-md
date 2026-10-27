import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { reactionDiffusionPng } from "./lib/reaction-diffusion.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Static hero background: one frame of the Gray-Scott field at the old canvas
// size (150x98). The browser scales it up, which gives the soft look for free.
await writeFile(path.join(root, "assets/hero-rd.png"), reactionDiffusionPng(150, 98, 1));
console.log("wrote assets/hero-rd.png");
