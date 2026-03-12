import { apiClient } from './client';

const MAX_DIMENSION = 2048; // px — giữ đủ chất lượng cho ảnh cưới
const MAX_SIZE = 4.5 * 1024 * 1024; // 4.5MB — để dưới giới hạn 5MB server

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down nếu vượt MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      // Bắt đầu quality cao, giảm dần cho đến khi < MAX_SIZE
      const tryEncode = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Không thể nén ảnh'));
            if (blob.size <= MAX_SIZE || quality <= 0.5) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              tryEncode(Math.round((quality - 0.1) * 10) / 10);
            }
          },
          'image/jpeg',
          quality,
        );
      };

      tryEncode(0.9);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc file ảnh'));
    };

    img.src = objectUrl;
  });
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const form = new FormData();
  form.append('file', compressed);
  const res = await apiClient.post<{ url: string }>('/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
}
