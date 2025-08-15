"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { contentAPI } from "@/lib/api";
import { MessageSquare, FolderOpen, Clock } from "lucide-react";

export function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ["contact-queries"],
    queryFn: async () => {
      const {data} = await contentAPI.getRecentContactQueries();
      if (data.success) {
        return data.contactQueries;
      }
      return []; 
    },
  });
  const contactQueries = data?.contactQueries;

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await contentAPI.getProjects();
      return data.projects;
    },
  });


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center space-x-4"
              >
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  console.log({ projects});

  // Combine and sort recent activities
  const recentMessages =
    contactQueries?.map((query: any) => ({
      type: "message",
      title: `New message from ${query.name}`,
      description: query.message.substring(0, 100) + "...",
      time: new Date(query.createdAt).toLocaleDateString(),
      status: query.status,
      icon: MessageSquare,
    })) || [];

  // const recentProjects =
  //   projects?.map((project: any) => ({
  //     type: "project",
  //     title: `Project: ${project.title}`,
  //     description: `Status: ${project.status}`,
  //     time: new Date(project.updatedAt).toLocaleDateString(),
  //     status: project.status,
  //     icon: FolderOpen,
  //   })) || []

  const activities = [...recentMessages];
  // const activities = [...recentMessages, ...recentProjects].slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and messages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-muted rounded-lg">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                    {activity.status && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
