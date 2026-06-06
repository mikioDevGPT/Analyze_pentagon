import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "assets");
await fs.mkdir(assets, { recursive: true });

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#234C3D"/>
  <circle cx="512" cy="515" r="276" fill="#FFFDF7"/>
  <circle cx="512" cy="515" r="188" fill="#F6F1E6" stroke="#78A96B" stroke-width="28"/>
  <path d="M302 236 L302 494 M254 236 L254 420 Q254 494 302 494 Q350 494 350 420 L350 236" fill="none" stroke="#E8793D" stroke-width="34" stroke-linecap="round"/>
  <path d="M748 234 Q660 290 660 408 Q660 476 720 498 L720 790" fill="none" stroke="#E8793D" stroke-width="36" stroke-linecap="round"/>
</svg>`;

const foregroundSvg = iconSvg.replace('<rect width="1024" height="1024" fill="#234C3D"/>', "");
await sharp(Buffer.from(iconSvg)).flatten({ background: "#234C3D" }).png().toFile(path.join(assets, "icon.png"));
await sharp(Buffer.from(iconSvg)).resize(512, 512).png().toFile(path.join(assets, "favicon.png"));
await sharp(Buffer.from(foregroundSvg)).png().toFile(path.join(assets, "adaptive-icon.png"));
await sharp(Buffer.from(iconSvg))
  .resize(520, 520)
  .extend({ top: 252, bottom: 252, left: 252, right: 252, background: "#F4F1E8" })
  .png()
  .toFile(path.join(assets, "splash.png"));
