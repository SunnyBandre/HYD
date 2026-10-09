// Fetches per-dish photos from Wikimedia Commons, downscales to <=480px and
// converts to WebP. Writes to src/assets/images/food/<slug>.webp and prints a
// report + CREDITS.md. Photos on Commons are freely licensed (see CREDITS).
import sharp from "sharp";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";

const OUT = new URL("../src/assets/images/food", import.meta.url).pathname
  // strip a leading drive letter slash on Windows
  .replace(/^\/([A-Za-z]:)/, "$1");
const WANT = 480;

const dishes = {
  "egg-omelette": { q: "omelette", keys: ["omelette"] },
  "bun-kabab": { q: "bun kebab", keys: ["bun kebab"] },
  "beef-nihari": { q: "nihari", keys: ["nihari"] },
  "hara-keema": { q: "keema", keys: ["keema", "qima"] },
  "hara-keema-ghotala": { q: "mutton keema", keys: ["keema", "ghotala"] },
  "egg-roll": { q: "kolkata egg roll", keys: ["egg roll", "kolkata"] },
  "chicken-boti-roll": { q: "kati roll", keys: ["kati roll", "kathi roll", "roll"] },
  "chicken-seekh-kabab-roll": { q: "seekh kebab", keys: ["seekh", "roll"] },
  "chicken-bihari-roll": { q: "roll kebab", keys: ["bihari", "roll"] },
  "beef-seekh-kabab-roll": { q: "seekh kebab roll", keys: ["seekh", "roll"] },
  "beef-bihari-roll": { q: "kebab roll", keys: ["bihari", "roll"] },
  "ch-tikka-leg": { q: "chicken tikka skewer", keys: ["tikka"] },
  "ch-boti": { q: "chicken boti", keys: ["boti"] },
  "ch-malai-boti": { q: "malai chicken", keys: ["malai"] },
  "ch-hariyali-boti": { q: "hariyali chicken", keys: ["hariyali", "green kebab"] },
  "ch-bihari": { q: "bihari kebab", keys: ["bihari"] },
  "ch-seekh-kabab": { q: "chicken seekh kebab", keys: ["seekh"] },
  "beef-bihari": { q: "bihari kabab", keys: ["bihari"], prefer: ["marinated", "threading", "serving plate"] },
  "beef-seekh-kabab": { q: "beef kebab seekh", keys: ["seekh"] },
  "fish-tilapia": { q: "tilapia", keys: ["tilapia"] },
  "fish-salmon": { q: "salmon fillet", keys: ["salmon"] },
  "plain-rice": { q: "steamed rice", keys: ["rice"] },
  "jeera-rice": { q: "jeera rice", keys: ["jeera", "jeera rice", "cumin rice"] },
  "vegetarian-biryani": { q: "vegetable biryani", keys: ["biryani", "vegetable"] },
  "goat-biryani": { q: "mutton biryani", keys: ["biryani", "mutton"] },
  "regular-chai": { q: "masala chai", keys: ["chai", "tea"] },
  "mixed-chai": { q: "ginger tea", keys: ["tea", "ginger"] },
  "water": { q: "glass of water", keys: ["water"] },
  "thumbs-up": { q: "cola glass", keys: ["cola"] },
  "salted-chaas": { q: "chaas", keys: ["chaas", "buttermilk"] },
  "sweet-lassi": { q: "lassi", keys: ["lassi"] },
  "mango-lassi": { q: "mango lassi", keys: ["mango lassi", "lassi"] },
  "gulab-jamun": { q: "gulab jamun", keys: ["gulab jamun"] },
  "carrot-halwa": { q: "carrot halwa", keys: ["halwa", "carrot", "gajar"] },
  "laukey-halwa": { q: "lauki halwa", keys: ["halwa", "lauki", "bottle gourd"] },
};

const api = (qs) =>
  `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8&${qs}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=${WANT}`;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "HYD-menu-app/1.0 (contact: dev@example.com)" } }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`bad JSON from ${url}: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "HYD-menu-app/1.0" } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

function score(title, spec) {
  const t = title.toLowerCase();
  let s = 0;
  for (const k of spec.keys) if (t.includes(k)) s += 10;
  for (const k of spec.prefer ?? []) if (t.includes(k)) s += 3;
  // prefer photos (not maps/diagrams/pages)
  if (/\.jpg|\.jpeg|\.png|\.webp/.test(title)) s += 1;
  if (/diagram|infographic|infographics|map|logo|flag|icon|drawing/.test(t)) s -= 20;
  return s;
}

fs.mkdirSync(OUT, { recursive: true });
const creds = ["# Dish photo credits — fetched from Wikimedia Commons",
  "| slug | file | license | url |", "| --- | --- | --- | --- |"];
const report = [];
let ok = 0, fail = 0;

for (const [slug, spec] of Object.entries(dishes)) {
  try {
    const json = await getJSON(api(`gsrsearch=${encodeURIComponent(`filetype:bitmap ${spec.q}`)}`));
    const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
    const scored = pages
      .map((p) => ({ p, s: score(p.title, spec) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    const best = scored[0]?.p ?? pages[0];
    if (!best?.imageinfo?.[0]) throw new Error(`no results for "${spec.q}"`);
    const ii = best.imageinfo[0];
    const url = ii.thumburl ?? ii.url;
    const buf = await download(url);
    const out = path.join(OUT, `${slug}.webp`);
    const info = await sharp(buf)
      .rotate()
      .resize({ width: WANT, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(out);
    const license = ii.extmetadata?.LicenseShortName?.value ?? "see file page";
    creds.push(`| ${slug} | ${best.title} | ${license} | https://commons.wikimedia.org/wiki/File:${encodeURIComponent(best.title.replace(/^File:/, ""))} |`);
    report.push(`ok    ${slug.padEnd(24)} ${info.width}x${info.height}  ${info.size} B  <- ${best.title}`);
    ok++;
  } catch (e) {
    report.push(`FAIL  ${slug.padEnd(24)} ${e.message}`);
    fail++;
  }
}

fs.writeFileSync(path.join(OUT, "CREDITS.md"), creds.join("\n") + "\n");
console.log(report.join("\n"));
console.log(`\nok=${ok} fail=${fail}`);