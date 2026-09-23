import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadFonts } from "./lib/fonts.mjs";
import { reactionDiffusionPng } from "./lib/reaction-diffusion.mjs";
import { LABEL, HEADLINE, SUBHEAD, colors, glassShadow, h } from "./lib/theme.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  const [{ serif, sans, mono }, photo] = await Promise.all([
    loadFonts(root),
    readFile(path.join(root, "assets/flo.png")),
  ]);

  const photoDataUri = `data:image/png;base64,${photo.toString("base64")}`;
  // Same grid size as the live #rd canvas (index.html), so the pattern's
  // fill/spot statistics match the hero exactly; cropped to the OG aspect below.
  const bgDataUri = `data:image/png;base64,${reactionDiffusionPng(
    150,
    98,
    0.45
  ).toString("base64")}`;

  const tree = h(
    "div",
    {
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      padding: "40px 56px",
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
      h("div", {
        position: "absolute",
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        backgroundImage:
          "linear-gradient(180deg, rgba(251,247,239,0) 0%, rgba(251,247,239,0.35) 60%, #fbf7ef 100%)",
      }),
      h(
        "div",
        {
          fontFamily: "Geist Mono",
          fontWeight: 500,
          fontSize: 15,
          color: colors.ink,
        },
        LABEL
      ),
      h(
        "div",
        {
          display: "flex",
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 36,
        },
        [
          h(
            "div",
            { display: "flex", flexDirection: "column", maxWidth: 720 },
            [
              h(
                "div",
                {
                  fontFamily: "Instrument Serif",
                  fontWeight: 400,
                  fontSize: 72,
                  lineHeight: 0.98,
                  letterSpacing: -1.4,
                  color: colors.ink,
                },
                HEADLINE
              ),
              h(
                "div",
                {
                  marginTop: 24,
                  maxWidth: 640,
                  fontFamily: "Spline Sans",
                  fontWeight: 400,
                  fontSize: 23,
                  lineHeight: 1.42,
                  color: colors.body,
                },
                SUBHEAD
              ),
            ]
          ),
          h(
            "div",
            {
              display: "flex",
              flexShrink: 0,
              width: 283,
              height: 360,
              borderRadius: 26,
              overflow: "hidden",
              position: "relative",
              boxShadow: glassShadow,
            },
            [
              {
                type: "img",
                props: {
                  src: photoDataUri,
                  width: 296,
                  height: 377,
                  style: {
                    position: "absolute",
                    left: -6,
                    bottom: -10,
                    objectFit: "cover",
                  },
                },
              },
              h("div", {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "22%",
                borderRadius: "26px 26px 0 0",
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))",
              }),
            ]
          ),
        ]
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

  await writeFile(path.join(root, "assets/og.png"), png);
  console.log("Wrote assets/og.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
