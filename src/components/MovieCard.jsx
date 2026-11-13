import {Heart, Star} from "lucide-react";
import {Link} from "react-router-dom";
import {tmdbImage} from "../services/tmdb";
import {isWishlisted, toggleWishlist} from "../utils/storage";
import {useState} from "react";

export default function MovieCard({movie, userRating = 0}) {
    const [w, setW] = useState(isWishlisted(movie.id));
    const year = movie.release_date?.slice(0, 4) || "—";

    function tog(e) {
        e.preventDefault();
        e.stopPropagation();
        const n = toggleWishlist(movie);
        setW(n.some(x => String(x.id) === String(movie.id)))
    }

    return <Link to={`/movie/${movie.id}`} className="group block">
        <article className="card-hover overflow-hidden rounded-2xl border border-white/8 bg-white/[.035]">
            <div className="poster-shine relative aspect-[2/3] bg-[#11131a]">{movie.poster_path ?
                <img src={tmdbImage(movie.poster_path)} alt={movie.title} loading="lazy"
                     className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"/> :
                <div className="grid h-full place-items-center p-5 text-center text-sm text-slate-500">Poster
                    unavailable</div>}
                <button onClick={tog}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/55">
                    <Heart size={17} fill={w ? "currentColor" : "none"} className={w ? "text-rose-400" : "text-white"}/>
                </button>
                <div
                    className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-2 py-1 text-[11px] font-bold">{year}</div>
            </div>
            <div className="p-3.5"><h3 className="line-clamp-2 min-h-10 text-sm font-bold">{movie.title}</h3>
                <div className="mt-2 flex justify-between text-xs text-slate-500"><span
                    className="flex items-center gap-1"><Star size={13} fill="currentColor"
                                                              className="text-amber-400"/> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span><span>{movie.vote_count ? `${movie.vote_count.toLocaleString()} votes` : "No votes"}</span>
                </div>
                {userRating > 0 &&
                    <div className="mt-2 text-[11px] font-semibold text-violet-300">Your rating: {userRating}/5</div>}
            </div>
        </article>
    </Link>
}
