import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, PawPrint, ArrowRight } from 'lucide-react';
import { AnimalReport, ReportStatus } from '../../../models';
import { formatDate } from '../../../utils/formatDate';
import './ReportCard.css';

interface ReportCardProps {
  report: AnimalReport;
}

function ReportCard({ report }: ReportCardProps) {
  const [imgError, setImgError] = useState(false);
  const isLost = report.status === ReportStatus.Lost;

  return (
    <motion.article
      className="report-card"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Link to={`/reports/${report.id}`} className="report-card-media-link" aria-label={`View ${report.animalName}`}>
        <div className="report-card-image">
          {report.photoUrl && !imgError ? (
            <img
              src={report.photoUrl}
              alt={report.animalName}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="report-card-image-fallback" aria-hidden="true">
              <PawPrint size={40} />
            </div>
          )}
          <span className={`status-badge ${report.status}`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
        </div>
      </Link>
      <div className="report-card-body">
        <div className="report-card-heading">
          <h3 className="report-card-name">{report.animalName}</h3>
          <span className="report-card-type">
            <PawPrint size={13} aria-hidden="true" /> {report.animalType}
          </span>
        </div>

        <p className="report-card-description">{report.description}</p>

        <div className="report-card-meta">
          <span className="report-card-meta-item">
            <MapPin size={14} aria-hidden="true" />
            <span className="truncate">{report.lastSeenAddress || 'Location on map'}</span>
          </span>
          <span className="report-card-meta-item">
            <Calendar size={14} aria-hidden="true" />
            {formatDate(report.datePosted)}
          </span>
        </div>

        <Link to={`/reports/${report.id}`} className="report-card-link">
          View Details <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}

export default ReportCard;
