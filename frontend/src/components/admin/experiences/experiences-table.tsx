"use client";

import { useState } from "react";
import { useExperiences } from "@/hooks/use-portfolio-data";
import { contentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

const employmentColors: Record<string, string> = {
  "full-time":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "part-time": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  internship:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  contract:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  freelance: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  temporary:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function ExperiencesTable() {
  const { data: { experiences } = {}, isLoading } = useExperiences();
  const [deleteExperience, setDeleteExperience] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentAPI.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      setDeleteExperience(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete experience",
        variant: "destructive",
      });
    },
  });

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse p-6 border rounded-lg shadow-sm flex gap-4"
          >
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!experiences?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No experiences found. Create your first experience to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {experiences.map((exp: any) => (
          <div
            key={exp._id}
            className="relative flex flex-col border rounded-lg p-6 shadow-sm bg-card"
          >
            {/* Header: Logo + Title + Actions */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {exp.companyLogo ? (
                  <img
                    src={exp.companyLogo}
                    alt={exp.company}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm">
                    {exp.company[0]}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/experiences/${exp._id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteExperience(exp)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted-foreground line-clamp-3">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  className={
                    employmentColors[exp.employmentType] || employmentColors.other
                  }
                >
                  {exp.employmentType}
                </Badge>
                <Badge variant="secondary">{exp.location}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(exp.startDate).toLocaleDateString()} –{" "}
                {exp.isCurrent
                  ? "Present"
                  : exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* Tech stack */}
            {exp.technologiesUsed?.length ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.technologiesUsed.slice(0, 3).map((tech: any, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tech?.title || `Tech ${idx + 1}`}
                  </Badge>
                ))}
                {exp.technologiesUsed.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{exp.technologiesUsed.length - 3}
                  </Badge>
                )}
              </div>
            ) : null}

            {/* Website Link */}
            {exp.companyWebsite && (
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={exp.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Website
                  </a>
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteExperience}
        onOpenChange={() => setDeleteExperience(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              experience "{deleteExperience?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteExperience._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
