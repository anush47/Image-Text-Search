import { useEffect, useState, useRef } from "react";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadedImage } from "@/types/image";

interface ImagePreviewDialogProps {
  selectedImageIndex: number | null;
  searchResults: UploadedImage[];
  onClose: () => void;
}

export function ImagePreviewDialog({
  selectedImageIndex,
  searchResults,
  onClose,
}: ImagePreviewDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex || 0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      setCurrentIndex(selectedImageIndex);
      setZoomLevel(1);
    }
  }, [selectedImageIndex]);

  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prevZoom) => {
      if (direction === "in" && prevZoom < 3) return prevZoom + 0.5;
      if (direction === "out" && prevZoom > 0.5) return prevZoom - 0.5;
      return prevZoom;
    });
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (searchResults.length === 0) return;

    setCurrentIndex((prevIndex) => {
      if (direction === "prev") {
        return (prevIndex - 1 + searchResults.length) % searchResults.length;
      } else {
        return (prevIndex + 1) % searchResults.length;
      }
    });
    setZoomLevel(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") navigateImage("prev");
        if (e.key === "ArrowRight") navigateImage("next");
        if (e.key === "+" || e.key === "=") handleZoom("in");
        if (e.key === "-") handleZoom("out");
        if (e.key === "Escape") onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, onClose]);

  if (selectedImageIndex === null || searchResults.length === 0) {
    return null;
  }

  const currentImage = searchResults[currentIndex];

  return (
    <Dialog open={selectedImageIndex !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-screen p-0 m-0">
        <DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white/90 transition-colors"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>

            <img
              ref={imageRef}
              src={currentImage.file}
              alt={currentImage.name}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain transition-transform duration-200 ease-in-out"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button size="sm" onClick={() => handleZoom("out")}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => handleZoom("in")}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white"
              onClick={() => navigateImage("prev")}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white"
              onClick={() => navigateImage("next")}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">
              {currentImage.name} ({currentIndex + 1}/{searchResults.length})
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
