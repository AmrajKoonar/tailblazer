import { SlidersHorizontal } from 'lucide-react';
import { AnimalType, ReportStatus, FilterState } from '../../../models';
import './ReportFilters.css';

interface ReportFiltersProps {
  filters: FilterState;
  onAnimalTypeChange: (type: AnimalType | 'all') => void;
  onStatusChange: (status: ReportStatus | 'all') => void;
}

function ReportFilters({ filters, onAnimalTypeChange, onStatusChange }: ReportFiltersProps) {
  return (
    <div className="report-filters">
      <span className="report-filters__label" aria-hidden="true">
        <SlidersHorizontal size={16} /> Filter
      </span>
      <div className="filter-group">
        <label htmlFor="animal-type-filter">Animal Type</label>
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
        <label htmlFor="status-filter">Status</label>
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
    </div>
  );
}

export default ReportFilters;
