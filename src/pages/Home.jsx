import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Film,
    Sparkles,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import LoadingGrid from "../components/LoadingGrid";

import {
    discoverMovies,
    searchMovies,
    TMDB_GENRES,
} from "../services/tmdb";

import { loadRatings } from "../utils/storage";

export default function Home({ query, setQuery }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const urlSearch = searchParams.get("search") || "";

    const [f, setF] = useState({
        genre: "",
        year: "",
        minRating: "",
        sortBy: "popularity.desc",
        genres: TMDB_GENRES,
    });

    const [m, setM] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        totalPages: 1,
        totalResults: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState(Boolean(urlSearch));
    const [ratings, setRatings] = useState(loadRatings());

    async function load(page = 1, q = "") {
        setLoading(true);
        setError("");

        try {
            const trimmedQuery = q.trim();

            const d = trimmedQuery
                ? await searchMovies(trimmedQuery, page)
                : await discoverMovies({
                    ...f,
                    page,
                });

            setM(d.results || []);

            setMeta({
                page: d.page || page,
                totalPages: Math.min(d.total_pages || 1, 500),
                totalResults: d.total_results || 0,
            });

            setSearch(Boolean(trimmedQuery));
            setRatings(loadRatings());
        } catch (e) {
            setM([]);
            setMeta({
                page: 1,
                totalPages: 1,
                totalResults: 0,
            });

            setError(e?.message || "Unable to load movies.");
        } finally {
            setLoading(false);
        }
    }

    /*
     * IMPORTANT:
     * The search term now comes from the URL.
     *
     * Example:
     * /?search=Inception
     *
     * This means when we navigate from Movie Details
     * back to Home, the search term cannot be lost.
     */
    useEffect(() => {
        const trimmedSearch = urlSearch.trim();

        if (setQuery) {
            setQuery(trimmedSearch);
        }

        load(1, trimmedSearch);
    }, [urlSearch]);

    /*
     * Apply filters.
     *
     * When filters are applied, remove any active
     * search query from the URL.
     */
    function apply() {
        setQuery?.("");

        setSearchParams({}, { replace: true });

        load(1, "");
    }

    /*
     * Reset everything.
     */
    function reset() {
        const n = {
            genre: "",
            year: "",
            minRating: "",
            sortBy: "popularity.desc",
            genres: TMDB_GENRES,
        };

        setF(n);
        setQuery?.("");
        setSearch(false);

        setSearchParams({}, { replace: true });

        load(1, "");
    }

    /*
     * Pagination.
     *
     * If a search is active, continue searching the same
     * movie title on the next page.
     */
    function page(p) {
        if (p < 1 || p > meta.totalPages) {
            return;
        }

        const currentSearch = urlSearch.trim();

        load(p, currentSearch);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* HERO */}
            <section
                className="relative mb-8 overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-violet-950/50 via-[#11131b] to-cyan-950/30 px-5 py-10 sm:px-8 lg:px-12"
            >
                <div className="relative max-w-3xl">

                    <div
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-bold text-violet-300"
                    >
                        <Sparkles size={14} />
                        Your movie discovery space
                    </div>

                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                        Find a film worth{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                            remembering.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Search, filter, explore detailed movie information and
                        keep your personal ratings and wishlist in one polished
                        place.
                    </p>

                </div>
            </section>

            {/* FILTERS */}
            <FilterBar
                filters={f}
                setFilters={setF}
                onApply={apply}
                onReset={reset}
                loading={loading}
            />

            {/* RESULTS */}
            <section className="mt-8">

                <div className="mb-4 flex items-end justify-between gap-3">

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-400">
                            {search ? "Search" : "Discover"}
                        </p>

                        <h2 className="mt-1 text-2xl font-black">
                            {search
                                ? `Search results for “${urlSearch}”`
                                : "Explore movies"}
                        </h2>

                        {!loading && (
                            <p className="mt-1 text-xs text-slate-500">
                                {meta.totalResults.toLocaleString()} titles available
                            </p>
                        )}
                    </div>

                    <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">
                        <Film size={15} />
                        TMDB-powered catalog
                    </div>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                        <b>Could not load movies</b>

                        <div className="mt-1 text-rose-200/70">
                            {error}
                        </div>
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <LoadingGrid />

                ) : m.length ? (

                    <>
                        {/* MOVIE GRID */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {m.map((x) => (
                                <MovieCard
                                    key={x.id}
                                    movie={x}
                                    userRating={
                                        ratings[String(x.id)] || 0
                                    }
                                />
                            ))}
                        </div>

                        {/* PAGINATION */}
                        <div className="mt-8 flex items-center justify-center gap-3">

                            <button
                                disabled={meta.page <= 1}
                                onClick={() => page(meta.page - 1)}
                                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 disabled:opacity-30"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold">
                                Page {meta.page} / {meta.totalPages}
                            </div>

                            <button
                                disabled={meta.page >= meta.totalPages}
                                onClick={() => page(meta.page + 1)}
                                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 disabled:opacity-30"
                                aria-label="Next page"
                            >
                                <ChevronRight size={18} />
                            </button>

                        </div>
                    </>

                ) : (

                    /* EMPTY STATE */
                    <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">

                        <Film
                            className="mx-auto text-slate-600"
                            size={36}
                        />

                        <h3 className="mt-4 text-lg font-bold">
                            No movies found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try another title, genre, year or rating.
                        </p>

                    </div>
                )}

            </section>
        </main>
    );
}