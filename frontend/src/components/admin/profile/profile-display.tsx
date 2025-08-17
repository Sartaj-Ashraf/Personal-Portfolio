"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Users,
  CalendarClock,
  Globe,
  Plus,
} from "lucide-react";
import { useProfile } from "@/hooks/use-portfolio-data";
import Link from "next/link";

export function PersonalDetailsCard() {
  const { data: { profile } = {},  } = useProfile();

  if (!profile) {
    return (
      <div className="text-center py-8 text-muted-foreground flex items-center justify-center flex-col gap-8">
        No profile data available.
        <Button asChild>
          <Link href="/admin/profile/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Profile
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (date?: string | Date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  return (
    <Card className=" shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-semibold">{profile.name}</CardTitle>
        <Button asChild>
          <Link href={`/admin/profile/${profile._id}`}>
            <Plus className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={profile.imageUrl || "https://i.ibb.co/default-avatar.png"}
              alt={`${profile.name} profile`}
              className="w-40 h-40 rounded-md object-cover border border-gray-300"
            />
            <Badge
              variant={profile.isActive ? "default" : "outline"}
              className={`mt-4 px-3 py-1 text-sm font-medium ${
                profile.isActive
                  ? "bg-green-100 text-green-800"
                  : "text-muted-foreground"
              }`}
            >
              {profile.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Right Side: Details */}
          <div className="flex-grow space-y-4">
            {/* Job & Company */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {profile.jobTitle && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{profile.jobTitle}</span>
                </div>
              )}
              {profile.company && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-1">
                  <CalendarClock className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-muted-foreground text-sm italic">
                {profile.bio}
              </p>
            )}

            {/* About */}
            {profile.about && (
              <div>
                <h3 className="font-semibold mb-1">About</h3>
                <p className="text-sm leading-relaxed">{profile.about}</p>
              </div>
            )}

            {/* Contact & Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Contact</h4>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-blue-600 underline"
                  >
                    {profile.email}
                  </a>
                </p>
                {profile.phoneNumber && <p>Phone: {profile.phoneNumber}</p>}
                <p>Username: {profile.username}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Social Links</h4>
                <div className="flex space-x-4 items-center">
                  {profile.social?.github && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(profile.social.github, "_blank")
                      }
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                  )}
                  {profile.social?.linkedin && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(profile.social.linkedin, "_blank")
                      }
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                  )}
                  {profile.social?.twitter && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(profile.social.twitter, "_blank")
                      }
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                  )}
                  {profile.social?.instagram && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(profile.social.instagram, "_blank")
                      }
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                  )}
                  {!profile.social && (
                    <span className="text-muted-foreground text-sm">
                      No social links
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
