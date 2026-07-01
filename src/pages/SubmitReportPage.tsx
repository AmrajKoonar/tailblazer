import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import {
  PawPrint,
  Upload,
  MapPin,
  Lock,
  AlertCircle,
  CheckCircle2,
  Info,
  Save,
  Trash2,
} from 'lucide-react';
import { AnimalType, ReportFormData } from '../models';
import { useSubmitReport } from '../hooks/useSubmitReport';
import { useGeocoding } from '../hooks/useGeocoding';
import { loadDraft, saveDraft, clearDraft, isDraftMeaningful, ReportDraft } from '../utils/draftStorage';

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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const draftLoadedRef = useRef(false);
  const { submitReport, submitting, error, success, resetStatus } = useSubmitReport();
  const { address, loading: geocodingLoading, geocode, setAddress } = useGeocoding();

  // Manage object URL lifecycle for the photo preview
  useEffect(() => {
    if (!form.photo) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.photo]);

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

  // Restore a saved draft once on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && isDraftMeaningful(draft)) {
      setForm((prev) => ({
        ...prev,
        animalName: draft.animalName,
        animalType: draft.animalType,
        description: draft.description,
        contactInfo: draft.contactInfo,
        lastSeenLat: draft.lastSeenLat,
        lastSeenLng: draft.lastSeenLng,
        lastSeenAddress: draft.lastSeenAddress,
        password: draft.password,
      }));
      if (draft.lastSeenAddress) setAddress(draft.lastSeenAddress);
      setHasDraft(true);
      setDraftRestored(true);
    }
    draftLoadedRef.current = true;
  }, [setAddress]);

  // Autosave the form to localStorage (debounced), excluding the photo file
  useEffect(() => {
    if (!draftLoadedRef.current || success) return;

    const draft: ReportDraft = {
      animalName: form.animalName,
      animalType: form.animalType,
      description: form.description,
      contactInfo: form.contactInfo,
      lastSeenLat: form.lastSeenLat,
      lastSeenLng: form.lastSeenLng,
      lastSeenAddress: currentAddress,
      password: form.password,
    };

    const timer = window.setTimeout(() => {
      if (isDraftMeaningful(draft)) {
        saveDraft(draft);
        setHasDraft(true);
        setDraftSaved(true);
        setDraftRestored(false);
      } else {
        clearDraft();
        setHasDraft(false);
        setDraftSaved(false);
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    form.animalName,
    form.animalType,
    form.description,
    form.contactInfo,
    form.lastSeenLat,
    form.lastSeenLng,
    form.password,
    currentAddress,
    success,
  ]);

  // Clear the stored draft once a report is successfully submitted
  useEffect(() => {
    if (success) {
      clearDraft();
      setHasDraft(false);
      setDraftSaved(false);
      setDraftRestored(false);
    }
  }, [success]);

  const handleClearDraft = () => {
    clearDraft();
    setForm(INITIAL_FORM);
    setValidationErrors([]);
    setAddress('');
    setPhotoPreview(null);
    setHasDraft(false);
    setDraftSaved(false);
    setDraftRestored(false);
  };

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
      <div className="page-container page-container--narrow">
        <motion.div
          className="success-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="success-card__icon">
            <CheckCircle2 size={40} />
          </div>
          <h2>Report Submitted!</h2>
          <p>Your lost animal report has been saved successfully and is now visible to the community.</p>
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container page-container--narrow">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="page-intro">
          <div className="page-intro__icon">
            <PawPrint size={28} />
          </div>
          <div>
            <h1 className="page-intro__title">Submit a Lost Animal Report</h1>
            <p className="page-intro__subtitle">
              Share the details below so your community can help bring them home.
            </p>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="error-message" role="alert">
            <ul>
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {hasDraft && (
          <div className="draft-bar" role="status">
            <span className="draft-bar__status">
              <Save size={15} />
              {draftRestored && !draftSaved
                ? 'Draft restored - we saved your earlier progress'
                : 'Draft saved automatically'}
            </span>
            <button type="button" className="draft-bar__clear" onClick={handleClearDraft}>
              <Trash2 size={14} /> Clear draft
            </button>
          </div>
        )}

        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <h2 className="form-section-title">
            <PawPrint size={18} /> Animal details
          </h2>

          <div className="form-grid">
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
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo *</label>
            <label className="file-upload" htmlFor="photo">
              <span className="file-upload__icon">
                <Upload size={20} />
              </span>
              <span className="file-upload__text">
                <strong>{form.photo ? 'Change photo' : 'Upload a photo'}</strong>
                {form.photo ? form.photo.name : 'PNG or JPG, clear photo of the animal'}
              </span>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            {photoPreview && (
              <div className="file-preview">
                <img src={photoPreview} alt="Selected preview" />
                <span>{form.photo?.name}</span>
              </div>
            )}
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
            <p className="field-help">How finders can reach you if they spot the animal.</p>
          </div>

          <h2 className="form-section-title">
            <MapPin size={18} /> Last seen location
          </h2>

          <div className="form-group">
            <label>Last Seen Location * (click the map)</label>
            <div className="map-picker-wrapper">
              <MapContainer center={[49.2827, -123.1207]} zoom={11} className="map-picker">
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
            {form.lastSeenLat !== null && form.lastSeenLng !== null ? (
              <p className="location-info">
                <strong>Coordinates:</strong> {form.lastSeenLat.toFixed(5)},{' '}
                {form.lastSeenLng.toFixed(5)}
                <br />
                <strong>Address:</strong>{' '}
                {geocodingLoading
                  ? 'Looking up address...'
                  : currentAddress || 'Click map to select'}
              </p>
            ) : (
              <p className="field-help">
                <Info size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                Click anywhere on the map to drop a pin on the last seen spot.
              </p>
            )}
          </div>

          <h2 className="form-section-title">
            <Lock size={18} /> Security
          </h2>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a password"
            />
            <p className="field-help">
              You'll need this password later to mark the animal as found.
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
            {submitting ? (
              'Submitting...'
            ) : (
              <>
                <AlertCircle size={18} /> Submit Report
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default SubmitReportPage;
