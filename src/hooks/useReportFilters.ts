import { useState, useMemo } from 'react';
import { AnimalReport, AnimalType, ReportStatus, FilterState, SortOption } from '../models';

interface UseReportFiltersReturn {
  filters: FilterState;
  setAnimalTypeFilter: (type: AnimalType | 'all') => void;
  setStatusFilter: (status: ReportStatus | 'all') => void;
  setSearch: (search: string) => void;
  setSort: (sort: SortOption) => void;
  clearFilters: () => void;
  isFiltering: boolean;
  filteredReports: AnimalReport[];
}

const DEFAULT_FILTERS: FilterState = {
  animalType: 'all',
  status: 'all',
  search: '',
  sort: SortOption.NewestFirst,
};

function sortReports(reports: AnimalReport[], sort: SortOption): AnimalReport[] {
  const copy = [...reports];
  switch (sort) {
    case SortOption.OldestFirst:
      return copy.sort(
        (a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
      );
    case SortOption.NameAsc:
      return copy.sort((a, b) => a.animalName.localeCompare(b.animalName));
    case SortOption.NameDesc:
      return copy.sort((a, b) => b.animalName.localeCompare(a.animalName));
    case SortOption.LostFirst:
      return copy.sort((a, b) => Number(b.status === ReportStatus.Lost) - Number(a.status === ReportStatus.Lost));
    case SortOption.FoundFirst:
      return copy.sort((a, b) => Number(b.status === ReportStatus.Found) - Number(a.status === ReportStatus.Found));
    case SortOption.NewestFirst:
    default:
      return copy.sort(
        (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      );
  }
}

export function useReportFilters(reports: AnimalReport[]): UseReportFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredReports = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const matched = reports.filter((report) => {
      if (filters.animalType !== 'all' && report.animalType !== filters.animalType) {
        return false;
      }
      if (filters.status !== 'all' && report.status !== filters.status) {
        return false;
      }
      if (query) {
        const haystack = [
          report.animalName,
          report.description,
          report.contactInfo,
          report.animalType,
          report.lastSeenAddress,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });

    return sortReports(matched, filters.sort);
  }, [reports, filters]);

  const setAnimalTypeFilter = (type: AnimalType | 'all') => {
    setFilters((prev) => ({ ...prev, animalType: type }));
  };

  const setStatusFilter = (status: ReportStatus | 'all') => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const setSort = (sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const isFiltering =
    filters.animalType !== 'all' ||
    filters.status !== 'all' ||
    filters.search.trim() !== '' ||
    filters.sort !== SortOption.NewestFirst;

  return {
    filters,
    setAnimalTypeFilter,
    setStatusFilter,
    setSearch,
    setSort,
    clearFilters,
    isFiltering,
    filteredReports,
  };
}
