"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { contentAPI } from "@/lib/api"
import { toast, useToast } from "@/hooks/use-toast"
import { useTechStack } from "@/hooks/use-portfolio-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface ExperienceFormProps {
  experience?: any
  isEdit?: boolean
}

export function ExperienceForm({ experience, isEdit = false }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "remote",
    employmentType: "other",
    companyWebsite: "",
    companyLogo: "",
    coverImage: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    keyPoints: [] as string[],
    achievements: [] as string[],
    challenges: [] as string[],
    technologiesUsed: [] as string[],
  })

  const [newKeyPoint, setNewKeyPoint] = useState("")
  const [newAchievement, setNewAchievement] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { data: techStack } = useTechStack()

  // Initialize form for edit
  useEffect(() => {
    if (experience && isEdit) {
      setFormData({
        title: experience.title || "",
        company: experience.company || "",
        location: experience.location || "remote",
        employmentType: experience.employmentType || "other",
        companyWebsite: experience.companyWebsite || "",
        companyLogo: experience.companyLogo || "",
        coverImage: experience.coverImage || "",
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split("T")[0] : "",
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split("T")[0] : "",
        isCurrent: experience.isCurrent || false,
        description: experience.description || "",
        keyPoints: experience.keyPoints || [],
        achievements: experience.achievements || [],
        challenges: experience.challenges || [],
        technologiesUsed: experience.technologiesUsed?.map((tech: any) => tech._id) || [],
      })
    }
  }, [experience, isEdit])

  const createMutation = useMutation({
    mutationFn: (data: any) => contentAPI.createExperience(data),
    onSuccess: () => {
      toast({ title: "Success", description: "Experience created successfully" })
      router.push("/admin/experiences")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create experience",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => contentAPI.updateExperience(experience._id, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Experience updated successfully" })
      router.push("/admin/experiences")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update experience",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const submitData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      }
      if (isEdit) updateMutation.mutate(submitData)
      else createMutation.mutate(submitData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = (field: "keyPoints" | "achievements" | "challenges", value: string, setter: any) => {
    if (value.trim()) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }))
      setter("")
    }
  }

  const removeItem = (field: "keyPoints" | "achievements" | "challenges", index: number) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const toggleTechStack = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      technologiesUsed: prev.technologiesUsed.includes(techId)
        ? prev.technologiesUsed.filter((id) => id !== techId)
        : [...prev.technologiesUsed, techId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle>Experience Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Role / Title *</Label>
              <Input id="title" required value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input id="company" required value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} maxLength={2000}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Employment Info */}
        <Card>
          <CardHeader><CardTitle>Work Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Location</Label>
              <Select value={formData.location} onValueChange={(v) => handleChange("location", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Employment Type</Label>
              <Select value={formData.employmentType} onValueChange={(v) => handleChange("employmentType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Company Website</Label>
              <Input type="url" value={formData.companyWebsite}
                onChange={(e) => handleChange("companyWebsite", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input type="date" value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={formData.endDate}
                  disabled={formData.isCurrent}
                  onChange={(e) => handleChange("endDate", e.target.value)} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isCurrent" checked={formData.isCurrent}
                onCheckedChange={(v) => handleChange("isCurrent", v as boolean)} />
              <Label htmlFor="isCurrent">Currently Working Here</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arrays: KeyPoints / Achievements / Challenges */}
      {(["keyPoints", "achievements", "challenges"] as const).map((field) => (
        <Card key={field}>
          <CardHeader><CardTitle>{field}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={field === "keyPoints" ? newKeyPoint : field === "achievements" ? newAchievement : newChallenge}
                onChange={(e) =>
                  field === "keyPoints"
                    ? setNewKeyPoint(e.target.value)
                    : field === "achievements"
                    ? setNewAchievement(e.target.value)
                    : setNewChallenge(e.target.value)
                }
                placeholder={`Add a ${field.slice(0, -1)}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem(field, e.currentTarget.value,
                      field === "keyPoints" ? setNewKeyPoint : field === "achievements" ? setNewAchievement : setNewChallenge)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addItem(field, field === "keyPoints" ? newKeyPoint : field === "achievements" ? newAchievement : newChallenge,
                    field === "keyPoints" ? setNewKeyPoint : field === "achievements" ? setNewAchievement : setNewChallenge)
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData[field].map((item, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {item}
                  <Button
                    type="button" variant="ghost" size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => removeItem(field, index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Tech stack */}
      <Card>
        <CardHeader><CardTitle>Technologies Used</CardTitle></CardHeader>
        {/* <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack?.map((tech: any) => (
              <div key={tech._id} className="flex items-center space-x-2">
                <Checkbox
                  id={tech._id}
                  checked={formData.technologiesUsed.includes(tech._id)}
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

      {/* Submit / Cancel */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/experiences")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Experience" : "Create Experience"}
        </Button>
      </div>
    </form>
  )
}
