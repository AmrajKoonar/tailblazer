import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { PawPrint, MapPin, ShieldCheck, Search, ArrowRight, PlusCircle, SearchX } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { useReportFilters } from '../hooks/useReportFilters';
import { ReportStatus } from '../models';
import { ReportsMap, ReportFilters, ReportCard } from '../components/Main';
import './HomePage.css';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* code for home page below: */
function HomePage() {
  const { reports, loading, error } = useReports();
  const { filters, setAnimalTypeFilter, setStatusFilter, filteredReports } =
    useReportFilters(reports);

  const lostCount = reports.filter((r) => r.status === ReportStatus.Lost).length;
  const foundCount = reports.filter((r) => r.status === ReportStatus.Found).length;
  const featured = reports[0] ?? null;

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-card">
          <div className="spinner" />
          <p className="state-card__text">Loading lost animal reports…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="state-card">
          <div className="state-card__icon">
            <SearchX size={30} />
          </div>
          <h2 className="state-card__title">Something went wrong</h2>
          <p className="state-card__text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="hero-badge">
              <PawPrint size={15} /> Community lost & found for pets
            </span>
            <h1 className="hero-title">
              Help lost pets find <span className="accent">their way home.</span>
            </h1>
            <p className="hero-subtitle">
              Report, track, and resolve lost animal sightings in your community. Pin the last
              seen location on the map, add a photo, and reunite pets with the people who love them.
            </p>
            <div className="hero-actions">
              <Link to="/submit" className="btn btn-primary btn-lg">
                <PlusCircle size={19} /> Report a Lost Pet
              </Link>
              <a href="#browse" className="btn btn-secondary btn-lg">
                <Search size={19} /> Browse Reports
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat__value">{reports.length}</span>
                <span className="hero-stat__label">Total reports</span>
              </div>
              <div className="hero-stat hero-stat--lost">
                <span className="hero-stat__value">{lostCount}</span>
                <span className="hero-stat__label">Currently lost</span>
              </div>
              <div className="hero-stat hero-stat--found">
                <span className="hero-stat__value">{foundCount}</span>
                <span className="hero-stat__label">Reunited</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="hero-visual-card">
              {featured ? (
                <>
                  <img
                    src={featured.photoUrl}
                    alt={featured.animalName}
                    className="hero-visual-img"
                  />
                  <div className="hero-visual-caption">
                    <span className="dot" />
                    Latest report: {featured.animalName} · {featured.animalType}
                  </div>
                </>
              ) : (
                <div
                  className="hero-visual-img"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--gradient-hero), var(--color-bg-soft)',
                  }}
                >
                  <PawPrint size={64} color="var(--color-primary)" />
                </div>
              )}
              <ul className="hero-feature-list">
                <li>
                  <MapPin size={18} /> Precise last-seen locations on an interactive map
                </li>
                <li>
                  <ShieldCheck size={18} /> Password-protected “mark as found” updates
                </li>
                <li>
                  <Search size={18} /> Filter reports by animal type and status
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="map-section" aria-label="Lost animals map">
        <div className="section-header" style={{ marginTop: 0 }}>
          <div>
            <span className="section-eyebrow">
              <MapPin size={15} /> Sightings map
            </span>
            <h2 className="section-title">Lost animals near you</h2>
            <p className="section-subtitle">
              Each marker is a currently lost pet. Click a marker to view details.
            </p>
          </div>
        </div>
        <ReportsMap reports={reports} />
      </section>

      {/* Browse */}
      <section className="browse-section" id="browse" aria-label="Browse reports">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              <Search size={15} /> Browse reports
            </span>
            <h2 className="section-title">All reports</h2>
            <p className="section-subtitle">
              Showing {filteredReports.length} of {reports.length} reports.
            </p>
          </div>
          <ReportFilters
            filters={filters}
            onAnimalTypeChange={setAnimalTypeFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <SearchX size={28} />
            </div>
            <h3>No reports match your filters</h3>
            <p>Try adjusting the animal type or status filters to see more results.</p>
          </div>
        ) : (
          <motion.div
            className="reports-grid"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
          >
            {filteredReports.map((report) => (
              <motion.div key={report.id} variants={item}>
                <ReportCard report={report} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
          <Link to="/submit" className="btn btn-accent btn-lg">
            Report a lost pet <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;
