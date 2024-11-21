
"use client"
import Header from "@/components/common/header/header";
import { useState } from "react";
import CreateAttributesDialog from "./create/create_dialog";
import { Settings } from "lucide-react";

export default function AttributesComponent() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-h-0 flex flex-col w-3/5 ">
      <Header
        title="Attributes"
        actionType="add"
        onActionClick={() => setOpen(true)}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
      {[1, 1, 1, 1,1,1,1,1].map((ele, key) => {
        return (
          <div key={key}className="flex border-b gap-2 px-2 py-2 items-center">
            <Settings />
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
