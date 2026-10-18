# NATA Agent Avatars

Illustrated circular badges for the 8 NATA agents.

## Agents & Files
- **chief** (`Chief of Staff`): `chief.webp`, `chief.png`, `chief.jpg`
- **strategy** (`Consultant / Strategic Advisor`): `strategy.webp`, `strategy.png`, `strategy.jpg`
- **finance** (`Finance & Tax Specialist`): `finance.webp`, `finance.png`, `finance.jpg`
- **marketing** (`Marketing & Sales`): `marketing.webp`, `marketing.png`, `marketing.jpg`
- **customers** (`CRM / Customer Experience`): `customers.webp`, `customers.png`, `customers.jpg`
- **people** (`People & Payroll`): `people.webp`, `people.png`, `people.jpg`
- **ops** (`Ops & Inventory`): `ops.webp`, `ops.png`, `ops.jpg`
- **radar** (`Market Radar`): `radar.webp`, `radar.png`, `radar.jpg`

## Format & Specs
- **WebP**: 512x512 with transparent circular mask (~50-80 KB each). Primary web format for ultra-fast loading.
- **PNG**: 512x512 with transparent circular mask (~350-450 KB each). Fallback for environments without WebP.
- **JPG**: 512x512 cropped circular badge (~50-95 KB each).
- **Fallback**: The `Monogram` component in `src/components/ui.tsx` falls back to the agent's theme color and monogram letters (`a.mono`) if images fail to load.

## Regeneration
Generated via `python scripts/generate-avatars.py [source_dir]`.
Defaults to `assets/avatars/raw/` in the repository, with fallback to `Downloads/NATA avatar`.
The raw original 2048x2048 artwork is archived in `assets/avatars/raw/`.
