import { UploadedImage } from "@/types/image";

export const searchImages = async (
  query: string,
  images: UploadedImage[]
): Promise<UploadedImage[]> => {
  // Simulate search delay
  return images.filter((img) => img.text.includes(query.toLowerCase()));
};
