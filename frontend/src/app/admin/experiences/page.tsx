import { PageHeader } from "@/components/admin/page-header";
import { ExperiencesTable } from "@/components/admin/experiences/experiences-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Metadata } from "next";
import { Head } from "next/document";
export const metadata: Metadata = {
  title: "Sartaj Ashraf | Full Stack Web Developer",
  description:
    "Explore the portfolio of Sartaj Ashraf, a Full Stack Developer skilled in building modern web applications using React, Node.js, Full stack developer, web developer, MongoDB, and cloud technologies.",
  keywords: [
    "React",
    "Node.js",
    "MongoDB",
    "Full Stack Developer",
    "Web Developer",
    "Portfolio",
    "Sartaj Ashraf",
    "Full Stack Developer Portfolio",
    "Portfolio Management",
    "graphic designer",
    "Experiences",
    "Dashboard",
  ],
  openGraph: {
    title: "Sartaj Ashraf | Full Stack Web Developer ",
    description:
      "Explore the portfolio of Sartaj Ashraf, a Full Stack Developer skilled in building modern web applications using React, Node.js, MongoDB, and cloud technologies.",
    url: "https://sartajashraf.com/admin/profile",
    siteName: "Sartaj Ashraf | Full Stack Developer Portfolio",
    images: [
      {
        url: "https://sartajashraf.com/og-image.png", // replace with actual OG image
        width: 1200,
        height: 630,
        alt: "Admin Profile Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sartaj Ashraf | Full Stack Web Developer",
    description:
      "Explore the portfolio of Sartaj Ashraf, a Full Stack Developer skilled in building modern web applications using React, Node.js, MongoDB, and cloud technologies.",
    images: ["https://sartajashraf.com/og-image.png"], // replace with actual OG image
  },
};
export default function AdminExperiencesPage() {
  return (
    <>
      {" "}
      <Head>
        <title>Sartaj Ashraf | Full Stack Web Developer</title>
        <meta
          name="description"
          content="Explore the portfolio of Sartaj Ashraf, a Full Stack Developer skilled in building modern web applications using React, Node.js, MongoDB, and cloud technologies."
        />
        <meta
          name="keywords"
          content="Full Stack Developer, React, Node.js, MongoDB, JavaScript, TypeScript, Web Development, Portfolio, Sartaj Ashraf"
        />
        <meta name="author" content="Sartaj Ashraf" />

        {/* Open Graph / Social Preview */}
        <meta
          property="og:title"
          content="Sartaj Ashraf | Full Stack Web Developer"
        />
        <meta
          property="og:description"
          content="Portfolio of Sartaj Ashraf – showcasing expertise in modern full-stack web development."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sartajashraf.com/profile" />
        <meta
          property="og:image"
          content="https://sartajashraf.com/preview-image.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sartaj Ashraf | Full Stack Web Developer"
        />
        <meta
          name="twitter:description"
          content="Explore the portfolio and skills of Sartaj Ashraf, Full Stack Web Developer."
        />
        <meta
          name="twitter:image"
          content="https://sartajashraf.com/preview-image.jpg"
        />
      </Head>
      <div className="space-y-6">
        <PageHeader
          title="Experiences"
          description="Manage your portfolio experiences"
          action={
            <Button asChild>
              <Link href="/admin/experiences/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Link>
            </Button>
          }
        />
        <ExperiencesTable />
      </div>
    </>
  );
}
