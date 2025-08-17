import { PageHeader } from "@/components/admin/page-header";
import { PersonalDetailsCard } from "@/components/admin/profile/profile-display";
import Head from "next/head";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sartaj Ashraf | Full Stack Web Developer",
  description:
    "Explore the portfolio of Sartaj Ashraf, a Full Stack Developer skilled in building modern web applications using React, Node.js, MongoDB, and cloud technologies.",
  keywords: [
    "admin profile",
    "portfolio management",
    "personal details",
    "dashboard",
  ],
  openGraph: {
    title: "Sartaj Ashraf | Full Stack Web Developer",
    description:
      "Explore the portfolio of Sartaj Ashraf, a Full Stack Developer skilled in building modern web applications using React, Node.js, MongoDB, and cloud technologies.",
    url: "https://sartajashraf.com/admin/profile",
    siteName: "Sartaj Ashraf | Full Stack Web Developer",
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

export default function AdminProfilePage() {
  return (
    <>
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
          title="Profile"
          description="Manage your personal information and portfolio details"
        />

        <PersonalDetailsCard />
      </div>
    </>
  );
}
