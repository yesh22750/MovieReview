import axios from "axios";

const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
const api = axios.create({baseURL: "https://api.themoviedb.org/3", timeout: 12000});
const img = "https://image.tmdb.org/t/p";
export const tmdbImage = (path, size = "w500") => path ? `${img}/${size}${path}` : "";
export const TMDB_GENRES = [[28, "Action"], [12, "Adventure"], [16, "Animation"], [35, "Comedy"], [80, "Crime"], [99, "Documentary"], [18, "Drama"], [10751, "Family"], [14, "Fantasy"], [36, "History"], [27, "Horror"], [10402, "Music"], [9648, "Mystery"], [10749, "Romance"], [878, "Sci-Fi"], [53, "Thriller"], [10752, "War"], [37, "Western"]];

function check() {
    if (!token) throw new Error("TMDB_ACCESS_TOKEN is missing. Add it to .env.local and restart Vite.");
}

async function request(config) {
    check();
    try {
        return (await api.request({...config, headers: {Authorization: `Bearer ${token}`}})).data
    } catch (e) {
        const s = e?.response?.status, m = e?.response?.data?.status_message;
        if (s === 401) throw new Error("TMDB authentication failed (401). Check your TMDB Read Access Token.");
        if (s === 429) throw new Error("TMDB rate limit reached. Try again shortly.");
        if (s >= 500) throw new Error("TMDB is temporarily unavailable. Try again shortly.");
        throw new Error(m || e.message || "TMDB request failed.");
    }
}

export async function discoverMovies(f = {}) {
    const params = {
        language: "en-US",
        page: f.page || 1,
        include_adult: false,
        include_video: false,
        sort_by: f.sortBy || "popularity.desc"
    };
    if (f.year) params.primary_release_year = f.year;
    if (f.genre) params.with_genres = f.genre;
    if (f.minRating) {
        params["vote_average.gte"] = f.minRating;
        params["vote_count.gte"] = 20
    }
    return request({url: "/discover/movie", params});
}

export async function searchMovies(query, page = 1) {
    return request({url: "/search/movie", params: {query, page, language: "en-US", include_adult: false}});
}

export async function getMovieDetails(id) {
    return request({url: `/movie/${id}`, params: {language: "en-US", append_to_response: "credits"}});
}
