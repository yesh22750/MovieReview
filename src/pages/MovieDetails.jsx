import {useEffect, useState} from "react";
import {ArrowLeft, CalendarDays, Clock3, Heart, Languages, Star, Users} from "lucide-react";
import {Link, useParams} from "react-router-dom";
import {getMovieDetails, tmdbImage} from "../services/tmdb";
import {getOmdbByImdbId} from "../services/omdb";
import {isWishlisted, loadRatings, setMovieRating, toggleWishlist} from "../utils/storage";
import RatingStars from "../components/RatingStars";

export default function MovieDetails() {
    const {id} = useParams();
    const [movie, setMovie] = useState(null), [omdb, setOmdb] = useState(null), [rating, setRating] = useState(loadRatings()[String(id)] || 0), [wish, setWish] = useState(isWishlisted(id)), [loading, setLoading] = useState(true), [error, setError] = useState("");
    useEffect(() => {
        let a = true;
        (async () => {
            try {
                const x = await getMovieDetails(id);
                if (!a) return;
                setMovie(x);
                if (x.imdb_id) {
                    const o = await getOmdbByImdbId(x.imdb_id);
                    if (a) setOmdb(o)
                }
            } catch (e) {
                if (a) setError(e.message)
            } finally {
                if (a) setLoading(false)
            }
        })();
        return () => {
            a = false
        }
    }, [id]);
    if (loading) return <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="skeleton h-[520px] rounded-3xl"/>
    </main>;
    if (error || !movie) return <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-200"><b>Movie unavailable</b>
            <p className="mt-2 text-sm">{error || "This movie could not be loaded."}</p><Link
                className="mt-5 inline-flex text-sm font-bold text-violet-300" to="/">← Back to movies</Link></div>
    </main>;
    const year = movie.release_date?.slice(0, 4) || "—",
        runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "—",
        cast = movie.credits?.cast?.slice(0, 8) || [];
    const rate = v => {
        setRating(v);
        setMovieRating(id, v)
    };
    const toggle = () => {
        const n = toggleWishlist(movie);
        setWish(n.some(x => String(x.id) === String(id)))
    };
    return <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8"><Link to="/"
                                                                               className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><ArrowLeft
        size={17}/> Back to movies</Link>
        <section className="overflow-hidden rounded-3xl border border-white/8 bg-white/[.025]">
            <div className="relative min-h-[420px] overflow-hidden">{movie.backdrop_path &&
                <img src={tmdbImage(movie.backdrop_path, "w1280")} alt=""
                     className="absolute inset-0 h-full w-full object-cover opacity-20"/>}
                <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/90 to-[#08090d]/60"/>
                <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[280px_1fr] lg:p-12">
                    <div
                        className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10">{movie.poster_path ?
                        <img src={tmdbImage(movie.poster_path)} alt={movie.title}
                             className="aspect-[2/3] w-full object-cover"/> :
                        <div className="aspect-[2/3] grid place-items-center text-slate-500">Poster
                            unavailable</div>}</div>
                    <div className="self-center">
                        <div className="flex flex-wrap gap-2">{movie.genres?.slice(0, 4).map(g => <span key={g.id}
                                                                                                        className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">{g.name}</span>)}</div>
                        <h1 className="mt-4 text-4xl font-black sm:text-5xl">{movie.title}</h1>{movie.tagline &&
                        <p className="mt-3 text-sm italic text-slate-500">“{movie.tagline}”</p>}
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400"><span
                            className="flex gap-1.5"><CalendarDays size={16}/>{year}</span><span
                            className="flex gap-1.5"><Clock3 size={16}/>{runtime}</span><span
                            className="flex gap-1.5"><Star size={16} fill="currentColor"
                                                           className="text-amber-400"/>{movie.vote_average?.toFixed(1) || "N/A"}</span>{movie.original_language &&
                            <span className="flex gap-1.5"><Languages size={16}/>{movie.original_language.toUpperCase()}</span>}
                        </div>
                        <button onClick={toggle}
                                className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-4 py-2.5 text-sm font-bold">
                            <Heart size={17} fill={wish ? "currentColor" : "none"}
                                   className={wish ? "text-rose-400" : ""}/>{wish ? "In wishlist" : "Add to wishlist"}
                        </button>
                        <div className="mt-8 rounded-2xl border border-white/8 bg-black/20 p-4">
                            <div className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">Your rating
                            </div>
                            <div className="mt-2 flex items-center gap-4"><RatingStars value={rating} onChange={rate}
                                                                                       size={24} interactive/><span
                                className="text-sm font-bold text-slate-300">{rating ? `${rating}/5` : "Not rated"}</span>{rating > 0 &&
                                <button onClick={() => rate(0)}
                                        className="text-xs text-slate-500 hover:text-white">Clear</button>}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid gap-8 border-t border-white/8 p-6 sm:p-9 lg:grid-cols-[1.5fr_1fr] lg:p-12">
                <div><h2 className="text-lg font-black">Overview</h2><p
                    className="mt-3 text-sm leading-7 text-slate-400">{movie.overview || "No overview is available."}</p>{cast.length > 0 &&
                    <div className="mt-8">
                        <div className="flex items-center gap-2 text-lg font-black"><Users size={18}
                                                                                           className="text-violet-400"/>Cast
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{cast.map(p => <div key={p.id}
                                                                                                        className="rounded-xl border border-white/8 bg-white/[.025] p-3">
                            <div className="text-sm font-bold">{p.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{p.character || "Cast"}</div>
                        </div>)}</div>
                    </div>}</div>
                <aside className="space-y-3"><Info l="Release date" v={movie.release_date || "N/A"}/><Info
                    l="Original title" v={movie.original_title || "N/A"}/><Info l="Status"
                                                                                v={movie.status || "N/A"}/><Info
                    l="Countries"
                    v={movie.production_countries?.map(x => x.name).join(", ") || "N/A"}/>{omdb?.imdbRating &&
                    <Info l="IMDb rating" v={`${omdb.imdbRating}/10`}/>}</aside>
            </div>
        </section>
    </main>
}

function Info({l, v}) {
    return <div className="rounded-xl border border-white/8 bg-white/[.025] p-4">
        <div className="text-[11px] font-bold uppercase tracking-[.15em] text-slate-600">{l}</div>
        <div className="mt-1 text-sm font-semibold text-slate-300">{v}</div>
    </div>
}
