"""Screen a source sheet before spending two minutes building it.

Shoulder-width consistency across the nine cells is the single best predictor of
whether a character will sit still. Under ~3% is good; the sheets that failed were
20-30%.
"""
import os
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

for path in sys.argv[1:]:
    im = Image.open(path)
    fmt, mode = im.format, im.mode
    a = np.array(im.convert('RGBA'))
    W = a.shape[0] // 3
    alpha_ok = fmt == 'PNG' and (a[..., 3] < 10).mean() > 0.05
    widths, edges, blobs = [], [], []
    for i in range(9):
        c, r = i % 3, i // 3
        op = a[r*W:(r+1)*W, c*W:(c+1)*W, 3] > 100
        if not op.any():
            edges.append(f'{i}:empty'); continue
        ys, xs = np.where(op)
        band = ys.max() - int(W * 0.05)
        sy, sx = np.where(op[band:, :])
        widths.append(sx.max() - sx.min())
        e = []
        if op[0:2, :].sum() > 15: e.append('top')
        if op[:, 0:2].sum() > 15: e.append('L')
        if op[:, -2:].sum() > 15: e.append('R')
        if e: edges.append(f'{i}:{"+".join(e)}')
        lbl, n = ndimage.label(op)
        blobs.append(n)
    spread = 100 * (max(widths) - min(widths)) / np.mean(widths)

    # Head-to-shoulder ratio. The head has to dominate or the cursor tracking stops
    # reading -- the head is the part that moves, so it must be the part you look at.
    # Measured on the good ones: cat 0.66, panda 0.93, dino 1.08. Anything past ~1.1
    # looks like a wide slab with a small head on top.
    op = a[W:2*W, W:2*W, 3] > 100
    ys, xs = np.where(op)
    top, bot = ys.min(), ys.max()
    hy, hx = np.where(op[top:top + int((bot - top) * 0.55), :])
    sy, sx = np.where(op[bot - int(W * 0.05):, :])
    ratio = (sx.max() - sx.min()) / (hx.max() - hx.min())

    # Spread only means something on the directions sheet: the floating hearts and
    # sparkles on an expressions sheet land in the shoulder band and inflate it.
    expressions = os.path.basename(path).startswith('reactions')
    verdict = ('n/a on an expressions sheet' if expressions
               else 'GOOD' if spread < 3 else ('marginal' if spread < 8 else 'REJECT'))
    shape = 'GOOD' if ratio < 0.95 else ('marginal' if ratio < 1.10 else 'TOO WIDE')
    print(f'{path.split("/")[-2] if "/" in path else path}  {fmt} {mode} {im.size}')
    print(f'   alpha: {"ok" if alpha_ok else "MISSING"}   shoulder spread {spread:.1f}% -> {verdict}')
    print(f'   shoulders/head {ratio:.2f} -> {shape}  (target under 0.95; cat 0.66, panda 0.93)')
    print(f'   mean shoulder width {int(np.mean(widths))}px   blobs per cell {blobs}')
    print(f'   edge contact: {edges or "none"}')
