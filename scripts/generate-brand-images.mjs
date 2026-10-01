// Generates the favicon set and the default social card in public/:
//   favicon.svg, favicon.ico (16/32/48), apple-touch-icon.png (180×180),
//   og-image.png (1200×630).
// Run with `node scripts/generate-brand-images.mjs` after changing the site
// name or palette. The social card is a typographic stand-in until a real
// photo of the car is available; posts with a heroImage use that instead.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = new URL("../public/", import.meta.url);
const INK = "#24282c"; // --foreground / --primary in light mode
const PAPER = "#ffffff";

// A plain "M" monogram drawn as a stroke, so it renders the same everywhere
// without depending on installed fonts.
const iconSvg = (size, { rounded = true } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${rounded ? 6 : 0}" fill="${INK}"/>
  <path d="M8.5 23.5V8.5l7.5 9 7.5-9v15" fill="none" stroke="${PAPER}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

writeFileSync(new URL("favicon.svg", OUT), iconSvg(32));

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

// ICO container holding PNG-encoded images (supported by every current browser).
const icoSizes = [16, 32, 48];
const images = await Promise.all(icoSizes.map((size) => png(iconSvg(size), size)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header.writeUInt8(icoSizes[index], entry);
  header.writeUInt8(icoSizes[index], entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
writeFileSync(new URL("favicon.ico", OUT), Buffer.concat([header, ...images]));

// iOS adds its own rounded corners, so the touch icon is a full square.
writeFileSync(new URL("apple-touch-icon.png", OUT), await png(iconSvg(180, { rounded: false }), 180));

const font = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="80" y="96" width="64" height="6" fill="${PAPER}"/>
  <text x="80" y="160" font-family="${font}" font-size="26" letter-spacing="3" fill="#b8bcc0">A FIRST-HAND ACCOUNT · SYDNEY, NSW</text>
  <text x="80" y="262" font-family="${font}" font-size="68" font-weight="700" fill="${PAPER}">My Car-Buying Experience with</text>
  <text x="80" y="344" font-family="${font}" font-size="68" font-weight="700" fill="${PAPER}">McCarroll's GWM Artarmon:</text>
  <text x="80" y="426" font-family="${font}" font-size="68" font-weight="700" fill="${PAPER}">What Happened</text>
  <text x="80" y="490" font-family="${font}" font-size="32" fill="#dfe1e3">2026 Haval Jolion Vanta</text>
  <text x="80" y="556" font-family="${font}" font-size="26" fill="#9a9fa4">mccarrollsreview.com.au</text>
</svg>`;
await sharp(Buffer.from(ogSvg)).png().toFile(fileURLToPath(new URL("og-image.png", OUT)));

console.log("Wrote favicon.svg, favicon.ico, apple-touch-icon.png and og-image.png to public/");
