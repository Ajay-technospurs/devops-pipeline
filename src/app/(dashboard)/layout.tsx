import type { Metadata } from "next";
import MainLayout from "@/components/layouts/main/main";

export const metadata: Metadata = {
  title: "Workflow App",
  description: "Custom workflow builder application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
