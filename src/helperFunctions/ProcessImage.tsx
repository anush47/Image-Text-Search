import { UploadedImage } from "@/types/image";

export const processImages = async (
  files: File[]
): Promise<UploadedImage[]> => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return files.map((file) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    url: URL.createObjectURL(file),
    text: "",
  }));
};
