"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { profileAPI } from "@/lib/api";
import { useProfile } from "@/hooks/use-portfolio-data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  profile?: any
  isEdit?: boolean
}

export function ProfileForm({ profile, isEdit = false }: ProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    username: "",
    email: "",
    phoneNumber: "",
    bio: "",
    jobTitle: "",
    location: "",
    company: "",
    social: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    },
    isActive: true,
  });

  console.log({social: formData.social});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  console.log({profile});
  const { toast } = useToast();

  // Initialize form with existing profile
  useEffect(() => {
    if (profile) {
      setLoading(true);
      setFormData({
        name: profile.name || "",
        about: profile.about || "",
        username: profile.username || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        bio: profile.bio || "",
        jobTitle: profile.jobTitle || "",
        location: profile.location || "",
        company: profile.company || "",
        social: {
          github: profile.social?.github || "",
          linkedin: profile.social?.linkedin || "",
          twitter: profile.social?.twitter || "",
          instagram: profile.social?.instagram || "",
        },
        isActive: profile.isActive ?? true,
      });
      
      // Set existing image preview if editing
      if (profile.imageUrl && typeof profile.imageUrl === 'string') {
        setImagePreview(profile.imageUrl);
      }
      setLoading(false);
    }
  }, [profile, isEdit]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL for the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image preview and file
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (profile?._id) {
        setLoading(true);
        return profileAPI.updateProfile(profile._id, data);
      } else {
        setLoading(true);
        return profileAPI.createProfile(data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setLoading(false);
      router.push("/admin/profile");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Append normal fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "object") {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Append image if selected
      if (imageFile) {
        submitData.append("imageUrl", imageFile);
      }

      updateMutation.mutate(submitData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (field.startsWith("social.")) {
      const socialField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social: { ...prev.social, [socialField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal & Professional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />

            {/* Image Upload with Preview */}
            <div className="space-y-3">
              <Label htmlFor="image">Profile Image</Label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* File Input */}
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label 
                  htmlFor="image" 
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Label>
              </div>
              
              {/* Image upload hint */}
              <p className="text-sm text-muted-foreground">
                Recommended: Square image, at least 300x300px
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="jobTitle"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
            />
            <Input
              id="company"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
            <Input
              id="location"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />

            <Textarea
              id="bio"
              placeholder="Bio (max 300 chars)"
              value={formData.bio}
              maxLength={300}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="about"
            rows={6}
            placeholder="Tell visitors about yourself..."
            value={formData.about}
            onChange={(e) => handleChange("about", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Input
            id="github"
            placeholder="GitHub URL"
            value={formData.social.github}
            onChange={(e) => handleChange("social.github", e.target.value)}
          />
          <Input
            id="linkedin"
            placeholder="LinkedIn URL"
            value={formData.social.linkedin}
            onChange={(e) => handleChange("social.linkedin", e.target.value)}
          />
          <Input
            id="twitter"
            placeholder="Twitter URL"
            value={formData.social.twitter}
            onChange={(e) => handleChange("social.twitter", e.target.value)}
          />
          <Input
            id="instagram"
            placeholder="Instagram URL"
            value={formData.social.instagram}
            onChange={(e) => handleChange("social.instagram", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Other Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Active</Label>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Profile views: {profile?.profileViews ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">
            Last login: {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "Never"}
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
          {profile?._id ? "Update Profile" : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}