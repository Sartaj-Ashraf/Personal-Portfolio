"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { porjectAPI } from "@/lib/api";
import { toast, useToast } from "@/hooks/use-toast";
import { useTechStack } from "@/hooks/use-portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectFormProps {
  project?: any;
  isEdit?: boolean;
}

export function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  console.log({ projectIs: project, isEdit });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    status: "Planning",
    techStack: [] as string[],
    features: [] as string[],
    startDate: "",
    endDate: "",
    githubRepo: "",
    liveDemo: "",
  });
  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { data: techStack } = useTechStack();

  // Initialize form with project data if editing
  useEffect(() => {
    if (project && isEdit) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        category: project.category || "other",
        status: project.status || "Planning",
        techStack: project.techStack?.map((tech: any) => tech._id) || [],
        features: project.features || [],
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        githubRepo: project.githubRepo || "",
        liveDemo: project.liveDemo || "",
      });
    }
  }, [project, isEdit]);

  const createMutation = useMutation({
    mutationFn: (data: any) => porjectAPI.createProject(data),
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
        description:
          error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => porjectAPI.updateProject(project._id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      router.push("/admin/projects");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  console.log({ formData });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      };

      if (isEdit) {
        updateMutation.mutate(submitData);
      } else {
        createMutation.mutate(submitData);
      }
    } catch (error) {
      // Error handled by mutations
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const toggleTechStack = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(techId)
        ? prev.techStack.filter((id) => id !== techId)
        : [...prev.techStack, techId],
    }));
  };

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
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your project"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="Open Source">Open Source</SelectItem>
                  <SelectItem value="e-commerce">e-commerce</SelectItem>
                  <SelectItem value="crm">crm</SelectItem>
                  <SelectItem value="cms">cms</SelectItem>
                  <SelectItem value="inventory">inventory</SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
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
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubRepo">GitHub Repository</Label>
              <Input
                id="githubRepo"
                type="url"
                value={formData.githubRepo}
                onChange={(e) => handleChange("githubRepo", e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveDemo">Live Demo URL</Label>
              <Input
                id="liveDemo"
                type="url"
                value={formData.liveDemo}
                onChange={(e) => handleChange("liveDemo", e.target.value)}
                placeholder="https://your-project.com"
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
                  checked={formData.techStack.includes(tech._id)}
                  onCheckedChange={() => toggleTechStack(tech._id)}
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
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a key feature"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addFeature())
              }
            />
            <Button type="button" onClick={addFeature} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="pr-1">
                {feature}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 ml-1"
                  onClick={() => removeFeature(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
