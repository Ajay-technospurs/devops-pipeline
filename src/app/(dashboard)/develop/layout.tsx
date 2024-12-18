import { fetchPalettes } from "@/actions/palettes";
import { fetchProjects } from "@/actions/projects";
import { FlowProvider } from "@/provider/canvas_provider";
import { PanelRefProvider } from "@/provider/layout_provider";
import DevelopmentLayout from "@/views/develop/layout/layout";
import { ReactFlowProvider } from "@xyflow/react";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [projects, palettes] = await Promise.all([
    fetchProjects(),
    fetchPalettes()
  ]);
  return (
    <ReactFlowProvider>
      <PanelRefProvider>
        <FlowProvider>
          <section className="h-full">
            <DevelopmentLayout projects={projects} palettes={palettes} >
              {children}
            </DevelopmentLayout>
          </section>
        </FlowProvider>
      </PanelRefProvider>
    </ReactFlowProvider>
  );
}
