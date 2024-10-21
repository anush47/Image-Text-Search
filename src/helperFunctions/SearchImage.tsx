import { UploadedImage } from "@/types/image";

export const searchImages = async (
  query: string,
  images: UploadedImage[]
): Promise<UploadedImage[]> => {
  // Simulate search delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return images.filter((img) =>
    img.name.toLowerCase().includes(query.toLowerCase())
  );
};
