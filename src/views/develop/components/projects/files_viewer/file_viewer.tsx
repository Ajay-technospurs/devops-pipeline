import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, CopyIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepositoryProvider } from "@/types/repository";
import { SyntaxHighlighter } from "./syntax_highlighter";

// Interfaces for file and folder structures
interface RepositoryItem {
  path: string;
  name: string;
  type: "file" | "dir";
  size?: number;
  content?: string;
  language?: string;
}

interface RepositoryBrowserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  repository: {
    provider: RepositoryProvider;
    fullName: string;
    accessToken?: string;
  };
  initialPath?: string;
  onFileSelect?: (filePath: string) => void;
}

const PROVIDER_STRATEGIES: any = {
  [RepositoryProvider.GITHUB]: {
    async fetchDirectoryContents(repo: any, path: string, token: string) {
      const response = await axios.get(
        `https://api.github.com/repos/${repo.fullName}/contents/${path || ""}`,
        {
          headers: token ? { Authorization: `token ${token}` } : {},
        }
      );
      return response.data.map((item: any) => ({
        path: item.path,
        name: item.name,
        type: item.type,
        size: item.size,
      }));
    },
    async fetchFileContent(repo: any, path: string, token: string) {
      const response = await axios.get(
        `https://api.github.com/repos/${repo.fullName}/contents/${path}`,
        {
          headers: token ? { Authorization: `token ${token}` } : {},
          params: { ref: "main" },
        }
      );
      if (
        /\.(png|jpg|jpeg|gif|bmp|webp|svg|tiff|ico)$/i.test(response.data?.path)
      ) {
        return response.data?.content;
      }

      return atob(response.data?.content);
    },
  },
};

export function RepositoryBrowserDialog({
  isOpen,
  onOpenChange,
  repository,
  initialPath,
  onFileSelect,
}: RepositoryBrowserDialogProps) {
  const [currentPath, setCurrentPath] = useState(initialPath || "");
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<RepositoryItem | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = async (path = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const strategy = PROVIDER_STRATEGIES[repository.provider];
      const contents = await strategy.fetchDirectoryContents(
        repository,
        path,
        repository.accessToken
      );

      setItems(contents);
      setCurrentPath(path);

      const pathSegments = path.split("/").filter(Boolean);
      setBreadcrumbs(pathSegments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contents");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileContent = async (file: RepositoryItem) => {
    try {
      const strategy = PROVIDER_STRATEGIES[repository.provider];
      const content = await strategy.fetchFileContent(
        repository,
        file.path,
        repository.accessToken
      );

      setSelectedFile({ ...file, content });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch file content"
      );
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
    const newPath = breadcrumbs.slice(0, index + 1).join("/");
    fetchContents(newPath);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(currentPath);
  };

  const handleFileSelect = () => {
    if (selectedFile) {
      onFileSelect?.(selectedFile.path);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchContents(initialPath);
    }
  }, [isOpen, initialPath]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[95vh] flex flex-col min-h-0 p-4 gap-2">
        <DialogHeader className="flex-shrink">
          <DialogTitle>Repository Browser - {repository.fullName}</DialogTitle>
          <DialogDescription>
            Browse and select files from the repository
          </DialogDescription>
        </DialogHeader>

        <Breadcrumb className="flex-shrink">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => fetchContents()}
                className="cursor-pointer"
              >
                {repository.provider}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((segment, index) => (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => handleBreadcrumbClick(index)}
                    className="cursor-pointer"
                  >
                    {segment}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            <Button variant="ghost" className="ml-2" onClick={handleCopyPath}>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-4 flex-1 min-h-0 w-full min-w-0">
          <div className="min-w-[400px] border rounded  min-h-0 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : (
              <Table>
                {/* <TableHeader >
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader> */}
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.path}
                      onClick={() => handleItemClick(item)}
                      className="cursor-pointer hover:bg-accent"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.type === "dir" ? (
                            <FolderIcon
                              fill={"hsl(var(--primary-foreground))"}
                              className="h-4 w-4 foreground"
                            />
                          ) : (
                            <FileIcon className="h-4 w-4 foreground" />
                          )}
                          {item.name}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex-1 border rounded flex flex-col min-h-0 min-w-0">
            <Tabs
              defaultValue="preview"
              className="flex-1 min-h-0 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="raw">Raw</TabsTrigger>
              </TabsList>
              <TabsContent
                value="preview"
                className="p-4 h-full flex-1 min-h-0 overflow-y-auto"
              >
                {selectedFile ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold">
                        {selectedFile.name}
                      </h3>
                      <Badge>{selectedFile.path}</Badge>
                    </div>
                    {selectedFile.content ? (
                      /\.(png|jpg|jpeg|gif|bmp|webp|svg|tiff|ico)$/i.test(
                        selectedFile.path
                      ) ? (
                        <img
                          src={`data:image/${selectedFile.path
                            .split(".")
                            .pop()};base64,${selectedFile.content}`}
                          alt={selectedFile.name}
                          className="max-h-[400px] mx-auto"
                        />
                      ) : (
                        <SyntaxHighlighter
                          code={selectedFile.content}
                          fileExtension={
                            selectedFile.path?.split(".").pop() ?? ""
                          }
                        />
                      )
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Cannot preview this file type.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Select a file to preview
                  </div>
                )}
              </TabsContent>
              <TabsContent
                value="raw"
                className="p-4 h-full flex-1 min-h-0 overflow-y-auto"
              >
                {selectedFile ? (
                  <ScrollArea className="h-[500px] border rounded p-2">
                    <code className="block whitespace-pre-wrap break-all">
                      {selectedFile.content}
                    </code>
                  </ScrollArea>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Select a file to view raw content
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleFileSelect} disabled={!selectedFile}>
                Select File
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
