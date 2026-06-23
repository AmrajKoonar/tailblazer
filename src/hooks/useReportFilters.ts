import { useState, useMemo } from 'react';
import { AnimalReport, AnimalType, ReportStatus, FilterState } from '../models';

interface UseReportFiltersReturn {
  filters: FilterState;
  setAnimalTypeFilter: (type: AnimalType | 'all') => void;
  setStatusFilter: (status: ReportStatus | 'all') => void;
  filteredReports: AnimalReport[];
}

export function useReportFilters(reports: AnimalReport[]): UseReportFiltersReturn {
  const [filters, setFilters] = useState<FilterState>({
    animalType: 'all',
    status: 'all',
  });

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (filters.animalType !== 'all' && report.animalType !== filters.animalType) {
        return false;
      }
      if (filters.status !== 'all' && report.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [reports, filters]);

  const setAnimalTypeFilter = (type: AnimalType | 'all') => {
    setFilters((prev) => ({ ...prev, animalType: type }));
  };

  const setStatusFilter = (status: ReportStatus | 'all') => {
    setFilters((prev) => ({ ...prev, status }));
  };

  return { filters, setAnimalTypeFilter, setStatusFilter, filteredReports };
}
