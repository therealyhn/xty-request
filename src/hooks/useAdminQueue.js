import { useCallback, useEffect, useState } from 'react';
import { fetchRequests, updateRequestStatus } from '../lib/api/admin.js';

export function useAdminQueue({ username, password, status }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSuccess, setLastSuccess] = useState(false);

  const canFetch = Boolean(username && password);

  const load = useCallback(async () => {
    if (!canFetch) return;
    setIsLoading(true);
    setError(null);
    setLastSuccess(false);
    try {
      const data = await fetchRequests({
        username,
        password,
        status: status && status !== 'all' ? status : '',
      });
      setItems(data);
      setLastSuccess(true);
    } catch (err) {
      setError(err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [username, password, status, canFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(
    async (id, nextStatus) => {
      if (!canFetch) return;
      await updateRequestStatus({ username, password, id, status: nextStatus });
      await load();
    },
    [username, password, canFetch, load]
  );

  return { items, isLoading, error, lastSuccess, reload: load, updateStatus };
}
