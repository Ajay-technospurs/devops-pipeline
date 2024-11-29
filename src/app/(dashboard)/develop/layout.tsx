"use client";
import { FlowProvider } from "@/provider/canvas_provider";
import {PanelRefProvider} from "@/provider/layout_provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PanelRefProvider>
      <FlowProvider>
        <section className="h-full">{children}</section>
      </FlowProvider>
    </PanelRefProvider>
  );
}
