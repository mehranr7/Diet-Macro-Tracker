# Diet Macro Tracker (Cordova)

A lightweight macro tracker (Protein / Carbs / Fat) built with **Apache Cordova** and a simple client-side foods database (`Db.json`). The UI is Persian-friendly (RTL) and the app persists your targets and consumed macros using localStorage.

## Features
- Track daily Protein / Carbs / Fat progress based on your targets.
- Add foods from a predefined database and calculate macros by gram amount.
- Dark/Light theme toggle.
- Persistent state (targets + consumed items) via localStorage.
- Simple static DB loading from `Db.json` (publish it via GitHub Pages or any static host).

## Project structure
- `www/`: App UI and client code (HTML/CSS/JS).
- `config.xml`: Cordova configuration.
- `Db.json`: Foods database (macros per 100g).

## Getting started
1. Install dependencies:
   - `npm install`
2. Add a platform (example Android):
   - `cordova platform add android`
3. Run:
   - `cordova run android`

## Foods database format
`Db.json` is a JSON array of food objects:

```json
[
  { "id": "24", "name": "Chicken Breast", "protein": 30.0, "carbs": 0.0, "fat": 3.5 }
]
```

## User Interface
<img width="650" height="511" alt="diet-app" src="https://github.com/user-attachments/assets/1f807fc7-37ea-4166-9154-904d29a660ff" />

