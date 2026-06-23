import { ImgBBResponse } from '../models';

const API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;
const UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', API_KEY);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.statusText}`);
  }

  const data: ImgBBResponse = await response.json();

  if (!data.success) {
    throw new Error('Image upload was not successful');
  }

  return data.data.display_url;
}
