import axios from "axios";

const key = import.meta.env.VITE_OMDB_API_KEY?.trim();
const api = axios.create({baseURL: "https://www.omdbapi.com/", timeout: 10000});

export async function getOmdbByImdbId(imdbId) {
    if (!key || !imdbId) return null;
    try {
        const {data} = await api.get("", {params: {apikey: key, i: imdbId, plot: "full"}});
        return data?.Response === "True" ? data : null
    } catch {
        return null;
    }
}
