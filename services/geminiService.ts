import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generateImage = async (
  prompt: string,
  uploadedImages: (UploadedImage | null)[]
): Promise<string> => {
  const model = 'gemini-2.5-flash-image-preview';

  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];

  const imageParts = uploadedImages
    .filter((img): img is UploadedImage => img !== null)
    .map(uploadedImage => ({
      inlineData: {
        mimeType: uploadedImage.mimeType,
        data: uploadedImage.base64,
      },
    }));
  
  // Per documentation, image parts should ideally come first
  parts.push(...imageParts);
  parts.push({ text: prompt });


  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Find the image part in the response
  if (response.candidates && response.candidates.length > 0) {
    const content = response.candidates[0].content;
    if (content && content.parts) {
      for (const part of content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const mimeType: string = part.inlineData.mimeType;
          return `data:${mimeType};base64,${base64ImageBytes}`;
        }
      }
    }
  }

  throw new Error('API did not return an image. The response might contain safety blocks or other text content.');
};

export const suggestPrompt = async (
  basePrompt: string,
  userInstructions: string,
  uploadedImages: (UploadedImage | null)[]
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are a world-class prompt engineer for an AI image generation model. Your task is to refine and improve an existing prompt based on user instructions and potentially an uploaded image.
Your goal is to generate a new, highly detailed, and effective prompt for image generation. The new prompt should incorporate the user's instructions and the visual information from the image (if provided) into the base prompt's structure.
The final prompt must be in English. It should be descriptive, clear, and ready to be used for generating an image.
Do not add any explanations, introductory phrases, or markdown formatting. Output ONLY the refined prompt text.`;

  let promptParts: ({ inlineData: { mimeType: string; data: string } } | { text: string })[] = [
    { text: `Base Prompt: "${basePrompt}"` },
    { text: `User's Additional Instructions: "${userInstructions}"` },
    { text: "Based on the above, create the new, improved prompt." }
  ];

  const validImages = uploadedImages.filter((img): img is UploadedImage => img !== null);

  if (validImages.length > 0) {
    const imageParts = validImages.map(uploadedImage => ({
        inlineData: {
            mimeType: uploadedImage.mimeType,
            data: uploadedImage.base64,
        },
    }));
    // Prepend image analysis instruction and image data
    promptParts = [
      { text: `First, analyze the key elements, style, subject, and composition of the provided image${validImages.length > 1 ? 's' : ''}.` },
      ...imageParts,
      ...promptParts
    ];
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: promptParts },
    config: {
      systemInstruction: systemInstruction,
    },
  });

  if (response.text) {
    return response.text.replace(/```(prompt|markdown)?/g, '').trim();
  }

  throw new Error('AI could not suggest a prompt. Please try again.');
};