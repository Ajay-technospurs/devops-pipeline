
"use client"
import Header from "@/components/common/header/header";
import { useState } from "react";
import CreateAttributesDialog from "./create/create_dialog";
import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AttributesComponent() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-h-0 flex flex-col w-3/5 ">
      <Header
        title="Attributes"
        actionType="add"
        onActionClick={() => setOpen(true)}
      />
      <div className="p-2 flex-shrink-0">
        <Input
          placeholder="Search and select..."
          // value={searchTerm}
          // onChange={(e) => handleSearch(e.target.value)}
          startIcon={<Search size={16} />}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
      {[1, 1, 1, 1,1].map((ele, key) => {
        return (
          <div key={key}className="flex border-b gap-2 px-2 py-2 items-center">
            <Settings className="foreground" />
            <div className="text-sm">Random Attribute </div>
          </div>
        );
      })}
      </div>
      <div className="">
        <CreateAttributesDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
