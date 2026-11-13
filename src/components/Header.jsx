import { Link, useLocation } from "react-router-dom";
import { Film, Heart, Search, Sun, Moon, Monitor } from "lucide-react";

export default function Header({
                                   query,
                                   setQuery,
                                   onSearch,
                                   theme = "dark",
                                   setTheme,
                               }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-16 items-center gap-3">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex shrink-0 items-center gap-2"
                        aria-label="CineReview home"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
                            <Film className="h-5 w-5 text-white" />
                        </div>

                        <div className="hidden sm:block">
                            <div className="text-lg font-black tracking-tight text-white">
                                Cine<span className="text-cyan-400">Review</span>
                            </div>

                            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                                Movie Reviews
                            </div>
                        </div>
                    </Link>

                    {/* Search */}
                    <form
                        onSubmit={onSearch}
                        className="mx-auto flex w-full max-w-xl items-center"
                    >
                        <div className="flex w-full items-center rounded-xl border border-white/10 bg-white/[0.04] transition focus-within:border-cyan-400/40 focus-within:bg-white/[0.06]">
                            <Search className="ml-3 h-4 w-4 shrink-0 text-slate-500" />

                            <input
                                id="movie-search"
                                name="movieSearch"
                                type="search"
                                placeholder="Search movies by title..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full min-w-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-600"
                                autoComplete="off"
                            />

                            <button
                                type="submit"
                                className="mr-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        <Link
                            to="/"
                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                isActive("/")
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            Movies
                        </Link>

                        <Link
                            to="/wishlist"
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                isActive("/wishlist")
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Heart className="h-4 w-4" />
                            Wishlist
                        </Link>
                    </nav>

                    {/* Theme Controls */}
                    <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 md:flex">
                        <button
                            type="button"
                            aria-label="Light theme"
                            title="Light"
                            onClick={() => setTheme?.("light")}
                            className={`rounded-lg p-2 transition ${
                                theme === "light"
                                    ? "bg-white text-slate-900 shadow"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Sun className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Auto theme"
                            title="Auto"
                            onClick={() => setTheme?.("auto")}
                            className={`rounded-lg p-2 transition ${
                                theme === "auto"
                                    ? "bg-white text-slate-900 shadow"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Monitor className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Dark theme"
                            title="Dark"
                            onClick={() => setTheme?.("dark")}
                            className={`rounded-lg p-2 transition ${
                                theme === "dark"
                                    ? "bg-white text-slate-900 shadow"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Moon className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Mobile Theme */}
                    <select
                        id="mobile-theme"
                        name="mobileTheme"
                        aria-label="Theme"
                        value={theme}
                        onChange={(e) => setTheme?.(e.target.value)}
                        className="theme-select h-10 rounded-xl border border-white/10 bg-white/[.04] px-2 text-xs font-semibold outline-none md:hidden"
                    >
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                        <option value="dark">Dark</option>
                    </select>

                </div>
            </div>
        </header>
    );
}