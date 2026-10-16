# Pattern Studio

Pattern Studio is a local tool for building parametric patterns for products and surfaces: vents, grilles, treads, textures and prints. It is a single file that runs in the browser with no install, no internet connection and no account.

## Run it

**Option A:** double-click `index.html`.

**Option B:** run this in the folder that holds `index.html`:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

Your work autosaves in the browser. Use **Save project** to keep a `.json` file you can reopen anywhere.

## The idea

The canvas works as the control panel. You drop **gradient controllers** on it and drag their handles. Every layer then responds to the combined gradient, and the pattern redraws live.

## Layouts

Every layout uses the same boundary, shapes and gradients, so switching between them takes one click.

| Layout | Notes |
|---|---|
| Wallpaper group (17) | p1 … p6m symmetry groups |
| Grid | Rows and columns with a row offset (brick, staggered, hex) |
| Random scatter | Poisson-disc spacing, so pieces are random but evenly spaced. Gradients can make it denser or sparser. |
| Along a path | Pieces follow a Curve or Line gradient, in one or more rows |
| Spiral | Archimedean spiral; arms and turn gap are adjustable |
| Concentric | Rings around a centre, or rings that follow the surface outline |
| Fibonacci | Sunflower packing using the golden angle |
| Cross-hatch lines | Continuous lines whose width follows the gradient. A second direction gives moiré effects. |
| Voronoi stone cracks | Stones separated by cracks of a set width |
| Flow lines | Each line bends with the gradient and can wave, giving ripples and contour-map looks |

## Gradients and attractors

These apply to all layers.

| Controller | Notes |
|---|---|
| Point | Radial attractor with a set reach |
| Line | Attractor along a segment |
| Curve | Attractor along an editable spline; it can also be the path for "Along a path" |
| Linear ramp | A gradient from 0 to 1 between two handles |
| Image map | Halftone: an image's brightness drives the pattern, and dark areas give bigger pieces |
| Noise | Organic variation |

Each controller has a reach, a falloff curve (linear, smooth, ease, step), invert and strength. You can combine several controllers by taking the strongest value, adding, multiplying or taking the weakest.

## Gradient response

These settings are per layer:
- **Size**, from a far scale to a near scale. Line layouts vary line width; Voronoi varies stone size.
- **Spacing**, which packs pieces denser or spreads them sparser near a controller, like a lens.
- **Rotation**, and **Angle**, which makes pieces face along the gradient.
- **Opacity**. In the displacement map this becomes grey levels.
- **Drop out**, either below a threshold or by random thinning (dither).
- **Colour gradient**, from a far colour to the fill colour.
- **Morph shape**, which blends one shape into another across the gradient (for example a square into a star).

## Surface

- **Boundary:** a rectangle, a rounded rectangle, a circle or ellipse, or **any shape** (imported, drawn, or a text outline). Holes in a shape are kept.
- **Margin**, and what happens at the edge: cut pieces, keep only whole pieces, or let whole pieces overhang.
- **Feather edges:** set a width and an effect (shrink, fade, shrink + fade, or thin out). A dotted line on the canvas marks where the feather starts.
- **Open area:** the status bar shows roughly how much of the surface is open, which is useful for vents and grilles.

## Shapes

- 22 built-in shapes, including a wave scale and an insole outline.
- **Import:** SVG, PNG, JPG, GIF, WebP, BMP, AVIF and DXF. You can also paste SVG code or a path `d` string.
- **Draw** your own shape.
- **Text:** converted to outlines by default.
- **Images:** trace them to vector outlines.
- **Bake cell → shape:** turns one cell's cluster of copies into a new shape, so a rosette can be fed into another group.

## Presets

There are 16 presets: Speaker grille, Laptop vent, Halftone dots, Sunflower, Voronoi stone, Flow waves, Moiré hatch, Shoe tread (pgg), Spiral seeds, Concentric diffuser, Path scatter, Seigaiha waves, Ridgeline waves, Midsole lattice, Letterform and Shape morph. Every value in a preset stays editable.

## Exports

All exports are in real millimetres.

| Format | Use |
|---|---|
| SVG (whole surface or one seamless tile) | Illustrator, Figma, Inkscape, laser cutting, print |
| PNG, JPG, WebP | Set the resolution in dpi |
| Displacement map PNG | Blender Displace modifier, or a height/bump texture |
| DXF (R12) | AutoCAD, Fusion, CNC, sheet-metal and laser cutting. You get one DXF layer per pattern layer, plus the boundary. |
| **STEP (.stp)** | Real solids for SolidWorks, Fusion, Rhino, CATIA and Inventor. Choose raised pieces on a plate, or a **perforated plate** with every piece cut through. **STP split** (2×2, 3×3 or 4×4 blocks, zipped) keeps dense patterns responsive in CAD. A tolerance setting trades accuracy for file size. |
| STL | A relief on a base plate for 3D printing. Each piece is a watertight shell. |
| Project (.json) | Reopen and keep editing later |

If a STEP file won't open, switch the CAD import mode between Solid and Surface.

## Limits

- A seamless tile exists only for lattice layouts (wallpaper or grid) at rotation 0° or 90°, with no active gradients and no feather.
- The perforated plate needs pieces that don't overlap each other.
- Morphing uses each shape's outer outline, so holes inside a shape are not morphed.
- Very dense patterns stop at about 60,000 pieces. Increase the spacing, or split the surface into parts.
