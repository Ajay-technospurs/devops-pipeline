"use client";

import React, { createContext, useContext, useState } from "react";

interface ComponentState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

interface UIContextType {
  sidebar: ComponentState;
  configBar: ComponentState;
  // Add other components' state management here as needed
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  // State management for the Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebar = {
    isOpen: isSidebarOpen,
    toggle: () => setIsSidebarOpen((prev) => !prev),
    open: () => setIsSidebarOpen(true),
    close: () => setIsSidebarOpen(false),
  };

  // State management for the ConfigBar
  const [isConfigBarOpen, setIsConfigBarOpen] = useState(false);
  const configBar = {
    isOpen: isConfigBarOpen,
    toggle: () => setIsConfigBarOpen((prev) => !prev),
    open: () => setIsConfigBarOpen(true),
    close: () => setIsConfigBarOpen(false),
  };

  return (
    <UIContext.Provider value={{ sidebar, configBar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
}
