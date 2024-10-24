"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageSearch } from "@/components/ImageSearch";
import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";
import { UploadedImage } from "@/types/image";

export default function ImageTextSearch() {
  // Initialize state for uploaded images
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Attempt to retrieve saved images from localStorage
      const saved = localStorage.getItem("uploadedImages");
      // If saved images exist, parse and return them; otherwise, return an empty array
      return saved ? JSON.parse(saved) : [];
    }
    // Return an empty array if not in a browser environment (e.g., during server-side rendering)
    return [];
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<UploadedImage[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700 animate-pulse">
        Image Text Search
      </h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <div className="h-[180px] md:h-auto overflow-auto">
          <ImageUploader
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        </div>
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
