import { Search, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { AnimalType, ReportStatus, FilterState, SortOption } from '../../../models';
import './ReportFilters.css';

interface ReportFiltersProps {
  filters: FilterState;
  onAnimalTypeChange: (type: AnimalType | 'all') => void;
  onStatusChange: (status: ReportStatus | 'all') => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  onClear: () => void;
  isFiltering: boolean;
}

const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.NewestFirst]: 'Newest first',
  [SortOption.OldestFirst]: 'Oldest first',
  [SortOption.NameAsc]: 'Pet name A–Z',
  [SortOption.NameDesc]: 'Pet name Z–A',
  [SortOption.LostFirst]: 'Lost first',
  [SortOption.FoundFirst]: 'Found first',
};

function ReportFilters({
  filters,
  onAnimalTypeChange,
  onStatusChange,
  onSearchChange,
  onSortChange,
  onClear,
  isFiltering,
}: ReportFiltersProps) {
  return (
    <div className="report-filters">
      <div className="filter-search">
        <Search size={17} className="filter-search__icon" aria-hidden="true" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, description, contact, or address…"
          aria-label="Search reports"
        />
        {filters.search && (
          <button
            type="button"
            className="filter-search__clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="animal-type-filter">
            <SlidersHorizontal size={13} aria-hidden="true" /> Type
          </label>
          <select
            id="animal-type-filter"
            value={filters.animalType}
            onChange={(e) => onAnimalTypeChange(e.target.value as AnimalType | 'all')}
          >
            <option value="all">All Types</option>
            {Object.values(AnimalType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">
            <SlidersHorizontal size={13} aria-hidden="true" /> Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value as ReportStatus | 'all')}
          >
            <option value="all">All</option>
            <option value={ReportStatus.Lost}>Lost</option>
            <option value={ReportStatus.Found}>Found</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">
            <ArrowUpDown size={13} aria-hidden="true" /> Sort
          </label>
          <select
            id="sort-filter"
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            {Object.values(SortOption).map((opt) => (
              <option key={opt} value={opt}>
                {SORT_LABELS[opt]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-ghost filter-clear"
          onClick={onClear}
          disabled={!isFiltering}
        >
          <X size={16} /> Clear
        </button>
      </div>
    </div>
  );
}

export default ReportFilters;
