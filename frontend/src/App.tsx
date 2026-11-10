import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, Bell, CalendarDays, ChevronDown, Clapperboard, Compass,
  Disc3, Film, Flame, Headphones, Home, ListMusic, Menu, Music2, Play,
  Radio, Search, Settings, ShieldCheck, Sparkles, Trophy, Tv2, X
} from 'lucide-react'
import { getPopularMovies, globalSearch, getSportsStatus } from './services/api'

type Movie = { id: number; title?: string; name?: string; poster_path?: string | null; backdrop_path?: string | null; overview?: string; release_date?: string; vote_average?: number }
type Page = 'Home' | 'Movies' | 'Music' | 'Football' | 'My Library'
const poster = (path?: string | null) => path ? `https://image.tmdb.org/t/p/w500${path}` : ''
const backdrop = (path?: string | null) => path ? `https://image.tmdb.org/t/p/w1280${path}` : ''

const musicSamples = [
  { title: 'Midnight City', artist: 'M83', kind: 'Electronic', color: 'from-indigo-500 to-violet-900' },
  { title: 'Golden Hour', artist: 'JVKE', kind: 'Pop', color: 'from-amber-400 to-rose-800' },
  { title: 'Essence', artist: 'Wizkid', kind: 'Afrobeats', color: 'from-emerald-500 to-teal-950' },
  { title: 'Calm Down', artist: 'Rema', kind: 'Afrobeats', color: 'from-fuchsia-500 to-purple-950' },
]
const sampleMatches = [
  { league: 'Premier League', home: 'Arsenal', away: 'Chelsea', score: '— : —', status: 'Upcoming', time: 'Provider required' },
  { league: 'La Liga', home: 'Real Madrid', away: 'Barcelona', score: '— : —', status: 'Upcoming', time: 'Provider required' },
  { league: 'UEFA Champions League', home: 'PSG', away: 'Bayern Munich', score: '— : —', status: 'Upcoming', time: 'Provider required' },
]

export default function App() {
  const [page, setPage] = useState<Page>('Home')
  const [movies, setMovies] = useState<Movie[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [sports, setSports] = useState<any>(null)
  const [movieError, setMovieError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [loadingMovies, setLoadingMovies] = useState(true)
  const [mobileNav, setMobileNav] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)

  useEffect(() => {
    getPopularMovies()
      .then(data => setMovies(Array.isArray(data.results) ? data.results : []))
      .catch(() => setMovieError('Connect your TMDB API key in backend/.env and start the API to load the live movie catalogue.'))
      .finally(() => setLoadingMovies(false))
    getSportsStatus().then(setSports).catch(() => setSports({ message: 'Football data provider is not connected yet.' }))
  }, [])

  async function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchError('')
    try { setResults(await globalSearch(query.trim())); setPage('Home') }
    catch { setSearchError('Search API is unavailable. Make sure the LOUFHUB backend is running.') }
  }

  const featured = movies.find(m => m.backdrop_path) || movies[0]
  const visibleMovies = useMemo(() => page === 'Movies' ? movies : movies.slice(0, 8), [movies, page])
  const navItems: { label: Page; icon: typeof Home }[] = [
    { label: 'Home', icon: Home }, { label: 'Movies', icon: Film }, { label: 'Music', icon: Headphones },
    { label: 'Football', icon: Trophy }, { label: 'My Library', icon: ListMusic },
  ]

  function changePage(next: Page) { setPage(next); setMobileNav(false); setResults(null) }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Sparkles size={19} /></span><span>LOUF<span>HUB</span></span><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X /></button></div>
      <div className="side-label">DISCOVER</div>
      <nav className="side-nav">
        {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-link ${page === label ? 'active' : ''}`} onClick={() => changePage(label)}><Icon size={18} /><span>{label}</span>{label === 'Football' && <span className="nav-live-dot" />}</button>)}
      </nav>
      <div className="side-label side-label-spaced">YOUR SPACE</div>
      <button className="nav-link" onClick={() => changePage('My Library')}><Flame size={18} /><span>Trending picks</span></button>
      <button className="nav-link" onClick={() => changePage('My Library')}><Settings size={18} /><span>Preferences</span></button>
      <div className="sidebar-bottom"><div className="premium-card"><div className="premium-icon"><ShieldCheck size={18} /></div><strong>Your hub, your vibe.</strong><p>One place for everything you love.</p><button onClick={() => changePage('My Library')}>Explore your library <ArrowRight size={14} /></button></div><div className="profile-row"><div className="avatar">L</div><div><strong>Guest explorer</strong><span>Welcome to LOUFHUB</span></div><ChevronDown size={15} /></div></div>
    </aside>

    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu /></button>
        <div className="breadcrumb"><span>LOUFHUB</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
        <form className="search-box" onSubmit={submitSearch}><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies, music, teams..." /><kbd>↵</kbd></form>
        <button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>
        <div className="top-avatar">L</div>
      </header>

      <div className="content-wrap">
        {searchError && <div className="notice notice-warning">{searchError}</div>}
        {results && <section className="search-results panel"><div className="section-heading"><div><span className="eyebrow">YOUR SEARCH</span><h2>Results for “{results.query || query}”</h2></div><button className="text-button" onClick={() => setResults(null)}>Clear <X size={14} /></button></div><p className="muted">{results.movies_and_people?.length || 0} movie and people matches from TMDB. Music and football search need their providers connected.</p><div className="search-result-list">{(results.movies_and_people || []).slice(0, 10).map((item: any) => <button key={`${item.id}-${item.media_type || 'item'}`} onClick={() => { const found = movies.find(m => m.id === item.id); if (found) setSelectedMovie(found) }}><span className="result-icon"><Film size={16} /></span><span>{item.title || item.name}</span><ArrowRight size={15} /></button>)}</div></section>}

        {(page === 'Home' || page === 'Movies') && <>
          {page === 'Home' && <section className="hero" style={featured?.backdrop_path ? { backgroundImage: `linear-gradient(90deg, rgba(13,12,22,.98) 0%, rgba(13,12,22,.82) 48%, rgba(13,12,22,.2) 100%), linear-gradient(0deg, #0d0c16 0%, transparent 50%), url(${backdrop(featured.backdrop_path)})` } : undefined}>
            <div className="hero-glow" /><div className="hero-content"><div className="hero-kicker"><span className="live-pip" /> YOUR ENTERTAINMENT UNIVERSE</div><h1>Every story.<br />Every <span>sound.</span><br />Every game.</h1><p>Discover your next favourite film, find your soundtrack and stay close to the game — all in one hub.</p><div className="hero-actions"><button className="primary-button" onClick={() => changePage('Movies')}><Compass size={17} /> Explore now</button><button className="secondary-button" onClick={() => changePage('Football')}><Trophy size={16} /> Football center</button></div><div className="hero-tags"><span><Film size={13} /> MOVIES</span><span><Music2 size={13} /> MUSIC</span><span><Activity size={13} /> SPORTS</span></div></div>
            <div className="hero-stamp"><span>THE</span><strong>HUB</strong><small>OF WHAT YOU LOVE</small></div>
          </section>}

          {page === 'Movies' && <div className="page-intro"><span className="eyebrow">THE BIG SCREEN, YOUR WAY</span><h1>Movie <span>discovery</span></h1><p>Find something unforgettable to watch next.</p></div>}
          <section className="section-block"><div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>{page === 'Movies' ? 'Popular right now' : 'Popular movies'}</h2></div><button className="text-button" onClick={() => changePage('Movies')}>View all <ArrowRight size={15} /></button></div>
            {loadingMovies ? <div className="movie-grid">{Array.from({ length: 8 }).map((_, i) => <div className="skeleton-poster" key={i} />)}</div> : visibleMovies.length ? <div className="movie-grid">{visibleMovies.map(movie => <button className="movie-card" key={movie.id} onClick={() => setSelectedMovie(movie)}><div className="poster-wrap">{movie.poster_path ? <img src={poster(movie.poster_path)} alt={`${movie.title || movie.name} poster`} loading="lazy" /> : <div className="poster-placeholder"><Film size={28} /></div>}<span className="poster-play"><Play size={17} fill="currentColor" /></span>{movie.vote_average ? <span className="rating">★ {movie.vote_average.toFixed(1)}</span> : null}</div><strong>{movie.title || movie.name || 'Untitled'}</strong><span>{movie.release_date?.slice(0, 4) || 'Release date TBA'}</span></button>)}</div> : <div className="empty-state"><Clapperboard size={28} /><strong>Movie catalogue waiting to connect</strong><p>{movieError || 'Start the backend and connect TMDB to load popular movies.'}</p></div>}
            {movieError && !movies.length && <p className="setup-hint">{movieError}</p>}
          </section>
          {page === 'Home' && <section className="section-block quick-discover"><div className="section-heading"><div><span className="eyebrow">PICK YOUR MOOD</span><h2>Explore the hub</h2></div></div><div className="discover-grid"><button className="discover-card discover-music" onClick={() => changePage('Music')}><div><Music2 size={21} /><span>LISTEN & DISCOVER</span><strong>Find your<br />next sound.</strong><em>Explore music <ArrowRight size={14} /></em></div><Disc3 className="discover-art" size={125} /></button><button className="discover-card discover-sports" onClick={() => changePage('Football')}><div><Trophy size={21} /><span>FOLLOW THE GAME</span><strong>Feel every<br />moment.</strong><em>Open football <ArrowRight size={14} /></em></div><Activity className="discover-art" size={125} /></button></div></section>}
        </>}

        {page === 'Music' && <section className="page-section"><div className="page-intro"><span className="eyebrow">SOUNDTRACK YOUR DAY</span><h1>Music <span>discovery</span></h1><p>Explore artists, albums and tracks. Playback will activate when a licensed music provider is connected.</p></div><div className="section-heading"><div><span className="eyebrow">A PLACE TO START</span><h2>Featured tracks</h2></div><span className="provider-pill"><span /> PROVIDER NOT CONNECTED</span></div><div className="music-list">{musicSamples.map((track, i) => <div className="music-row" key={track.title}><span className="track-number">0{i + 1}</span><div className={`album-art bg-gradient-to-br ${track.color}`}><Music2 size={22} /></div><div className="track-meta"><strong>{track.title}</strong><span>{track.artist} · {track.kind}</span></div><span className="track-source">Sample suggestion</span><button className="play-track" onClick={() => setPlayingTrack(track.title)} aria-label={`Select ${track.title}`}><Play size={16} fill="currentColor" /></button></div>)}</div><div className="notice"><ShieldCheck size={18} /><span><strong>Licensed listening:</strong> these are discovery examples only. Connect a music service that grants playback rights before enabling full tracks or downloads.</span></div>{playingTrack && <div className="mini-player"><div className="mini-player-icon"><Music2 size={18} /></div><div><strong>{playingTrack}</strong><span>Preview selection · playback provider not connected</span></div><button onClick={() => setPlayingTrack(null)} aria-label="Close player"><X size={17} /></button></div>}</section>}

        {page === 'Football' && <section className="page-section"><div className="page-intro"><span className="eyebrow">THE BEAUTIFUL GAME</span><h1>Football <span>center</span></h1><p>Fixtures, results, standings and match information in one place.</p></div><div className="football-banner"><div><span className="eyebrow">MATCHDAY TRACKER</span><h2>Stay in the game.</h2><p>{sports?.message || 'Connect a football data provider to show live match information.'}</p></div><div className="football-ball"><Trophy size={46} /></div></div><div className="section-heading"><div><span className="eyebrow">MATCH CENTER</span><h2>Fixture examples</h2></div><span className="provider-pill"><span /> LIVE DATA NOT CONNECTED</span></div><div className="match-list">{sampleMatches.map((match, i) => <div className="match-row" key={match.league}><div className="match-league">{match.league}<span>{match.time}</span></div><div className="team-name">{match.home}</div><div className="match-score">{match.score}</div><div className="team-name team-away">{match.away}</div><span className="match-status">{match.status}</span></div>)}</div><div className="notice"><Radio size={18} /><span>Live scores are data feeds. Watching live match broadcasts requires a separate authorized broadcaster or streaming provider.</span></div></section>}

        {page === 'My Library' && <section className="page-section"><div className="page-intro"><span className="eyebrow">YOUR PERSONAL SPACE</span><h1>My <span>library</span></h1><p>Your saved films, favourite tracks and followed teams will live here.</p></div><div className="library-empty"><div className="library-orbit"><ListMusic size={34} /></div><h2>Your collection starts here</h2><p>Explore LOUFHUB and build a personal collection as library features are connected.</p><button className="primary-button" onClick={() => changePage('Home')}>Discover something <ArrowRight size={16} /></button></div></section>}

        <footer className="footer"><span>© 2026 LOUFHUB</span><span>MADE FOR WHAT YOU LOVE <Sparkles size={12} /></span></footer>
      </div>
    </main>

    {selectedMovie && <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}><section className="movie-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedMovie(null)} aria-label="Close details"><X /></button>{selectedMovie.backdrop_path && <img className="modal-backdrop-image" src={backdrop(selectedMovie.backdrop_path)} alt="" />}<div className="modal-body"><span className="eyebrow">MOVIE DETAILS</span><h2>{selectedMovie.title || selectedMovie.name}</h2><p className="modal-meta">{selectedMovie.release_date || 'Release date unavailable'} {selectedMovie.vote_average ? ` · ★ ${selectedMovie.vote_average.toFixed(1)}/10` : ''}</p><p>{selectedMovie.overview || 'No synopsis is available for this title.'}</p><div className="notice"><ShieldCheck size={17} /><span>LOUFHUB displays movie information. Streaming availability depends on authorized services in your region.</span></div></div></section></div>}
  </div>
}
