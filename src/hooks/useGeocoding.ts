import { useState } from 'react';
import { reverseGeocode } from '../services/geocodingService';

interface UseGeocodingReturn {
  address: string;
  loading: boolean;
  geocode: (lat: number, lng: number) => Promise<void>;
  setAddress: (address: string) => void;
}

export function useGeocoding(): UseGeocodingReturn {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const geocode = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const result = await reverseGeocode(lat, lng);
      setAddress(result);
    } catch {
      setAddress('Unable to determine address');
    } finally {
      setLoading(false);
    }
  };

  return { address, loading, geocode, setAddress };
}
