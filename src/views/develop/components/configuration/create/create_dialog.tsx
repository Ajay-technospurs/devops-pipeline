import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProjectFormData {
  name: string;
  filePath: string;
}

export default function CreateConfigDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    filePath: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle your form submission logic here
    console.log(formData);
    setOpen(false);
    setFormData({ name: "", filePath: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-md bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-[60px]">
          <div className="space-y-[20px]">
            <label
              htmlFor="projectName"
              className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Project Name
            </label>
            <Input
              id="projectName"
              placeholder="Enter Project Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full"
            />
          </div>

          <div className="space-y-[20px]">
            <label
              htmlFor="filePath"
              className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              File Path / URL
            </label>
            <Input
              id="filePath"
              placeholder="Enter Project File Path / URL"
              value={formData.filePath}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, filePath: e.target.value }))
              }
              className="w-full"
            />
          </div>

          <div className="flex  space-x-4">
            <Button
              type="button"
              size={"lg"}
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 hover:bg-background"
            >
              Cancel
            </Button>
            <Button size={"lg"} type="submit" className="flex-1">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
