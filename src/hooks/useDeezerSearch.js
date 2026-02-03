import { useEffect, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue.js';
import { searchDeezer } from '../lib/api/deezer.js';

export function useDeezerSearch(query, options = {}) {
  const minLength = Number.isInteger(options.minLength) ? options.minLength : 2;
  const limit = Number.isInteger(options.limit) ? options.limit : 10;
  const debounceMs = Number.isInteger(options.debounceMs) ? options.debounceMs : 500;

  const debouncedQuery = useDebouncedValue(query, debounceMs);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < minLength) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    searchDeezer(trimmed, { limit, signal: controller.signal })
      .then((items) => {
        setResults(items);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setResults([]);
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, minLength, limit]);

  return { results, isLoading, error };
}
