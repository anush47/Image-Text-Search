import { UploadedImage } from "@/types/image";

export const searchImages = async (
  query: string,
  images: UploadedImage[]
): Promise<UploadedImage[]> => {
  // Simulate search delay
  //search for the query in the text of the image
  return images.filter((img) => img.text.includes(query.toLowerCase()));
};
