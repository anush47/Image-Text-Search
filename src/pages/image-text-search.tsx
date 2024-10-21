"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageSearch } from "@/components/ImageSearch";
import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";
import { UploadedImage } from "@/types/image";

export default function ImageTextSearch() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uploadedImages");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<UploadedImage[]>([]);

  useEffect(() => {
    localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <ImageUploader
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
        <ImageSearch
          uploadedImages={uploadedImages}
          onSelectImage={(index) => {
            setSelectedImageIndex(index);
          }}
          setSearchResults={setSearchResults}
        />
      </div>

      <ImagePreviewDialog
        selectedImageIndex={selectedImageIndex}
        searchResults={searchResults}
        onClose={() => setSelectedImageIndex(null)}
      />
    </div>
  );
}
