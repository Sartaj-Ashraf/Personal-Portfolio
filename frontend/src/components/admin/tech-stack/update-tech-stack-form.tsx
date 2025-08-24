"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { techStackAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface UpdateTechStackFormProps {
  tech: any; // Required for update - must have existing tech data
}

export function UpdateTechStackForm({ tech }: UpdateTechStackFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize state with existing tech data
  const [keypoints, setKeypoints] = useState<string[]>(tech?.keypoints || []);
  const [referenceWebsite, setReferenceWebsite] = useState<string[]>(
    tech?.referenceWebsite || []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featured, setFeatured] = useState<boolean>(tech?.featured || false);

  // Keypoint management
  const addKeypoint = (keypointText: string) => {
    if (keypointText.trim()) {
      setKeypoints((prev) => [...prev, keypointText.trim()]);
    }
  };

  const removeKeypoint = (index: number) => {
    setKeypoints((prev) => prev.filter((_, i) => i !== index));
  };

  // Website management
  const addWebsite = (websiteUrl: string) => {
    if (websiteUrl.trim()) {
      setReferenceWebsite((prev) => [...prev, websiteUrl.trim()]);
    }
  };

  const removeWebsite = (index: number) => {
    setReferenceWebsite((prev) => prev.filter((_, i) => i !== index));
  };

  // Update mutation only
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => techStackAPI.updateTech(tech._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techstack"] });
      toast({
        title: "Success",
        description: "Technology updated successfully",
      });
      router.push("/admin/tech-stack");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update technology",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data from the event
    const formData = new FormData(e.currentTarget);

    // Basic validation
    const title = formData.get("title") as string;
    if (!title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Technology name is required",
        variant: "destructive",
      });
      return;
    }

    // Create submission FormData
    const submitData = new FormData();

    // Add all basic form fields
    for (const [key, value] of formData.entries()) {
      if (value) {
        submitData.append(key, value);
      }
    }

    // Add complex data as JSON strings
    submitData.append("keypoints", JSON.stringify(keypoints));
    submitData.append("referenceWebsite", JSON.stringify(referenceWebsite));
    submitData.append("featured", featured.toString());

    // Add image if selected (for update, this is optional)
    if (imageFile) {
      submitData.append("imageUrl", imageFile);
    }

    updateMutation.mutate(submitData);
  };

  const handleKeypointKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      addKeypoint(input.value);
      input.value = "";
    }
  };

  const handleWebsiteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      addWebsite(input.value);
      input.value = "";
    }
  };

  const isLoading = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Technology Name *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={tech?.title || ""}
                placeholder="e.g., React, Node.js, MongoDB"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                defaultValue={tech?.category || "Other"}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
                <option value="Testing">Testing</option>
                <option value="Cloud">Cloud</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
              <select
                id="proficiencyLevel"
                name="proficiencyLevel"
                defaultValue={tech?.proficiencyLevel || "Intermediate"}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={tech?.description || ""}
                placeholder="Brief description of your experience with this technology"
                rows={3}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={tech?.order || 0}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(checked) => setFeatured(!!checked)}
                disabled={isLoading}
              />
              <Label htmlFor="featured">Featured Technology</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Technology Icon/Logo</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                disabled={isLoading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              <div className="space-y-2">
                {tech?.imageUrl && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={tech.imageUrl}
                      alt={tech.title}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div>
                      <p className="text-sm font-medium">Current Image</p>
                      <p className="text-xs text-muted-foreground">
                        {imageFile
                          ? "Will be replaced with new image"
                          : "Keep current image"}
                      </p>
                    </div>
                  </div>
                )}
                {imageFile && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="New upload"
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div>
                      <p className="text-sm font-medium">New Image</p>
                      <p className="text-xs text-muted-foreground">
                        Will replace current image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Points */}
      <Card>
        <CardHeader>
          <CardTitle>Key Points ({keypoints.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a key point about this technology"
              onKeyPress={handleKeypointKeyPress}
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addKeypoint(input.value);
                input.value = "";
              }}
              variant="outline"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {keypoints.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No key points added yet. Add some to highlight important aspects
                of this technology.
              </p>
            ) : (
              keypoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <span className="text-sm flex-1">{point}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeypoint(index)}
                    disabled={isLoading}
                    className="ml-2 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reference Websites */}
      <Card>
        <CardHeader>
          <CardTitle>Reference Websites ({referenceWebsite.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a reference website URL"
              type="url"
              onKeyPress={handleWebsiteKeyPress}
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addWebsite(input.value);
                input.value = "";
              }}
              variant="outline"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {referenceWebsite.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No reference websites added yet. Add some useful links related
                to this technology.
              </p>
            ) : (
              referenceWebsite.map((website, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate flex-1"
                  >
                    {website}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWebsite(index)}
                    disabled={isLoading}
                    className="ml-2 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tech-stack")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Technology...
            </>
          ) : (
            "Update Technology"
          )}
        </Button>
      </div>
    </form>
  );
}
