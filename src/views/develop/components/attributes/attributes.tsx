
"use client"
import Header from "@/components/common/header/header";
import { useState } from "react";
import CreateAttributesDialog from "./create/create_dialog";
import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import AttributesTabsLayout from "./layout/layout";

export default function AttributesComponent() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-h-0 flex flex-col w-full h-full">
      <Header
        title="Attributes"
        actionType="info"
        // onActionClick={() => setOpen(true)}
      />
      <AttributesTabsLayout />
    </div>
  );
}
