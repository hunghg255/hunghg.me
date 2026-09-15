# Bundled characters

All ready-to-use artwork lives in `assets/`, relative to the skill folder. Copy both
files for a character into the target project's static assets directory.

| Character | Directions atlas | Reactions atlas | Style |
| --- | --- | --- | --- |
| fox | `assets/fox-directions.webp` | `assets/fox-reactions.webp` | Colour storybook sticker |

These are finished 3×3 WebP atlases with transparency, ready for the bundled
`assets/cursor-buddy.tsx` component. They need no downloading, generation, or rebuilding.

## Adding characters to the package

Use a matching pair named:

```text
assets/<name>-directions.webp
assets/<name>-reactions.webp
```

Build and verify new artwork using the workflow in `SKILL.md` before adding the final
atlases here. Update this inventory when a complete pair is bundled. List only files
actually included in the package; style variants count as separate pairs.

If a requested character is absent, follow *Draw a new one* in `SKILL.md`. For the user's
own likeness, use their photo with the REFERENCE prompt in `reference/prompts.md`.
The style prompts describe generation options, not additional bundled artwork.
