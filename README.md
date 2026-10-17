# Pattern Studio

Pattern Studio is a local tool for building parametric patterns for products and surfaces: vents, grilles, treads, textures and prints. It is a single file that runs in the browser with no install, no internet connection and no account.

## Run it

**Option A:** double click `index.html`.

**Option B:** run this in the folder that holds `index.html`:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

Your work autosaves in the browser. Use **Save project** to keep a `.json` file you can reopen anywhere.

## Finding your way around

* **Top bar:** Undo, Redo, a **File** menu (new, open, save, share link, import, draw or type a shape) and **Export**.
* **Clear everything** (next to Shuffle on the canvas toolbar) removes all layers, gradients, effects, colours and surface settings and leaves one empty layer, ready for you to pick a shape. Your shapes and export settings stay, and Undo brings everything back. **File → New pattern** starts again from the example pattern instead.
* **Canvas toolbar:**
  * **Crop** puts handles on the surface edges. Drag them to trim or extend the surface; the pattern stays where it is. Press Esc or Enter when done.
  * **Center** moves the pattern so a symmetry point sits in the middle of the surface (spirals, rings and sunflowers move their centre there).
  * **Reset motif** puts the motif back to a tidy size and spot in its cell.
  * **Shuffle** tries a random symmetry group and motif placement. Undo brings the last one back.
  * **Clear everything** leaves one empty layer with no gradients or effects.
  * **Fit** shows the whole surface, and **View** turns guides on or off: rulers, cell, motif box, gradient handles, symmetry marks, seamless tile and heat map.
* **Shape tools** run down the left edge of the canvas, like Illustrator's toolbar. Each button is a family (Organic, Geometric, Lines) and shows the shape in use; click it to open the family and pick a shape. The pen button holds **Your shapes**: imported, drawn and text shapes, with Import, Draw and Text.
* **Drag and drop shapes** from the rail or a family: drop on the canvas to use it on the selected layer, on a layer in the Layers list to give that layer the shape, or on empty space in the list for a new layer. Crosshatch, flow and Voronoi layers draw lines rather than motifs, so a shape picked or dropped on one goes on a new layer above it.
* **Motif** (bottom of the rail) opens the motif panel next to the shape tools: position, size, turn, stretch, flip, Edit shape outline and Bake cell. It stays open on wide screens and floats over the canvas on phones.
* **Rulers** along the top and left of the canvas are in millimetres, with 0 at the surface's top left corner.
* **Settings panel**, with one tab per job: **Layout** (layers and how copies are arranged), **Effects** (gradients and what they do), **Style** (colour, surface), **Presets** and **Export**. The app opens on Layout with a plain pattern and no gradients; presets are optional and sit in their own tab.

### Moving around and moving things

It works like Illustrator or Figma:

| To do this | Do this |
|---|---|
| Pan | Drag an empty spot, scroll with the mouse wheel or trackpad, or hold Space and drag |
| Zoom | Ctrl/Cmd or Alt + scroll, pinch on a trackpad, or Ctrl/Cmd + `+` / `-` (Ctrl/Cmd + 0 fits) |
| Move the motif | Drag the dashed motif box (or Shift drag anywhere) |
| Move the whole pattern | Drag the green cell box |
| Stay on the surface | The cell box and the motif box can't leave the surface: drags stop at its edge, and if resizing, cropping or rotating would push them out, they move back in by whole cells, so the pattern itself doesn't change |
| Move a gradient | Drag its round handles |
| Snap to the middle | Handles, the pattern and the motif snap to the surface's centre lines (the motif also to its cell centre), with a pink guide. Hold Alt to drag freely, or turn it off under View → Snap to middle |

On a phone the canvas stays at the top and the settings sit in a sheet below it, with the tabs along the bottom. Tap the open tab again, or the grab bar, to give the canvas the full screen. Drag with one finger to pan or move things, and pinch with two fingers to zoom.

## Use it online, share it, or let an AI make patterns

* **Website:** https://camembert-picante.github.io/pattern_studio/ (GitHub Pages; nothing to install).
* **Share a pattern:** File → **Copy share link** gives a link that opens that exact pattern for anyone.
* **AI:** any AI can describe a pattern as a small JSON object and turn it into a link, and an agent such as Claude Code can render it straight to SVG, PNG, DXF, STEP or STL with `tools/render.mjs`. See **[making_patterns_with_ai.md](making_patterns_with_ai.md)**.

## The idea

The canvas works as the control panel. You drop **gradient controllers** on it and drag their handles. Every layer then responds to the combined gradient, and the pattern redraws live.

## Layouts

Every layout uses the same boundary, shapes and gradients, so switching between them takes one click.

| Layout | Notes |
|---|---|
| Wallpaper group (17) | p1 … p6m symmetry groups. Cells start square. Drag the cell's corner handles on the canvas to resize or slant it, or use the Square, Rectangle, Hex 60° and Slanted buttons under Spacing. Plain, brick and hex grids are p1 with the right side lengths and angle. |
| Random scatter | Poisson disc spacing, so pieces are random but evenly spaced. Gradients can make it denser or sparser. |
| Spiral | Archimedean spiral; arms and turn gap are adjustable |
| Concentric | Rings around a centre, or rings that follow the surface outline |
| Fibonacci | Sunflower packing using the golden angle |
| Crosshatch lines | Continuous lines whose width follows the gradient. A second direction gives moiré effects. |
| Voronoi stone cracks | Stones separated by cracks of a set width. **Corner radius** rounds the stones, up to smooth pebbles |
| Flow lines | Each line bends with the gradient and can wave, giving ripples and contour map looks |

## Gradients and attractors

These are the sources: each gives a value from 0 to 1 across the surface. On their own they change nothing; effects decide what they do.

| Controller | Notes |
|---|---|
| Point | Radial attractor with a set reach |
| Line | Attractor along a segment |
| Curve | Attractor along an editable spline |
| Linear ramp | A gradient from 0 to 1 between two handles |
| Image map | Halftone: an image's brightness drives the pattern, and dark areas give bigger pieces |
| Noise | Organic variation |

Each controller has a reach, a falloff curve (linear, smooth, ease, step), invert and strength. You can combine several controllers by taking the strongest value, adding, multiplying or taking the weakest.

## Effects

Effects work like layer effects in Photoshop. Add them with **+ Add effect** in the **Effects** tab; the menu says what each one does. Each effect is a card you can expand, hide with its eye, move up or delete. If there is no gradient yet, the first effect adds a point gradient you can drag.

* **Driven by:** all gradients, or only the ones you pick. While a card is open, gradients that don't drive it are dimmed on the canvas.
* **Applies to:** all layers, or only the ones you pick.
* **In the Layers list**, like Photoshop: overall effects sit on an **All layers** row at the top, and each layer lists its own effects underneath it. Drag an effect chip onto another layer to move it there, onto **All layers** to make it overall, or hold Alt while dropping to copy it. Click a chip to open it.
* **Order:** drag an effect card by its grip in the Effects tab to change the order effects apply in.
* **Stacking:** several effects can stack, even of the same kind, for example size from a point on one layer and colour from a ramp on all of them.

The effects are:
* **Size**, from a far scale to a near scale. Line layouts vary line width; Voronoi varies stone size.
* **Spacing**, which packs pieces denser or spreads them sparser near a controller, like a lens.
* **Rotation**, which turns pieces more the closer they are.
* **Face the source**, which turns every piece to point at the nearest gradient (or along a ramp). It shows nothing on round shapes like Dot.
* **Opacity**, with **Fade over**: at 100% pieces fade evenly across the gradient; lower values keep them solid and fade only the weak end, so the gradient's edge dissolves like a feather. In the displacement map opacity becomes grey levels.
* **Drop out**, either below a threshold or by random thinning (dither).
* **Colour**, from a far colour to each layer's fill colour.
* **Morph shape**, which blends one shape into another across the gradient (for example a square into a star).

## Surface

* **Boundary:** a rectangle, a rounded rectangle, a circle or ellipse, or **any shape** (imported, drawn, or a text outline). Holes in a shape are kept.
* **Margin**, and what happens at the edge: cut pieces, keep only whole pieces, or let whole pieces overhang.
* **Feather edges:** set a width and an effect (shrink, fade, shrink + fade, or thin out). A dotted line on the canvas marks where the feather starts.
* **Open area:** the status bar shows roughly how much of the surface is open, which is useful for vents and grilles.

## Shapes

* 20 built in shapes in three families on the left tool rail: **Organic** (comma, leaf, drop, crescent, wave scale), **Geometric** (dot, ellipse, pill, bar, square, triangle, hexagon, star, ring, plus, L) and **Lines** (line, wave, arc, hook).
* **Edit any shape:** open it in the pen tool with **Edit shape outline** (Motif tab) or the **Edit** button in a shape family. Curves and arcs become editable points and handles. Editing one of your shapes updates it everywhere; editing a built in shape saves an edited copy under Your shapes. Holes and extra parts are kept as they are.
* **Import:** SVG, PNG, JPG, GIF, WebP, BMP, AVIF and DXF. You can also paste SVG code or a path `d` string.
* **Draw** your own shape with a pen tool that works like Illustrator's: click for a corner, click and drag for a curve, click the first point to close. Drag points and handles to refine; Alt/Option drag a handle to break it, Alt/Option click a point to switch corner and smooth, Shift for 45° steps.
* **Text:** converted to outlines by default.
* **Images:** trace them to vector outlines.
* **Bake cell → shape:** turns one cell's cluster of copies into a new shape, so a rosette can be fed into another group.

## Presets

There are 15 presets: Speaker grille, Laptop vent, Halftone dots, Sunflower, Voronoi stone, Flow waves, Moiré hatch, Shoe tread (pgg), Spiral seeds, Concentric diffuser, Seigaiha waves, Ridgeline waves, Midsole lattice, Letterform and Shape morph. Every value in a preset stays editable.

## Exports

All exports are in real millimetres.

| Format | Use |
|---|---|
| SVG (whole surface or one seamless tile) | Illustrator, Figma, Inkscape, laser cutting, print |
| PNG, JPG, WebP | Set the resolution in dpi |
| Displacement map PNG | Blender Displace modifier, or a height/bump texture |
| DXF (R12) | AutoCAD, Fusion, CNC, sheet metal and laser cutting. You get one DXF layer per pattern layer, plus the boundary. |
| **STEP (.stp)** | Real solids for SolidWorks, Fusion, Rhino, CATIA and Inventor. Choose raised pieces on a plate, or a **perforated plate** with every piece cut through. **STP split** (2×2, 3×3 or 4×4 blocks, zipped) keeps dense patterns responsive in CAD. A tolerance setting trades accuracy for file size. |
| STL | A relief on a base plate for 3D printing. Each piece is a watertight shell. |
| Project (.json) | Reopen and keep editing later |

If a STEP file won't open, switch the CAD import mode between Solid and Surface.

## Limits

* A seamless tile exists only for wallpaper layouts at rotation 0° or 90°, with no active effects and no edge feather.
* The perforated plate needs pieces that don't overlap each other.
* Morphing uses each shape's outer outline, so holes inside a shape are not morphed.
* Very dense patterns stop at about 60,000 pieces. Increase the spacing, or split the surface into parts.
