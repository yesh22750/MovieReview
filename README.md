# CineReview — Perfect TMDB + OMDb
## Setup
1. `npm install`
2. Create `.env.local`:
```
VITE_TMDB_ACCESS_TOKEN=YOUR_TMDB_API_READ_ACCESS_TOKEN
VITE_OMDB_API_KEY=YOUR_OMDB_API_KEY
```
3. `npm run dev`
4. `npm run build`

   ## Troubleshooting

### Could not load movies

If the application displays:

> **Could not load movies**  
> timeout of 12000ms exceeded

this indicates that the movie API request did not receive a response within the configured 12-second timeout.

The application uses the OMDb API for movie data. Check the OMDb API key and network/API availability if this error occurs.

## API architecture
- Axios is used for TMDB and OMDb requests.
- TMDB Read Access Token is sent as `Authorization: Bearer ...`.
- Discover uses real TMDB query parameters for genre, release year, minimum rating and sorting.
- Search uses `/search/movie`.
- Details use `/movie/{id}` with credits.
- OMDb enriches details using the TMDB IMDb ID. OMDb failure is isolated and does not break TMDB.
- No trailer integration is included.
- Ratings and wishlist persist in localStorage.
- `401`, rate-limit, server and missing-token errors are shown as clean UI messages.

## Netlify
Build command: `npm run build`
Publish directory: `dist`
Add both environment variables in Netlify and redeploy.


## Theme
- Light, Dark and Auto themes are available in the header.
- Auto follows the operating system/browser color preference.
- The selected preference is persisted in localStorage.
- Tailwind CSS v4 is used for the responsive UI and component styling.
