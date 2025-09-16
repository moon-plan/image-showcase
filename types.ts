export interface Case {
  id: string;
  name: string;
  description: string;
  prompt: string;
  imageUploads: number;
  suggestionHint?: string;
  author?: string;
  href?: string;
}

export interface Category {
  name: string;
  cases: Case[];
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}