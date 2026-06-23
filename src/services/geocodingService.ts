interface NominatimResponse {
  display_name: string;
  error?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data: NominatimResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.display_name;
}
