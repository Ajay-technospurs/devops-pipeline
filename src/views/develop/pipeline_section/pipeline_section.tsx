"use client"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { usePanelRefs } from "@/provider/layout_provider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AttributesComponent from "../components/attributes/attributes";
import DevelopCanvas from "../components/canvas/canvas";
import ConfigComponent from "../components/configuration/config";
import { GitHubProjectType } from "@/mongodb/model/github";

export default function PipeLineSection({project,file}:{project:GitHubProjectType,file?:GitHubProjectType}){
    const { getPanelRef } = usePanelRefs();
    return (
        
        <ResizablePanelGroup className="h-full" direction="vertical">
          <ResizablePanel defaultSize={60} ref={getPanelRef("develop-canvas")}>
            <DevelopCanvas project={project} file={file} />
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
    )
}