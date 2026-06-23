/* enums for animal type and report status below: */
export enum AnimalType {
  Dog = 'Dog',
  Cat = 'Cat',
  Bird = 'Bird',
  Rabbit = 'Rabbit',
  Other = 'Other',
}

export enum ReportStatus {
  Lost = 'lost',
  Found = 'found',
}

export interface AnimalReport {
  id: string;
  animalName: string;
  animalType: AnimalType;
  description: string;
  contactInfo: string;
  photoUrl: string;
  lastSeenLat: number;
  lastSeenLng: number;
  lastSeenAddress: string;
  password: string;
  status: ReportStatus;
  datePosted: string;
}

export interface ReportFormData {
  animalName: string;
  animalType: AnimalType;
  description: string;
  contactInfo: string;
  photo: File | null;
  lastSeenLat: number | null;
  lastSeenLng: number | null;
  lastSeenAddress: string;
  password: string;
}

export interface ImgBBResponse {
  data: {
    id: string;
    url: string;
    display_url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface JsonBinData {
  reports: AnimalReport[];
}

export interface JsonBinReadResponse {
  record: JsonBinData;
  metadata: {
    id: string;
    createdAt: string;
    private: boolean;
  };
}

export interface FilterState {
  animalType: AnimalType | 'all';
  status: ReportStatus | 'all';
}
