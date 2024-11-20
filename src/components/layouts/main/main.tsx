import React from "react";

import TopBar from "./top_bar/top_bar";
import NavigationTabs from "./navigation_tabs/navigation_tabs";

// Main Layout Component that combines TopBar and NavigationTabs
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-svh h-svh max-h-svh overflow-hidden bg-background text-foreground">
    <TopBar />
    <NavigationTabs />
    <main className="flex-1 min-h-0">{children}</main>
  </div>
);

export default MainLayout;
