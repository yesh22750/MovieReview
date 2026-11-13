const R = "cinereview.ratings.v1", W = "cinereview.wishlist.v1";
const read = (k, d) => {
    try {
        return JSON.parse(localStorage.getItem(k) || JSON.stringify(d))
    } catch {
        return d
    }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
export const loadRatings = () => read(R, {});

export function setMovieRating(id, r) {
    const x = loadRatings();
    if (r === 0) delete x[String(id)]; else x[String(id)] = Number(r);
    write(R, x);
    return x
}

export const loadWishlist = () => read(W, []);
export const saveWishlist = x => write(W, x);
export const isWishlisted = id => loadWishlist().some(x => String(x.id) === String(id));

export function toggleWishlist(m) {
    const x = loadWishlist(), id = String(m.id), exists = x.some(i => String(i.id) === id);
    const n = exists ? x.filter(i => String(i.id) !== id) : [...x, {
        id: m.id,
        title: m.title,
        poster_path: m.poster_path || "",
        release_date: m.release_date || "",
        vote_average: m.vote_average || 0
    }];
    write(W, n);
    return n
}
