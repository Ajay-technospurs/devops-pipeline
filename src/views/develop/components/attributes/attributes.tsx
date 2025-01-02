
"use client"
import Header from "@/components/common/header/header";
import { useState } from "react";
import AttributesTabsLayout from "./layout/layout";

export default function AttributesComponent() {

  return (
    <div className="min-h-0 flex flex-col w-full h-full">
      <Header
        title="Attributes"
        actionType="info"
      />
      <AttributesTabsLayout />
    </div>
  );
}
