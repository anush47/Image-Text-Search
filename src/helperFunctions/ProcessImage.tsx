import { UploadedImage } from "@/types/image";
import { createWorker } from "tesseract.js";

export const processImages = async (
  files: File[]
): Promise<UploadedImage[]> => {
  // Create a Tesseract worker
  const worker = await createWorker("eng");

  try {
    // Process each file
    const processedImages = await Promise.all(
      files.map(async (file) => {
        // Create object URL for the file
        const url = URL.createObjectURL(file);

        // Perform OCR
        const {
          data: { text },
        } = await worker.recognize(url);

        // Return the processed image object
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: url,
          text: text,
        };
      })
    );

    console.log(processedImages);

    return processedImages;
  } catch (error) {
    console.error("Error processing images:", error);
    throw error;
  } finally {
    // Terminate the worker
    await worker.terminate();
  }
};
