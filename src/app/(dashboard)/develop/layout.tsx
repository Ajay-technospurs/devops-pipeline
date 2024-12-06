"use client";
import { FlowProvider } from "@/provider/canvas_provider";
import { PanelRefProvider } from "@/provider/layout_provider";
import { ReactFlowProvider } from "@xyflow/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReactFlowProvider>
      <PanelRefProvider>
        <FlowProvider>
          <section className="h-full">{children}</section>
        </FlowProvider>
      </PanelRefProvider>
    </ReactFlowProvider>
  );
}
