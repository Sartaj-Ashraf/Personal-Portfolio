"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contentAPI } from "@/lib/api";
import { useProfile } from "@/hooks/use-portfolio-data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ProfileForm() {
  const { data: { profile = {} } = {}, isLoading } = useProfile();
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
    totalProjects: [] as string[], // ObjectIds
    totalTechStack: [] as string[], // ObjectIds
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with existing profile
  useEffect(() => {
    if (profile) {
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
        totalProjects: profile.totalProjects || [],
        totalTechStack: profile.totalTechStack || [],
        isActive: profile.isActive ?? true,
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (profile?._id) {
        return contentAPI.updateProfile(profile._id, data);
      } else {
        return contentAPI.createProfile(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

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

            <Label htmlFor="image">Profile Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
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
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {profile?._id ? "Update Profile" : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
