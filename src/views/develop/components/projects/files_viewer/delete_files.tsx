import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RepositoryItem } from "./file_viewer";
export function DeleteConformation({
  deleteItem,
  itemToDelete,
  setItemToDelete,
  setShowDeleteAlert,
  showDeleteAlert,
}: {
  showDeleteAlert: boolean;
  setShowDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>;
  itemToDelete: RepositoryItem | null;
  setItemToDelete: React.Dispatch<React.SetStateAction<RepositoryItem | null>>;
  deleteItem: () => Promise<void>;
}) {
  return (
    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            {itemToDelete?.type === "dir" ? "folder" : "file"}{" "}
            <span className="font-medium">{itemToDelete?.name}</span>
            {itemToDelete?.type === "dir" && " and all its contents"}. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setShowDeleteAlert(false);
              setItemToDelete(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteItem}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
