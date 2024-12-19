import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RepositoryItem } from "./file_viewer";
import { Button } from "@/components/ui/button";
import { RepositoryProvider } from "@/types/repository";
import { CopyIcon } from "lucide-react";
import React from "react";

export default function BreadCrumbListComp({
  breadcrumbs,
  fetchContents,
  handleBreadcrumbClick,
  handleCopyPath,
  repository,
  selectedFile,
}: {
  selectedFile: RepositoryItem | null;
  breadcrumbs: string[];
  fetchContents: (path?: string) => Promise<void>;
  repository: {
    provider: RepositoryProvider;
    fullName: string;
    owner: string;
    name: string;
    accessToken?: string;
  };
  handleBreadcrumbClick: (index: number) => void;
  handleCopyPath: () => void;
}) {
  const segments = selectedFile
    ? [...breadcrumbs, selectedFile.name]
    : breadcrumbs;

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => fetchContents()}>
          {repository.provider}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {segments.map((segment, index) => (
        <React.Fragment key={segment}>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={
                () =>
                  index < breadcrumbs.length
                    ? handleBreadcrumbClick(index)
                    : null // Disable click for the selected file
              }
              className={
                index < breadcrumbs.length ? "cursor-pointer" : "cursor-default"
              }
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
  );
}
