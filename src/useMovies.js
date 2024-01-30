import { useState, useEffect } from "react";

const KEY = "8ee8a3e7";

////////////////////////////////////////////
// Creating our First Custom Hook: useMovies
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  /////////////////////////
  // Adding a Loading State
  const [isLoading, setIsLoading] = useState(false);
  //////////////////
  // Handling Errors
  const [error, setError] = useState("");

  //////////////////////////
  // Using an async Function
  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      ////////////////////////////
      // Cleaning Up Data Fetching
      return function () {
        controller.abort();
      };
    },
    ///////////////////////////////////////
    // Syncronizing Queries With Movie Data
    [query]
  );

  return { movies, isLoading, error };
}
