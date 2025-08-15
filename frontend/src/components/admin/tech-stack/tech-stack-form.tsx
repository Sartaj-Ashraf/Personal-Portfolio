"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { contentAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface TechStackFormProps {
  tech?: any
  isEdit?: boolean
}

export function TechStackForm({ tech, isEdit = false }: TechStackFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    description: "",
    proficiencyLevel: "Intermediate",
    keypoints: [] as string[],
    referenceWebsite: [] as string[],
    order: 0,
    featured: false,
  })
  const [newKeypoint, setNewKeypoint] = useState("")
  const [newWebsite, setNewWebsite] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Initialize form with tech data if editing
  useEffect(() => {
    if (tech && isEdit) {
      setFormData({
        title: tech.title || "",
        category: tech.category || "Other",
        description: tech.description || "",
        proficiencyLevel: tech.proficiencyLevel || "Intermediate",
        keypoints: tech.keypoints || [],
        referenceWebsite: tech.referenceWebsite || [],
        order: tech.order || 0,
        featured: tech.featured || false,
      })
    }
  }, [tech, isEdit])

  const createMutation = useMutation({
    mutationFn: (data: FormData) => contentAPI.createTech(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techstack"] })
      toast({
        title: "Success",
        description: "Technology created successfully",
      })
      router.push("/admin/tech-stack")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create technology",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => contentAPI.updateTech(tech._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techstack"] })
      toast({
        title: "Success",
        description: "Technology updated successfully",
      })
      router.push("/admin/tech-stack")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update technology",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value))
        } else {
          submitData.append(key, value.toString())
        }
      })

      // Append image if selected
      if (imageFile) {
        submitData.append("imageUrl", imageFile)
      }

      if (isEdit) {
        updateMutation.mutate(submitData)
      } else {
        createMutation.mutate(submitData)
      }
    } catch (error) {
      // Error handled by mutations
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addKeypoint = () => {
    if (newKeypoint.trim()) {
      setFormData((prev) => ({
        ...prev,
        keypoints: [...prev.keypoints, newKeypoint.trim()],
      }))
      setNewKeypoint("")
    }
  }

  const removeKeypoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keypoints: prev.keypoints.filter((_, i) => i !== index),
    }))
  }

  const addWebsite = () => {
    if (newWebsite.trim()) {
      setFormData((prev) => ({
        ...prev,
        referenceWebsite: [...prev.referenceWebsite, newWebsite.trim()],
      }))
      setNewWebsite("")
    }
  }

  const removeWebsite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      referenceWebsite: prev.referenceWebsite.filter((_, i) => i !== index),
    }))
  }

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
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Cloud">Cloud</SelectItem>
                  <SelectItem value="UI/UX">UI/UX</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
              <Select
                value={formData.proficiencyLevel}
                onValueChange={(value) => handleChange("proficiencyLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of your experience with this technology"
                rows={3}
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
                type="number"
                value={formData.order}
                onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange("featured", checked)}
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
              />
              {tech?.imageUrl && !imageFile && (
                <p className="text-sm text-muted-foreground">Current image will be kept if no new image is selected</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Points */}
      <Card>
        <CardHeader>
          <CardTitle>Key Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newKeypoint}
              onChange={(e) => setNewKeypoint(e.target.value)}
              placeholder="Add a key point about this technology"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeypoint())}
            />
            <Button type="button" onClick={addKeypoint} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {formData.keypoints.map((point, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{point}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeKeypoint(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reference Websites */}
      <Card>
        <CardHeader>
          <CardTitle>Reference Websites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              placeholder="Add a reference website URL"
              type="url"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addWebsite())}
            />
            <Button type="button" onClick={addWebsite} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {formData.referenceWebsite.map((website, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {website}
                </a>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeWebsite(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/tech-stack")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Technology" : "Add Technology"}
        </Button>
      </div>
    </form>
  )
}
