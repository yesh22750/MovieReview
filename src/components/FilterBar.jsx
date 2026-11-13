import { SlidersHorizontal } from "lucide-react";

const YEARS = Array.from(
    { length: new Date().getFullYear() - 1969 },
    (_, index) => new Date().getFullYear() - index
);

const GENRES = [
    ["", "All Genres"],
    ["28", "Action"],
    ["12", "Adventure"],
    ["16", "Animation"],
    ["35", "Comedy"],
    ["80", "Crime"],
    ["99", "Documentary"],
    ["18", "Drama"],
    ["10751", "Family"],
    ["14", "Fantasy"],
    ["36", "History"],
    ["27", "Horror"],
    ["10402", "Music"],
    ["9648", "Mystery"],
    ["10749", "Romance"],
    ["878", "Sci-Fi"],
    ["53", "Thriller"],
    ["10752", "War"],
    ["37", "Western"],
];

export default function FilterBar({
                                      filters,
                                      setFilters,
                                      onApply,
                                      onReset,
                                  }) {
    function updateFilter(name, value) {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <section className="mb-8 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-5">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <SlidersHorizontal size={18} />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Filter Movies
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Refine movies by genre, year, rating and sorting
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {/* Genre */}
                <div>
                    <label
                        htmlFor="movie-genre"
                        className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                        Genre
                    </label>

                    <select
                        id="movie-genre"
                        name="movieGenre"
                        value={filters.genre || ""}
                        onChange={(e) => updateFilter("genre", e.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                        {GENRES.map(([value, label]) => (
                            <option
                                key={value || "all-genres"}
                                value={value}
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                            >
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year */}
                <div>
                    <label
                        htmlFor="movie-year"
                        className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                        Release Year
                    </label>

                    <select
                        id="movie-year"
                        name="movieYear"
                        value={filters.year || ""}
                        onChange={(e) => updateFilter("year", e.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                        <option
                            value=""
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            All Years
                        </option>

                        {YEARS.map((year) => (
                            <option
                                key={year}
                                value={year}
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                            >
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rating */}
                <div>
                    <label
                        htmlFor="movie-rating"
                        className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                        Minimum Rating
                    </label>

                    <select
                        id="movie-rating"
                        name="movieRating"
                        value={filters.minRating || ""}
                        onChange={(e) => updateFilter("minRating", e.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                        <option
                            value=""
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            Any Rating
                        </option>

                        <option
                            value="9"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            9+
                        </option>

                        <option
                            value="8"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            8+
                        </option>

                        <option
                            value="7"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            7+
                        </option>

                        <option
                            value="6"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            6+
                        </option>

                        <option
                            value="5"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            5+
                        </option>
                    </select>
                </div>

                {/* Sort */}
                <div>
                    <label
                        htmlFor="movie-sort"
                        className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                        Sort By
                    </label>

                    <select
                        id="movie-sort"
                        name="movieSort"
                        value={filters.sortBy || "popularity.desc"}
                        onChange={(e) => updateFilter("sortBy", e.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                        <option
                            value="popularity.desc"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            Popularity
                        </option>

                        <option
                            value="vote_average.desc"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            Highest Rated
                        </option>

                        <option
                            value="primary_release_date.desc"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            Newest
                        </option>

                        <option
                            value="primary_release_date.asc"
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                            Oldest
                        </option>
                    </select>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                >
                    Reset
                </button>

                <button
                    type="button"
                    onClick={onApply}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
                >
                    Apply Filters
                </button>
            </div>
        </section>
    );
}