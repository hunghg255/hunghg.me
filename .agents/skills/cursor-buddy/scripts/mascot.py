"""Take a character from a description to a verified mascot.

    python mascot.py fox --describe "a cute chibi fox with warm orange fur"
    python mascot.py mine --reference ~/my-character.png
    python mascot.py fox --skip-generate        # rebuild from sheets already on disk

Runs generate -> screen -> build -> verify and retries the sheet that failed. It stops
at two built atlases: installing the component and putting it on a page is the agent's
job, because only the agent can see where this project keeps static files and which
component its header lives in.

There is no name registry. The component takes the two sheets as paths, so a character
is its two files and nothing else has to know its name.

The retry loop is the point. An image model returns an unusable sheet often enough that
a tool which generates once and hands back whatever arrived will produce jumpy mascots
for anyone who is not checking the numbers themselves. Both failure modes it catches are
ones you cannot see in a thumbnail: a directions sheet whose body is redrawn per cell,
and a pair of sheets drawn at different scales.
"""
import argparse
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('MASCOT_ROOT', os.getcwd())

# Above this much movement when the atlases swap, a click visibly shifts the mascot.
# The shipped set measures at or under ~1px; 2px is the point where it starts to read.
BOOP_LIMIT = 2.0

# How closely the two sheets must agree on colour; below this they read as different
# drawings, changing appearance on click without moving. A genuine mismatch measured 12%;
# most characters land 45-86%, but robots with a large flat face plate can go as low as
# 27% because that plate's visible area swings with the drawn expression. The gap between
# "legitimately low" and "broken" is narrow -- treat a near-miss as a reason to look, not
# proof of a fault.
PALETTE_LIMIT = 0.22

# How much the shoulders may change width between the sheets. A uniform scale difference
# leaves the body centred -- no shift -- while visibly swelling or shrinking it on click.
# Most of the set lands under 8%; the two visibly-wrong cases measured 34% and 16%, both
# characters whose hair covered the shoulders, leaving nothing reliable to match on. Expect
# an occasional false positive around 15% from something protruding at shoulder height,
# like a winding key.
WIDTH_LIMIT = 0.12


def run(script, *args):
    result = subprocess.run([sys.executable, os.path.join(HERE, script), *args],
                            capture_output=True, text=True, env={**os.environ, 'MASCOT_ROOT': ROOT})
    if result.returncode != 0:
        print(result.stdout + result.stderr)
        sys.exit(f'{script} failed for this character.')
    return result.stdout


def screen(name, sheet='directions'):
    """True when the sheet is worth building."""
    out = run('screen.py', os.path.join(ROOT, 'characters', name, f'{sheet}.png'))
    print(out.rstrip())
    if 'alpha: MISSING' in out:
        # Unrecoverable: a flattened background cannot be keyed out afterwards, because
        # the character's own outlines are the same black as the background would be.
        print(f'  -> {sheet} sheet has no transparency')
        return False
    spread = re.search(r'shoulder spread ([\d.]+)%', out)
    if sheet != 'directions':
        return True
    # A high spread means the body is a different width in every cell, which no
    # alignment can rescue -- the sheet has nothing stable to pin.
    return bool(spread) and float(spread.group(1)) < 8.0


def measure(name):
    """(movement in rendered px, how closely the two sheets' palettes agree)."""
    out = run('verify.py', name)
    print(out.rstrip())
    moved = re.search(r'moves ([\d.]+) rendered px', out)
    match = re.search(r'weakest palette match: \S+ at ([\d.]+)%', out)
    width = re.search(r'worst width change: \S+ at ([\d.]+)%', out)
    return (float(moved.group(1)) if moved else 99.0,
            float(match.group(1)) / 100 if match else 0.0,
            float(width.group(1)) / 100 if width else 9.0)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('name')
    parser.add_argument('--describe', default='')
    parser.add_argument('--reference')
    parser.add_argument('--style', default='colour',
                        choices=['colour', 'ink', 'sketch', 'riso', 'paper', 'pixel'],
                        help='how the character is drawn; the framing never changes')
    parser.add_argument('--only', choices=['directions', 'reactions'],
                        help='regenerate just this sheet on the first pass, keeping the other')
    parser.add_argument('--skip-generate', action='store_true',
                        help='use the sheets already in characters/<name>')
    parser.add_argument('--dest', default=os.environ.get('MASCOT_DEST', os.path.join(ROOT, 'public', 'mascots')),
                        help='where the built atlases go (default public/mascots)')
    parser.add_argument('--retries', type=int, default=2)
    args = parser.parse_args()
    os.environ['MASCOT_DEST'] = args.dest

    base = ['generate.py', args.name, '--style', args.style]
    if args.describe:
        base += ['--describe', args.describe]
    if args.reference:
        base += ['--reference', args.reference]
    only = args.only  # which sheet to (re)draw next; None means both

    for attempt in range(args.retries + 1):
        if not args.skip_generate:
            print(f'generating {args.name}' + (f' (attempt {attempt + 1})' if attempt else ''))
            print(run(*base, *(['--only', only] if only else [])).rstrip())

        if not screen(args.name, 'reactions'):
            sys.exit(f'{args.name}: redraw the EXPRESSIONS sheet as a PNG with a real alpha '
                     f'channel, then run again with --skip-generate.')

        if not screen(args.name):
            if args.skip_generate or attempt == args.retries:
                sys.exit(f'{args.name}: the directions sheet is unusable -- either it has no '
                         f'transparency, or its body is a different shape in every cell. '
                         f'Redraw it, or pick a character whose hair and ears do not hang '
                         f'over the shoulders.')
            # The expressions sheet is drawn from the directions sheet, so a new
            # directions sheet needs a new expressions sheet to match it.
            print('  -> body is not consistent across the cells, redrawing both sheets')
            only = None
            continue

        print(f'building {args.name}')
        print(run('build.py', args.name, '--anchor', 'shoulders').rstrip())

        moved, match, width = measure(args.name)
        if moved <= BOOP_LIMIT and match >= PALETTE_LIMIT and width <= WIDTH_LIMIT:
            print(f'\n{args.name} is ready:')
            print(f'  {os.path.join(args.dest, args.name)}-directions.webp')
            print(f'  {os.path.join(args.dest, args.name)}-reactions.webp')
            return

        if moved > BOOP_LIMIT:
            problem = (f'the two sheets disagree by {moved:.2f}px, so it would visibly jump '
                       f'when clicked')
        elif width > WIDTH_LIMIT:
            problem = (f'the body is {width * 100:.0f}% a different width between the sheets, '
                       f'so it would swell or shrink when clicked')
        else:
            problem = (f'the expressions sheet is a recognisably different drawing '
                       f'({match * 100:.0f}% palette match), so it would change appearance '
                       f'when clicked')

        if args.skip_generate or attempt == args.retries:
            sys.exit(f'{args.name}: {problem}. The expressions sheet is the one at fault: '
                     f'redraw it (through the API, rerun with --only reactions), or give the '
                     f'character hair that does not cover the shoulders -- with the shoulders '
                     f'hidden there is nothing reliable for the two sheets to be matched on.')
        print(f'  -> {problem}, regenerating the expressions sheet')
        only = 'reactions'


if __name__ == '__main__':
    main()
