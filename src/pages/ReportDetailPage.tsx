import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimalReport, ReportStatus } from '../models';
import { fetchReports, saveReports } from '../services/jsonBinService';
import { formatDate } from '../utils/formatDate';

/* code for report detail page below: */
function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AnimalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="loading-message">Loading report...</div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="page-container">
        <div className="error-message">{error || 'Report not found'}</div>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">&larr; Back to all reports</Link>

      <div className="detail-card">
        <div className="detail-image-section">
          <img src={report.photoUrl} alt={report.animalName} className="detail-image" />
        </div>

        <div className="detail-info-section">
          <div className="detail-header">
            <h1 className="detail-name">{report.animalName}</h1>
            <span className={`status-badge-large ${report.status}`}>
              {report.status === ReportStatus.Lost ? 'Lost' : 'Found'}
            </span>
          </div>

          <div className="detail-fields">
            <div className="detail-field">
              <span className="field-label">Animal Type</span>
              <span className="field-value">{report.animalType}</span>
            </div>
            <div className="detail-field">
              <span className="field-label">Description</span>
              <span className="field-value">{report.description}</span>
            </div>
            <div className="detail-field">
              <span className="field-label">Contact Info</span>
              <span className="field-value">{report.contactInfo}</span>
            </div>
            <div className="detail-field">
              <span className="field-label">Last Seen Address</span>
              <span className="field-value">{report.lastSeenAddress}</span>
            </div>
            <div className="detail-field">
              <span className="field-label">Coordinates</span>
              <span className="field-value">
                {report.lastSeenLat.toFixed(5)}, {report.lastSeenLng.toFixed(5)}
              </span>
            </div>
            <div className="detail-field">
              <span className="field-label">Date Posted</span>
              <span className="field-value">{formatDate(report.datePosted)}</span>
            </div>
            <div className="detail-field">
              <span className="field-label">Status</span>
              <span className="field-value">{report.status === ReportStatus.Lost ? 'Lost' : 'Found'}</span>
            </div>
          </div>

          {markSuccess && (
            <div className="success-message">
              This animal has been marked as found!
            </div>
          )}

          {report.status === ReportStatus.Lost && !markSuccess && (
            <div className="mark-found-section">
              {!showMarkFound ? (
                <button
                  className="btn btn-accent"
                  onClick={() => setShowMarkFound(true)}
                >
                  Mark as Found
                </button>
              ) : (
                <div className="mark-found-form">
                  <p>Enter the password you used when creating this report:</p>
                  <div className="mark-found-input-row">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                    <button
                      className="btn btn-accent"
                      onClick={handleMarkAsFound}
                      disabled={marking}
                    >
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
      </div>
    </div>
  );
}

export default ReportDetailPage;
