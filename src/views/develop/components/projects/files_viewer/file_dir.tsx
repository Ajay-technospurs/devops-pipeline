import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderPlusIcon, FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Assuming you have this component
import { RepositoryItem } from "./file_viewer";

export default function FileDirectory({
  error,
  handleItemClick,
  isLoading,
  isPush,
  items,
  selectedFile,
  setIsCreatingFolder,
  handleDeleteClick,
}: {
  isPush: boolean;
  setIsCreatingFolder: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: string | null;
  items: RepositoryItem[];
  handleItemClick: (item: RepositoryItem) => void;
  handleDeleteClick: (item: RepositoryItem) => void;
  selectedFile: RepositoryItem | null;
}) {
  return (
    <div className="min-w-[400px] border rounded flex flex-col">
      <div className="overflow-y-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-full">Name</TableHead>
              <TableCell>
                {isPush && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    <FolderPlusIcon className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} rowSpan={6} className="text-center">
                  <Spinner size="h-8 w-8" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="text-red-500">{error}</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.path}
                  
                  className={
                    "cursor-pointer hover:bg-accent" +
                    (selectedFile?.name === item.name ? " bg-border" : "")
                  }
                >
                  <TableCell onClick={() => handleItemClick(item)}>
                    <div className="flex items-center gap-2">
                      {item.type === "dir" ? (
                        <FolderIcon className="h-4 w-4 foreground" />
                      ) : (
                        <FileIcon className="h-4 w-4 foreground" />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary"
                        >
                          •••
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteClick(item)}>
                          <Trash2Icon className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
