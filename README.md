# Simple Biodiversity Web Map

Turn field notes into an online, interactive **species-occurrence map** in minutes.  
Everything runs on a free static site (GitHub Pages) — **no server, no database**.

[![GitHub Pages](https://img.shields.io/badge/Use%20it%20online-live-2ea44f)](https://sanriomisintaro.github.io/biodiversity-webmap-template/app/)
[![Docs](https://img.shields.io/badge/Docs-How%20to%20use-informational)](https://sanriomisintaro.github.io/biodiversity-webmap-template/docs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

## Quick access
- **Live map app:** https://sanriomisintaro.github.io/biodiversity-webmap-template/app/
- **Docs / How-to:** https://sanriomisintaro.github.io/biodiversity-webmap-template/docs/
- **Get the blank template:** [`template/`](template/)  
- **Converters (online):**
  - CSV to TXT: https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/csv-to-txt/
  - XLSX to TXT: https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/xlsx-to-txt/

---
## What is this?
A **low-infrastructure** method for small biodiversity teams (labs, NGOs, classes) to publish species observations as an interactive web map. The app reads **four plain-text files** at load time:

- `data_species.txt` – species list and legend info  
- `data_mappoints.txt` – occurrence records (one record per line)  
- `data_language.txt` – UI labels (e.g., Indonesian + English)  
- `data_setting.txt` – map defaults (zoom, theme, basemap, etc.)

You can edit these files with any text editor or export them from spreadsheets via the built-in converters.

---
## Features
- Interactive map with base-layer switcher (default / satellite / terrain)
- Per-species toggles, **count-aware** legend, optional photo markers
- Mixed coordinate strings supported (decimal, DMS/DM like `N 01°28.717'`)
- 🇮🇩/🇬🇧 Bilingual UI (e.g., `[id]` and `[en]` blocks in `data_language.txt`)
- Fully static: works on GitHub Pages; versionable & citable

---
## Repository structure
```
app/
index.html
assets/
css/styles.css
js/app.js
data/
data_species.txt
data_mappoints.txt
data_language.txt
data_setting.txt
images/ # species photos/icons referenced from data_species.txt
docs/ # how-to guide (served on Pages)
template/ # blank starter you can copy
tools/
csv-to-txt/ # CSV converter (browser-based)
xlsx-to-txt/ # XLSX converter (browser-based)
```

---
## File formats (quick reference)

### `app/data/data_species.txt`
```
name | color | image
```
- `name`: scientific or common name shown in legend  
- `color`: HEX color (e.g., `#377eb8`)  
- `image`: relative path in `app/images/` (optional)  

**Example**
```
Perkutut Jawa (Geopelia striata) | #377eb8 | images/PerkututJawa.jpg
```

### `app/data/data_mappoints.txt`
```
date | time | species | count | district | coord | habitat | location | activity
```
- `date`: `YYYY-MM-DD` (recommended) or common local formats  
- `time`: `HH:MM` (24h) or `H:MM AM/PM`  
- `species`: **must match** a `name` in `data_species.txt`  
- `coord`: `-1.481, 124.846` **or** `N 01°28.717' E 124°53.518'`  
- Pipes `|` inside text are auto-replaced with `/` by the converters

**Example**
```
2025-08-21 | 06:15 | Perkutut Jawa (Geopelia striata) | 2 | Sario | -1.481, 124.846 | Pekarangan | Pohon ketapang depan rumah | Menyanyi
```

### `app/data/data_language.txt`
INI-style language blocks + `key=value` lines:
```
[id]
appTitle=Informasi Sebaran Burung di Kota Manado
legendTitle=Spesies
details.date=Tanggal
...
[en]
appTitle=Birds Distribution Information in Manado
legendTitle=Species
details.date=Date
...
```

### `app/data/data_setting.txt`
```
scale = 12 # initial zoom (city ~12, neighborhood ~15)
theme = light # light | dark
language = local # local=id, translate=en
mapType = default # default | satellite | terrain
showImages = true # true/false | 1/0
showRoad = 1 # 0=show labels/roads, 1=hide labels
```

> Full details and screenshots: see **Docs**.

---
## How to use

### Option A — Start from the **blank template**
1. Download/copy files from [`template/`](template/).  
2. Fill the four `data_*.txt` files with your species and points.  
3. Open `app/index.html` locally (or publish on Pages).

### Option B — Convert your spreadsheet first
- Use **CSV > TXT** or **XLSX > TXT** online:
  - CSV: https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/csv-to-txt/
  - XLSX: https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/xlsx-to-txt/
- Move the downloaded `data_mappoints.txt` into `app/data/`.

### Publish on GitHub Pages
1. Push this repo to GitHub.  
2. **Settings > Pages** > *Deploy from a branch* > **Branch:** `main`, **Folder:** `/ (root)`  
3. Your site will be at:  
   `https://sanriomisintaro.github.io/biodiversity-webmap-template/`

---
## When to use (and when not)
- DO:
  - Teaching, outreach, class projects, small NGO/lab datasets (hundreds > few thousands of points)
    
- DONT:
  - If you need multi-user data entry, user accounts, advanced queries, or millions of points > consider a server-backed platform; this app can be a **stepping-stone**.

---

## Cite / credit
If you use this template in a publication or report, please cite the repository and (if available) the archived release DOI.
(not ready yet to cite)

---
## License
- **Code:** MIT (permissive; see [LICENSE](LICENSE))  
- **Your data/images:** choose an appropriate license (e.g., CC BY 4.0).  
- Please keep required **basemap attributions** visible in the map UI.

---
## Sensitive species
If needed, generalize or mask coordinates **before** publishing (e.g., round to 0.01° or remove precise sites).
**Please** never publish the exact locations of sensitive taxa. We mean it, especially for endangered and protected taxa.

---
## Troubleshooting
- Problem: **No points on map**, do: `species` values in `data_mappoints.txt` must match `name` in `data_species.txt`.  
- Problem: **Broken images**, do: check the path (e.g., `images/Jalak.jpg`) and filename case.  
- Problem: **Settings ignored**, do: ensure `key = value` formatting (no extra characters).  
- Problem: **Local file won’t load** do: some browsers block local fetches. If you have python, serve locally:
  ```
  # in the repo root
  python -m http.server 8000
  # then open http://localhost:8000/app/
  ```
  - if you dont have python, use any local web server.

---
## Acknowledgements
Built with lightweight web tech (vanilla HTML/CSS/JS).
Map tiles from OpenStreetMap / imagery providers as configured in the app.

---
