import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Wishlist from "./pages/Wishlist";

const THEME_KEY = "cinereview.theme.v1";

function getStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);

    return value === "light" ||
    value === "dark" ||
    value === "auto"
        ? value
        : "auto";
  } catch {
    return "auto";
  }
}

function getResolvedTheme(preference) {
  if (preference !== "auto") {
    return preference;
  }

  return window.matchMedia(
      "(prefers-color-scheme: dark)"
  ).matches
      ? "dark"
      : "light";
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [q, setQ] = useState("");
  const [theme, setTheme] = useState(getStoredTheme);

  /*
   * Keep the header search input synchronized
   * with the URL.
   *
   * Example:
   * /?search=Inception
   *
   * Header will automatically show:
   * Inception
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search") || "";

    setQ(searchTerm);
  }, [location.search]);

  /*
   * Theme handling
   */
  useEffect(() => {
    const media = window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

    const applyTheme = () => {
      const resolved = getResolvedTheme(theme);

      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };

    applyTheme();

    if (theme === "auto") {
      media.addEventListener?.("change", applyTheme);

      return () => {
        media.removeEventListener?.("change", applyTheme);
      };
    }
  }, [theme]);

  /*
   * Persist theme preference
   */
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Theme still works if storage is unavailable.
    }
  }, [theme]);

  /*
   * MAIN SEARCH HANDLER
   *
   * Instead of dispatching a CustomEvent,
   * put the search term directly into the URL.
   *
   * This works from:
   * - Home
   * - Movie Details
   * - Wishlist
   *
   * Example:
   * /?search=Inception
   */
  function search(e) {
    e.preventDefault();

    const searchTerm = q.trim();

    if (!searchTerm) {
      navigate("/", { replace: false });
      return;
    }

    navigate(
        `/?search=${encodeURIComponent(searchTerm)}`
    );
  }

  return (
      <div className="app-shell">

        <Header
            query={q}
            setQuery={setQ}
            onSearch={search}
            theme={theme}
            setTheme={setTheme}
        />

        <Routes>

          {/* HOME */}
          <Route
              path="/"
              element={
                <Home
                    query={q}
                    setQuery={setQ}
                />
              }
          />

          {/* MOVIE DETAILS */}
          <Route
              path="/movie/:id"
              element={<MovieDetails />}
          />

          {/* WISHLIST */}
          <Route
              path="/wishlist"
              element={<Wishlist />}
          />

          {/* FALLBACK */}
          <Route
              path="*"
              element={
                <Home
                    query={q}
                    setQuery={setQ}
                />
              }
          />

        </Routes>

        <footer className="mx-auto mt-10 max-w-7xl border-t border-white/6 px-4 py-7 text-center text-xs text-slate-600">
          CineReview • TMDB + OMDb • Trailer intentionally removed
        </footer>

      </div>
  );
}

export default function App() {
  return <AppContent />;
}