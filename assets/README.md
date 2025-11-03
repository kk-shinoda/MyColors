# Assets Directory

This directory contains assets for the MyColor extension:

- `color-palette.svg` - SVG version of the color palette icon
- `color-palette.png` - **TODO**: PNG version needed for Raycast (512x512 pixels recommended)

## Icon Requirements

Raycast extensions require PNG format icons. The SVG file exists but needs to be converted to PNG format and referenced in package.json:

```json
"icon": "color-palette.png"
```

The icon should be 512x512 pixels for best quality across all Raycast interface sizes.