import imageCompression from 'browser-image-compression';

// Image compression options type
export interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export async function compressImage(
  file: File, 
  isProfileImage: boolean = false
): Promise<File | null> {
  // Validate file size
  if (file.size > 40 * 1024 * 1024) {
    console.warn("File size exceeds 40MB limit.");
    return null;
  }

  // Default compression options
  const defaultOptions = {
    maxSizeMB: isProfileImage ? 0.5 : 1,
    maxWidthOrHeight: isProfileImage ? 500 : 1200,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return null;
  }
}

export function createFilePreview(file: File | null): string {
  if (!file) return '';
  return URL.createObjectURL(file);
}

export function generateSupabaseFilePath(
  userId: string, 
  fileType: 'profile' | 'cover' | 'post'
): string {
  const timestamp = Date.now();
  return `${userId}/${fileType}_${timestamp}.jpg`;
}

 // Function to generate a snapshot image from the video
 export const snapImage = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL();
  
    // Ensure the image is large enough (greater than 100 KB)
    const success = image.length > 100000;
  
    if (success) {
      return image;
    }
    return null;
  };