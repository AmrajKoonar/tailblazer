import { Link } from 'react-router-dom';
import { AnimalReport, ReportStatus } from '../../../models';
import { formatDate } from '../../../utils/formatDate';
import './ReportCard.css';

interface ReportCardProps {
  report: AnimalReport;
}

function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="report-card">
      <div className="report-card-image">
        <img src={report.photoUrl} alt={report.animalName} />
        <span className={`status-badge ${report.status}`}>
          {report.status === ReportStatus.Lost ? 'Lost' : 'Found'}
        </span>
      </div>
      <div className="report-card-body">
        <h3 className="report-card-name">{report.animalName}</h3>
        <p className="report-card-type">{report.animalType}</p>
        <p className="report-card-address">{report.lastSeenAddress}</p>
        <p className="report-card-date">{formatDate(report.datePosted)}</p>
        <Link to={`/reports/${report.id}`} className="report-card-link">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ReportCard;
