import { SidebarProvider } from "@/provider/sidebar_provider";
import DevelopmentLayout from "@/views/develop/layout/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DevelopmentLayout />
      <section>
        {children}
      </section>
    </SidebarProvider>
  );
}
