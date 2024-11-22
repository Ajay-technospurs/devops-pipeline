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

export default function DevelopmentLayout({
  palettes,
  projects,
}: {
  projects: ProjectType[];
  palettes: PaletteType[];
}) {
  return (
    <>
      <ResizablePanelGroup className="h-full" direction="horizontal">
        <ResizablePanel className="h-full" defaultSize={25}>
          {/* <div className=" border-r flex flex-col h-full"> */}
          <ResizablePanelGroup
            className="h-full  border-r"
            direction="vertical"
          >
            <ResizablePanel className="h-full" defaultSize={55}>
              <ProjectSection projects={projects} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="h-full" minSize={6} maxSize={45} defaultSize={45}>
              <PaletteSection palettes={palettes} />
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* </div> */}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup className="h-full" direction="vertical">
            <ResizablePanel defaultSize={60}>
              <DevelopCanvas />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40} className="flex w-full min-h-0">
              <ConfigComponent />
              <AttributesComponent />
            </ResizablePanel>
          </ResizablePanelGroup>
          {/* <div className="flex flex-col h-full ">
            <div className="h-[65%]">
              <DevelopCanvas />
            </div>
            <div className="flex w-full h-[35%]">
              <ConfigComponent />
              <AttributesComponent />
            </div>
          </div> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
