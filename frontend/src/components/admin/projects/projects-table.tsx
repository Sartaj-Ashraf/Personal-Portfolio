"use client";

import { useProjects } from "@/hooks/use-portfolio-data";
import { porjectAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DeleteConfirmationDialog,
} from "@/components/admin/shared/confirm-delete-modal";
import { useDeleteConfirmation } from "@/hooks/use-confirm-delete"

import {
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Plus,
} from "lucide-react";
import Link from "next/link";

const statusColors = {
  Planning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "In Progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "On Hold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function ProjectsTable() {
  const { data: { projects = [] } = {}, isLoading, refetch } = useProjects();
  const { deleteItem, openDeleteDialog, closeDeleteDialog, isOpen } = useDeleteConfirmation();
  const { toast } = useToast();
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => porjectAPI.deleteProject(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      refetch();
      closeDeleteDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteItem?._id) {
      deleteMutation.mutate(deleteItem._id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg"
          >
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No projects found. Create your first project to get started.
        </p>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project: any) => (
              <TableRow key={project._id}>
                <TableCell>
                  <div className="w-[200px]">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[
                        project.status as keyof typeof statusColors
                      ] || statusColors.Planning
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack
                      ?.slice(0, 2)
                      .map((tech: any, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech.title || `Tech ${index + 1}`}
                        </Badge>
                      ))}
                    {project.techStack?.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.techStack.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell> */}
                <TableCell>
                  <div className="flex space-x-2">
                    {project.githubRepo && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={project.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View GitHub Repository"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.liveDemo && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View Live Demo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/projects/${project._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Delete Project"
        description="This will permanently delete the project and all its associated data including images, tech stack associations, and other related information."
        itemName={deleteItem?.title}
        confirmText="Delete Project"
        cancelText="Cancel"
      />
    </>
  );
}
