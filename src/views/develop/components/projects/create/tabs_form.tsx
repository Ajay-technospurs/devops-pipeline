import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github as GitHubLogoIcon,
  Gitlab as GitLabLogoIcon,
} from "lucide-react";

import { RepositoryProvider } from "@/types/repository";
import { GitHubRepositoryForm } from "./providers/GitHubRepositoryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { GitLabRepositoryForm } from './providers/GitLabRepositoryForm';

// Mapping of providers to their respective icons and form components
const PROVIDER_CONFIG = {
  [RepositoryProvider.GITHUB]: {
    icon: <GitHubLogoIcon className="h-5 w-5" />,
    FormComponent: GitHubRepositoryForm,
    label: "GitHub",
  },
  //   [RepositoryProvider.GITLAB]: {
  //     icon: <GitLabLogoIcon className="h-5 w-5" />,
  //     FormComponent: GitLabRepositoryForm,
  //     label: 'GitLab'
  //   },
  // Future providers can be added here
};

export function ProjectCreateEdit({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [activeProvider, setActiveProvider] = useState<RepositoryProvider>(
    RepositoryProvider.GITHUB
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg bg-secondary">
      <DialogHeader>
          <DialogTitle className="text-3xl text-start">
            {"New Project"}
          </DialogTitle>
        </DialogHeader>

            Select a provider and enter repository details

          <Tabs
            value={activeProvider}
            onValueChange={(value) =>
              setActiveProvider(value as RepositoryProvider)
            }
            className="w-full items-start justify-start"
          >
            {/* Provider Selection Tabs */}
            <TabsList className="flex justify-start">
              {Object.entries(PROVIDER_CONFIG).map(([provider, config]) => (
                <TabsTrigger
                  key={provider}
                  value={provider}
                  className="flex items-center gap-2"
                >
                  {config.icon}
                  {config.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Provider-Specific Forms */}
            {Object.entries(PROVIDER_CONFIG).map(([provider, config]) => {
              const FormComponent = config.FormComponent;
              return (
                <TabsContent key={provider} value={provider}>
                  <FormComponent onSuccess={()=>{
                    window.location.reload()
                  }} />
                </TabsContent>
              );
            })}
          </Tabs>
        
      </DialogContent>
    </Dialog>
  );
}
