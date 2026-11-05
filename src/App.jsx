import { useEffect, useMemo, useState } from 'react'
import seedMovies from './movies.json'
import { loadMoviesFromOmdb } from './omdbApi'

const languages = ['All languages', 'Tamil', 'English', 'Malayalam', 'Telugu', 'Kannada']
const genres = ['All genres', ...new Set(seedMovies.map((movie) => movie.genre))]
const years = ['All years', ...[...new Set(seedMovies.map((movie) => String(movie.year)))].sort((a, b) => Number(b) - Number(a))]

function Stars({ value, onRate, size = 'normal', label = true }) {
  return <div className={`stars stars-${size}`} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= Math.round(value) ? 'star active' : 'star'} onClick={(event) => { event.stopPropagation(); onRate?.(star) }} aria-label={`Rate ${star} out of 5`} disabled={!onRate}>★</button>)}
    {label && <span className="star-value">{value ? Number(value).toFixed(1) : '—'}</span>}
  </div>
}

function App() {
  const [movies, setMovies] = useState(seedMovies)
  const [apiStatus, setApiStatus] = useState({ loading: true, connected: false, connectedCount: 0, error: null })
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('All languages')
  const [genre, setGenre] = useState('All genres')
  const [year, setYear] = useState('All years')
  const [minRating, setMinRating] = useState('Any rating')
  const [sort, setSort] = useState('featured')
  const [ratings, setRatings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('framebyframe-ratings') || '{}') } catch { return {} }
  })
  const [selected, setSelected] = useState(null)
  const [showRatedOnly, setShowRatedOnly] = useState(false)
  useEffect(() => {
    let cancelled = false

    async function connectToOmdb() {
      setApiStatus({ loading: true, connected: false, connectedCount: 0, error: null })
      const result = await loadMoviesFromOmdb()
      if (cancelled) return
      setMovies(result.movies)
      setApiStatus({
        loading: false,
        connected: result.connected,
        connectedCount: result.connectedCount || 0,
        error: result.error
      })
    }

    connectToOmdb()
    return () => { cancelled = true }
  }, [])


  const getAverage = (movie) => ratings[movie.id] ? (movie.averageRating * movie.ratingCount + ratings[movie.id]) / (movie.ratingCount + 1) : movie.averageRating

  useEffect(() => { localStorage.setItem('framebyframe-ratings', JSON.stringify(ratings)) }, [ratings])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const list = movies.filter((movie) => {
      const matchesQuery = !normalized || movie.title.toLowerCase().includes(normalized)
      const matchesLanguage = language === 'All languages' || movie.language === language
      const matchesGenre = genre === 'All genres' || movie.genre === genre
      const matchesYear = year === 'All years' || String(movie.year) === year
      const userRating = ratings[movie.id] || 0
      const displayedAverage = ratings[movie.id] ? (movie.averageRating * movie.ratingCount + ratings[movie.id]) / (movie.ratingCount + 1) : movie.averageRating
      const matchesRating = minRating === 'Any rating' || displayedAverage >= Number(minRating)
      const matchesRated = !showRatedOnly || userRating > 0
      return matchesQuery && matchesLanguage && matchesGenre && matchesYear && matchesRating && matchesRated
    })
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'newest') list.sort((a, b) => b.year - a.year)
    if (sort === 'rating') list.sort((a, b) => getAverage(b) - getAverage(a))
    return list
  }, [query, language, genre, year, minRating, sort, ratings, showRatedOnly])

  const setMovieRating = (id, value) => setRatings((current) => ({ ...current, [id]: value }))
  const clearFilters = () => { setQuery(''); setLanguage('All languages'); setGenre('All genres'); setYear('All years'); setMinRating('Any rating'); setSort('featured'); setShowRatedOnly(false) }
  const featured = movies.find((movie) => movie.featured)
  const userRatedCount = Object.values(ratings).filter(Boolean).length

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return <div className="site-shell min-h-screen">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Frame by Frame home"><span className="brand-mark">F<span>.</span></span><span className="brand-name">frame by frame<small>YOUR PERSONAL MOVIE JOURNAL</small></span></a>
      <nav className="nav-links"><a href="#discover">Discover</a><a href="#languages">Languages</a><a href="#about">About</a></nav>
      <button className={`journal-button ${showRatedOnly ? 'is-active' : ''}`} onClick={() => { setShowRatedOnly((value) => !value); document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' }) }}><span>✦</span> My journal <b>{userRatedCount}</b></button>
    </header>

    <div className={`api-status ${apiStatus.connected ? 'api-status-success' : apiStatus.error ? 'api-status-warning' : ''}`} role="status">
      <span className="api-status-dot" />
      {apiStatus.loading
        ? 'Connecting to OMDb movie data…'
        : apiStatus.connected
          ? `OMDb connected · ${apiStatus.connectedCount}/10 movie records loaded`
          : apiStatus.error}
    </div>

    <main id="top">
      <section className="hero-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> THE ART OF WATCHING</div>
          <h1>Every film leaves<br />a <em>little something.</em></h1>
          <p className="hero-description">A place to find your next favourite, revisit a story, and keep a note of the films that stay with you.</p>
          <a className="discover-link" href="#discover">Explore the collection <span>↘</span></a>
          <div className="hero-footnote"><span className="tiny-dot" /> A handpicked collection across five languages</div>
        </div>
        <div className="hero-art" aria-label="Featured film Jai Bhim artwork">
          <div className="hero-art-orbit orbit-one" /><div className="hero-art-orbit orbit-two" />
          <div className="hero-art-card"><img src={featured.cover} alt="Poster for Jai Bhim" /><div className="hero-art-caption"><span>FEATURED FILM · {featured.year}</span><strong>{featured.title}</strong><small>{featured.language} · {featured.genre}</small></div></div>
          <div className="floating-note note-top">A STORY<br />THAT MATTERS</div><div className="floating-note note-bottom">NO. 001 <span>✳</span></div>
          <div className="hero-index">01 <i /> 10</div>
        </div>
      </section>

      <section className="collection-strip" id="languages"><div><span className="strip-label">THE COLLECTION</span><strong>Stories without borders.</strong></div><div className="language-pills">{['Tamil', 'English', 'Malayalam', 'Telugu', 'Kannada'].map((item, index) => <button key={item} onClick={() => { setLanguage(item); document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' }) }}>{item}<sup>0{index + 1}</sup></button>)}</div></section>

      <section className="discover-section" id="discover">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FRAME</div><h2>The watchlist <em>edit.</em></h2><p>Browse, filter, and leave your own rating. Your journal stays saved on this device.</p></div><div className="collection-count"><strong>{filtered.length.toString().padStart(2, '0')}</strong><span>FILMS FOUND</span></div></div>

        <div className="filter-panel">
          <label className="search-box"><span className="search-icon">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by movie title..." aria-label="Search by movie title" />{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label>
          <label className="select-wrap"><span>LANGUAGE</span><select value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="select-wrap"><span>GENRE</span><select value={genre} onChange={(event) => setGenre(event.target.value)}>{genres.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="select-wrap"><span>YEAR</span><select value={year} onChange={(event) => setYear(event.target.value)}>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="select-wrap"><span>MIN. RATING</span><select value={minRating} onChange={(event) => setMinRating(event.target.value)}>{['Any rating', '3', '3.5', '4', '4.5'].map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="results-row"><span>{showRatedOnly ? 'YOUR PERSONAL PICKS' : 'ALL FILMS'} <i>·</i> {filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span><div className="sort-control"><label htmlFor="sort">SORT BY</label><select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Curated order</option><option value="newest">Newest first</option><option value="rating">Top rated</option><option value="title">Title A–Z</option></select><button className="reset-button" onClick={clearFilters}>Reset filters ↺</button></div></div>

        {filtered.length ? <div className="movie-grid grid">{filtered.map((movie, index) => <article className="movie-card" key={movie.id} onClick={() => setSelected(movie)} tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter') setSelected(movie) }} aria-label={`View details for ${movie.title}`}>
          <div className="poster-frame"><img src={movie.cover} alt={`Poster for ${movie.title}`} loading="lazy" /><span className="poster-number">{String(movie.id).padStart(2, '0')}</span><span className="poster-open">↗</span>{ratings[movie.id] && <span className="rated-tag">YOUR PICK ★ {ratings[movie.id]}</span>}</div>
          <div className="movie-meta"><div className="movie-kicker"><span>{movie.language.toUpperCase()}</span><i>·</i><span>{movie.year}</span><i>·</i><span>{movie.genre.toUpperCase()}</span></div><h3>{movie.title}</h3><div className="card-bottom"><span className="score">★ <b>{getAverage(movie).toFixed(1)}</b><small>/ 5</small></span><span className="your-rating">{ratings[movie.id] ? `YOU ★ ${ratings[movie.id]}/5` : 'ADD YOUR RATING +'}</span></div></div>
        </article>)}</div> : <div className="empty-state"><span>✳</span><h3>No frames found.</h3><p>Try a different title or loosen your filters.</p><button onClick={clearFilters}>Clear all filters</button></div>}
      </section>

      <section className="quote-band" id="about"><span className="quote-mark">“</span><p>Some films entertain us. Some films <em>find us.</em></p><span className="quote-credit">A LITTLE NOTE FROM THE EDITOR</span></section>
    </main>

    <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">F<span>.</span></span><span className="brand-name">frame by frame<small>YOUR PERSONAL MOVIE JOURNAL</small></span></a><span>Made for people who love a good story. <b>✳</b></span><a href="#top" className="back-top">BACK TO TOP ↑</a></footer>

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details">×</button><div className="modal-poster"><img src={selected.cover} alt={`Poster for ${selected.title}`} /></div><div className="modal-content"><div className="eyebrow"><span className="eyebrow-line" /> FILM NOTES · {String(selected.id).padStart(2, '0')}</div><div className="modal-tags"><span>{selected.language}</span><span>{selected.year}</span><span>{selected.genre}</span></div><h2 id="modal-title">{selected.title}</h2><p className="modal-note">{selected.note}</p><p className="modal-synopsis">{selected.synopsis}</p><div className="detail-facts"><div><small>DIRECTOR</small><strong>{selected.director}</strong></div><div><small>RUNTIME</small><strong>{selected.runtime}</strong></div><div><small>AVERAGE RATING</small><strong>★ {getAverage(selected).toFixed(1)} / 5</strong></div></div><div className="data-source">Movie details: <b>{selected.apiSource === 'OMDb' ? 'OMDb API' : 'Local fallback'}</b>{selected.imdbID ? ` · IMDb ${selected.imdbID}` : ''}</div><div className="cast-block"><small>CAST</small><p>{selected.cast.join(' · ')}</p></div><div className="rate-block"><div><small>YOUR RATING</small><span>{ratings[selected.id] ? 'Thanks for adding your take.' : 'How many stars would you give it?'}</span></div><Stars value={ratings[selected.id] || 0} onRate={(value) => setMovieRating(selected.id, value)} size="large" /></div></div></section></div>}
  </div>
}

export default App
