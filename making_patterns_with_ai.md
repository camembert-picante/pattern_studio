# Making patterns with AI

Pattern Studio can be driven by an AI assistant (Claude or any other) in three ways. None of them needs anything installed in the browser.

| Way | Where it works | What you get |
|---|---|---|
| **1. A share link** | Any chat with any AI, no tools needed | A link that opens the pattern in the browser, ready to edit or export |
| **2. The render script** | Claude Code or any agent that can run commands | Finished files (SVG, PNG, DXF, STEP, STL…) written straight to disk |
| **3. The in page API** | Agents that control a browser | `window.PatternStudio` for loading, inspecting and exporting |

All three use the same **pattern description**: a small JSON object, documented below. Every field is optional except `layers`, and anything left out takes its default.

The public site is **https://camembert-picante.github.io/pattern_studio/**.

**For an AI agent working in this repository:** the whole app is `index.html` (HTML, CSS and JS in one file, no build step). To make a pattern for someone, write the pattern description, run `node tools/render.mjs pattern.json --format png` and look at the result, adjust, then render the formats they asked for and give them the files together with the `--link`, so they can keep editing in the browser.

***

## 1. Share links

Put the pattern JSON after `#pattern=`, URL encoded:

```
https://camembert-picante.github.io/pattern_studio/#pattern=<URL encoded JSON>
```

Opening the link loads the pattern, replacing what was on screen. Undo brings back the previous one. Example: a hexagonal star pattern.

```
https://camembert-picante.github.io/pattern_studio/#pattern=%7B%22layers%22%3A%5B%7B%22shape%22%3A%22star%22%2C%22group%22%3A%22p6m%22%2C%22cellW%22%3A14%7D%5D%7D
```

which is `{"layers":[{"shape":"star","group":"p6m","cellW":14}]}`.

* **File → Copy share link** in the app makes a shorter, compressed link (`#p=…`) for any pattern, including your own shapes.
* Links work on the public site and on any copy of `index.html` served over http(s). They do not work on a claude.ai artifact page, because claude.ai drops this part of the address, and the app's own links always point at the public site.

**For an AI writing a link:** build the JSON, keep it compact (no spaces), URL encode it, and append it to the address above. Keep to built in shape ids or define shapes with `svgShapes` (below).

## 2. The render script (Claude Code and other agents)

`tools/render.mjs` loads the app in headless Chromium, applies a pattern and writes the exports. It needs Node 18+ and Playwright (`npm i playwright` or a global install; set `CHROMIUM_PATH` to use a specific Chromium).

```bash
node tools/render.mjs pattern.json --format svg,png,dxf --out out
node tools/render.mjs "https://camembert-picante.github.io/pattern_studio/#p=…" --format step
echo '{"layers":[{"shape":"dot","group":"p6","cellW":6}]}' | node tools/render.mjs - --format png --dpi 150 --link
```

| Option | Meaning |
|---|---|
| `--format a,b,c` | Any of `svg svgtile png pngtile jpg webp disp disptile dxf dxftile step stl json` (default `svg,png`) |
| `--out dir` | Where to write files (default `out`) |
| `--dpi n` | Resolution for png / jpg / webp / displacement maps |
| `--relief mm`, `--base mm` | Relief height and base plate thickness for STL and STEP |
| `--solid relief\|perforated` | STEP: raised pieces on a plate, or a plate with every piece cut through |
| `--split n` (1 to 4) | STEP: split into n × n blocks (zipped) for heavy patterns |
| `--no-expand` | SVG: keep copies as `<use>` references |
| `--link` | Also print a share link for the pattern |

It prints a JSON summary: piece count, open area (%), surface size, seamless tile size (if any), the files written and, with `--link`, the link. Check the summary before handing files over: `pieces` near 60,000 with `limitReached: true` means the spacing is too tight; `openArea` is what matters for vents and grilles.

**Workflow for an agent:** write the pattern JSON → render a PNG → look at it → adjust → render the final formats → give the user the files and the share link so they can keep editing.

## 3. The in page API

On the site (or any copy of `index.html`), `window.PatternStudio` offers:

| Call | Does |
|---|---|
| `load(pattern)` | Load a pattern object or JSON text. Returns a summary |
| `get()` | The current pattern as a full project object |
| `summary()` | Layers, pieces, open area, surface, seamless tile, gradient count |
| `reset('clear' \| 'example')` | One empty layer, or the starter pattern |
| `presets()` / `preset(name)` | List or load the built in presets. Loading one is a clean start: nothing from the previous pattern carries over except custom shapes and export settings |
| `shapes()`, `groups()`, `layouts()`, `formats()` | What can be used |
| `addShape(svgText, name)` | Add a shape from SVG; returns its id |
| `await export(format, options)` | `[{ filename, mime, base64 }]`, with no download dialog |
| `await link()` | A share link for the current pattern |
| `await fromLink(url)` | The pattern inside a share link |

***

## The pattern description

All sizes are in **millimetres**; angles are in degrees. Coordinates are measured from the surface's top left corner, x to the right, y down.

```json
{
  "region": { "W": 200, "H": 150 },
  "ctrls": [ { "type": "point", "x": 100, "y": 75, "radius": 80 } ],
  "layers": [ {
    "layout": "wallpaper", "group": "p4", "shape": "comma",
    "cellW": 20, "size": 8, "fill": "#1f2a44"
  } ],
  "fx": [ { "kind": "size", "p": { "min": 0.4, "max": 1 } } ]
}
```

### Surface: `region`

| Field | Values | Default |
|---|---|---|
| `W`, `H` | Surface width and height | 200, 150 |
| `shape` | `rect`, `rounded`, `ellipse`, `custom` (outline of a shape, see `shapeId`) | `rect` |
| `radius` | Corner radius for `rounded` | 12 |
| `shapeId`, `fit` | For `custom`: the shape whose outline is the surface; `contain` or `stretch` | |
| `margin` | Empty band inside the edge | 0 |
| `edge` | `clip` cut pieces at the edge · `inside` only whole pieces inside · `touch` whole pieces that may overhang | `clip` |
| `bgOn`, `bg` | Paint the background, and its colour | `true`, `#f7f3ea` |
| `boundary` | Draw the outline in exports | `false` |
| `featherOn`, `featherW` | Soften the pattern towards the edge over this width | `false`, 10 |
| `featherMode` | `size` shrink · `fade` · `sizefade` · `dither` thin out | `size` |
| `featherMin`, `featherCurve` | Size at the very edge (0 to 1); `linear smooth in out step` | 0, `smooth` |

### Layers: `layers[]`

Each layer is one shape repeated by one layout. Layers are drawn in list order, so the last one is on top.

**Layout**

| `layout` | What it does | Settings in `lay` |
|---|---|---|
| `wallpaper` (default) | One of the 17 symmetry groups, set by `group` | `stack`: `none`, `down`, `up` (which rows overlap which) |
| `scatter` | Random but evenly spaced (Poisson disc) | `spacing` (min distance), `seed`, `jitter` (random turn ±°) |
| `spiral` | Archimedean spiral | `spacing`, `pitch` (gap between turns), `arms`, `cx`, `cy` (centre, % of W/H), `align`, `jitter` |
| `concentric` | Rings | `spacing`, `ringMode`: `circle` or `boundary` (follow the surface outline), `cx`, `cy`, `align`, `jitter` |
| `fibonacci` | Sunflower packing | `spacing`, `cx`, `cy`, `align` (point copies outward), `jitter` |
| `hatch` | Continuous lines; their width follows gradients | `spacing`, `width`, `angle`, `cross` (second direction), `crossAngle` |
| `flow` | Lines that bend with gradients and can wave | `spacing`, `width`, `angle`, `bend`, `bendCentre`, `wave`, `waveLen`, `waveSkew` |
| `voronoi` | Stones separated by cracks | `spacing` (stone size), `gap` (crack width), `corner` (corner radius in mm; large values give pebbles), `round` (extra smoothing, 0 to 4), `seed` |

`hatch`, `flow` and `voronoi` draw their own geometry and ignore `shape`.

**Wallpaper group and cell** (for `wallpaper`)

| `group` | Cell | Cell fields |
|---|---|---|
| `p1`, `p2` | oblique | `cellW` (side a), `bLen` (side b), `angle` between them: 90 rectangle/square, 60 hexagonal |
| `pm`, `pg`, `pmm`, `pmg`, `pgg` | rectangular | `cellW`, `cellH` |
| `cm`, `cmm` | centred rectangular | `cellW`, `cellH` |
| `p4`, `p4m`, `p4g` | square | `cellW` |
| `p3`, `p3m1`, `p31m`, `p6`, `p6m` | hexagonal | `cellW` (distance between rotation centres) |

* `p1` copies only slide, so every copy faces the same way. That makes `p1` the plain grid: a square grid is `"angle": 90, "bLen"` equal to `cellW`, and a hex or staggered grid is `"angle": 60`.
* The other groups add half turns (`p2`), mirrors (`m`), glides (`g`), quarter turns (`p4…`) or third- and sixth turns (`p3…`, `p6…`).
* `rot` rotates the whole pattern.
* `sx`, `sy` place the lattice origin, a symmetry point. Set them to W/2, H/2 to centre the pattern.
* `link: true` on layers 2+ reuses Layer 1's cell so stacked layers stay aligned.

**Motif** (any layout except hatch / flow / voronoi)

| Field | Meaning | Default |
|---|---|---|
| `shape` | A shape id (below) | `comma` |
| `size` | Longest side of the motif | 12 |
| `mx`, `my` | Motif offset from the cell origin (wallpaper only) | -5.7, -8.7 |
| `mrot`, `aspect`, `flip` | Turn (°), width multiplier, mirror | 0, 1, `false` |

If a layer gives none of `size`, `mx` and `my`, the motif is placed automatically to suit its cell or spacing, the same as the **Reset motif** button. For groups with rotations or mirrors, keep the motif off the cell origin, or its copies pile up on one spot.

**Look**

| Field | Values | Default |
|---|---|---|
| `fill` | Colour | `#1f2a44` |
| `strokeOn`, `stroke`, `sw` | Outline on/off, colour, width (mm; for line shapes this is the line width) | `false`, `#000000`, 0.6 |
| `opacity`, `blend` | 0 to 1; `normal multiply screen overlay darken lighten difference exclusion` | 1, `normal` |
| `colorMode`, `palette`, `paletteN` | `single`, or colour copies by `copy` (orientation), `flip`, `rows`, `cols`, `checker`, `random` using the first `paletteN` colours of `palette` | `single` |
| `visible` | Show the layer | `true` |

### Effects: `fx[]`

Effects decide what the gradients do, like layer effects in Photoshop. Each effect is one response, driven by some or all gradients and applied to some or all layers. Several effects can stack, including several of the same kind, and they apply in list order.

```json
"fx": [
  { "kind": "size",  "p": { "min": 0.3, "max": 1 } },
  { "kind": "color", "p": { "c2": "#e8b04a" }, "src": ["g1"], "layers": ["L2"] }
]
```

| Field | Meaning | Default |
|---|---|---|
| `kind` | One of the kinds below | |
| `p` | The settings for that kind | the kind's defaults |
| `src` | `"all"`, or a list of gradient `id`s that drive it | `"all"` |
| `layers` | `"all"`, or a list of layer `id`s it applies to | `"all"` |
| `on` | Turn the effect off without removing it | `true` |

To point an effect at particular gradients or layers, give those gradients and layers an `id` (any short text, like `"g1"` or `"L2"`) and list the ids.

| `kind` | `p` | Effect |
|---|---|---|
| `size` | `min` (far), `max` (near) | Size. Line layouts vary width; voronoi varies stone size |
| `spacing` | `amt` (-0.9 denser … 0.9 sparser) | Density: packs pieces closer or spreads them near gradients |
| `rot` | `deg` | Turn pieces near gradients |
| `align` | `off` (0 points at the source, 90 runs around it, 180 points away) | Face the source: every piece turns to point at the nearest point, line or curve gradient, or along a ramp |
| `opacity` | `min` (far opacity), `w` (fade over, 0.05 to 1) | Fade. With `w` 1 the fade runs evenly across the gradient; lower values keep pieces solid and fade only the weak end, like a feathered edge |
| `drop` | `mode` (`threshold` or `dither`), `t` | Remove pieces where the gradient is weak |
| `color` | `c2` (far colour) | Blend from `c2` to each layer's `fill` |
| `morph` | `shape`, `steps` | Morph into another shape across the gradient |

`rot`, `align` and `morph` act on shape layers only. Older projects stored responses per layer as `"mod": { "size": { "on": true, … } }`, and had a separate `feather` kind (now `opacity` with `w`); those still load and become effects for that layer.

### Gradients: `ctrls[]` and `mix`

Gradients are sources: each gives a value from 0 to 1 everywhere on the surface, and the effects decide what that value does. Give a gradient an `id` when an effect should follow only that one.

| `type` | Fields |
|---|---|
| `point` | `x`, `y`, `radius` (reach) |
| `line` | `x1`, `y1`, `x2`, `y2`, `radius` |
| `curve` | `pts`: `[[x, y], …]` through which a smooth spline runs, `radius` |
| `ramp` | `x1`, `y1` (value 0) to `x2`, `y2` (value 1) |
| `noise` | `radius` (feature size), `seed` |
| `image` | `data` (an image data URL; dark = 1), `contrast` |

All types also take `curve` (falloff: `linear smooth in out step`), `invert`, `weight` (strength 0 to 1) and `on`. `mix` combines several: `max` (default), `add`, `multiply`, `min`.

### Keep-out areas: `excl[]`

Red areas where pieces are removed (screw holes, logos, clear bands). Coordinates in mm from the surface's top left.

```json
"excl": [
  { "type": "ellipse", "x": 85, "y": 60, "w": 30, "h": 30, "margin": 2 },
  { "type": "rect", "x": 0, "y": 0, "w": 200, "h": 12, "mode": "centre" },
  { "type": "poly", "pts": [[20, 100], [60, 90], [70, 140], [15, 135]] },
  { "type": "shape", "shapeId": "star", "x": 140, "y": 20, "w": 40, "h": 40, "layers": ["L2"] }
]
```

| Field | Meaning | Default |
|---|---|---|
| `type` | `rect`, `ellipse` (box `x`, `y`, `w`, `h`), `poly` (`pts`), `shape` (a shape id stretched to the box) | |
| `margin` | Extra clear space around the area, mm | 0 |
| `mode` | `touch` removes pieces that touch the area; `centre` only those centred in it | `touch` |
| `layers` | `"all"` or a list of layer `id`s | `"all"` |
| `on` | Turn the area off without removing it | `true` |

### Shapes

Built in ids:
* **Organic:** `comma` `leaf` `drop` `crescent` `seigaiha` (wave scale)
* **Geometric:** `dot` `ellipse` `pill` `bar` `square` `tri` `hex` `star` `ring` `plus` `ell`
* **Lines:** `line` `wave` `arc` `hook`. These are drawn as strokes; their thickness is `sw`.
* **Surface outlines:** `insole`

Define your own with `svgShapes`, then use the id like any other:

```json
"svgShapes": [
  { "id": "blob", "name": "Blob", "d": "M10 50 C10 10 90 10 90 50 C90 90 10 90 10 50 Z" },
  { "id": "zig",  "name": "Zigzag", "d": "M0 0 L20 30 L40 0 L60 30", "line": true },
  { "id": "logo", "name": "Logo", "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>…</svg>" }
]
```

* **Coordinates:** any units work; shapes are scaled to fit.
* **Holes:** a path with several closed parts uses even odd filling, so inner parts become holes.
* **Line shapes:** add `"line": true` to draw the path as a stroke instead of a fill.

### Export settings: `exp`

`dpi`, `expand` (SVG copies as paths), `reliefH`, `baseT`, `solid` (`relief` or `perforated`), `split`, `stepTol`, `jpgQ`. The render script's options set these for you.

***

## Recipes

**Round speaker grille, holes shrinking toward the rim**
```json
{ "region": { "W": 120, "H": 120, "shape": "ellipse", "edge": "inside", "featherOn": true, "featherW": 10, "featherMin": 0.3 },
  "ctrls": [ { "type": "point", "x": 60, "y": 60, "radius": 62 } ],
  "layers": [ { "group": "p1", "shape": "dot", "cellW": 4.2, "bLen": 4.2, "angle": 60, "sx": 60, "sy": 60, "mx": 0, "my": 0, "size": 3.2 } ],
  "fx": [ { "kind": "size", "p": { "min": 0.45, "max": 1 } } ] }
```

**Laptop vent: slots that fade out along a ramp**
```json
{ "region": { "W": 220, "H": 70, "shape": "rounded", "radius": 14, "edge": "inside" },
  "ctrls": [ { "type": "ramp", "x1": 10, "y1": 35, "x2": 210, "y2": 35 } ],
  "layers": [ { "group": "p1", "shape": "pill", "cellW": 10, "bLen": 6, "angle": 63.4, "mx": 0, "my": 0, "size": 8 } ],
  "fx": [ { "kind": "size", "p": { "min": 0.3, "max": 1 } }, { "kind": "opacity", "p": { "min": 0, "w": 0.3 } } ] }
```

**Two layers, one effect each**
```json
{ "ctrls": [ { "id": "centre", "type": "point", "x": 100, "y": 75, "radius": 90 }, { "id": "ramp", "type": "ramp", "x1": 0, "y1": 0, "x2": 200, "y2": 0 } ],
  "layers": [ { "id": "dots", "group": "p4", "shape": "dot", "cellW": 10, "size": 7 },
              { "id": "rings", "group": "p6", "shape": "ring", "cellW": 16, "size": 9, "fill": "#d4552b" } ],
  "fx": [ { "kind": "size", "src": ["centre"], "layers": ["dots"], "p": { "min": 0.2, "max": 1 } },
          { "kind": "rot", "src": ["ramp"], "layers": ["rings"], "p": { "deg": 180 } },
          { "kind": "color", "p": { "c2": "#e8b04a" } } ] }
```

**Tread with mirrored leaves**
```json
{ "region": { "W": 110, "H": 280, "shape": "custom", "shapeId": "insole", "fit": "stretch", "edge": "inside" },
  "layers": [ { "group": "pgg", "shape": "leaf", "cellW": 14, "cellH": 18, "fill": "#26282d" } ] }
```

**Halftone from noise**
```json
{ "ctrls": [ { "type": "noise", "radius": 30, "seed": 4 } ],
  "layers": [ { "layout": "fibonacci", "shape": "dot", "lay": { "spacing": 3.5, "cx": 50, "cy": 50 }, "size": 3.2 } ],
  "fx": [ { "kind": "size", "p": { "min": 0.1, "max": 1 } }, { "kind": "drop", "p": { "t": 0.08 } } ] }
```

## Good to know

* **Piece count:** keep the motif smaller than its cell, and keep `size` and `spacing` sensible for the surface. Rendering stops at about 60,000 pieces.
* **Seamless tiles** (`svgtile`, `pngtile`, `disptile`, `dxftile`) need wallpaper layers at 0° or 90° rotation, no active effects and no feather.
* **STEP** with `perforated` needs pieces that don't overlap.
* **Holes inside shapes** are kept in exports, but morphing uses only each shape's outer outline.
