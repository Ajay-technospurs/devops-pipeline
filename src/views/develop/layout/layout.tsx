"use client";

import { FlowProvider } from "@/provider/canvas_provider";
import PaletteSection from "../components/palettes/palettes";
import ProjectSection from "../components/projects/projects";
import DevelopCanvas from "../components/canvas/canvas";
import ConfigComponent from "../components/configuration/config";

export default function DevelopmentLayout() {
  return (
    <FlowProvider>
      <div className="h-full flex">
        <div className="max-w-[400px] w-[400px] border border-r flex flex-col h-full">
          <ProjectSection />
          <PaletteSection />
        </div>
        <div className="flex-1 flex flex-col h-full">
          <div className="h-[65%]">
          <DevelopCanvas />
          </div>
          <div className="flex w-full">
            <ConfigComponent />
          </div>
        </div>
      </div>
    </FlowProvider>
  );
}
