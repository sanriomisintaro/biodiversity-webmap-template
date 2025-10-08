

# CSV to data_mappoints.txt
**Use it online:** https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/csv-to-txt/

Convert a CSV into the **pipe-separated** text file `data_mappoints.txt`
used by the biodiversity web map template.

- Browser-only (client-side; no uploads)
- Auto-detects header names (Indonesian & English synonyms)
- Normalizes **date** (`YYYY-MM-DD`) and **time** (`HH:MM`)
- Shows a preview (first 10 lines)
- Skips empty rows and any row missing **Species** or **Coord**

> Folder: `tools/csv-to-txt/`  
> Entry point: `index.html`  
> Parser library: **Papa Parse** (CDN)

---

## Quick start

1. Open **`index.html`** in a modern browser (Chrome/Edge).
2. Click **Choose file** and select your `.csv`.
3. Click **Convert → TXT**.  
   You’ll see a preview, and your browser downloads **`data_mappoints.txt`**.

**Optional screenshots** (add PNGs to `tools/csv-to-txt/images/` with these names):
- ![Open CSV](images/csv-step1-open.png)
- ![Preview & download](images/csv-step2-preview-download.png)

---

## CSV requirements

- **Delimiter**: comma `,` (semicolon `;` often works but prefer commas)
- **Encoding**: UTF-8
- **Header row**: first line must contain column names
- **Quoted fields**: supported

---

## Output fields (order & meaning)

The tool writes **9 fields** separated by a pipe `|`:
```
date | time | species | count | district | coord | habitat | location | activity
```

- **date** — e.g., `2025-08-21`
- **time** — `HH:MM` (24-hour)
- **species** — must match names in your app’s `data_species.txt`
- **count** — integer or numeric text
- **district** — area/admin label
- **coord** — coordinates string (`-1.481, 124.846` **or** `N 01°28.717' E 124°53.518'`)
- **habitat / location / activity** — free text

---

## Accepted header names (case-insensitive, ID/EN)

Use any of these (and close variants) in your CSV header row:

- **date**: `Tanggal`, `Hari/Tanggal`, `Date`, `Tgl`, `Hari Tanggal`  
- **time**: `Jam`, `Waktu`, `Time`, `Pukul`  
- **species**: `Jenis`, `Spesies`, `Species`, `Taxon`, `Nama Jenis`, `Scientific Name`, `Common Name`  
- **count**: `Jumlah Individu`, `Jumlah`, `Count`, `Abundance`, `N`, `Number`  
- **district**: `Distrik`, `Kecamatan`, `District`, `Desa/Kelurahan`, `Village`  
- **coord**: `Titik Koordinat`, `Koordinat`, `Coord`, `Coordinate`, `Coordinates`, `Lat Long`, `Lat/Long`, `Latitude Longitude`, `GPS`  
- **habitat**: `Tipe Habitat`, `Habitat`, `Habitat Type`  
- **location**: `Lokasi`, `Site`, `Micro-site`, `Micro site`, `Spot`  
- **activity**: `Aktivitas`, `Activity`, `Behavior`, `Behaviour`

> If you see **“Missing columns: …”**, rename your headers to any accepted synonym above.

---

## Normalization & sanitization

- **Date**: accepts `YYYY-MM-DD`, `DD/MM/YYYY`, or `DD-MM-YYYY` (converted to `YYYY-MM-DD`).  
  (Rare case: numeric “Excel serial” dates are also handled.)
- **Time**: accepts `HH:MM` or `H:MM AM/PM` (converted to 24-hour).
- **Newlines** in cells are replaced with spaces.
- The **pipe** character `|` in cells is replaced with `/` (so the output delimiter stays intact).

---

## Example output line

```
2025-08-21 | 06:15 | Perkutut Jawa (Geopelia striata) | 2 | Sario | -1.481, 124.846 | Pekarangan | Pohon ketapang depan rumah | Menyanyi
```

Move the downloaded file to your app as **`app/data/data_mappoints.txt`**.

---

## Troubleshooting

- **“No header row found”** → Ensure the first line contains column names.  
- **“Missing columns: …”** → Rename headers to accepted synonyms (see list).  
- **Preview shows 0 lines** → All rows were empty or lacked **Species** or **Coord**.  
- **Weird characters (�)** → Re-export the CSV as **UTF-8**.  
- **No points on the map** → In your web app, *species* names must match `data_species.txt`.

---

## Offline use (no CDN)

This page loads **Papa Parse** from a CDN. For offline or air-gapped use:

1. Download `papaparse.min.js` into `tools/csv-to-txt/` folder.
2. Edit the script tag in `index.html`:

```
<html>
<!-- replace CDN: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script> -->
<!-- with local file: -->
<script src="papaparse.min.js"></script>
```

## Privacy

Files are processed **locally** in your browser. No data is uploaded to a server.

---

## License

You may reuse this tool. If you distribute it, keep attribution and this README.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f)](https://sanriomisintaro.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)