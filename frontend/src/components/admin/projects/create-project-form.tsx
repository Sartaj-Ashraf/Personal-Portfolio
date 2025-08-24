"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, useToast } from "@/hooks/use-toast";
import { useTechStack } from "@/hooks/use-portfolio-data";
import { porjectAPI } from "@/lib/api";
import { Loader2, X, Plus } from "lucide-react";

interface CreateProjectFormProps {
  // No props needed for create form
}

export function CreateProjectForm({}: CreateProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: techStack } = useTechStack();

  // Only state we need for UI interactions (no initial data for create form)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);

  // File management
  const addNewFiles = (files: FileList | null) => {
    if (files) {
      setNewFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Features management
  const addFeature = (featureText: string) => {
    if (featureText.trim()) {
      setFeatures(prev => [...prev, featureText.trim()]);
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // Tech stack management
  const toggleTechStack = (techId: string) => {
    setSelectedTechStack(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => porjectAPI.createProject(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      router.push("/admin/projects");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data from the event
    const formData = new FormData(e.currentTarget);

    // Basic validation
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }

    if (!description?.trim()) {
      toast({
        title: "Validation Error", 
        description: "Project description is required",
        variant: "destructive",
      });
      return;
    }

    // For create, at least one image is required
    if (newFiles.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one image file is required",
        variant: "destructive",
      });
      return;
    }

    // Create submission FormData
    const submitData = new FormData();

    // Add all form fields
    for (const [key, value] of formData.entries()) {
      if (key === 'startDate' || key === 'endDate') {
        if (value) {
          submitData.append(key, new Date(value as string).toISOString());
        }
      } else if (value) {
        submitData.append(key, value);
      }
    }

    // Add complex data
    submitData.append('techStack', JSON.stringify(selectedTechStack));
    submitData.append('features', JSON.stringify(features));

    // Add image files
    newFiles.forEach(file => {
      submitData.append('images', file);
    });

    createMutation.mutate(submitData);
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      addFeature(input.value);
      input.value = '';
    }
  };

  const isLoading = createMutation.isPending;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter project title"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your project"
                  rows={4}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue="Web Development"
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Open Source">Open Source</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="crm">CRM</option>
                    <option value="cms">CMS</option>
                    <option value="inventory">Inventory</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="Planning"
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubRepo">GitHub Repository</Label>
                <Input
                  id="githubRepo"
                  name="githubRepo"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveDemo">Live Demo URL</Label>
                <Input
                  id="liveDemo"
                  name="liveDemo"
                  type="url"
                  placeholder="https://your-project.com"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {techStack?.map((tech: any) => (
                <div key={tech._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech._id}
                    checked={selectedTechStack.includes(tech._id)}
                    onCheckedChange={() => toggleTechStack(tech._id)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={tech._id} className="text-sm">
                    {tech.title}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent> */}
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a key feature"
                onKeyPress={handleFeatureKeyPress}
                disabled={isLoading}
              />
              <Button 
                type="button" 
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addFeature(input.value);
                  input.value = '';
                }}
                variant="outline"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => removeFeature(index)}
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Project Images *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* New Images */}
            {newFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Selected Images ({newFiles.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Upload ${idx + 1}`} 
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Input */}
            <div>
              <h4 className="text-sm font-medium mb-3">
                Upload Project Images {newFiles.length === 0 && "*"}
              </h4>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addNewFiles(e.target.files)}
                disabled={isLoading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {newFiles.length === 0 
                  ? "Please select at least one image for your project."
                  : `${newFiles.length} image(s) selected. You can add more or remove existing ones.`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
