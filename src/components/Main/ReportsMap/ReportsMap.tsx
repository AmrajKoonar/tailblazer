import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { AnimalReport, ReportStatus } from '../../../models';
import './ReportsMap.css';

interface ReportsMapProps {
  reports: AnimalReport[];
}

function ReportsMap({ reports }: ReportsMapProps) {
  const lostReports = reports.filter((r) => r.status === ReportStatus.Lost);

  return (
    <div className="reports-map-wrapper">
      <MapContainer center={[49.2827, -123.1207]} zoom={11} className="reports-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lostReports.map((report) => (
          <Marker key={report.id} position={[report.lastSeenLat, report.lastSeenLng]}>
            <Popup>
              <div className="map-popup">
                <img src={report.photoUrl} alt={report.animalName} className="popup-image" />
                <div className="popup-body">
                  <div className="popup-info">
                    <span className="popup-name">{report.animalName}</span>
                    <span className="popup-type">{report.animalType}</span>
                  </div>
                  {report.lastSeenAddress && (
                    <p className="popup-address">{report.lastSeenAddress}</p>
                  )}
                  <Link to={`/reports/${report.id}`} className="popup-link">
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="reports-map-empty" role="status">
        <MapPin size={15} />
        {lostReports.length === 0
          ? 'No lost pets on the map yet'
          : `${lostReports.length} lost ${lostReports.length === 1 ? 'pet' : 'pets'} on the map`}
      </div>
    </div>
  );
}

export default ReportsMap;
