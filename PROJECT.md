# Project: Tailwind v4 Migration & Codebase Cleanup

## Architecture
- Framework: Svelte 5 / SvelteKit 2 in `/home/nbkhang/Dev/Active/EmberRoot/app`
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`)
- Build tool: Vite (`vite.config.ts`)

## Code Layout
- `app/src/routes/layout.css`: Global Tailwind CSS v4 `@theme` configuration and base styles.
- `app/src/lib/components/`: Reorganized into 6 domain directories:
  - `layout/`: Shell components (`PageShell`, `Sidebar`, `TopNav`, `ActualDataPage`).
  - `ui/`: Design system primitives (`Button`, `Card`, `Panel`, `Badge`, `Dropdown`, `SideDrawer`, `MiniHeatmapCard`, `ProgressBar`, `SearchBar`, etc.).
  - `feedback/`: Status indicators & loading states (`LoadingState`, `StatusPill`).
  - `charts/`: Data visualization charts & tooltips (`BarChart`, `DonutChart`, `LineAreaChart`, `SparklineChart`, `HeatmapGrid`, `ChartTooltip`).
  - `dashboard/`: Domain aggregate widgets (`ActiveAlertsWidget`, `ForestHealthWidget`, `NodeHealthPanel`, `WeatherWidget`, etc.).
  - `map/`: Spatial map components (`MapView`, `SensorMarker`, `LayerControl`, `MapLegend`, `SearchPanel`, `TelemetryDrawer`, `FilterBar`).
- `app/src/lib/stores/`: Application state stores (`operations.svelte.ts`).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Diagnostic Audit | Detailed audit of CSS, styles, components, and svelte-check warnings | none | DONE |
| 2 | Global Theme & Tailwind v4 Config | Convert `layout.css` to `@theme` configuration with full design tokens | M1 | DONE |
| 3 | Component Reorganization & Import Updates | Move components to 6 subdirectories, rename collision, update imports | M1 | DONE |
| 4 | Svelte Inline CSS Removal & Tailwind Migration | Remove `<style>` blocks from 51 Svelte files & replace with Tailwind v4 classes | M2, M3 | IN_PROGRESS |
| 5 | Svelte-Check & A11y Linting Fixes | Resolve TS error & 23 warnings in `pnpm run check` and `pnpm run lint` | M4 | PLANNED |
| 6 | E2E Build & Forensic Audit | Production `pnpm run build`, forensic audit, final verification | M5 | PLANNED |

## Interface Contracts
- Standard Svelte component imports from `$lib/components/<domain>/<Component>.svelte` or `$lib/index.ts`.
- Tailwind v4 custom colors and fonts defined in `@theme` in `app/src/routes/layout.css`.
