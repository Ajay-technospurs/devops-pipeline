import Header from "@/components/common/header/header";
import { useState } from "react";
import CreateConfigDialog from "./create/create_dialog";
import CreateAttributesDialog from "./create/create_dialog";

export default function AttributesComponent() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="h-[40%] min-h-0 flex flex-col w-3/5 ">
      <Header
        title="Attributes"
        actionType="add"
        onActionClick={() => setOpen(true)}
      />
      <div className="flex-1 min-h-0">
        <CreateAttributesDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
