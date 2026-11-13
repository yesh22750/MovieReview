import {useEffect, useState} from "react";
import {Heart, Trash2} from "lucide-react";
import {Link} from "react-router-dom";
import {loadWishlist, saveWishlist} from "../utils/storage";
import {tmdbImage} from "../services/tmdb";

export default function Wishlist() {
    const [x, setX] = useState([]);
    useEffect(() => setX(loadWishlist()), []);

    function remove(id) {
        const n = x.filter(i => String(i.id) !== String(id));
        setX(n);
        saveWishlist(n)
    }

    return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><p
        className="text-xs font-bold uppercase tracking-[.2em] text-rose-400">Personal collection</p><h1
        className="mt-1 text-3xl font-black">My Wishlist</h1><p
        className="mt-2 text-sm text-slate-500">{x.length} saved {x.length === 1 ? "movie" : "movies"}</p>{x.length ?
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{x.map(m => <div key={m.id}
                                                                                                    className="overflow-hidden rounded-2xl border border-white/8 bg-white/[.03]">
            <Link to={`/movie/${m.id}`}>{m.poster_path ?
                <img src={tmdbImage(m.poster_path)} alt={m.title} className="aspect-[2/3] w-full object-cover"/> :
                <div className="aspect-[2/3] grid place-items-center text-slate-600">No poster</div>}</Link>
            <div className="p-3.5"><Link to={`/movie/${m.id}`}
                                         className="line-clamp-2 text-sm font-bold hover:text-violet-300">{m.title}</Link>
                <div className="mt-2 flex justify-between"><span
                    className="text-xs text-slate-500">{m.release_date?.slice(0, 4) || "—"}</span>
                    <button onClick={() => remove(m.id)}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-500 hover:text-rose-400">
                        <Trash2 size={15}/></button>
                </div>
            </div>
        </div>)}</div> :
        <div className="mt-8 rounded-3xl border border-dashed border-white/10 px-6 py-20 text-center"><Heart
            className="mx-auto text-slate-600" size={40}/><h2 className="mt-4 text-lg font-bold">Your wishlist is
            empty</h2><p className="mt-2 text-sm text-slate-500">Save movies from the catalog and they will appear
            here.</p><Link to="/" className="mt-5 inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold">Explore
            movies</Link></div>}</main>
}
