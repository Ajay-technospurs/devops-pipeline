import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepositoryProvider } from "@/types/repository";
import { SyntaxHighlighter } from "./syntax_highlighter";
import { DeleteConformation } from "./delete_files";
import CreateFolder from "./create_folder";
import FileDirectory from "./file_dir";
import BreadCrumbListComp from "./breadcrumbs";

// Interfaces for file and folder structures
export interface RepositoryItem {
  path: string;
  name: string;
  type: "file" | "dir";
  content?: string;
}

interface RepositoryBrowserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  repository: {
    provider: RepositoryProvider;
    fullName: string;
    owner: string;
    name: string;
    repo: string;
    accessToken?: string;
  };
  initialPath?: string;
  onFileSelect?: (filePath: string) => Promise<void>;
  isPush?: boolean;
}

export function RepositoryBrowserDialog({
  isOpen,
  onOpenChange,
  repository,
  initialPath = "",
  onFileSelect,
  isPush = false,
}: RepositoryBrowserDialogProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<RepositoryItem | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RepositoryItem | null>(null);

  const octokit = new Octokit({
    auth: repository.accessToken,
    request: {
      fetch: (url: any, options: any) => {
        options.cache = "no-store";
        return fetch(url, options);
      },
    },
  });

  const handleDeleteClick = (item: RepositoryItem) => {
    setItemToDelete(item);
    setShowDeleteAlert(true);
  };

  const deleteItem = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "dir") {
        // For directories, we need to recursively delete all contents
        const deleteContents = async (path: string) => {
          const { data } = await octokit.repos.getContent({
            owner: repository.owner,
            repo: repository.name,
            path,
          });

          if (Array.isArray(data)) {
            for (const item of data) {
              if (item.type === "dir") {
                await deleteContents(item.path);
              } else {
                await octokit.repos.deleteFile({
                  owner: repository.owner,
                  repo: repository.name,
                  path: item.path,
                  message: `Delete ${item.path}`,
                  sha: item.sha,
                });
              }
            }
          }
        };

        await deleteContents(itemToDelete.path);
      } else {
        // For files, get the SHA first
        const { data } = await octokit.repos.getContent({
          owner: repository.owner,
          repo: repository.name,
          path: itemToDelete.path,
        });

        if (!Array.isArray(data) && data.sha) {
          await octokit.repos.deleteFile({
            owner: repository.owner,
            repo: repository.name,
            path: itemToDelete.path,
            message: `Delete ${itemToDelete.name}`,
            sha: data.sha,
          });
        }
      }

      // Refresh the current directory
      await fetchContents(currentPath, true);
      if (selectedFile?.path === itemToDelete.path) {
        setSelectedFile(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    } finally {
      setShowDeleteAlert(false);
      setItemToDelete(null);
    }
  };
  const fetchContents = async (fullPath: string = "", forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    const isFilePath = fullPath.includes("api.github.com");
    try {
      let owner = repository.owner;
      let repo = repository.repo!=""&&repository.repo!=undefined&&repository.repo!=null?repository?.repo:repository.name;
      let path = fullPath;

      if (isFilePath) {
        // Extract owner, repo, and relative path from the full URL
        const match = fullPath.match(
          /repos\/([^/]+)\/([^/]+)\/contents\/(.+?)(\?|$)/
        );
        if (match) {
          owner = match[1]; // Extract owner
          repo = match[2]; // Extract repo name
          path = match[3]; // Extract the relative path

          // Remove the filename from the path
          const lastSlashIndex = path.lastIndexOf("/");
          if (lastSlashIndex !== -1) {
            path = path.substring(0, lastSlashIndex); // Keep only the directory
          }
        }
      }

      // Prepare the options
      const options = {
        owner,
        repo,
        path,
        request: { cache: "no-store" },
      };

      const { data } = await octokit.repos.getContent(options);

      const parsedItems = Array.isArray(data)
        ? data.map((item) => ({
            path: item.path,
            name: item.name,
            type: item.type === "dir" ? "dir" : "file",
          }))
        : [];
      if (isFilePath) {
        const fileName = fullPath.substring(
          fullPath.lastIndexOf("/") + 1,
          fullPath.indexOf("?") > -1 ? fullPath.indexOf("?") : undefined
        );
        const item = parsedItems.find((ele) => ele.name == fileName);
        fetchFileContent(item as RepositoryItem);
      }
      setItems(parsedItems as any);
      setBreadcrumbs(path.split("/").filter(Boolean));
      setCurrentPath(path);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contents");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    try {
      // Create a .gitkeep file in the new folder to make it exist
      const folderPath = `${
        currentPath ? currentPath + "/" : ""
      }${newFolderName}/.gitkeep`;

      await octokit.repos.createOrUpdateFileContents({
        owner: repository.owner,
        repo: repository.name,
        path: folderPath,
        message: `Create folder: ${newFolderName}`,
        content: Buffer.from("").toString("base64"),
      });

      // Refresh the current directory
      await fetchContents(currentPath, true);
      setIsCreatingFolder(false);
      setNewFolderName("");
    } catch (err: any) {
      setError(err.message || "Failed to create folder");
    }
  };

  const fetchFileContent = async (file: RepositoryItem) => {
    try {
      const { data } = await octokit.repos.getContent({
        owner: repository.owner,
        repo: repository.repo!=""&&repository.repo!=undefined&&repository.repo!=null?repository?.repo:repository.name,
        path: file.path,
      });

      const content = "content" in data ? atob(data.content) : "";
      setSelectedFile({ ...file, content });
    } catch (err: any) {
      setError(err.message || "Failed to fetch file content");
    }
  };

  const handleItemClick = (item: RepositoryItem) => {
    if (item.type === "dir") {
      fetchContents(item.path);
    } else {
      fetchFileContent(item);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    // If the last breadcrumb is the selected file, deselect the file and go to its directory.
    if (index === breadcrumbs.length && selectedFile) {
      fetchContents(selectedFile.path.split("/").slice(0, -1).join("/"), true);
      setSelectedFile(null);
    } else {
      setSelectedFile(null);
      const newPath = breadcrumbs.slice(0, index + 1).join("/");
      fetchContents(newPath, true);
    }
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(currentPath);
  };

  const handleFileSelect = async () => {
    if (isPush) {
      await onFileSelect?.(currentPath || "");
      fetchContents(currentPath, true);
    } else if (selectedFile) {
      onFileSelect?.(selectedFile.path);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (isOpen) {
        await fetchContents(initialPath);
      }
    }
    fetchData();
  }, [isOpen, initialPath]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] h-[95vh] flex flex-col p-4 gap-2 min-h-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Repository Browser - {repository.fullName}
            </DialogTitle>
            <DialogDescription>
              Browse and select files from the repository
            </DialogDescription>
          </DialogHeader>

          <Breadcrumb>
            <BreadCrumbListComp
              selectedFile={selectedFile}
              breadcrumbs={breadcrumbs}
              fetchContents={fetchContents}
              repository={repository}
              handleBreadcrumbClick={handleBreadcrumbClick}
              handleCopyPath={handleCopyPath}
            />
          </Breadcrumb>

          <div className="flex gap-4 flex-1 min-h-0 w-full min-w-0">
            <FileDirectory
              isPush={isPush}
              setIsCreatingFolder={setIsCreatingFolder}
              isLoading={isLoading}
              error={error}
              items={items}
              handleItemClick={handleItemClick}
              handleDeleteClick={handleDeleteClick}
              selectedFile={selectedFile}
            />

            <div className="flex-1 border rounded flex flex-col min-h-0 min-w-0">
              <Tabs
                defaultValue="preview"
                className="flex-1 flex flex-col min-h-0"
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="preview"
                  className="flex-1 min-h-0 p-4 overflow-auto"
                >
                  {selectedFile ? (
                    selectedFile.content ? (
                      /\.(png|jpg|jpeg|gif|bmp|webp|svg|tiff|ico)$/i.test(
                        selectedFile.path
                      ) ? (
                        <img
                          src={`data:image/${selectedFile.path
                            .split(".")
                            .pop()};base64,${btoa(selectedFile.content)}`}
                          alt={selectedFile.name}
                          className="max-h-[400px] mx-auto"
                        />
                      ) : (
                        <SyntaxHighlighter
                          code={selectedFile.content}
                          fileExtension={
                            selectedFile.path.split(".").pop() || ""
                          }
                        />
                      )
                    ) : (
                      <div className="text-center">
                        Cannot preview this file type.
                      </div>
                    )
                  ) : (
                    <div className="text-center">Select a file to preview</div>
                  )}
                </TabsContent>
                <TabsContent
                  value="raw"
                  className="flex-1 min-h-0 p-4 overflow-auto"
                >
                  {selectedFile ? (
                    <code className="block whitespace-pre-wrap">
                      {selectedFile.content}
                    </code>
                  ) : (
                    <div className="text-center">
                      Select a file to view raw content
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleFileSelect}
                  disabled={!selectedFile && !isPush}
                >
                  Select File
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateFolder
        isCreatingFolder={isCreatingFolder}
        setIsCreatingFolder={setIsCreatingFolder}
        currentPath={currentPath}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        createNewFolder={createNewFolder}
      />
      <DeleteConformation
        showDeleteAlert={showDeleteAlert}
        setShowDeleteAlert={setShowDeleteAlert}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        deleteItem={deleteItem}
      />
    </>
  );
}
