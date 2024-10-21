import { useState, useCallback, useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UploadedImage } from "@/types/image";
import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";
import { searchImages } from "@/helperFunctions/SearchImage";

interface ImageSearchProps {
  uploadedImages: UploadedImage[];
  onSelectImage: (index: number) => void;
  setSearchResults: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export function ImageSearch({
  uploadedImages,
  onSelectImage,
}: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResultsState] = useState<UploadedImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === "") {
      setSearchResultsState([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchImages(searchQuery, uploadedImages);
      setSearchResultsState(results);
    } catch (error) {
      console.error("Error searching images:", error);
      setSearchResultsState([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, uploadedImages]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    onSelectImage(index);
  };

  const handleClosePreview = () => {
    setSelectedImageIndex(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        {/* search results count */}
        <div className="text-sm text-gray-500 mt-2">
          {searchResults.length} results found
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {searchResults.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{image.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
      <ImagePreviewDialog
        selectedImageIndex={selectedImageIndex}
        searchResults={searchResults}
        onClose={handleClosePreview}
      />
    </Card>
  );
}
