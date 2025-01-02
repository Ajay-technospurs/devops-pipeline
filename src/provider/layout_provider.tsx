"use client";
import React, { createContext, useContext, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels"; // Replace with actual library import

// Define the shape of the context
type PanelRefContextType = {
  getPanelRef: (id: string) => React.RefObject<ImperativePanelHandle>;
  collapsePanel: (id: string) => void;
  expandPanel: (id: string, minSize?: number) => void;
  togglePanel: (id: string) => void;
};

// Create the context
const PanelRefContext = createContext<PanelRefContextType | undefined>(
  undefined
);

// Provider component
export const PanelRefProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const refMap = useRef(
    new Map<string, React.RefObject<ImperativePanelHandle>>()
  );

  const getPanelRef = (id: string): React.RefObject<ImperativePanelHandle> => {
    if (!refMap.current.has(id)) {
      refMap.current.set(id, React.createRef<ImperativePanelHandle>());
    }
    return refMap.current.get(id)!;
  };

  const collapsePanel = (id: string): void => {
    const panel = getPanelRef(id).current;
    if (panel) {
      panel.collapse();
    }
  };

  const expandPanel = (id: string, minSize?: number): void => {
    const panel = getPanelRef(id).current;
    if (panel) {
      if (minSize) {
        panel.expand(minSize);
      } else {
        panel.expand();
      }
    }
  };
  const togglePanel = (id: string): void => {
    const panel = getPanelRef(id).current;
    if (panel) {
      if (panel.isCollapsed()) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  };
  return (
    <PanelRefContext.Provider
      value={{ getPanelRef, collapsePanel, expandPanel, togglePanel }}
    >
      {children}
    </PanelRefContext.Provider>
  );
};

// Hook to use the context
export const usePanelRefs = (): PanelRefContextType => {
  const context = useContext(PanelRefContext);
  if (!context) {
    throw new Error("usePanelRefs must be used within a PanelRefProvider");
  }
  return context;
};
