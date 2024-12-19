import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateFolder({
  createNewFolder,
  currentPath,
  isCreatingFolder,
  newFolderName,
  setIsCreatingFolder,
  setNewFolderName,
}: {
  isCreatingFolder: boolean;
  setIsCreatingFolder: React.Dispatch<React.SetStateAction<boolean>>;
  currentPath: string;
  newFolderName: string;
  setNewFolderName: React.Dispatch<React.SetStateAction<string>>;
  createNewFolder: () => Promise<void>;
}) {
  return (
    <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
      <DialogContent className="sm:max-w-[425px] bg-secondary">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for the new folder in {currentPath || "root"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folderName" className="text-right text-nowrap">
              Folder Name
            </Label>
            <Input
              id="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createNewFolder()}
              className="col-span-3"
              placeholder="Enter folder name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={createNewFolder}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
