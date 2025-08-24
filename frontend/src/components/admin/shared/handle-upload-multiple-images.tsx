import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function UploadImages({ handleUpload, handleFileSelection, uploadFiles, setUploadFiles, uploading }: any) {
  return (
    <div className="bg-white rounded-lg shadow-xs py-2 mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload New Images</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="flex flex-col gap-4 col-span-4">
            <div>
              <input
                type="file"
                name="file-upload"
                onChange={handleFileSelection}
                accept="image/*"
                multiple
                required
              />
            </div>
            {uploadFiles.length > 0 && (
              <div className="text-sm text-gray-600">
                Selected {uploadFiles.length} file(s)
              </div>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
          <div className="col-span-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Selected Images</h2>
            {uploadFiles && uploadFiles.length > 0 ? (
              <div className="space-y-4 h-[350px] overflow-y-auto flex flex-wrap gap-4 relative">
                {uploadFiles.map((image: any, index: any) => (
                  <div key={image.publicId} className="relative group">
                    <Image
                      src={URL.createObjectURL(image)}
                      width={300}
                      height={300}
                      alt={`Image ${index + 1}`}
                      className="w-full h-36 object-cover rounded-lg border"
                    />
                    <div className="absolute top-1 right-1">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newFiles = [...uploadFiles];
                          newFiles.splice(index, 1);
                          setUploadFiles(newFiles);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2  border-gray-300 rounded-lg">
                <p className="text-red-500 text-sm">No images selected</p>
                
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

