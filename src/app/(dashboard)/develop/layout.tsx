import { FlowProvider } from "@/provider/canvas_provider";
import { UIProvider } from "@/provider/sidebar_provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <FlowProvider>
        <section className="h-full">{children}</section>
      </FlowProvider>
    </UIProvider>
  );
}
