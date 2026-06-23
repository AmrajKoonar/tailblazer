import { useState, FormEvent } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { AnimalType, ReportFormData } from '../models';
import { useSubmitReport } from '../hooks/useSubmitReport';
import { useGeocoding } from '../hooks/useGeocoding';

function MapClickHandler({ onMapClick }: { onMapClick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
}

const INITIAL_FORM: ReportFormData = {
  animalName: '',
  animalType: AnimalType.Dog,
  description: '',
  contactInfo: '',
  photo: null,
  lastSeenLat: null,
  lastSeenLng: null,
  lastSeenAddress: '',
  password: '',
};

function SubmitReportPage() {
  const [form, setForm] = useState<ReportFormData>(INITIAL_FORM);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitReport, submitting, error, success, resetStatus } = useSubmitReport();
  const { address, loading: geocodingLoading, geocode } = useGeocoding();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
  };

  const handleMapClick = async (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setForm((prev) => ({
      ...prev,
      lastSeenLat: lat,
      lastSeenLng: lng,
    }));
    await geocode(lat, lng);
  };

  // Keep form address in sync with geocoding result
  const currentAddress = address || form.lastSeenAddress;

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!form.animalName.trim()) errors.push('Animal name is required');
    if (!form.description.trim()) errors.push('Description is required');
    if (!form.contactInfo.trim()) errors.push('Contact information is required');
    if (!form.photo) errors.push('Photo upload is required');
    if (form.lastSeenLat === null || form.lastSeenLng === null) {
      errors.push('Please click the map to select a last seen location. This is required.');
    }
    if (!form.password.trim()) errors.push('Password is required');
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetStatus();

    const errors = validate();
    setValidationErrors(errors);
    if (errors.length > 0) return;

    await submitReport({
      ...form,
      lastSeenAddress: currentAddress,
    });
  };

  if (success) {
    return (
      <div className="page-container">
        <div className="success-card">
          <h2>Report Submitted!</h2>
          <p>Your lost animal report has been saved successfully.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setForm(INITIAL_FORM);
              setValidationErrors([]);
              resetStatus();
            }}
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Submit a Lost Animal Report</h1>

      {validationErrors.length > 0 && (
        <div className="error-message">
          <ul>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form className="submit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="animalName">Animal Name *</label>
          <input
            id="animalName"
            name="animalName"
            type="text"
            value={form.animalName}
            onChange={handleChange}
            placeholder="e.g. Buddy"
          />
        </div>

        <div className="form-group">
          <label htmlFor="animalType">Animal Type *</label>
          <select
            id="animalType"
            name="animalType"
            value={form.animalType}
            onChange={handleChange}
          >
            {Object.values(AnimalType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="photo">Photo *</label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the animal, any distinctive features, circumstances of going missing..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">Contact Information *</label>
          <input
            id="contactInfo"
            name="contactInfo"
            type="text"
            value={form.contactInfo}
            onChange={handleChange}
            placeholder="e.g. email or phone number"
          />
        </div>

        <div className="form-group">
          <label>Last Seen Location * (click the map)</label>
          <div className="map-picker-wrapper">
            <MapContainer
              center={[49.2827, -123.1207]}
              zoom={11}
              className="map-picker"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onMapClick={handleMapClick} />
              {form.lastSeenLat !== null && form.lastSeenLng !== null && (
                <Marker position={[form.lastSeenLat, form.lastSeenLng]} />
              )}
            </MapContainer>
          </div>
          {form.lastSeenLat !== null && form.lastSeenLng !== null && (
            <p className="location-info">
              <strong>Coordinates:</strong> {form.lastSeenLat.toFixed(5)}, {form.lastSeenLng.toFixed(5)}
              <br />
              <strong>Address:</strong>{' '}
              {geocodingLoading ? 'Looking up address...' : currentAddress || 'Click map to select'}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password * (needed to mark as found later)</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Choose a password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

export default SubmitReportPage;
