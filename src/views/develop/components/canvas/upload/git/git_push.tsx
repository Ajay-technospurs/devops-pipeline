import React, { useState } from "react";
import { Octokit } from "@octokit/rest";
import { RepositoryProvider } from "@/types/repository";
import { RepositoryBrowserDialog } from "../../../projects/files_viewer/file_viewer";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // Assuming Shadcn's toast setup is used
import { GitHubProjectType } from "@/mongodb/model/github";
import { AddSubProjectbyId } from "@/actions/projects";

interface GitHubFilePushProps {
  repository: {
    provider: RepositoryProvider;
    owner: string;
    repo:string
    fullName: string;
    name: string;
    accessToken?: string;
    id: string;
    isPrivate: boolean;
  };
  data: Record<string, any>; // Ensuring the data is an object
  fileName?: string; // Optional custom filename
}

export function GitHubFilePush({
  repository,
  data,
  fileName = "pipeline.json",
}: GitHubFilePushProps) {
  const [isRepositoryBrowserOpen, setIsRepositoryBrowserOpen] = useState(false);

  const pushFileToGitHub = async (filePath: string) => {
    try {
      if (!repository?.owner || !repository?.name) {
        throw new Error("Repository owner or name is missing.");
      }

      const cleanPath = filePath.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
      const fullPath = cleanPath.endsWith(".json")
        ? cleanPath
        : `${cleanPath}/${fileName}`;

      // Initialize Octokit
      const octokit = new Octokit({
        auth: repository.accessToken || undefined,
      });

      // Convert content to Base64
      const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString(
        "base64"
      );

      let sha: string | undefined;
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner: repository.owner,
          repo: repository.name,
          path: fullPath,
          mediaType: { format: "object" },
        });
        sha = "sha" in existingFile ? existingFile.sha : undefined;
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        sha = undefined;
      }

      const response = await octokit.repos.createOrUpdateFileContents({
        owner: repository.owner,
        repo: repository.name,
        path: fullPath,
        message: `Add/Update ${fileName}`,
        content: contentBase64,
        sha, // Include SHA if file exists
      });
      toast({
        title: `File successfully pushed to GitHub!`,
        description: fullPath,
      });
      const gitData: any = response.data;
      const body: Partial<GitHubProjectType> = {
        owner: repository.owner,
        name: gitData?.content?.name,
        repo: repository.name,
        url: gitData?.content?.url,
        token: repository.accessToken,
        isPrivate: repository.accessToken != null,
      };
      await AddSubProjectbyId(repository?.id, body);
      return {
        success: true,
        data: gitData,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast({ title: `Failed to push file: ${errorMessage}` });
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleFileSelect = async (filePath: string) => {
    if (!repository.accessToken) {
      toast({ title: "Access token is required to push files." });
      // toast.error("Access token is required to push files.");
      return;
    }

    await pushFileToGitHub(filePath);

    // setIsRepositoryBrowserOpen(false);
  };

  return (
    <>
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => setIsRepositoryBrowserOpen(true)}
      >
        <Download className="w-5 h-5 foreground-dark" />
      </button>

      {isRepositoryBrowserOpen && (
        <RepositoryBrowserDialog
          isOpen={isRepositoryBrowserOpen}
          onOpenChange={(open) => setIsRepositoryBrowserOpen(open)}
          repository={repository}
          onFileSelect={handleFileSelect}
          initialPath=""
          isPush={true}
        />
      )}
    </>
  );
}
