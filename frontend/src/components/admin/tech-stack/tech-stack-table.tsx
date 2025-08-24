"use client";

import { useState } from "react";
import { useTechStack } from "@/hooks/use-portfolio-data";
import { techStackAPI } from "@/lib/api";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Star, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryColors = {
  Frontend: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Backend: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Database:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DevOps:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Mobile: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Testing:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Cloud:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "UI/UX": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const proficiencyColors = {
  Beginner: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Advanced: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Expert: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export function TechStackTable() {
  const {
    data: { techStacks = [] } = {},
    isLoading,
    refetch,
  } = useTechStack();
  const [deleteTech, setDeleteTech] = useState<any>(null);
  const { toast } = useToast();
  console.log({ techStacks });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => techStackAPI.deleteTech(id),
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "Technology deleted successfully",
      });
      refetch();
      setDeleteTech(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete technology",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg"
          >
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!techStacks?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No technologies found. Create your first technology to get started.
        </p>
        <Button asChild>
          <Link href="/admin/tech-stack/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Technology
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
              <TableHead>Technology</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Proficiency</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {techStacks.map((tech: any) => (
              <TableRow key={tech._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {tech.imageUrl && (
                      <div className="relative w-8 h-8">
                        <img
                          src={tech.imageUrl || "/placeholder.svg"}
                          alt={tech.title}
                          className="object-contain rounded"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{tech.title}</p>
                      {tech.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {tech.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      categoryColors[
                        tech.category as keyof typeof categoryColors
                      ] || categoryColors.Other
                    }
                  >
                    {tech.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      proficiencyColors[
                        tech.proficiencyLevel as keyof typeof proficiencyColors
                      ] || proficiencyColors.Beginner
                    }
                  >
                    {tech.proficiencyLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  {tech.featured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </TableCell>
                <TableCell>{tech.order}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(tech.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/tech-stack/${tech._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTech(tech)}
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
      <AlertDialog open={!!deleteTech} onOpenChange={() => setDeleteTech(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              {deleteTech?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteTech._id)}
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
