# yourdata.xlsx to data_mappoints.txt

**Use it online:** https://sanriomisintaro.github.io/biodiversity-webmap-template/tools/xlxs-to-txt/

Convert an Excel sheet (XLSX/XLS) into the **pipe-separated** text file
`data_mappoints.txt` used by the web map template.

- Everything runs **in your browser** (client-side only).
- Auto-detects header names (Indonesian & English synonyms).
- Normalizes dates (`YYYY-MM-DD`) and times (`HH:MM`).
- Shows a preview before download.
- Skips empty rows and rows missing **Species** or **Coord**.

> This code made by using SheetJS (XLSX parser). If you need offline use, download `xlsx.full.min.js` and update the `<script>` tag in `index.html` to the local file.

---

## Quick start

1. Open **`index.html`** in a modern browser (Chrome/Edge).
2. Click **Choose file** and select your `.xlsx` / `.xls`.
3. Pick the **worksheet** (if there are multiple).
4. Click **Convert to TXT**.  
   You’ll see a preview (first 10 lines) and your browser downloads **`data_mappoints.txt`**.

**Screenshots (add these to `images/` and keep the same names):**
- ![Open file](images/step1-open-file.png)
- ![Choose sheet](images/step2-choose-sheet.png)
- ![Preview and download](images/step3-preview-download.png)

---

## Expected columns (in this order)

The output is **pipe-separated** with 9 columns:
```
date | time | species | count | district | coord | habitat | location | activity
```
### Header synonyms (case-insensitive)

The tool accepts these header names (and close variants):

| Output field | Accepted headers (examples) |
| --- | --- |
| **date** | `Tanggal`, `Hari/Tanggal`, `Date`, `Tgl`, `Hari Tanggal` |
| **time** | `Jam`, `Waktu`, `Time`, `Pukul` |
| **species** | `Jenis`, `Spesies`, `Species`, `Taxon`, `Nama Jenis`, `Scientific Name`, `Common Name` |
| **count** | `Jumlah Individu`, `Jumlah`, `Count`, `Abundance`, `N`, `Number` |
| **district** | `Distrik`, `Kecamatan`, `District`, `Desa/Kelurahan`, `Village` |
| **coord** | `Titik Koordinat`, `Koordinat`, `Coord`, `Coordinate`, `Coordinates`, `Lat Long`, `Lat/Long`, `Latitude Longitude`, `GPS` |
| **habitat** | `Tipe Habitat`, `Habitat`, `Habitat Type` |
| **location** | `Lokasi`, `Site`, `Micro-site`, `Micro site`, `Spot` |
| **activity** | `Aktivitas`, `Activity`, `Behavior`, `Behaviour` |

> Tip: if detection fails, just rename your header cells to match one of the synonyms above.

---

## Input formats

- **Date**: `YYYY-MM-DD` (recommended), `DD/MM/YYYY`, `DD-MM-YYYY`, or Excel serial dates.  
- **Time**: `HH:MM` (24-h), or `H:MM AM/PM` (converted to 24-h).  
- **Coordinates**: either decimal degrees (e.g., `-1.481, 124.846`) **or** DMS/DM strings like `N 01°28.717' E 124°53.518'`.

**Sanitization rules**
- Newlines are flattened to spaces.
- The pipe character `|` in cells is replaced with `/` (so the output delimiter stays intact).

---

## Output example
```
2025-08-21 | 06:15 | Perkutut Jawa (Geopelia striata) | 2 | Sario | -1.481, 124.846 | Pekarangan | Pohon ketapang depan rumah | Menyanyi
```
Save the downloaded file as **`app/data/data_mappoints.txt`** in your web map.

---

## Troubleshooting

- **“Missing columns: …”** > Adjust your header row to include all required columns (see table above).  
- **Preview shows 0 lines** > All rows were empty or lacked Species/Coord. Check your data.  
- **Weird dates/times** > Cells formatted oddly in Excel may export as text. Try converting to proper date/time in Excel, or let the tool normalize common formats.  
- **No internet** > Download `xlsx.full.min.js` and reference it locally in `index.html`.

---

## Offline use (no CDN)

This page loads **Papa Parse** from a CDN. For offline or air-gapped use:

1. Download `xlsx.full.min.js` into `tools/xlxs-to-txt/` folder.
2. Edit the script tag in `index.html`:

```
<html>
<!-- replace CDN: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script> -->
<!-- with local file: -->
<script src="xlsx.full.min.js"></script>
```

---

## Privacy

Files are processed **locally** in your browser. No data is uploaded to a server.

---

## License

You may reuse this tool. If you distribute it, keep attribution and this README.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f)](https://sanriomisintaro.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)