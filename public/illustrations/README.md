# Illustrations

Raw SVG assets extracted verbatim from the Local Lookout standalone HTML prototype
(`/Magazine/Above the Hook Design System_files/The Local Lookout - Standalone.html`).

Four of these (05, 07, 08, and to a lesser extent 10) are the 400x300 editorial card
thumbnails that appear in the "Seven stories, one free." grid on the magazine homepage.
The rest are either UI icons or card art for other article IDs (including winter covers
that are used by the Winter 2026 issue's TOC, not the Spring 2026 homepage).

| File | viewBox | Depicts (single-sentence guess) |
|---|---|---|
| `01-lock-icon.svg` | 0 0 16 16 | Solid padlock icon used on subscriber/locked chips. |
| `02-arrow-right.svg` | 0 0 20 20 | Thin right-pointing arrow used next to CTA button labels. |
| `03-check-icon.svg` | 0 0 20 20 | Check mark used in subscriber-tier feature lists. |
| `04-dash-icon.svg` | 0 0 20 20 | Horizontal dash used for "not included" rows in tier tables. |
| `05-juet-hills.svg` | 0 0 400 300 | Dusk sky with sun over silhouetted Highlands hills and dark water below — card art for the Juet / "A Very Good Land to Fall With" feature. |
| `06-hartshorne-map.svg` | 0 0 400 300 | Antique parchment sketch labelling Sandy Hook and Hartshorne with a compass rose — card art for "Thirteen Shillings" (kind: `hartshorne`; not wired into the home grid in the prototype). |
| `07-building-600-house.svg` | 0 0 400 300 | Cream clapboard house with dark roof sitting on a green lawn — card art for the Building 600 / "The House That Stayed" feature. |
| `08-humpback-stranding.svg` | 0 0 400 300 | Dark whale silhouette on a beige beach with quiet surf lines — card art for "Strandings." |
| `09-bahrs-landing.svg` | 0 0 400 300 | Lit-window restaurant building facade at night — card art for "Four Generations at Bahrs." |
| `10-goat-hill.svg` | 0 0 400 300 | Warm orange sky over a silhouetted ridge dotted with houses, harbor below — card art for the "Goat Hill" quarterly essay. |
| `11-winter-lighthouse.svg` | 0 0 400 300 | Tall white lighthouse against a pale winter sky — card art for the Sandy Hook Lighthouse story in the Winter issue. |
| `12-winter-weapons-bunkers.svg` | 0 0 400 300 | Three concrete Fort Hancock bunkers on a cold green plain — card art for the Winter weapons/Nike-missile story. |
| `13-winter-ice-floes.svg` | 0 0 400 300 | Blue-gray harbor scattered with white ice floes — card art for the Winter ice / "Weathered Year" piece. |
| `14-winter-diner.svg` | 0 0 400 300 | Night scene of a lit diner with warm windows and a rust awning stripe — card art for the Winter diner story. |
| `15-winter-route-36.svg` | 0 0 400 300 | Gray sky over a descending Route 36 roadway with dashed yellow centerline — card art for the Winter Route 36 / Highlands approach story. |

All paths, fills, gradients, and coordinates are copied unmodified from the prototype.
Two adjustments were made to convert React/JSX source into standalone SVG:

- JSX attribute names (`strokeWidth`, `stopColor`, `strokeDasharray`, `fontStyle`, `fontSize`, `fontFamily`) rewritten to their kebab-case SVG equivalents (`stroke-width`, `stop-color`, etc.).
- Added `xmlns="http://www.w3.org/2000/svg"` so the files are valid standalone SVG documents.
