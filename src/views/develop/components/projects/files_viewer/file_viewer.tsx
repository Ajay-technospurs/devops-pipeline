import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { 
  FileIcon, 
  FolderIcon, 
  CodeIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RepositoryProvider } from '@/types/repository';

// Interfaces for file and folder structures
interface RepositoryItem {
  path: string;
  name: string;
  type: 'file' | 'dir';
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

// Provider-specific file fetching strategies
const PROVIDER_STRATEGIES:any = {
  [RepositoryProvider.GITHUB]: {
    async fetchDirectoryContents(repo:any, path:string, token:string) {
      const response = await axios.get(
        `https://api.github.com/repos/${repo.fullName}/contents/${path || ''}`,
        { 
          headers: token 
            ? { Authorization: `token ${token}` } 
            : {} 
        }
      );
      return response.data.map((item:any) => ({
        path: item.path,
        name: item.name,
        type: item.type,
        size: item.size
      }));
    },
    async fetchFileContent(repo:any, path:string, token:string) {
      const response = await axios.get(
        `https://api.github.com/repos/${repo.fullName}/contents/${path}`,
        { 
          headers: token 
            ? { Authorization: `token ${token}` } 
            : {},
          params: { ref: 'main' }
        }
      );
      return atob(response.data.content);
    }
  },
  [RepositoryProvider.GITLAB]: {
    async fetchDirectoryContents(repo:any, path:string, token:string) {
      // GitLab implementation would go here
      throw new Error('GitLab support not yet implemented');
    },
    async fetchFileContent(repo:any, path:string, token:string) {
      // GitLab implementation would go here
      throw new Error('GitLab support not yet implemented');
    }
  }
};

export function RepositoryBrowserDialog({
  isOpen,
  onOpenChange,
  repository,
  initialPath,
  onFileSelect
}: RepositoryBrowserDialogProps) {
  const [currentPath, setCurrentPath] = useState(initialPath || '');
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<RepositoryItem | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch directory contents
  const fetchContents = async (path = '') => {
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
      
      // Update breadcrumbs
      const pathSegments = path.split('/').filter(Boolean);
      setBreadcrumbs(pathSegments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contents');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch file content
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
      setError(err instanceof Error ? err.message : 'Failed to fetch file content');
    }
  };

  // Navigation and interaction handlers
  const handleItemClick = (item: RepositoryItem) => {
    if (item.type === 'dir') {
      fetchContents(item.path);
    } else {
      fetchFileContent(item);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = breadcrumbs.slice(0, index + 1).join('/');
    fetchContents(newPath);
  };

  const handleFileSelect = () => {
    if (selectedFile) {
      onFileSelect?.(selectedFile.path);
      onOpenChange(false);
    }
  };

  // Initial content fetch
  useEffect(() => {
    if (isOpen) {
      fetchContents(initialPath);
    }
  }, [isOpen, initialPath]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Repository Browser - {repository.fullName}
          </DialogTitle>
          <DialogDescription>
            Browse and select files from the repository
          </DialogDescription>
        </DialogHeader>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
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
          </BreadcrumbList>
        </Breadcrumb>

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-4 flex-grow overflow-hidden">
          {/* File/Folder List */}
          <div className="col-span-1 border rounded">
            <ScrollArea className="h-full w-full">
              {isLoading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow 
                        key={item.path}
                        onClick={() => handleItemClick(item)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.type === 'dir' ? (
                              <FolderIcon className="h-4 w-4" />
                            ) : (
                              <FileIcon className="h-4 w-4" />
                            )}
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {item.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </div>

          {/* File Preview Tabs */}
          <div className="col-span-2 border rounded">
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="raw">Raw</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="p-4">
                {selectedFile ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {selectedFile.name}
                      </h3>
                      <Badge>{selectedFile.path}</Badge>
                    </div>
                    <ScrollArea className="h-[500px] border rounded p-2">
                      <pre className="text-sm">{selectedFile.content}</pre>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Select a file to preview
                  </div>
                )}
              </TabsContent>
              <TabsContent value="raw" className="p-4">
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
              
            {/* Action Buttons */}
            <div className="p-4 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFileSelect}
                disabled={!selectedFile}
              >
                Select File
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}