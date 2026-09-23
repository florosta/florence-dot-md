// Keep this in sync with the <h1>/.sub copy in index.html.
export const LABEL = "florence.md";
export const HEADLINE =
  "Hi, I'm Flo. I help you make better decisions by building the systems that connect people, information, and purpose.";
export const SUBHEAD =
  "Ten years of data and systems at mission-driven companies; a PhD in theoretical biology, and currently undertaking an MBA.";

export const colors = {
  page: "#fbf7ef",
  ground: "#f0e9db",
  ink: "#23231f",
  body: "#4a4840",
};

// Matches --glass-shadow in style.css.
export const glassShadow = [
  "0 2px 4px rgba(35,35,31,0.08)",
  "0 22px 60px rgba(90,143,60,0.28)",
  "0 0 0 1px rgba(255,255,255,0.8)",
  "inset 0 0 0 1.5px rgba(255,255,255,0.65)",
  "inset 0 2px 2px rgba(255,255,255,1)",
  "inset 0 -2px 3px rgba(35,35,31,0.08)",
].join(", ");

export function h(type, style, children) {
  return { type, props: { style, children } };
}
