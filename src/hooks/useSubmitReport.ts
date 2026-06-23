import { useState } from 'react';
import { AnimalReport, ReportFormData, ReportStatus } from '../models';
import { uploadImage } from '../services/imageUploadService';
import { fetchReports, saveReports } from '../services/jsonBinService';
import { generateId } from '../utils/generateId';

interface UseSubmitReportReturn {
  submitReport: (formData: ReportFormData) => Promise<void>;
  submitting: boolean;
  error: string | null;
  success: boolean;
  resetStatus: () => void;
}

export function useSubmitReport(): UseSubmitReportReturn {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  const submitReport = async (formData: ReportFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      if (!formData.photo) {
        throw new Error('Photo upload is required');
      }
      if (formData.lastSeenLat === null || formData.lastSeenLng === null) {
        throw new Error('Please click the map to select a last seen location. This is required.');
      }

      const photoUrl = await uploadImage(formData.photo);

      const report: AnimalReport = {
        id: generateId(),
        animalName: formData.animalName,
        animalType: formData.animalType,
        description: formData.description,
        contactInfo: formData.contactInfo,
        photoUrl,
        lastSeenLat: formData.lastSeenLat,
        lastSeenLng: formData.lastSeenLng,
        lastSeenAddress: formData.lastSeenAddress,
        password: formData.password,
        status: ReportStatus.Lost,
        datePosted: new Date().toISOString(),
      };

      const currentReports = await fetchReports();
      await saveReports([...currentReports, report]);

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit report';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return { submitReport, submitting, error, success, resetStatus };
}
