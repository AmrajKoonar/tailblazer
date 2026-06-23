import { useReports } from '../hooks/useReports';
import { useReportFilters } from '../hooks/useReportFilters';
import { ReportsMap, ReportFilters, ReportCard } from '../components/Main';

/* code for home page below: */
function HomePage() {
  const { reports, loading, error } = useReports();
  const { filters, setAnimalTypeFilter, setStatusFilter, filteredReports } =
    useReportFilters(reports);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-message">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Lost Animals Map</h1>
      <ReportsMap reports={reports} />

      <h2 className="section-title">Browse Reports</h2>
      <ReportFilters
        filters={filters}
        onAnimalTypeChange={setAnimalTypeFilter}
        onStatusChange={setStatusFilter}
      />

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <p>No reports match your filters.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
