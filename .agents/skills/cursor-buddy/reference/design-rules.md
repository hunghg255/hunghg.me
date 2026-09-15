# Why the rules are shaped this way

Everything here was learned by building fifty of these and measuring what broke. Read it
when a character fails in a way the script's messages do not cover.

## The body must be one drawing

A mascot reads as stable when its body is the same drawing in every cell and the head
moves on top of it. Image models like to redraw the body in profile when the head turns,
which leaves nothing for the build to pin — measured body drift was 22% on a sheet drawn
that way against 5% for one drawn correctly, and no alignment strategy rescues it.

A bust with visible shoulders works far better than a long neck, because shoulders read
the same from every head angle.

## The head must dominate

The head is the part that moves. If the shoulders are as wide as the head, the eye reads
a wide slab and the tracking stops registering. Shoulders at roughly two thirds the head
width is the target. Measured on ones that work: cat 0.66, fox 0.62, robot 0.63. A first
fox attempt came back at 1.02 and looked inert.

## Nothing may touch a cell edge

Anything crossing an edge is clipped in the source itself. Hearts, sparkles and `zzz` are
the usual casualties.

Sideways clipping is the other half of this and shows up on anything wide: big ears, wide
hats, spread wings. A koala drawn with ears spanning almost the full cell width came back
with both ears chopped flat, *and* with a slice of the neighbouring cell's ear appearing
beside it — one fault producing two symptoms, a cut and a bleed. The build strips the
stray fragment, but the character's own clipped ear is part of the main shape and cannot
be recovered.

The cue is `edge contact` naming `L` or `R` across most cells, and more than one blob per
cell. The fix is in the description, not the build: say the wide feature must be drawn
small enough to leave clear space either side of it inside the cell. A character also needs clear space *below* the shoulders: the build
measures a fixed-height sliver up from the lowest opaque pixel, so if the body runs off
the bottom, that sliver is the cell edge rather than the shoulders and its width changes
with however much got clipped.

## Long hair is the most common failure

Loose hair that falls over the shoulders gets drawn differently in the two sheets, so the
shoulder line the build pins on moves. A pirate with loose braids measured 5.06px of
movement on click; the same character re-prompted with the hair tied back under a bandana
measured 0.00px. Buns, beanies, hats and short hair are all safe.

## How the two sheets are made to agree

Each sheet is normalised against its own anchor, so a reactions sheet drawn even slightly
larger survives that untouched and the mascot lurches the moment it is clicked. The build
fixes this: it takes the mean silhouette of each sheet and searches for the scale and
vertical offset that make the two overlap best, then applies that one correction to all
nine reaction frames, and finally nudges each frame individually onto the shoulder line.

Single-feature heuristics were tried first and all failed the same way. Matching
silhouette height is fooled by an expression sheet that draws the hair bushier; matching
head width is fooled by a bigger hat. Both measure one thing and get misled by whatever
else the second sheet happened to draw differently. Searching the overlap optimises what
a viewer actually sees.

## The bottom fade

A real blur, not just an alpha ramp: four increasing radii composited through their own
bands, blurred in premultiplied alpha so transparent black is not dragged into the edges.
It is anchored to each frame's own bottom row rather than one shared line — a shared line
either clips the frames that reach lower or leaves shallower ones ending in a hard cut.

Its depth trades against how much body survives. `FADE_DEPTH` in `build.py` is 0.12 of
the tile; at 0.20 it ate the panda's shoulders.

Every character is also cropped so its bottom edge lands on the same line down the tile,
so a row of mascots sits at one height instead of each finding its own.

## Reading the numbers

`verify.py` reports how far the body moves when the atlases swap, in pixels at the size
the mascot is rendered. Under ~1px is invisible; the script refuses to register anything
above 2px.

The number is measured on a band at **fixed rows of the tile**. Two earlier versions of
this measurement were wrong in ways worth knowing about, because both looked more careful
than the thing that worked:

- *Widest row of the lower body* reported 27–37px of movement on characters that do not
  move at all. A straight-sided body has many rows of identical width, so the argmax
  flips between them arbitrarily.
- *A band defined relative to each frame's own extent* reported 4–6px, and was circular:
  the bottom fade ends at a slightly different height in every frame, so a
  frame-relative band starts in a different place and the correlation reads that as
  motion.

The overlap percentage printed alongside varies legitimately (64–95%) because reaction
art genuinely differs in silhouette — bushier hair, an open mouth. Do not chase it.

## When the numbers and your eyes disagree

Trust your eyes. Put the directions centre frame and the reactions blink frame on top of
each other in two colours and look at where they disagree — that is the check that
matches what a person sees, and it caught problems the metrics missed more than once.

## The two sheets can disagree without moving

Position is not the only failure. The expressions sheet sometimes comes back as a
recognisably different drawing — same pose, same size, but the whiskers dropped or the
belly patch gone — and the mascot then changes appearance on click without shifting a
pixel. Shift alone scores that as perfect.

`verify.py` also reports a palette match: a histogram intersection over the character's
own pixels, across both sheets. Verified characters land between 49% and 86%. A
mismatched pair measured 12%. The build refuses anything under 40%.

The percentage is lower than intuition suggests even for good pairs, because expressions
legitimately change which colours are visible — an open mouth adds pink, closed eyes
remove white. Do not chase it upward; it is a floor, not a score.

Two things move this number, both worth reaching for before redrawing:

- **The model.** On one hamster, `gpt-image-1` produced 12–21% across four attempts;
  `gpt-image-2.5` produced 45% first try, preserving whiskers and belly patch that the
  older model kept dropping. Newer image models hold a character together across two
  generations far better.
- **Restating the description in the second prompt.** Handing over the first sheet as a
  reference image is not enough on its own — the model treats it as inspiration and
  redraws. Naming the colours in words as well as pixels moved the same character from
  12% to 21% before the model change.

## Transparency

The sheets must be PNGs with a real alpha channel, and this is the one failure with no
recovery: a flattened background cannot be keyed out afterwards, because the character's
own outlines are the same black. Ask for it explicitly in every prompt. Of 290 images
generated by Codex on one machine, only 15 had an alpha channel at all — the default is
opaque.

## Ask for appeal, do not forbid it

The style paragraph is phrased as a list of things to include. An earlier version was
inherited from prompts written against an older model and was phrased as prohibitions —
*FLAT cartoon vector style, no gradients, no glossy 3D shading*.

Those prohibitions were never doing any work. The older model ignored them and added
catchlights, blush, inner-ear colour and tufted fur anyway, which is why the first fifty
characters look the way they do. A newer model follows instructions properly, obeys them,
and returns exactly what that phrasing describes: two flat fills, beady dot eyes, a
smooth blob silhouette and no blush. Beside the hand-made set it looked unfinished.

The fix was to name the qualities that make the set work — white catchlight in each eye,
soft cheek blush, several tones per colour, coloured inner ears, a tufted silhouette
wherever there is fur — and narrow the negatives to photorealism and heavy 3D gloss only.
Same model, same character, same everything else; the result went from unusable to
matching the rest of the set, and the palette match rose from 45% to 58% as a side
effect, since a richer palette is more distinctive to preserve.

The general lesson: when prompts move to a newer model, the constraints that were being
silently ignored start being obeyed. Re-read them for what they literally ask for.

## A photo needs to be told to stop being a photo

Feeding a reference photo produces a good likeness and the wrong style: a realistic
portrait illustration with small eyes and adult proportions, sitting beside a set of
big-head chibis. The identifying features come through fine; it is the *rendering* that
carries over when you did not want it to.

Naming the target style is not enough, because the photo is the stronger signal. What
works is saying plainly what to discard — "DO NOT reproduce the photograph: not its
realism, not its lighting, not its proportions, not its level of detail" — and then what
to keep, as a short closed list: hair, facial hair, glasses shape, skin tone, top colour.
Everything else gets simplified away.

Same photo, same model, one added paragraph: the second attempt matched the set.

## The body can change size without moving

A third way the sheets disagree, found only after a user reported it: the body is drawn at
a different *width*. A uniform scale difference leaves the body centred where it was, so
the shift measurement reads a clean 0.00px while the shoulders visibly swell or shrink the
moment you click. Two of the five characters reported this way scored a perfect zero on
every check that existed at the time.

`verify.py` now also reports width change at the shoulders. Most of the set lands under
8%. The two that were visibly wrong measured 34% and 16%.

Both were characters whose hair covered the shoulders — and that is also what caused it.
The cross-sheet fit searches for the scale that makes the two sheets overlap best, and if
that search can see the hair, an expression sheet with bushier hair drags the scale down
until the hair agrees, taking the shoulders with it. The fix was to run the fit on the
shoulders alone (`FIT_BAND`), below where hair reaches.

`FIT_BAND` has to be genuinely low. At 0.55 of the character's height it still caught hair
on every long-haired character and the fit kept shrinking them; 0.86 clears it. Above ~0.90
the band gets too thin and the scale estimate turns noisy again.

Where the hair covers the shoulders completely there is nothing reliable to match on and no
setting rescues it. Tying the hair back fixed both characters outright: 34% to 7%, and 16%
to 2%. This is the same rule as the pirate, arriving by a different route — it is the most
load-bearing constraint in the whole brief.

## A sheet can come back mirrored

One character in fifty-two arrived with its head turns in mirrored order: the drawing
facing the viewer's right sat in the `up-left`, `left` and `down-left` slots, and vice
versa. On the page it looked away from the cursor instead of toward it.

No measurement catches this. Shift, palette, width and overlap are all perfect, because
every drawing is correct and correctly aligned — only the cell order is wrong. It is the
one defect that has to be looked at rather than measured.

Check it the cheap way: crop the `left` cell (row 2, column 1) and the `right` cell
(row 2, column 3) and put them side by side. The left one must face the viewer's left.

It does not need regenerating. The art is fine, so swapping the outer columns of the
directions sheet moves every drawing into the slot it belongs to:

```python
for r in range(3):
    left  = im.crop((0, r*T, T, (r+1)*T))
    right = im.crop((2*T, r*T, 3*T, (r+1)*T))
    out.paste(right, (0, r*T)); out.paste(left, (2*T, r*T))
```

The expressions sheet is unaffected — every cell there faces the viewer.
