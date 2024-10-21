import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadedImage } from "@/types/image";
import { processImages } from "@/helperFunctions/ProcessImage";

interface ImageUploaderProps {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export function ImageUploader({
  uploadedImages,
  setUploadedImages,
}: ImageUploaderProps) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (processing) return; // Prevent new uploads while processing

      setProcessing(true);
      setProgress(0);
      setProgressStage("");
      try {
        // Check if already processed
        const alreadyProcessed = uploadedImages.filter((img) =>
          acceptedFiles.some((file) => file.name === img.name)
        );

        if (alreadyProcessed.length > 0) {
          toast({
            title: "Already processed",
            description: `${alreadyProcessed.length} file(s) already processed.`,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Process the new files
        const newFiles = acceptedFiles.filter(
          (file) => !alreadyProcessed.some((img) => img.name === file.name)
        );

        if (newFiles.length > 0) {
          const newProcessedImages = await processImages(
            newFiles,
            (progress, stage) => {
              setProgress(progress);
              setProgressStage(stage);
              if (progress % 10 === 0 && progress !== 0 && progress !== 100) {
                toast({
                  title: "Image processed",
                  description: `${progress}% (${
                    Math.floor((progress / 100) * newFiles.length) + 1
                  } out of ${newFiles.length} files processed)`,
                });
              }
            }
          );

          setUploadedImages((prev) => [...prev, ...newProcessedImages]);
          localStorage.setItem(
            "uploadedImages",
            JSON.stringify([...uploadedImages, ...newProcessedImages])
          );
        }

        toast({
          title: "Upload complete",
          description: `${newFiles.length} new file(s) uploaded and processed successfully.`,
        });
      } catch (error) {
        console.error("Error processing images:", error);
        toast({
          title: "Error uploading images",
          description: "An error occurred while processing the images.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
        setProgress(100);
        setProgressStage("Complete");
      }
    },
    [uploadedImages, setUploadedImages, toast, processing]
  );

  const deleteImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    localStorage.setItem(
      "uploadedImages",
      JSON.stringify(uploadedImages.filter((img) => img.id !== id))
    );
  };

  const deleteAllImages = () => {
    setUploadedImages([]);
    localStorage.removeItem("uploadedImages");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: processing, // Disable dropzone while processing
  });

  return (
    <Card className="h-fit lg:sticky lg:top-8">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          } ${processing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input {...getInputProps()} disabled={processing} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {processing
              ? "Processing images..."
              : "Drag & drop images here, or click to select files"}
          </p>
        </div>
        {processing && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">{progressStage}</p>
          </div>
        )}
        <ScrollArea className="h-[300px] mt-4">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-sm truncate max-w-[150px]">
                  {image.name}
                </span>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteImage(image.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
        {uploadedImages.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteAllImages}
            className="mt-4"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
