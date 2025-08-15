"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Phone,
  Calendar,
  User,
} from "lucide-react";

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  unresolved: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function MessagesTable() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [deleteMessage, setDeleteMessage] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-queries"],
    queryFn: async () => {
      const {data} = await contentAPI.getContactQueries();
      return data.contactQueries;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      contentAPI.updateContactQuery(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      toast({
        title: "Success",
        description: "Message status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentAPI.deleteContactQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      setDeleteMessage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (messageId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: messageId, status: newStatus });
  };

  const filteredMessages =
    messages &&
    messages?.filter((message: any) => {
      if (statusFilter === "all") return true;
      return message.status === statusFilter;
    });

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

  if (!messages?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No messages found. Contact form submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredMessages?.length || 0} message(s)
        </div>
      </div>

      {/* Messages Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages?.map((message: any) => (
              <TableRow key={message._id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{message.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {message.phone_number && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{message.phone_number}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-2 max-w-xs">
                    {message.message}
                  </p>
                </TableCell>
                <TableCell>
                  <Select
                    value={message.status}
                    onValueChange={(value) =>
                      handleStatusChange(message._id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue>
                        <Badge
                          className={
                            statusColors[
                              message.status as keyof typeof statusColors
                            ] || statusColors.pending
                          }
                        >
                          {message.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="unresolved">Unresolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteMessage(message)}
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

      {/* Message Detail Modal */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Contact form submission from {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name</span>
                  </div>
                  <p className="text-sm pl-6">{selectedMessage.name}</p>
                </div>

                {selectedMessage.phone_number && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <p className="text-sm pl-6">
                      <a
                        href={`tel:${selectedMessage.phone_number}`}
                        className="text-primary hover:underline"
                      >
                        {selectedMessage.phone_number}
                      </a>
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Received</span>
                  </div>
                  <p className="text-sm pl-6">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status</span>
                  </div>
                  <div className="pl-6">
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value) => {
                        handleStatusChange(selectedMessage._id, value);
                        setSelectedMessage({
                          ...selectedMessage,
                          status: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge
                            className={
                              statusColors[
                                selectedMessage.status as keyof typeof statusColors
                              ] || statusColors.pending
                            }
                          >
                            {selectedMessage.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="unresolved">Unresolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <h4 className="font-medium">Message</h4>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                {selectedMessage.phone_number && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedMessage.phone_number}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </a>
                  </Button>
                )}
                <Button onClick={() => setSelectedMessage(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteMessage}
        onOpenChange={() => setDeleteMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              message from "{deleteMessage?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteMessage._id)}
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
