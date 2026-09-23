import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "./lib/fonts.mjs";
import { reactionDiffusionPng } from "./lib/reaction-diffusion.mjs";
import { HEADLINE, colors, h } from "./lib/theme.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// LinkedIn's recommended personal-profile banner size.
const WIDTH = 1584;
const HEIGHT = 396;
// The circular profile photo overlaps roughly this much of the bottom-left
// corner; keep text clear of it.
const AVATAR_SAFE_LEFT = 380;

async function main() {
  const { serif, sans, mono } = await loadFonts(root);

  const bgDataUri = `data:image/png;base64,${reactionDiffusionPng(
    198,
    50,
    0.45
  ).toString("base64")}`;

  const tree = h(
    "div",
    {
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      position: "relative",
      padding: `0 64px 0 ${AVATAR_SAFE_LEFT}px`,
      backgroundColor: colors.ground,
      fontFamily: "Spline Sans",
    },
    [
      {
        type: "img",
        props: {
          src: bgDataUri,
          width: WIDTH,
          height: HEIGHT,
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            objectFit: "cover",
          },
        },
      },
      h(
        "div",
        {
          fontFamily: "Instrument Serif",
          fontWeight: 400,
          fontSize: 58,
          lineHeight: 1.05,
          letterSpacing: -1,
          color: colors.ink,
          maxWidth: 900,
        },
        HEADLINE
      ),
    ]
  );

  const svg = await satori(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [serif, sans, mono],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
  const png = resvg.render().asPng();

  await writeFile(path.join(root, "assets/linkedin-banner.png"), png);
  console.log("Wrote assets/linkedin-banner.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
