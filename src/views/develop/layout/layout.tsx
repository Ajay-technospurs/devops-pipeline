"use client";
import PaletteSection from "../components/palettes/palettes";
import ProjectSection from "../components/projects/projects";
import DevelopCanvas from "../components/canvas/canvas";
import ConfigComponent from "../components/configuration/config";
import AttributesComponent from "../components/attributes/attributes";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { PaletteType, ProjectType } from "@/types";
import { usePanelRefs } from "@/provider/layout_provider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GitHubProjectType } from "@/mongodb/model/github";

export default function DevelopmentLayout({
  palettes,
  projects,
}: {
  projects: GitHubProjectType[];
  palettes: PaletteType[];
}) {
  const { getPanelRef } = usePanelRefs();
  return (
    <ResizablePanelGroup className="h-full" direction="horizontal">
      <ResizablePanel
        className="h-full"
        id="sidebar"
        defaultSize={25}
        collapsible={true}
        ref={getPanelRef("sidebar")} // Assign ref
      >
        <ResizablePanelGroup className="h-full border-r" direction="vertical">
          <ResizablePanel
            className="h-full"
            defaultSize={55}
            collapsible={true}
            ref={getPanelRef("project-section")}
          >
            <ProjectSection projects={projects} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            className="h-full"
            maxSize={95.6}
            defaultSize={45}
            collapsible={true}
            ref={getPanelRef("palette-section")}
          >
            <PaletteSection palettes={palettes} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={75}
        collapsible={true}
        ref={getPanelRef("main-panel")}
      >
        <ResizablePanelGroup className="h-full" direction="vertical">
          <ResizablePanel defaultSize={60} ref={getPanelRef("develop-canvas")}>
            <DevelopCanvas />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={40}
            collapsible={true}
            className="flex w-full min-h-0"
            ref={getPanelRef("config-panel")}
          >
            <DndProvider backend={HTML5Backend}>
              
            <ResizablePanelGroup className="h-full" direction="horizontal">
              <ResizablePanel
                defaultSize={60}
                collapsible={true}
                ref={getPanelRef("config-component")}
              >
                <ConfigComponent />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={40}
                collapsible={true}
                ref={getPanelRef("attributes-component")}
              >
                <AttributesComponent />
              </ResizablePanel>
            </ResizablePanelGroup>
            </DndProvider>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
