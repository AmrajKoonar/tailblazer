import { useState, useEffect, useCallback } from 'react';
import { AnimalReport } from '../models';
import { fetchReports } from '../services/jsonBinService';

interface UseReportsReturn {
  reports: AnimalReport[];
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReports();
      setReports(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reports';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return { reports, loading, error, refreshReports: loadReports };
}
