# Frame by Frame — Movie Review Website

A responsive React movie discovery and review app built as a front-end project. It contains a curated sample catalogue of 10 films: two each in Tamil, English, Malayalam, Telugu and Kannada.

## OMDb API connection

The app connects to the OMDb API when `VITE_OMDB_API_KEY` is available. The 10 curated movies are requested individually by title with `t`, and the returned movie details are merged into the existing collection. The selected real poster URLs are kept as the visual poster source, while OMDb supplies movie metadata such as year, genre, plot, director, runtime, cast and IMDb rating when available. If an individual OMDb lookup fails, that movie keeps its local fallback data so the UI remains usable.

### Configure the API key

1. Copy `.env.example` to a new file named `.env`.
2. Put your OMDb key in `.env`:

```env
VITE_OMDB_API_KEY=your_actual_omdb_key
```

3. Restart the Vite server after creating or changing `.env`:

```bash
npm run dev
```

Never commit `.env` to GitHub. It is excluded by `.gitignore`.

## Features

- Browse a responsive movie collection with film title, year, language, genre and average rating.
- Search by movie title.
- Filter by language, genre, release year and minimum average rating.
- Sort by curated order, newest, average rating or title.
- Open a film detail view with synopsis, director, runtime, cast and average rating.
- Give each film a personal 1–5 star rating.
- Save personal ratings in browser `localStorage` and view only films you have rated using **My journal**.
- Responsive layout for desktop, tablet and mobile.

## Tech stack

- React + Vite
- Tailwind CSS 4 (Vite plugin)
- React Hooks (`useState`, `useEffect`, `useMemo`)
- Tailwind CSS utilities for layout foundations, with plain CSS for the custom responsive visual design
- OMDb API integration with local fallback data

## Run locally

1. Install Node.js (LTS).
2. Extract this ZIP and open the project folder in VS Code or Cursor.
3. Open a terminal in the project folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production-ready site is generated in the `dist` folder.

## Deploy to Netlify

- Push the project to a GitHub repository.
- In Netlify, choose **Add new site → Import an existing project** and select the repository.
- Build command: `npm run build`
- Publish directory: `dist`

## Project structure

```text
movie-review-website/
├── public/
│   └── covers/          # Fallback artwork kept in the project
├── src/
│   ├── App.jsx          # App layout, filters, details and ratings
│   ├── main.jsx         # React entry point
│   ├── movies.json      # Sample movie data
│   └── styles.css       # Responsive styling
├── index.html
├── package.json
└── vite.config.js
```

## Notes about the sample data and artwork

This project uses a small mock catalogue so it runs immediately without an external movie API or API key. Average ratings are sample starting values stored with a sample rating count in the JSON data. When a visitor rates a film, their rating is included in the displayed average in that browser. The movie cards now use real poster artwork hosted by external image sources so the collection visually matches the actual films. The project does not redistribute those poster files inside the repository. If you publish the project publicly, keep the image-source credits/usage terms in mind and replace the remote URLs with assets you are licensed to use if required. Personal ratings are stored only in the current browser on the device where they are entered.

To extend the project, you can add OMDb search suggestions, pagination, user accounts, or a database-backed review system.
