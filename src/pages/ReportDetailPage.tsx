import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  PawPrint,
  FileText,
  Phone,
  MapPin,
  Navigation,
  Calendar,
  CheckCircle2,
  Lock,
  SearchX,
} from 'lucide-react';
import { AnimalReport, ReportStatus } from '../models';
import { fetchReports, saveReports } from '../services/jsonBinService';
import { formatDate } from '../utils/formatDate';

/* code for report detail page below: */
function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AnimalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const [showMarkFound, setShowMarkFound] = useState(false);
  const [password, setPassword] = useState('');
  const [markError, setMarkError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [markSuccess, setMarkSuccess] = useState(false);

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reports = await fetchReports();
      const found = reports.find((r) => r.id === id);
      if (!found) {
        setError('Report not found');
      } else {
        setReport(found);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load report';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleMarkAsFound = async () => {
    if (!report) return;
    setMarkError(null);

    if (!password.trim()) {
      setMarkError('Please enter the password');
      return;
    }

    if (password !== report.password) {
      setMarkError('Incorrect password');
      return;
    }

    try {
      setMarking(true);
      const allReports = await fetchReports();
      const updated = allReports.map((r) =>
        r.id === report.id ? { ...r, status: ReportStatus.Found } : r
      );
      await saveReports(updated);

      setReport({ ...report, status: ReportStatus.Found });
      setMarkSuccess(true);
      setShowMarkFound(false);
      setPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update report';
      setMarkError(message);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-card">
          <div className="spinner" />
          <p className="state-card__text">Loading report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="page-container">
        <div className="state-card">
          <div className="state-card__icon">
            <SearchX size={30} />
          </div>
          <h2 className="state-card__title">{error || 'Report not found'}</h2>
          <p className="state-card__text">
            The report you’re looking for may have been removed or the link is incorrect.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isLost = report.status === ReportStatus.Lost;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} /> Back to all reports
      </Link>

      <motion.div
        className="detail-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="detail-image-section">
          {report.photoUrl && !imgError ? (
            <img
              src={report.photoUrl}
              alt={report.animalName}
              className="detail-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="detail-image" style={{ display: 'grid', placeItems: 'center' }}>
              <PawPrint size={64} color="var(--color-border-strong)" />
            </div>
          )}
          <div className="detail-status-float">
            <span className={`status-badge-large ${report.status}`}>
              {isLost ? 'Lost' : 'Found'}
            </span>
          </div>
        </div>

        <div className="detail-info-section">
          <div className="detail-header">
            <h1 className="detail-name">{report.animalName}</h1>
            <span className="detail-type-chip">
              <PawPrint size={14} /> {report.animalType}
            </span>
          </div>

          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-field__icon">
                <FileText size={18} />
              </span>
              <div className="detail-field__body">
                <span className="field-label">Description</span>
                <span className="field-value">{report.description}</span>
              </div>
            </div>
            <div className="detail-field">
              <span className="detail-field__icon">
                <Phone size={18} />
              </span>
              <div className="detail-field__body">
                <span className="field-label">Contact Info</span>
                <span className="field-value">{report.contactInfo}</span>
              </div>
            </div>
            <div className="detail-field">
              <span className="detail-field__icon">
                <MapPin size={18} />
              </span>
              <div className="detail-field__body">
                <span className="field-label">Last Seen Address</span>
                <span className="field-value">{report.lastSeenAddress}</span>
              </div>
            </div>
            <div className="detail-field">
              <span className="detail-field__icon">
                <Navigation size={18} />
              </span>
              <div className="detail-field__body">
                <span className="field-label">Coordinates</span>
                <span className="field-value">
                  {report.lastSeenLat.toFixed(5)}, {report.lastSeenLng.toFixed(5)}
                </span>
              </div>
            </div>
            <div className="detail-field">
              <span className="detail-field__icon">
                <Calendar size={18} />
              </span>
              <div className="detail-field__body">
                <span className="field-label">Date Posted</span>
                <span className="field-value">{formatDate(report.datePosted)}</span>
              </div>
            </div>
          </div>

          {markSuccess && (
            <div className="success-message">
              <CheckCircle2 size={18} />
              This animal has been marked as found!
            </div>
          )}

          {report.status === ReportStatus.Lost && !markSuccess && (
            <div className="mark-found-section">
              {!showMarkFound ? (
                <button className="btn btn-accent" onClick={() => setShowMarkFound(true)}>
                  <CheckCircle2 size={18} /> Mark as Found
                </button>
              ) : (
                <div className="mark-found-form">
                  <p>
                    <Lock size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                    Enter the password you used when creating this report:
                  </p>
                  <div className="mark-found-input-row">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      aria-label="Report password"
                    />
                    <button className="btn btn-accent" onClick={handleMarkAsFound} disabled={marking}>
                      {marking ? 'Updating...' : 'Confirm'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowMarkFound(false);
                        setPassword('');
                        setMarkError(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  {markError && <p className="inline-error">{markError}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ReportDetailPage;
