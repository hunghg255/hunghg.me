"""Generate a character's two source sheets with the OpenAI images API.

    python generate.py fox --describe "a cute chibi fox with warm orange fur"
    python generate.py mine --reference ~/my-character.png

Writes characters/<name>/directions.png and reactions.png.

The directions sheet is made first. The expressions sheet is then made through the
EDITS endpoint with that sheet passed in as the reference image, so the model is
matching actual pixels rather than remembering a description. Getting the two sheets
to agree is the whole difficulty of this pipeline -- when they disagree the mascot
visibly jumps the moment it is clicked -- and handing over the first sheet is the
strongest lever available for that.
"""
import argparse
import base64
import os
import sys

# The newest image model on the account at the time of writing. Later ones hold a
# character's markings together far better across the two sheets, which is the thing
# this pipeline lives or dies on.
DEFAULT_MODEL = 'gpt-image-2.5-sunburst'

# Written to ask for appeal rather than to forbid it. An earlier version inherited
# "FLAT ... no gradients, no glossy 3D shading" from prompts tuned against a model that
# ignored the negatives and added richness anyway. Newer models obey them, and return
# exactly the two-tone, beady-eyed, textureless art that phrasing describes.
COLOUR = ('Cute storybook sticker art: clean bold black outlines with some weight variation, '
          'big expressive eyes each with a bright white catchlight, soft pink cheek blush, '
          'and warm saturated colours. Give it several tones per colour -- a lighter muzzle '
          'or belly, a darker shaded edge, coloured inner ears -- and a textured, tufted '
          'silhouette wherever the character has fur or hair, rather than a smooth blob. '
          'Charming and playful, full of small appealing details. Not flat, not plain, not '
          'minimal. No photorealism, no heavy 3D gloss, no airbrushed gradients.')

# Alternative renderings of the same character. Only the drawing style changes -- every
# structural rule below (bust framing, big head, one reused body, margins) is shared, so a
# style swap cannot break the alignment the whole pipeline depends on.
STYLES = {
    'colour': COLOUR,

    'ink': ('Black and white pen-and-ink drawing. Confident varied-weight black linework with '
            'fine cross-hatching and stippling for shading. NO colour anywhere and no flat grey '
            'fills -- every tone comes from the density of the hatching. Big expressive eyes '
            'with a white catchlight left as clean paper. Crisp, high contrast, plenty of open '
            'white. Charming and characterful, like a children\'s book illustration.'),

    'sketch': ('Loose graphite pencil sketch. Visible hand-drawn strokes with a slightly rough, '
               'searching quality, soft smudged shading, a few construction lines left showing. '
               'Warm grey graphite tones only, no flat colour and no hard vector edges. Big '
               'expressive eyes with a bright highlight left as clean paper. Warm and handmade. Keep '
               'the big-head chibi cartoon proportions and the soft cheek blush exactly as they '
               'would be in colour -- the same cute cartoon character, only drawn in pencil. Do '
               'NOT make it realistic or detailed.'),

    'riso': ('Two-colour risograph print. Flat spot inks in warm coral red and deep teal ONLY, '
             'plus the paper showing through. Visible paper grain, coarse halftone dot texture in '
             'the shaded areas, and a slight misregistration offset between the two ink layers. '
             'Bold simple shapes, no black outline -- forms are defined by the colour blocks.'),

    'paper': ('Cut-paper collage. The character built entirely from flat torn and cut paper '
              'shapes in layered matte colours, with visible paper fibre texture and a soft drop '
              'shadow where one piece overlaps another. No drawn outlines at all -- every edge is '
              'a cut or torn paper edge. Warm, tactile and handmade.'),

    'pixel': ('16-bit pixel art. Chunky visible square pixels on a strict grid, a small limited '
              'palette, hard-edged dithering for shading, a crisp one-pixel dark outline, and '
              'absolutely no anti-aliasing or soft edges anywhere. Readable and characterful at '
              'a small size, like a Super Nintendo sprite.'),
}

TAIL = ('No text, no labels, no borders, no drop shadows, no background colour. '
        'Square image, at least 1024x1024, PNG with alpha transparency.')

RULES = """LAYOUT: 3 columns by 3 rows, evenly spaced, fully transparent background. Each drawing is head plus upper shoulders, centred in its cell, same character and same head size in all nine cells.

FRAMING: a PORTRAIT BUST. Head, neck and shoulders only. NO arms, NO hands, NO legs, NO lower body. The shoulders are the lowest thing in the cell.

PROPORTIONS: a BIG HEAD chibi that still has a real body. The head is large and dominant, and the shoulders are roughly TWO THIRDS the width of the head -- narrower than the head, but clearly there. Do NOT draw a floating head.

THE RULE THAT MATTERS MOST: draw the BODY ONCE and reuse it. The neck, chest and shoulders must be the EXACT SAME SHAPE in the EXACT SAME POSITION in all nine cells, identical pixels if you can. The body always faces the viewer. Do NOT redraw the body in profile when the head turns. Only the head rotates, on top of an unchanging body.

MARGINS -- this is what goes wrong most often, so follow it literally: each character must sit ENTIRELY INSIDE its own cell with a wide empty gap on all four sides. Draw it at roughly 75% of the cell height, centred, leaving clear empty space above the head AND below the shoulders. The shoulders must STOP WELL SHORT of the bottom edge of the cell -- do not let the body run off the bottom or bleed into the cell underneath. Nothing may touch or cross a cell boundary. Shrink the character equally in every cell if that is what it takes."""

EXPRESSIONS = """1. Eyes closed as two upward curved arcs, gentle smile, plus ONE SMALL GOLDEN SUN in the chosen upper corner.
2. Same closed arc eyes, plus ONE SMALL RED HEART in the chosen upper corner.
3. Same closed arc eyes, plus THREE SMALL YELLOW SPARKLE STARS in the chosen upper corner.
4. Eyes wide open and very round, mouth open in a small round O of surprise, plus ONE ORANGE EXCLAMATION MARK in the chosen upper corner.
5. Starstruck: both eyes drawn as bright star shapes, big happy smile, plus ONE SMALL GOLDEN SHOOTING STAR with a short tail in the chosen upper corner. Star-shaped eyes alone do not count as the icon.
6. Eyes closed arcs, strong pink blush on both cheeks, plus ONE SMALL PINK FLOWER in the chosen upper corner.
7. Eyes closed sleeping curves, plus a small blue "z z z" in the chosen upper corner.
8. Both eyes drawn as spiral swirls, wavy wobbly mouth, plus ONE SMALL PURPLE SPIRAL in the chosen upper corner. Spiral eyes alone do not count as the icon.
9. Eyes closed arcs, mouth wide open in a big happy grin, plus ONE SMALL PARTY POPPER with a compact spray of confetti in the chosen upper corner."""


REACTION_ICONS = """ICONS: Every cell must include its assigned icon, drawn in the same art style and palette
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
instead of the icon colours named above, preserving each icon's distinctive shape."""
REACTION_TAIL = TAIL.replace('No text,', 'No text except the surprise exclamation mark and sleep "z z z" icons,')

def directions_prompt(describe, style):
    return f"""Generate a 3x3 grid sprite sheet of {describe}. {STYLES[style]}

This sheet is NINE HEAD DIRECTIONS, not expressions -- the face keeps the same calm
expression in every cell and only the direction the head is TURNED changes.

{RULES}

Turn the whole head clearly, do not just move the eyes: looking left swings the nose or
muzzle left and brings the far ear or cheek into view.
Row 1: up-left, up, up-right. Row 2: left, straight at the viewer, right.
Row 3: down-left, down, down-right.

NO hearts, NO sparkles, NO "zzz", NO spiral eyes -- no floating symbols of any kind.
{TAIL}"""


def reactions_prompt(describe, style):
    # The description is repeated here on purpose. Handing over the first sheet as a
    # reference image is not enough on its own -- the edits endpoint treats it as
    # inspiration and quietly redraws the character, dropping details like whiskers or a
    # belly patch. Restating the colours in words as well as pixels holds it together.
    same = f'The character is {describe}. ' if describe else ''
    look = f'Keep the {style} rendering style of the attached sheet exactly. ' if style != 'colour' else ''
    return f"""The attached image is a 3x3 head-direction sprite sheet. Produce the MATCHING
EXPRESSIONS sheet for that same character. {same}Copy the character from the attached image
exactly: the same colours, the same markings, the same fur or surface detail, the same line
weight. Every marking visible in the attached sheet must appear here too. Do not restyle,
simplify or redraw it.

NOT head directions. The character faces STRAIGHT AT THE VIEWER in all nine cells, head
perfectly straight. The only thing that changes between cells is the FACE, plus one small
floating icon or compact icon cluster in EVERY cell.

CRITICAL: same character, same art style, same palette, same line weight, same proportions,
and EXACTLY THE SAME SIZE AND POSITION IN THE CELL as the attached sheet. The chest and
shoulders must be the same drawing, the same width, and the same height off the bottom of
the cell as in the attached sheet, identical in all nine cells here. If the two sheets do
not line up the character visibly jumps, so match them.

Wide margin on all four sides, nothing touching a cell edge including the floating symbols,
and clear empty space below the shoulders.

The nine expressions, left to right, top to bottom:
{EXPRESSIONS}

{REACTION_ICONS}

{REACTION_TAIL}"""


def reference_prompt(describe, style):
    # A photograph pulls the model toward photorealism unless it is told, in as many words,
    # to throw the rendering away and keep only the identifying features. Without this the
    # result is a competent portrait illustration that looks nothing like the rest of the set.
    return f"""The attached image shows a person or character. Redraw them as a 3x3 grid sprite
sheet of NINE HEAD DIRECTIONS, in a completely different style from the attached image.

DO NOT reproduce the photograph: not its realism, not its lighting, not its proportions, not
its level of detail. Restyle it completely into a BIG HEAD CHIBI CARTOON -- a head roughly one
and a half times the width of the shoulders, very large round friendly eyes far bigger than a
real person's, a simplified nose and mouth, thick clean outlines and soft cheek blush. Think
children's sticker, not portrait.

Keep ONLY the things that identify them: hair shape and colour, facial hair, the shape and
colour of any glasses, skin tone, and the colour of their top{'. They are ' + describe if describe else ''}.
Simplify everything else away. {STYLES[style]}

The face keeps the same calm friendly expression in every cell; only the direction the head is
TURNED changes.

{RULES}

Turn the whole head clearly, do not just move the eyes.
Row 1: up-left, up, up-right. Row 2: left, straight at the viewer, right.
Row 3: down-left, down, down-right.

NO hearts, NO sparkles, NO "zzz", NO spiral eyes -- no floating symbols of any kind.
{TAIL}"""


def client():
    try:
        from openai import OpenAI
    except ImportError:
        sys.exit('openai SDK missing. Run: pip install openai')
    if not os.environ.get('OPENAI_API_KEY'):
        sys.exit('OPENAI_API_KEY is not set.')
    return OpenAI()


def save(result, path):
    with open(path, 'wb') as handle:
        handle.write(base64.b64decode(result.data[0].b64_json))
    return os.path.getsize(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('name')
    parser.add_argument('--describe', default='',
                        help='what the character looks like, e.g. "a chibi fox with orange fur"')
    parser.add_argument('--reference', help='an image of an existing character to redraw')
    parser.add_argument('--style', default='colour', choices=sorted(STYLES),
                        help='how the character is drawn; the shape and framing never change')
    parser.add_argument('--only', choices=['directions', 'reactions'],
                        help='regenerate just one sheet, leaving the other alone')
    args = parser.parse_args()

    if not args.describe and not args.reference:
        sys.exit('Give --describe, --reference, or both.')

    root = os.environ.get('MASCOT_ROOT', os.getcwd())
    folder = os.path.join(root, 'characters', args.name)
    os.makedirs(folder, exist_ok=True)
    directions = os.path.join(folder, 'directions.png')
    reactions = os.path.join(folder, 'reactions.png')

    api = client()
    # These models return base64 rather than a URL, and can key out the background
    # instead of painting one in. Override with MASCOT_IMAGE_MODEL.
    model = os.environ.get('MASCOT_IMAGE_MODEL', DEFAULT_MODEL)
    common = dict(model=model, size='1024x1024', background='transparent')

    if args.only != 'reactions':
        if args.reference:
            with open(os.path.expanduser(args.reference), 'rb') as handle:
                result = api.images.edit(image=[handle], prompt=reference_prompt(args.describe, args.style), **common)
        else:
            result = api.images.generate(prompt=directions_prompt(args.describe, args.style), **common)
        print(f'  directions.png  {save(result, directions) // 1024} KB')

    if args.only != 'directions':
        if not os.path.exists(directions):
            sys.exit(f'{directions} is missing; generate the directions sheet first.')
        with open(directions, 'rb') as handle:
            result = api.images.edit(image=[handle], prompt=reactions_prompt(args.describe, args.style), **common)
        print(f'  reactions.png   {save(result, reactions) // 1024} KB')


if __name__ == '__main__':
    main()
