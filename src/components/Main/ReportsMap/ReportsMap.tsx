import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { AnimalReport, ReportStatus } from '../../../models';
import './ReportsMap.css';

interface ReportsMapProps {
  reports: AnimalReport[];
}

function ReportsMap({ reports }: ReportsMapProps) {
  const lostReports = reports.filter((r) => r.status === ReportStatus.Lost);

  return (
    <div className="reports-map-wrapper">
      <MapContainer
        center={[49.2827, -123.1207]}
        zoom={11}
        className="reports-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lostReports.map((report) => (
          <Marker key={report.id} position={[report.lastSeenLat, report.lastSeenLng]}>
            <Popup>
              <div className="map-popup">
                <img
                  src={report.photoUrl}
                  alt={report.animalName}
                  className="popup-image"
                />
                <div className="popup-info">
                  <span className="popup-name">{report.animalName}</span>
                  <span className="popup-type">{report.animalType}</span>
                </div>
                <Link to={`/reports/${report.id}`} className="popup-link">
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ReportsMap;
