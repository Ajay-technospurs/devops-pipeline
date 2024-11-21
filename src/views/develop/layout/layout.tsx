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

export default function DevelopmentLayout({palettes,projects}:{projects:ProjectType[],palettes:PaletteType[]}) {
  return (
    <>

      <ResizablePanelGroup className="h-full" direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <div className=" border border-r flex flex-col h-full">
            <ProjectSection projects={projects} />  
            <PaletteSection palettes={palettes} /> 
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex flex-col h-full ">
            <div className="h-[65%]">
              <DevelopCanvas />
            </div>
            <div className="flex w-full h-[35%]">
              <ConfigComponent />
              <AttributesComponent />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
