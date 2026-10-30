#!/usr/bin/env node
// Render a Pattern Studio pattern to files, with no browser window: loads index.html in headless Chromium
// and drives window.PatternStudio. See making_patterns_with_ai.md.
//
//   node tools/render.mjs <pattern.json | share link | -> [--format svg,png,dxf] [--out dir] [--dpi 300] [--link]
//
// Prints a JSON summary (pieces, open area, files written, share link) on stdout.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = pathToFileURL(path.join(HERE, '..', 'index.html')).href;

function parseArgs(argv) {
  const o = { input: null, formats: ['svg', 'png'], out: 'out', link: false, opts: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--format' || a === '-f') o.formats = v().split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--out' || a === '-o') o.out = v();
    else if (a === '--link') o.link = true;
    else if (a === '--dpi') o.opts.dpi = +v();
    else if (a === '--relief') o.opts.reliefH = +v();      // STL / STEP relief height, mm
    else if (a === '--base') o.opts.baseT = +v();          // base plate thickness, mm
    else if (a === '--solid') o.opts.solid = v();          // STEP: relief | perforated
    else if (a === '--split') o.opts.split = +v();         // STEP: 1, 2, 3 or 4 (blocks per side)
    else if (a === '--no-expand') o.opts.expand = false;   // SVG: keep <use> copies instead of expanded paths
    else if (a === '--merge') o.opts.merge = true;         // DXF / STEP / STL: overlapping pieces become one outline, per layer
    else if (a === '--merge-layers') { o.opts.merge = true; o.opts.mergeLayers = true; } // ... and across layers
    else if (a === '--background') o.opts.withBg = true;  // SVG / PNG / JPG / WebP: include the surface colour (left out by default)
    else if (a === '--offset') o.opts.offset = +v();       // DXF / STEP / STL: grow (+) or shrink (-) every outline, mm (kerf)
    else if (a === '-h' || a === '--help') { console.log('Usage: node tools/render.mjs <pattern.json | link | -> [--format svg,png,dxf,step,stl,...] [--out dir] [--dpi 300] [--solid relief|perforated] [--merge] [--offset mm] [--background] [--link]'); process.exit(0); }
    else if (!o.input) o.input = a;
    else throw new Error('Unexpected argument: ' + a);
  }
  if (!o.input) throw new Error('Give a pattern: a .json file, a share link, or a dash (-) for stdin. --help for usage.');
  return o;
}

async function loadPlaywright() {
  try { return await import('playwright'); } catch { /* fall back to a global install */ }
  const root = execSync('npm root -g').toString().trim();
  return import(pathToFileURL(path.join(root, 'playwright', 'index.mjs')).href);
}

async function readStdin() { const chunks = []; for await (const c of process.stdin) chunks.push(c); return Buffer.concat(chunks).toString('utf8'); }

const args = parseArgs(process.argv.slice(2));
const { chromium } = await loadPlaywright();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(APP);
  await page.waitForFunction(() => window.PatternStudio && window.PatternStudio.version >= 1);

  const isLink = /#(p|pattern)=/.test(args.input);
  const project = isLink ? await page.evaluate(u => window.PatternStudio.fromLink(u), args.input)
    : JSON.parse(args.input === '-' ? await readStdin() : await readFile(args.input, 'utf8'));
  const summary = await page.evaluate(p => window.PatternStudio.load(p), project);

  await mkdir(args.out, { recursive: true });
  const files = [];
  for (const f of args.formats) {
    const got = await page.evaluate(([fmt, opts]) => window.PatternStudio.export(fmt, opts), [f, args.opts]);
    for (const g of got) { const p = path.join(args.out, g.filename); await writeFile(p, Buffer.from(g.base64, 'base64')); files.push(p); }
  }
  const result = { ...summary, files };
  if (args.link) result.link = await page.evaluate(() => window.PatternStudio.link());
  if (errors.length) result.pageErrors = errors;
  if (result.limitReached) console.error('Warning: the 60,000 piece limit was reached, so part of the pattern is missing. Use bigger pieces, wider spacing or a smaller surface.');
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
