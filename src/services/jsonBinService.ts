import { AnimalReport, JsonBinReadResponse, JsonBinData } from '../models';

const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID as string;
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY as string;
const BASE_URL = 'https://api.jsonbin.io/v3/b';

export async function fetchReports(): Promise<AnimalReport[]> {
  const response = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
    headers: {
      'X-Master-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.statusText}`);
  }

  const data: JsonBinReadResponse = await response.json();
  return data.record.reports ?? [];
}

export async function saveReports(reports: AnimalReport[]): Promise<void> {
  const body: JsonBinData = { reports };

  const response = await fetch(`${BASE_URL}/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to save reports: ${response.statusText}`);
  }
}
