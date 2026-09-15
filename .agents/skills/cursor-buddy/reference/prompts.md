# The three prompts

Substitute `{DESCRIBE}` with the character description, e.g. *a cute chibi fox with warm
orange fur, a cream muzzle and dark ear tips*.

Ask for transparency every time. It is the one failure that cannot be repaired
afterwards.

## Doing it by hand

With no image tool and no API key, paste these into any chat UI that draws images. One
fresh chat per character, exactly two messages: DIRECTIONS, then EXPRESSIONS with the first
result attached. Retrying inside a chat that already holds several attempts makes the model
average over them and the two sheets stop matching; if one needs redoing, start a new chat
and redo both. Saying up front that a second matching sheet is coming measurably helps.

Save the results as `characters/<name>/directions.png` and `characters/<name>/reactions.png`
in the project, then from the project root:

```bash
python3 <skill-dir>/scripts/mascot.py <name> --skip-generate
```

It builds, checks, and either says the character is ready or names the sheet at fault.

**Do not weaken the style paragraph.** It is written to ask for appeal rather than to
forbid it, and that is deliberate — see the note in `design-rules.md`. Telling a current
image model what *not* to do ("flat, no gradients, no shading") gets you exactly that:
two-tone fills, beady eyes and a smooth blob of a silhouette.

---

## DIRECTIONS — the first sheet

```
Generate a 3x3 grid sprite sheet of {DESCRIBE}. Cute storybook sticker art: clean bold black
outlines with some weight variation, big expressive eyes each with a bright white catchlight,
soft pink cheek blush, and warm saturated colours. Give it several tones per colour -- a
lighter muzzle or belly, a darker shaded edge, coloured inner ears -- and a textured, tufted
silhouette wherever the character has fur or hair, rather than a smooth blob. Charming and
playful, full of small appealing details. Not flat, not plain, not minimal. No photorealism,
no heavy 3D gloss, no airbrushed gradients.

This sheet is NINE HEAD DIRECTIONS, not expressions -- the face keeps the same calm
expression in every cell and only the direction the head is TURNED changes.

LAYOUT: 3 columns by 3 rows, evenly spaced, fully transparent background. Each drawing is
head plus upper shoulders, centred in its cell, same character and same head size in all
nine cells.

FRAMING: a PORTRAIT BUST. Head, neck and shoulders only. NO arms, NO hands, NO legs, NO
lower body. The shoulders are the lowest thing in the cell.

PROPORTIONS: a BIG HEAD chibi that still has a real body. The head is large and dominant,
and the shoulders are roughly TWO THIRDS the width of the head -- narrower than the head,
but clearly there. Do NOT draw a floating head.

THE RULE THAT MATTERS MOST: draw the BODY ONCE and reuse it. The neck, chest and shoulders
must be the EXACT SAME SHAPE in the EXACT SAME POSITION in all nine cells, identical pixels
if you can. The body always faces the viewer. Do NOT redraw the body in profile when the
head turns. Only the head rotates, on top of an unchanging body.

MARGINS -- this is what goes wrong most often, so follow it literally: each character must
sit ENTIRELY INSIDE its own cell with a wide empty gap on all four sides. Draw it at roughly
75% of the cell height, centred, leaving clear empty space above the head AND below the
shoulders. The shoulders must STOP WELL SHORT of the bottom edge of the cell -- do not let
the body run off the bottom or bleed into the cell underneath. Nothing may touch or cross a
cell boundary. Shrink the character equally in every cell if that is what it takes.

Turn the whole head clearly, do not just move the eyes: looking left swings the nose or
muzzle left and brings the far ear or cheek into view.
Row 1: up-left, up, up-right. Row 2: left, straight at the viewer, right.
Row 3: down-left, down, down-right.

NO hearts, NO sparkles, NO "zzz", NO spiral eyes -- no floating symbols of any kind.
No text, no labels, no borders, no drop shadows, no background colour.
Square image, at least 1024x1024, PNG WITH A REAL ALPHA CHANNEL. The background must be
genuinely transparent, not white.
```

---

## EXPRESSIONS — the second sheet

Pass the directions sheet you just made as a reference image alongside this.

Repeating the description here is deliberate. Handing over the first sheet is not enough
on its own — the model treats it as inspiration and quietly redraws the character,
dropping details like whiskers or a belly patch. Restating the colours in words as well
as pixels is what holds it together.

```
The attached image is a 3x3 head-direction sprite sheet. Produce the MATCHING EXPRESSIONS
sheet for that same character. The character is {DESCRIBE}. Copy the character from the
attached image exactly: the same colours, the same markings, the same fur or surface detail,
the same line weight. Every marking visible in the attached sheet must appear here too. Do
not restyle, simplify or redraw it.

NOT head directions. The character faces STRAIGHT AT THE VIEWER in all nine cells, head
perfectly straight. The only thing that changes between cells is the FACE, plus one small
floating icon or compact icon cluster in EVERY cell.

CRITICAL: same art style, same palette, same line weight, same proportions, and EXACTLY THE
SAME SIZE AND POSITION IN THE CELL as the attached sheet. The chest and shoulders must be the
same drawing, the same width, and the same height off the bottom of the cell as in the
attached sheet, identical in all nine cells here. If the two sheets do not line up the
character visibly jumps, so match them.

Wide margin on all four sides, nothing touching a cell edge including the floating symbols,
and clear empty space below the shoulders.

The nine expressions, left to right, top to bottom:
1. Eyes closed as two upward curved arcs, gentle smile, plus ONE SMALL GOLDEN SUN in the chosen upper corner.
2. Same closed arc eyes, plus ONE SMALL RED HEART in the chosen upper corner.
3. Same closed arc eyes, plus THREE SMALL YELLOW SPARKLE STARS in the chosen upper corner.
4. Eyes wide open and very round, mouth open in a small round O of surprise, plus ONE ORANGE EXCLAMATION MARK in the chosen upper corner.
5. Starstruck: both eyes drawn as bright star shapes, big happy smile, plus ONE SMALL GOLDEN SHOOTING STAR with a short tail in the chosen upper corner. Star-shaped eyes alone do not count as the icon.
6. Eyes closed arcs, strong pink blush on both cheeks, plus ONE SMALL PINK FLOWER in the chosen upper corner.
7. Eyes closed sleeping curves, plus a small blue "z z z" in the chosen upper corner.
8. Both eyes drawn as spiral swirls, wavy wobbly mouth, plus ONE SMALL PURPLE SPIRAL in the chosen upper corner. Spiral eyes alone do not count as the icon.
9. Eyes closed arcs, mouth wide open in a big happy grin, plus ONE SMALL PARTY POPPER with a compact spray of confetti in the chosen upper corner.

ICONS: Every cell must include its assigned icon, drawn in the same art style and palette
as the character, not a pasted platform emoji. Keep each icon or cluster compact, clearly
separate from the hair and readable at small display sizes. For EACH cell, randomly choose
ONE of two positions: the UPPER-LEFT or UPPER-RIGHT empty corner beside the top of the head,
as seen by the viewer. Use a varied mix of left and right placements across the sheet.
Place the entire icon cluster in that one corner; never split it across both corners or
place it in the top centre. Use the space beside the upper hair silhouette to save height,
keeping a clear gap from the hair and a wide inset from cell edges. Choose the corner once
when generating the artwork; its position stays fixed in the exported sprite.
Keep the head and shoulders at their reference
size and position; do not shrink or move the character to fit icons. No stray marks or
fragments from neighbouring cells. For restricted-colour styles, use the style palette
instead of the icon colours named above, preserving each icon's distinctive shape.

No text except the surprise exclamation mark and sleep "z z z" icons. No labels, no
borders, no drop shadows, no background colour.
Square image, at least 1024x1024, PNG WITH A REAL ALPHA CHANNEL. The background must be
genuinely transparent, not white.
```

---

## REFERENCE — starting from the user's own image or photo

Use this in place of DIRECTIONS when the user supplies a picture. Pass their image as the
reference. `{DESCRIBE}` is optional — add anything the picture does not make obvious.

A photograph pulls the model toward photorealism unless it is told in as many words to
throw the rendering away and keep only the identifying features. Without the "DO NOT
reproduce the photograph" paragraph you get a competent portrait illustration that looks
nothing like the rest of the set — right likeness, wrong style. Keep it.

```
The attached image shows a person or character. Redraw them as a 3x3 grid sprite sheet of
NINE HEAD DIRECTIONS, in a completely different style from the attached image.

DO NOT reproduce the photograph: not its realism, not its lighting, not its proportions, not
its level of detail. Restyle it completely into a BIG HEAD CHIBI CARTOON -- a head roughly one
and a half times the width of the shoulders, very large round friendly eyes far bigger than a
real person's, a simplified nose and mouth, thick clean outlines and soft cheek blush. Think
children's sticker, not portrait.

Keep ONLY the things that identify them: hair shape and colour, facial hair, the shape and
colour of any glasses, skin tone, and the colour of their top. They are {DESCRIBE}.
Simplify everything else away.

[then the style paragraph, and the LAYOUT / FRAMING / PROPORTIONS / THE RULE THAT MATTERS
MOST / MARGINS blocks from the DIRECTIONS prompt above, unchanged]

The face keeps the same calm friendly expression in every cell; only the direction the head is
TURNED changes.
Row 1: up-left, up, up-right. Row 2: left, straight at the viewer, right.
Row 3: down-left, down, down-right.

NO hearts, NO sparkles, NO "zzz", NO spiral eyes -- no floating symbols of any kind.
No text, no labels, no borders, no drop shadows, no background colour.
Square image, at least 1024x1024, PNG WITH A REAL ALPHA CHANNEL. The background must be
genuinely transparent, not white.
```

Describe the person plainly and only by what is visible — hair, facial hair, glasses, skin
tone, clothing colour. The EXPRESSIONS sheet then follows exactly as normal, with the
directions sheet you just made as its reference.

---

## STYLES

Every prompt below contains one **style paragraph** — the sentence or two describing how the
character is drawn. Swap that paragraph for one of these to change the look. Everything else
stays exactly as written: the framing, the big-head proportions, the one reused body, the
margins. A style only changes the rendering, never the shape, so it cannot break the
alignment the pipeline depends on.

Use the same style for both sheets of a character, and say the style name again in the
EXPRESSIONS prompt so the second sheet does not drift back toward the default.

### colour (default)

```
Cute storybook sticker art: clean bold black outlines with some weight variation, big
expressive eyes each with a bright white catchlight, soft pink cheek blush, and warm saturated
colours. Give it several tones per colour -- a lighter muzzle or belly, a darker shaded edge,
coloured inner ears -- and a textured, tufted silhouette wherever the character has fur or
hair, rather than a smooth blob. Charming and playful, full of small appealing details. Not
flat, not plain, not minimal. No photorealism, no heavy 3D gloss, no airbrushed gradients.
```

### ink — black and white pen drawing

```
Black and white pen-and-ink drawing. Confident varied-weight black linework with fine
cross-hatching and stippling for shading. NO colour anywhere and no flat grey fills -- every
tone comes from the density of the hatching. Big expressive eyes with a white catchlight left
as clean paper. Crisp, high contrast, plenty of open white. Charming and characterful, like a
children's book illustration. Keep the big-head chibi cartoon proportions and the soft cheek
blush exactly as they would be in colour -- this is the same cute cartoon character, only drawn
in ink. Do NOT make it realistic or detailed.
```

### sketch — pencil

```
Loose graphite pencil sketch. Visible hand-drawn strokes with a slightly rough, searching
quality, soft smudged shading, a few construction lines left showing. Warm grey graphite tones
only, no flat colour and no hard vector edges. Big expressive eyes with a bright highlight left
as clean paper. Warm and handmade. Keep the big-head chibi cartoon proportions and the soft
cheek blush exactly as they would be in colour -- the same cute cartoon character, only drawn
in pencil. Do NOT make it realistic or detailed.
```

### riso — two-colour risograph

```
Two-colour risograph print. Flat spot inks in warm coral red and deep teal ONLY, plus the paper
showing through. Visible paper grain, coarse halftone dot texture in the shaded areas, and a
slight misregistration offset between the two ink layers. Bold simple shapes, no black outline
-- forms are defined by the colour blocks.
```

### paper — cut-paper collage

```
Cut-paper collage. The character built entirely from flat torn and cut paper shapes in layered
matte colours, with visible paper fibre texture and a soft drop shadow where one piece overlaps
another. No drawn outlines at all -- every edge is a cut or torn paper edge. Warm, tactile and
handmade.
```

### pixel — 16-bit sprite

```
16-bit pixel art. Chunky visible square pixels on a strict grid, a small limited palette,
hard-edged dithering for shading, a crisp one-pixel dark outline, and absolutely no
anti-aliasing or soft edges anywhere. Readable and characterful at a small size, like a Super
Nintendo sprite.
```

### Two things to know

**ink and sketch pull toward realism.** Both carry that association far more strongly than
"cartoon" resists it, and they come back with bigger ears, smaller eyes and detailed fur --
recognisably a more grown-up character rather than the same one in monochrome. The trailing
"keep the chibi proportions, do NOT make it realistic" sentence helps but does not fully fix
it. Check the proportions against a colour character before accepting one.

**pixel needs a different resize.** The build scales with Lanczos everywhere, which softens
exactly the hard edges that make pixel art work. Shipping this style properly means a
nearest-neighbour path through `build.py`, not just the prompt.
