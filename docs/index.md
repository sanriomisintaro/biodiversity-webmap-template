# Simple Biodiversity Web Map — Docs

Publish species-occurrence maps from plain text files — no server, no database.

**Use it online**
- App: https://sanriomisintaro.github.io/biodiversity-webmap-template/app/
- Tools:
  - CSV to TXT: https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/csv-to-txt/
  - XLSX to TXT: https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/xlsx-to-txt/

**Repo**
- Root README: [../](../)
- Blank template: [../template/](../template/)

---
## Quick start

**Option A — Start blank (fastest)**
1. Download/copy files from **[../template/](../template/)**.
2. Edit the four data files in `app/data/` (see specs below).
3. Open **`app/index.html`** locally or publish on GitHub Pages.

**Option B — Convert your spreadsheet**
1. Export your table as **CSV** or use your **XLSX** file directly.
2. Convert online:
   - CSV to TXT: **[tools/csv-to-txt](../tools/csv-to-txt/)**  
   - XLSX to TXT: **[tools/xlsx-to-txt](../tools/xlsx-to-txt/)**
3. Move the downloaded **`data_mappoints.txt`** to **`app/data/`**.

**Publish on GitHub Pages**
1. Push to GitHub → **Settings → Pages**.  
2. Source: *Deploy from a branch* → **Branch:** `main`, **Folder:** `/ (root)`  
3. Your site: `https://sanriomisintaro.github.io/biodiversity-webmap-template/`

---

## Folder structure
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
images/ # photos/icons referenced from data_species.txt
docs/ # this page
tools/
csv-to-txt/ # CSV converter (browser-only)
xlsx-to-txt/ # XLSX converter (browser-only)
template/ # blank starter you can copy
```

---

## Data files (specs & examples)

### 1) `data_species.txt`
Pipe-separated, 3 columns:
```
name | color | image
```
- **name**: shown in the legend (scientific or common name)
- **color**: HEX (e.g., `#377eb8`)
- **image**: relative path in `app/images/` (optional)

**Example**
```
Perkutut Jawa (Geopelia striata) | #377eb8 | images/PerkututJawa.jpg
```

---

### 2) `data_mappoints.txt`
Pipe-separated, **9 columns in this exact order**:
```
date | time | species | count | district | coord | habitat | location | activity
```
- **date**: `YYYY-MM-DD` recommended (`DD/MM/YYYY` and `DD-MM-YYYY` are auto-normalized by the converters)
- **time**: `HH:MM` (24-h) or `H:MM AM/PM` (auto-normalized)
- **species**: must **match** a `name` in `data_species.txt`
- **coord**: decimal `-1.481, 124.846` **or** DMS/DM `N 01°28.717' E 124°53.518'`
  - YYou can use any of these:
  ```
  1.521583, 125.843583
  N 01°31.888' E 124°57.778'
  Lat: 1.4633916 Long: 124.8291702 
  ```

**Example**
```
2025-08-21 | 06:15 | Perkutut Jawa (Geopelia striata) | 2 | Sario | -1.481, 124.846 | Pekarangan | Pohon ketapang depan rumah | Menyanyi
```

---

### 3) `data_language.txt`
INI-style blocks + `key=value` pairs. Unknown keys are ignored.

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

Common keys: `appTitle`, `legendTitle`, `mapDefault`, `mapSatellite`,  
`details.date`, `details.time`, `details.count`, `details.coord`, `gmapsButton`, etc.

---
### 4) `data_setting.txt`
Key = value lines controlling defaults:
```
scale = 12 # initial zoom (city ~12, neighborhood ~15)
theme = light # light | dark
language = local # local=id, translate=en
mapType = default # default | satellite | terrain
showImages = true # true/false | 1/0
showRoad = 1 # 0=show road labels, 1=hide labels
```

---
## Tips

- Keep images ≤200–400 KB each for faster loads.
- Species show in the legend **only if** they appear in `data_mappoints.txt`.
- If loading the app locally fails (browser security), run a tiny server:
```
  # from the repo root
  python -m http.server 8000
  # then open http://localhost:8000/app/
```

---
##Converters (details)

CSV → TXT: detects Indonesian/English headers, normalizes dates/times, previews, then downloads data_mappoints.txt.
[Open:](https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/csv-to-txt/)

XLSX → TXT: supports multi-sheet workbooks, header synonyms, date/time normalization, preview, download.
[Open:](https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/xlsx-to-txt/)

Both run entirely in your browser (no upload).

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
## Cite / credit
If you use this template in a publication or report, please cite the repository and the archived release DOI (if available) .
- **Citation:** check CITATION.cff in root
  - Please keep required **basemap attributions** visible in the map UI.
    
---
## License
- **Code:** MIT (permissive; see [LICENSE](LICENSE))  

---

Happy mapping!

---


