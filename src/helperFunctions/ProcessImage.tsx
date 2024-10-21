import { UploadedImage } from "@/types/image";
import { createWorker } from "tesseract.js";

export const processImages = async (
  files: File[],
  progressCallback: (progress: number, stage: string) => void
): Promise<UploadedImage[]> => {
  // Create a Tesseract worker
  progressCallback(0, "Initializing OCR engine");
  const worker = await createWorker("eng");
  progressCallback(10, "OCR engine initialized");

  try {
    const totalFiles = files.length;
    const processedImages: UploadedImage[] = [];

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      progressCallback(
        10 + (i / totalFiles) * 80,
        `Processing image ${i + 1} of ${totalFiles}`
      );

      // Create object URL for the file
      const url = URL.createObjectURL(file);

      // Perform OCR
      progressCallback(
        10 + (i / totalFiles) * 80 + (1 / totalFiles) * 40,
        `Performing OCR on image ${i + 1}`
      );
      const {
        data: { text },
      } = await worker.recognize(url);

      //format the text to remove new lines spaces and case sensitivity remove empty strings make it one line with
      const formattedText = text.replace(/\n/g, " ").toLowerCase();

      // Create processed image object
      const processedImage: UploadedImage = {
        id: Math.random().toString(36).slice(2, 11),
        name: file.name,
        text: formattedText,
        file: await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }),
      };

      processedImages.push(processedImage);
      progressCallback(
        10 + ((i + 1) / totalFiles) * 80,
        `Completed processing image ${i + 1} of ${totalFiles}`
      );
    }

    progressCallback(90, "Finalizing");
    return processedImages;
  } catch (error) {
    console.error("Error processing images:", error);
    throw error;
  } finally {
    // Terminate the worker
    await worker.terminate();
    progressCallback(100, "Processing complete");
  }
};
