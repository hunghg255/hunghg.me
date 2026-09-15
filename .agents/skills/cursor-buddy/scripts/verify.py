"""How far the body actually moves when a boop swaps atlases.

Landmark metrics kept breaking here. "Widest row of the lower body" flips between two
rows of equal width on any character with straight sides, and reported 30px of movement
on mascots that do not move at all. Centre of mass moves when the mouth opens.

So this estimates the shift the way you would estimate any shift: slide the reaction
frame's body band against the directions centre frame and find the offset that lines
them up best. Reported in pixels at the size the mascot is rendered.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.environ.get('MASCOT_ROOT', os.getcwd())
DEST = os.environ.get('MASCOT_DEST', os.path.join(ROOT, 'public', 'mascots'))
DISPLAY = 140.0
SEARCH = 24


def cells(path):
    im = Image.open(path).convert('RGBA')
    t = im.size[0] // 3
    return t, [np.array(im.crop(((i % 3) * t, (i // 3) * t, (i % 3 + 1) * t, (i // 3 + 1) * t)))
               for i in range(9)]


def body(cell):
    opaque = cell[..., 3] > 120
    labels, count = ndimage.label(opaque)
    if count == 0:
        return opaque
    return labels == int(np.argmax(ndimage.sum(opaque, labels, range(1, count + 1)))) + 1


BAND_TOP, BAND_BOTTOM = 0.55, 0.78


def lower_band(mask):
    """Chest and shoulders, taken at FIXED rows of the tile.

    Defining the band relative to each frame's own extent looks more careful and is
    actually circular here: the bottom fade ends at a slightly different height in every
    frame, so a frame-relative band starts in a different place and the correlation
    reports that as movement. Every frame shares one tile geometry, so the same absolute
    rows are directly comparable -- and these rows sit above where the fade begins.
    """
    band = np.zeros_like(mask)
    top = int(mask.shape[0] * BAND_TOP)
    bottom = int(mask.shape[0] * BAND_BOTTOM)
    band[top:bottom] = mask[top:bottom]
    return band


def best_shift(ref, other):
    scores = []
    for dy in range(-SEARCH, SEARCH + 1):
        shifted = np.roll(other, dy, axis=0)
        if dy > 0:
            shifted[:dy] = False
        elif dy < 0:
            shifted[dy:] = False
        union = (shifted | ref).sum()
        scores.append(((shifted & ref).sum() / max(union, 1), dy))
    return max(scores)


def palette(cells_list):
    """Normalised colour histogram of the character across a sheet.

    Position is not the only way the two sheets can disagree. The expressions sheet
    sometimes comes back as a recognisably different drawing -- same pose and size, but
    the whiskers dropped or the belly patch gone -- and the mascot then changes
    appearance on click without moving at all. Shift alone scores that as perfect.
    """
    counts = np.zeros(4096, dtype=np.float64)
    for cell in cells_list:
        mask = body(cell) & (cell[..., 3] > 200)
        if not mask.any():
            continue
        rgb = (cell[mask][:, :3] // 16).astype(np.int32)
        counts += np.bincount(rgb[:, 0] * 256 + rgb[:, 1] * 16 + rgb[:, 2],
                              minlength=4096).astype(np.float64)
    total = counts.sum()
    return counts / total if total else counts


def shoulder_width(cells_list):
    """Mean width of the character at its shoulders, in pixels.

    The third way the two sheets can disagree, after position and colour: the body is
    drawn at a different size. A uniform scale difference leaves the body centred where it
    was, so the shift measurement reads a clean zero while the shoulders visibly shrink or
    swell on click. Measured at the bottom of the character rather than a fixed row of the
    tile, so hair hanging past the jaw is not mistaken for shoulder.
    """
    widths = []
    for cell in cells_list:
        mask = body(cell)
        rows = np.where(mask.any(axis=1))[0]
        if not len(rows):
            continue
        band = mask[rows.min() + int((rows.max() - rows.min()) * 0.85):rows.max() + 1]
        if band.any():
            widths.append(band.sum(axis=1).max())
    return float(np.mean(widths)) if widths else 0.0


print(f'{"character":11} {"shift":>8} {"overlap":>9} {"palette":>9} {"width":>8}'
      f'   (at {DISPLAY:.0f}px rendered)')
rows = []
for name in sys.argv[1:]:
    tile, directions = cells(os.path.join(DEST, f'{name}-directions.webp'))
    _, reactions = cells(os.path.join(DEST, f'{name}-reactions.webp'))
    scale = DISPLAY / tile
    ref = lower_band(body(directions[4]))
    results = [best_shift(ref, lower_band(body(c))) for c in reactions]
    shift = max(abs(dy) for _, dy in results) * scale
    overlap = min(score for score, _ in results)
    # Histogram intersection: 1.0 means the two sheets use the same colours in the
    # same proportions, which is what "the same character twice" looks like.
    match = float(np.minimum(palette(directions), palette(reactions)).sum())
    dw, rw = shoulder_width(directions), shoulder_width(reactions)
    width = abs(rw - dw) / dw if dw else 9.0
    rows.append((shift, match, width, name))
    print(f'{name:11} {shift:5.2f} px {overlap*100:8.1f}% {match*100:8.1f}% {width*100:7.1f}%')

print(f'\nworst shift: {max(rows)[3]} moves {max(rows)[0]:.2f} rendered px on boop')
weakest = min(rows, key=lambda r: r[1])
print(f'weakest palette match: {weakest[3]} at {weakest[1]*100:.1f}%')
widest = max(rows, key=lambda r: r[2])
print(f'worst width change: {widest[3]} at {widest[2]*100:.1f}%')
