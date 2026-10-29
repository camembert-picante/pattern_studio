# Pattern Studio

Pattern Studio is a local tool for building parametric patterns for products and surfaces: vents, grilles, treads, textures and prints. It is a single file that runs in the browser with no install, no internet connection and no account.

## Run it

**Option A:** double click `index.html`.

**Option B:** run this in the folder that holds `index.html`:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

Your work autosaves in the browser's own storage on your device (local storage, not cookies): the pattern, your own shapes, edits to built in shapes and which shapes you deleted. Nothing is sent anywhere. That storage belongs to one browser on one device and is lost if you clear site data, so use **Save project** to keep a `.json` file you can reopen anywhere; it carries your shapes with it.

## Finding your way around

* **Top bar:** Undo, Redo, a **File** menu (new, open, save, share link, import, draw or type a shape) and **Export**.
* **Clear everything** (next to Shuffle on the canvas toolbar) removes all layers, gradients, effects, colours and surface settings and leaves one empty layer, ready for you to pick a shape. Your shapes and export settings stay, and Undo brings everything back. **File → New pattern** starts again from the example pattern instead. Deleting the only layer does the same, without asking; Undo brings it back.
* **Canvas toolbar:**
  * **Crop** puts handles on the surface edges. Drag them to trim or extend the surface; the pattern stays where it is. Press Esc or Enter when done.
  * **Center** moves the pattern so a symmetry point sits in the middle of the surface (spirals, rings and sunflowers move their centre there).
  * **Reset motif** puts the motif back to a tidy size and spot in its cell.
  * **Shuffle** tries a random symmetry group and motif placement. Undo brings the last one back.
  * **Clear everything** leaves one empty layer with no gradients or effects.
  * **Fit** shows the whole surface, and **View** turns guides on or off: rulers, cell, motif box, gradient handles, symmetry marks, seamless tile and heat map.
* **Shapes** is the top button on the left edge of the canvas. It shows the shape in use; click it to see every shape, divided into Organic, Geometric, Lines and **Your shapes** (imported, drawn and text shapes, with Import, Draw and Text). The shape in use is named at the top with Edit, Delete and, for an edited built in shape, Reset.
* **Drag and drop shapes** from the rail or a family: drop on the canvas to use it on the selected layer, on a layer in the Layers list to give that layer the shape, or on empty space in the list for a new layer. Crosshatch, flow and Voronoi layers draw lines rather than motifs, so a shape picked or dropped on one goes on a new layer above it.
* **Keep out** (red, on the rail) adds red keep-out areas where no pieces go: draw a **rectangle** or **ellipse** by dragging, **draw** any outline with the same pen tool as Draw a shape (click for a corner, click and drag for a curve, Shift for 45°, click the first point or press Enter to finish, Backspace removes the last point, Esc cancels), or use **any shape** from the library. Drag an area to move it, its corner to resize it, and press Delete to remove it. On a drawn area drag its points and curve handles to reshape it (Alt/Option drag bends a handle on its own) and Alt/Option click a point to switch it between corner and curve. In the Keep out panel each area can be hidden, duplicated or deleted, and has a **margin** for extra clear space, a choice between removing pieces that **touch** it or only pieces **centred** in it, and which layers it applies to. Lines in crosshatch and flow layouts break around the areas, and exports follow them.
* **Motif** (bottom of the rail) opens the motif panel next to the shape tools: position, size, turn, stretch, flip, Edit shape outline and Bake cell. It stays open on wide screens and floats over the canvas on phones.
* **Outline band** (Style): a solid band of any colour around every piece of a layer, drawn under it. It outlines motifs, line shapes and crosshatch bands, for strapwork, interlace and cut out lettering looks. It is part of the picture (SVG, PNG); cut files keep the pieces themselves.
* **Random variation** (in the Motif panel) makes copies less stamped: a random turn (any angle, or whole steps such as 90° for Truchet tiles), random size, random mirroring, random colours from the layer's colours, and **Mix shapes**, where each copy picks between the layer's shape and any shapes you tick. A seed gives another arrangement. A random layer has no seamless tile.
* **Half drop and half brick:** for the p1 and p2 groups, Spacing has a Repeat choice. Half drop slides every column down by half a cell, like most wallpapers and fabrics; half brick slides every row across.
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
| Duplicate | Ctrl/Cmd+D, or the duplicate buttons, makes an exact copy: of the selected keep-out area, of the open effect when you're on the Effects tab, otherwise of the selected layer (its effects follow the copy) |
| Delete a gradient | Click one of its handles and press Delete or Backspace. On a curve this removes just the clicked point (a curve keeps at least two), or pulls back the clicked curve handle. Esc or a click on empty canvas deselects |
| Snap | The **Snap** button on the canvas toolbar turns snapping on and off. While it is on, dragged points, the pattern and the motif line up with the middle and edges of the surface and with every other point: gradient points, curve points, keep-out corners and points, cell corners and points already placed with the pen. A pink guide shows the line and a small × marks the point it lines up with. Hold Alt to drag freely |

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
| Random scatter | Poisson disc spacing, so pieces are random but evenly spaced. Gradients can make it denser or sparser. **Relax** evens the dots out step by step; with a Density effect they gather smoothly, like stippling |
| Circle packing | Circles of many sizes packed without touching, largest first, around keep-out areas and inside the outline. Set the smallest and largest diameter and the gap; gradients can decide where big circles fit. Each circle holds one copy of the motif |
| Spiral | Archimedean spiral; arms and turn gap are adjustable |
| Concentric | Rings around a centre, or rings that follow the surface outline |
| Circular pattern | Copies turned around a centre with any number of folds (5, 8, 10, 12…), like a rosette or mandala. Mirror copies adds a reflected copy beside each one; set the first ring, ring gap and number of rings, even spacing (outer rings get more copies, always a multiple of the folds), a twist per ring and a centre piece |
| Fibonacci | Sunflower packing using the golden angle |
| Crosshatch lines | Continuous lines whose width follows the gradient. A second direction gives moiré effects. With both directions, **Weave over and under** makes each line pass over one crossing and under the next, like woven cloth, basketry or strapwork, with a gap on each side where it passes under |
| Contour lines | Isolines of the gradients, like a topographic map: set how many levels and the line width. With no gradients they follow a built in noise; with a Noise gradient (Detail, Warp) they look like real terrain. **Draw** picks lines, **Filled above a level** (solid shapes wherever the gradient is above the level, with holes where it dips back below) or **Filled bands** (every other band between levels is solid; with a palette each band takes its own colour, like a relief map). Filled shapes export as outlines with holes to DXF, STEP and STL |
| Voronoi stone cracks | Stones separated by cracks of a set width. **Corner radius** rounds the stones, up to smooth pebbles |
| Flow lines | Each line bends with the gradient and can wave, giving ripples and contour map looks |

## Gradients and attractors

These are the sources: each gives a value from 0 to 1 across the surface. On their own they change nothing; effects decide what they do.

| Controller | Notes |
|---|---|
| Point | Radial attractor with a set reach |
| Line | Attractor along a segment |
| Curve | Attractor along a pen path: drag its points and curve handles on the canvas, Alt/Option click a point to switch corner and curve, Alt/Option drag a handle to bend it on its own, or **Draw with pen** to draw it again (click for a corner, click and drag for a curve, Enter or a click on the last point to finish) |
| Linear ramp | A gradient from 0 to 1 between two handles |
| Image map | Halftone: an image's brightness drives the pattern, and dark areas give bigger pieces |
| Noise | Organic variation. **Style** smooth, ridged (sharp crests) or cells (rounded cells around random points); **Detail** adds finer layers, **Roughness** sets how strong they are, **Warp** bends the noise by itself for marbled shapes |
| Turing pattern | A reaction diffusion simulation, the process behind animal coats, coral and ferrofluid: **Style** labyrinth (winding worms), stripes, spots, holes or cells (packed round blobs); **Blend with** lets patches of the surface drift into a second style, with **Blend amount** for how much; **Pattern size** sets the distance from one worm or spot to the next; **Seed** gives another layout; **Stretch** and **Direction** pull the worms one way, like fingerprints or brain coral. **Even line widths** measures by distance from each worm's edge (0.5 is the edge, 1 the centre line, 0 the middle of the gap), so a level near 1 gives thin dark lines of one width that still branch and end freely. It takes a few seconds to grow and the pattern appears when it is ready. Contour lines set to **Filled above a level** turn it into solid labyrinth shapes; stack several at nearby levels for shading |

Each controller has a reach, a falloff curve (linear, smooth, ease, step), invert and strength. On crosshatch and flow lines, opacity and colour effects fade smoothly along each line. You can combine several controllers by taking the strongest value, adding, multiplying or taking the weakest.

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
* **Drop out**, either below a threshold, by random thinning (dither), or in **bands**: the gradient is cut into steps and only a band of each step keeps its pieces, for contour stripes, tone bands or Turing style stripes.
* **Colour**, from a far colour to each layer's fill colour.
* **Morph shape**, which blends one shape into another across the gradient (for example a square into a star).

## Surface

* **Boundary:** a rectangle, a rounded rectangle, a circle or ellipse, or **any shape** (imported, drawn, or a text outline). Holes in a shape are kept.
* **Your own outline:** under Surface, **Draw outline** draws the boundary on the canvas with the pen tool, right where you want it, and **Upload outline…** takes an SVG or DXF (or an image, which is traced). The pattern then only lives inside that outline. SVG and DXF files keep their real size (from the SVG's width in mm, cm, in, pt or px, or the DXF's units), and if the outline is bigger than the surface, the surface grows to fit it. With **Actual size** you can move the outline with Outline x and y, and **Fit surface to outline** trims the surface to the outline plus the margin. Keep proportions and Stretch to fill still fit any outline into the surface.
* **Margin**, and what happens at the edge: cut pieces, keep only whole pieces, or let whole pieces overhang.
* **Feather edges:** set a width and an effect (shrink, fade, shrink + fade, or thin out). A dotted line on the canvas marks where the feather starts.
* **Open area:** the status bar shows how much of the whole surface the pieces cover (the open area of a vent or grille), measured on a fine grid so overlapping pieces count once and pieces are cut at the outline.
* **Piece limit:** a pattern draws and exports at most 60,000 pieces. When it hits that, the status bar and a message say so, because part of the pattern is missing.

## Shapes

* 19 built in shapes under **Shapes** on the left tool rail: **Organic** (comma, leaf, drop, crescent, wave scale), **Geometric** (dot, ellipse, pill, square, triangle, hexagon, star, ring, plus, L) and **Lines** (line, wave, arc, hook). Stretching a pill keeps its ends round, so a stretched pill is a slot or a bar.
* **Edit any shape:** open it in the pen tool with **Edit shape outline** (Motif tab) or the **Edit** button in a shape family. Curves and arcs become editable points and handles. Every shape edits in place and updates everywhere it is used, built in ones included; an edited built in shape gets a small dot and a **Reset** button that brings back the original. Holes and extra parts are kept as they are.
* **Delete any shape:** hover a shape under Shapes and click ✕ (on a phone, select it first), or use Delete at the top of the panel. Layers that used it switch to another shape. Undo brings it back. Deleted built in shapes are only hidden, so presets and saved patterns that use them still work, and **Restore** in their group brings them back.
* Hover a shape for ✎ to open it straight in the pen tool.
* **Import:** SVG, PNG, JPG, GIF, WebP, BMP, AVIF and DXF. You can also paste SVG code or a path `d` string.
* **Draw** your own shape with a pen tool that works like Illustrator's: click for a corner, click and drag for a curve, click the first point to close. Drag points and handles to refine; Alt/Option drag a handle to break it, Alt/Option click a point to switch corner and smooth, Shift for 45° steps.
* **Text:** converted to outlines by default.
* **Images:** trace them to vector outlines.
* **Bake cell → shape:** turns one cell's cluster of copies into a new shape, so a rosette can be fed into another group.

## Presets

There are 16 presets: Speaker grille, Laptop vent, Halftone dots, Sunflower, Voronoi stone, Flow waves, Moiré hatch, Shoe tread (pgg), Spiral seeds, Concentric diffuser, Seigaiha waves, Ridgeline waves, Midsole lattice, Letterform, Shape morph and Ferrofluid labyrinth. Loading a preset is a clean start: layers, gradients, effects, keep-out areas, the surface, crop and the View options all come from the preset, with nothing left over from before. Your own shapes and export settings stay, and Undo brings your previous pattern back. Every value in a preset stays editable.

## Exports

All exports are in real millimetres.

| Format | Use |
|---|---|
| SVG (whole surface or one seamless tile) | Illustrator, Figma, Inkscape, laser cutting, print |
| PNG, JPG, WebP | Set the resolution in dpi |
| Displacement map PNG | Blender Displace modifier, or a height/bump texture |
| DXF (R12) | AutoCAD, Fusion, CNC, sheet metal and laser cutting. You get one DXF layer per pattern layer, plus the boundary. Dots export as true CIRCLE entities, and pieces are cut cleanly at any surface outline, including custom shapes. |
| **STEP (.stp)** | Real solids for SolidWorks, Fusion, Rhino, CATIA and Inventor. Choose raised pieces on a plate, or a **perforated plate** with every piece cut through. **STP split** (2×2, 3×3 or 4×4 blocks, zipped) keeps dense patterns responsive in CAD. A tolerance setting trades accuracy for file size. |
| STL | 3D printing: raised pieces on a base plate, or a **perforated plate** with every piece cut through as one watertight mesh (thousands of holes are fine). |
| Project (.json) | Reopen and keep editing later |

For DXF, STEP and STL:
* **Merge overlapping pieces** turns pieces that overlap or touch into one outline, so a cutter never cuts inside a piece and a solid never has overlapping parts. By default each layer merges only its own pieces and keeps its own DXF layer; tick **Across layers** to merge pieces from different layers too (outlines that mix layers go on a MERGED layer). A perforated plate always merges all its holes.
* **Offset outlines** grows (plus) or shrinks (minus) every outline for kerf compensation. For holes cut by a laser, use minus half the kerf; for parts, plus half.
* Round dots stay true circles: CIRCLE entities in DXF and true cylinders in STEP, which keeps files small (a perforated plate with 6,000 round holes is about 8 MB of STEP).

If a STEP file won't open, switch the CAD import mode between Solid and Surface.

## Limits

* A seamless tile exists only for wallpaper layouts at rotation 0° or 90°, with no active effects and no edge feather.
* The perforated plate needs pieces that don't overlap each other.
* Morphing uses each shape's outer outline, so holes inside a shape are not morphed.
* Very dense patterns stop at about 60,000 pieces. Increase the spacing, or split the surface into parts.
