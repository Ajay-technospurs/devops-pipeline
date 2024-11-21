import { FlowProvider } from "@/provider/canvas_provider";
import { SidebarProvider } from "@/provider/sidebar_provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <FlowProvider>
        <section className="h-full">{children}</section>
      </FlowProvider>
    </SidebarProvider>
  );
}
