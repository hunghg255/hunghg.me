---
name: cursor-buddy
description: Put a cursor-tracking mascot on a page -- a chibi character that turns its head toward the pointer and reacts when clicked. Uses bundled artwork and a bundled React component, or draws a new one (with your own image tool, the OpenAI images API, or from a photo of the user), builds its two sprite sheets into aligned atlases and verifies they do not jump. Use when the user asks for a mascot, a character that watches the cursor, a portfolio head, wants one of the existing characters on their page, or wants a new character drawn.
---

# Cursor Buddy

Add a bundled mascot or draw a new character, then integrate it into the actual page.

## Package resources

Resolve resource paths relative to the folder containing this `SKILL.md`, called
`<skill-dir>` below. Run commands from the target project root.

- `assets/fox-directions.webp` and `assets/fox-reactions.webp`: ready-to-use fox atlases.
- `assets/cursor-buddy.tsx`: React component with cursor tracking and click reactions.
- `reference/characters.md`: inventory of bundled characters and naming conventions.
- `reference/prompts.md`: prompts for new artwork, styles, and photo references.
- `scripts/`: generation, screening, atlas building, and verification helpers.

The bundled route works offline and needs no image generation, Python, or API key.

Each character is two 3×3 sprite sheets: nine head directions, and nine expressions. The
component swaps between them by moving `background-position`, so there is no per-frame
JavaScript and no animation library. A character is its two files -- there is no registry
and nothing has to know its name.

## Which route

- **The user names a character, or would take one that exists** -- *Use one that is
  drawn*. No Python, no API key, works in any React project. This is the common case.
- **The user wants something new, or their own likeness** -- *Draw a new one*, then
  finish with *Put it on the page*.

Both routes end in *Put it on the page*. Do not stop at files and a snippet.

## Use one that is drawn

1. **Pick.** Read `reference/characters.md` and check that both files exist in `assets/`.
   The package currently includes fox. If the user did not name a character, use fox and
   say why it fits. For an unbundled character or their own likeness, use *Draw a new one*.

2. **Copy the two bundled sheets** into wherever this project serves static files -- `public/`
   for Next, Vite, CRA and Astro, `static/` for SvelteKit -- or next to the component to
   import them:

   ```bash
   mkdir -p public/mascots
   cp "<skill-dir>/assets/fox-directions.webp" public/mascots/fox-directions.webp
   cp "<skill-dir>/assets/fox-reactions.webp" public/mascots/fox-reactions.webp
   ```

   In PowerShell, use `New-Item -ItemType Directory -Force` and `Copy-Item -LiteralPath`
   for the same paths. Replace `<skill-dir>` with the full skill folder path. These WebP
   files are already built atlases; copy them without running the PNG source-sheet pipeline.
   Keep the originals in the skill and inspect destination files before replacing them.

3. **Put it on the page** (below).

## Put it on the page

Reuse an existing compatible `CursorBuddy` component. Otherwise copy `assets/cursor-buddy.tsx` into
the project's component directory and adapt formatting and imports to the project.
It depends only on React and browser APIs. Preserve its client directive in Next.js;
enable client hydration in frameworks that require it.

`directions` and `reactions` are URL strings for the two served sheets. For imported
images, pass the resolved URL string (for example `.src` for a Next.js static image import).
Both required. The other props are `size` (default 140), `label` (what a screen reader
calls it) and `className`.

```tsx
<CursorBuddy
  directions="/mascots/fox-directions.webp"
  reactions="/mascots/fox-reactions.webp"
  size={140}
  label="fox mascot"
/>
```

Use public URLs, never filesystem paths into the skill. For a new character, substitute
the paths produced by the build. Confirm both URLs load, the head follows the pointer,
and click or keyboard activation triggers a reaction.

**Put it where the user asked.** If they did not say, the top of the page -- the header or
hero, above or beside the title, which is where a head that watches the cursor reads best.
Edit the actual component; then tell the user what you changed and where.

## Draw a new one

### First, work out how you will draw

Two sheets have to be drawn per character, and agents differ in whether they can do that
themselves. Check in this order:

1. **You have a built-in image generation tool** (Codex does). Use it directly -- follow
   *Drawing it yourself* below.
2. **`OPENAI_API_KEY` is set.** Use the API path, which needs no image tool at all --
   follow *Drawing through the API*. This is the route for Claude Code, which has no image
   tool.
3. **Neither.** Say plainly that drawing needs either an agent that can generate images or
   an `OPENAI_API_KEY`, and offer two alternatives: a bundled character from `assets/`
   (*Use one that is drawn*), or the manual route in `reference/prompts.md`, where the user
   pastes the prompts into a chat UI themselves. Do not try to drive a web UI in a browser
   to work around it: it depends on the page's markup, needs a logged-in session, and gets
   rate-limited part way through a set.

Either way, the build needs Python 3:

```bash
python3 -c "import PIL, numpy, scipy" 2>&1
```

If that fails: `pip install -r <skill-dir>/scripts/requirements.txt`. Stop and say so
rather than working around it.

`<skill-dir>` everywhere below is the folder holding this SKILL.md -- the skill is
usually installed outside the project, so use its full path. Run every command from the
project root: the scripts read source sheets from `characters/<name>/` and write the built
atlases to `public/mascots/` under the current directory. Pass `--dest static/mascots` (or
wherever this project serves static files) when `public/` is not it.

### Drawing through the API

One command generates, screens, builds, verifies and retries:

```bash
python3 <skill-dir>/scripts/mascot.py fox --describe "a chibi fox with warm orange fur, a cream muzzle and dark ear tips"
```

Add `--style riso` for a different look, or `--reference ~/photo.jpg` to redraw someone.
`--only reactions` redraws just the expressions sheet and keeps the directions sheet.
It needs `pip install openai` alongside the packages above. The image model is pinned in
`generate.py`; set `MASCOT_IMAGE_MODEL` to use a different one.

### Drawing it yourself

**1. Draw the directions sheet.** Use your image generation tool with the DIRECTIONS
prompt from `reference/prompts.md`, substituting the character description. Save it to
`characters/<name>/directions.png`.

**2. Draw the expressions sheet.** Use the EXPRESSIONS prompt, and pass the directions
sheet you just made as a reference image. Save it to `characters/<name>/reactions.png`.
Each of the nine expressions needs its own floating icon or compact icon cluster, as
specified in the prompt. Randomly choose the upper-left or upper-right empty corner
beside the top of the head for each cell, with a mix across the sheet. Keep the whole icon
cluster in one corner, never top-centred. This choice is made when drawing and stays fixed
in the exported sprite. Keep the character's scale and position fixed. Visually check all
nine cells after building for readable, unclipped icons in the chosen corners with clear
space from hair and cell edges; automated checks do not verify icon placement or meaning.

**3. Build and verify.**

```bash
python3 <skill-dir>/scripts/mascot.py <name> --skip-generate
```

**4. Act on what it says.** It either finishes and tells you the character is ready,
or it names which of the two sheets is at fault. Redraw that one sheet and run step 3
again. Give up after two attempts and change the description instead -- past that the art
is the problem, not the build.

Run the commands yourself. Do not print them for the user to copy.

### Check the head turns point the right way

The scripts measure everything except which direction the character is actually looking.
Before you hand a character over, crop the `left` cell (middle row, first column) and the
`right` cell (middle row, third column) of the directions sheet and look at them: the left
one must face the viewer's left.

A sheet occasionally comes back mirrored, and it scores perfectly on every check while
looking away from the cursor on the page. Do not regenerate it -- the art is right and only
the cell order is wrong. `reference/design-rules.md` has the three-line column swap that
fixes it.

### Transparency is the thing that most often goes wrong

The sheets **must** be PNGs with a real alpha channel. Ask for it explicitly every time --
image tools return an opaque PNG unless told otherwise, nearly every time.

If the build reports `alpha: MISSING`, redraw the sheet. There is no recovery: a
flattened background cannot be keyed out afterwards, because the character's own outlines
are the same black.

### Writing the description

This decides whether the result is good, so spend a sentence on it rather than passing
the user's word through raw. "fox" gives a worse fox than "a cute chibi fox with warm
orange fur, a cream muzzle and dark ear tips". Name the colours and two or three
distinguishing features, in one sentence.

Avoid, because each breaks the alignment the effect depends on:

- **Long loose hair over the shoulders.** Tie it back or put it under a hat. It gets drawn
  differently in each sheet and the mascot lurches when clicked. Most common failure by far.
- **Anything wider than the head** -- big wings, wide headdresses. They get clipped at the
  cell edges.
- **Held props.** Staffs, mugs, instruments. The framing is head and shoulders only.

Good: `a chibi robot with a mint-green boxy head and a single wide visor screen`,
`a chibi grandmother with silver hair in a neat bun and round gold spectacles`.

### Drawing in another style

Six looks are available: `colour` (the default), `ink`, `sketch`, `riso`, `paper` and `pixel`.
They change only how the character is drawn -- the framing, proportions, reused body and
margins are shared, so a style cannot break the alignment.

`reference/prompts.md` has the paragraph for each. Swap it into both prompts for that
character, and name the style again in the EXPRESSIONS prompt so the second sheet does not
drift back to the default. Through the API path it is a flag:

```bash
python3 <skill-dir>/scripts/mascot.py fox --style riso --describe "a chibi fox with orange fur"
```

Keep one style per character across both its sheets. The caveats for `ink`, `sketch` and
`pixel` are at the bottom of `reference/prompts.md` -- read them before using those three.

### From a user's own image

Same loop, but for step 1 pass their image to your image tool with the REFERENCE prompt
from `reference/prompts.md`. It redraws their character as a directions sheet in the
style the pipeline needs. Step 2 onward is unchanged.

### Afterwards

Built atlases land in `public/mascots/<name>-{directions,reactions}.webp` (or `--dest`).
The source sheets stay in `characters/<name>/` so a character can be rebuilt without
redrawing it; say so, and leave it to the user whether to keep or delete them.

Then *Put it on the page*.

### Making several

One at a time, reporting as you go.

## Going deeper

`reference/design-rules.md` explains why each art rule exists, what each failure looks
like, and how the two sheets are matched. Read it when a character fails in a way the
script's messages do not cover.
