# TruckLoad — Truck Load Weight Estimator

A mobile-friendly web app that estimates the weight of earth materials loaded in dump trucks using manual measurements and material density data.

## Live App

🔗 [joshitmohanty.com/truckload-app](https://joshitmohanty.com/truckload-app/)

## How It Works

1. **Select Truck** — Pick from 14 preset profiles (common VA Beach/Hampton Roads trucks) or enter custom dimensions from iPhone's Measure app (LiDAR)
2. **Select Material** — 23 earth materials with real-world bulk densities (stone, soil, sand, mulch, gravel, recycled)
3. **Set Moisture** — Dry / Damp / Wet adjustment factors
4. **Estimate Fill Level** — Drag a fill line on a photo of the loaded truck, or use the manual slider. Select heap profile (flat, crowned, heaped, max)
5. **Get Result** — Estimated weight in tons with ±15% confidence range, full calculation breakdown, and unit conversions

## Features

- **Trapezoid bed geometry** — Accounts for angled dump truck walls (top wider than bottom)
- **Photo fill-line tool** — Snap a photo, drag a line to the material surface for intuitive fill estimation
- **Learning system** — Saves estimates in localStorage; after 3+ estimates with the same truck+material combo, suggests fill level and heap profile
- **Mobile-first design** — Built for field use on smartphones

## Formula

```
Effective Volume = Bed Volume × Fill% × Heap Factor
Adjusted Density = Base Density × Moisture Factor
Estimated Weight = Effective Volume × Adjusted Density
```

Bed volume uses trapezoidal prism formula: `L × ((TopWidth + BottomWidth) / 2) × Depth`

## Tech Stack

React + TypeScript + Vite, deployed via GitHub Pages with GitHub Actions.

## Accuracy

±10–15% with correct material selection and fill estimation. Not for legal billing or certified weighing — use a certified scale for official weights.

## License

MIT
