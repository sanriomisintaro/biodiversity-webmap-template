# Simple Biodiversity Web Map — Blank Template

This folder is a **starter kit** for publishing a simple species-occurrence web map.  
It’s a static site: open `index.html` and the app reads four plain-text files in `/data/` to build the map (no server, no database).

## Folder structure
```
index.html
assets/
css/styles.css
js/app.js
data/
data_species.txt
data_mappoints.txt
data_language.txt
data_setting.txt
images/
(put species photos/icons here; referenced from data_species.txt)
```
> Tip: Keep image files small (≤200–400 KB each) for fast loading. Use relative paths like `images/bird.jpg`. or anyfolder/url that you want.

---

## Quick start

1. **Add species rows** to `data/data_species.txt`.  
2. **Add observation rows** to `data/data_mappoints.txt`.  
3. **(Optional) Translate labels** in `data/data_language.txt`.  
4. **Adjust defaults** (zoom, theme, basemap) in `data/data_setting.txt`.  
5. Open `index.html` locally (double-click) or publish with GitHub Pages.

If you prepare data in a spreadsheet, use the helper tools in `/tools/` (e.g., **xlsx-to-txt** or **csv-to-txt**) to export the exact text format this app expects.

---

## The four data files (formats & examples)

### 1) `data_species.txt` — species list

**Columns (pipe-separated):**
```
name | color | image
```
- **name** — scientific/common name shown in the legend (e.g., `Cucak Kutilang (Pycnonotus aurigaster)`).
- **color** — HEX color for that species’ points (e.g., `#377eb8`).
- **image** — relative path to a photo/icon in `/images/` (e.g., `images/PerkututJawa.jpg`).

**Example rows:**
```
Cucak Kutilang (Pycnonotus aurigaster) | #e41a1c | images/CucakKutilang.jpg
Perkutut Jawa (Geopelia striata) | #377eb8 | images/PerkututJawa.jpg
```
> The app only displays species that actually appear in `data_mappoints.txt` (empty species won’t show).

---

### 2) `data_mappoints.txt` — occurrence records

**Columns (pipe-separated, one record per line):**
```
date | time | species | count | district | coord | habitat | location | activity
```
**Field notes:**
- **date** — e.g., `2025-08-21` or local format (keep one format consistently).
- **time** — `HH:MM` (24h) or local format.
- **species** — must **match** the `name` used in `data_species.txt`.
- **count** — integer (e.g., `1`).
- **district** — any admin/area label you use.
- **coord** — coordinate string. Recommended:
  - **Decimal degrees**: `-1.481, 124.846` _or_
  - **DMS/DM** as in the template: `N 01°28.717' E 124°53.518'`
- **habitat** — e.g., `Semak`, `Mangrove`.
- **location** — perch/spot description.
- **activity** — e.g., `Terbang`, `Foraging`.

> If you use the spreadsheet helper, it will export the right separators and coordinate text automatically.

---

### 3) `data_language.txt` — UI text (multilingual)

This file has **language blocks** and **key=value** pairs. Default blocks:
```
[id]
appTitle=Informasi Sebaran Burung di Kota Manado
...
[en]
appTitle=Birds Distribution Information in Manado
...
```
- Use **`[id]`** for Bahasa Indonesia and **`[en]`** for English.
- Keys use dot notation for grouping (e.g., `details.date`, `scale.local`).
- Add/modify keys freely; unknown keys are ignored.

**Common keys you might edit:**
- `appTitle`, `legendTitle`, `gmapsButton`
- `mapDefault`, `mapSatellite`, `mapTerrain`
- `details.date`, `details.time`, `details.count`, `details.coord`  
(See the file for the complete list of keys.)

---

### 4) `data_setting.txt` — map & UI defaults

**Keys (one per line):**
```
scale = 12 # initial zoom (12≈city, 15≈neighborhood)
theme = light # "light" or "dark"
language = local # "local" (id) or "translate" (en)
mapType = default # "default" | "satellite" | "terrain"
showImages = true # true/false | yes/no | 1/0
showRoad = 1 # 0=show road labels, 1=hide labels
```
Guidance:
- **scale**: higher number = closer in (try 12–15).
- **language**: `local` uses `[id]`; `translate` uses `[en]`.
- **showRoad**: `0` shows labels/roads overlay; `1` hides it.

---

## Publishing

- **Local:** double-click `index.html` (some browsers block local file access; if so, use a simple local server).
- **GitHub Pages:** push this folder to a repo → *Settings → Pages* → **Deploy from branch** → pick your default branch and **root** (`/`). Your site will be live at `<username>.github.io/<repo>/`.

---

## Troubleshooting

- **Blank map / no points** → check that `data_mappoints.txt` has at least one row and the **species names match** `data_species.txt`.  
- **Colors not applied** → verify HEX codes (e.g., `#4daf4a`).  
- **Images not showing** → confirm the path (e.g., `images/Jalak.jpg`) and file name spelling.  
- **Settings not applied** → ensure `key = value` formatting with no extra characters.

---

## Credits & license

You may reuse this tool. If you distribute it, keep attribution and this README.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f)](https://sanriomisintaro.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)