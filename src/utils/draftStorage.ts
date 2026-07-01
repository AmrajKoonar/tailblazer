import { AnimalType } from '../models';

/**
 * Serializable subset of the submit form persisted to localStorage.
 * The uploaded photo File is intentionally excluded (not serializable).
 */
export interface ReportDraft {
  animalName: string;
  animalType: AnimalType;
  description: string;
  contactInfo: string;
  lastSeenLat: number | null;
  lastSeenLng: number | null;
  lastSeenAddress: string;
  password: string;
}

const DRAFT_KEY = 'tailblazer:submit-draft:v1';

export function saveDraft(draft: ReportDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage may be unavailable (private mode / quota) — fail silently.
  }
}

export function loadDraft(): ReportDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ReportDraft>;

    const validTypes = Object.values(AnimalType) as string[];
    const animalType =
      typeof parsed.animalType === 'string' && validTypes.includes(parsed.animalType)
        ? (parsed.animalType as AnimalType)
        : AnimalType.Dog;

    return {
      animalName: typeof parsed.animalName === 'string' ? parsed.animalName : '',
      animalType,
      description: typeof parsed.description === 'string' ? parsed.description : '',
      contactInfo: typeof parsed.contactInfo === 'string' ? parsed.contactInfo : '',
      lastSeenLat: typeof parsed.lastSeenLat === 'number' ? parsed.lastSeenLat : null,
      lastSeenLng: typeof parsed.lastSeenLng === 'number' ? parsed.lastSeenLng : null,
      lastSeenAddress: typeof parsed.lastSeenAddress === 'string' ? parsed.lastSeenAddress : '',
      password: typeof parsed.password === 'string' ? parsed.password : '',
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

/** Returns true if the draft contains any user-entered content worth keeping. */
export function isDraftMeaningful(draft: ReportDraft): boolean {
  return (
    draft.animalName.trim() !== '' ||
    draft.description.trim() !== '' ||
    draft.contactInfo.trim() !== '' ||
    draft.password.trim() !== '' ||
    draft.lastSeenAddress.trim() !== '' ||
    draft.lastSeenLat !== null ||
    draft.lastSeenLng !== null
  );
}
