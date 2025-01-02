import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { GitHubRepositorySchema, RepositoryProvider } from '@/types/repository';
import { useRepositorySync } from '@/hooks/repo-sync';
import { toast } from '@/hooks/use-toast';

export function GitHubRepositoryForm({
  initialData = null,
  onSuccess,
}: {
  initialData?: any | null;
  onSuccess?: any;
}) {
  const { syncRepository, updateRepository } = useRepositorySync();
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);

  const form = useForm({
    resolver: zodResolver(GitHubRepositorySchema),
    defaultValues: initialData || {
      provider: RepositoryProvider.GITHUB,
      name: '',
      fullName: '',
      url: '',
      isPrivate: false,
      accessToken: '',
      description: '',
      stars: 0,
      forks: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setIsPrivate(initialData.isPrivate || false);
    }
  }, [initialData, form]);

  const extractFullNameFromUrl = (url: string) => {
    if(url.endsWith(".git")){
      url = url.replace(".git","")
    }
    const match = url.match(/github\.com\/([^/]+\/[^/]+)(?:\.git)?$/);
    return match ? match[1] : '';
  };

  const onSubmit = async (data: any) => {
    try {
      let repositoryData = { ...data };

      if (!initialData) {
        const githubResponse = await axios.get(
          `https://api.github.com/repos/${data.fullName}`,
          {
            headers: data.accessToken
              ? { Authorization: `token ${data.accessToken}` }
              : {},
          }
        );

        repositoryData = {
          ...repositoryData,
          description: githubResponse.data.description,
          stars: githubResponse.data.stargazers_count,
          forks: githubResponse.data.forks_count,
          url: githubResponse.data.html_url,
          token:data.accessToken
        };
      }

      if (initialData) {
        await updateRepository(repositoryData);
        toast({
          title: "Repository Updated",
          description: `${data.fullName} has been successfully updated.`,
        });
      } else {
        await syncRepository(repositoryData);
        toast({
          title: "Repository Added",
          description: `${data.fullName} has been successfully added.`,
        });
      }

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error handling GitHub repository:', error);
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'add'} repository`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/owner/repository-name"
                  {...field}
                  onChange={(e) => {
                    const url = e.target.value;
                    field.onChange(url);
                    const fullName = extractFullNameFromUrl(url);
                    console.log("Extracted Full Name:", fullName);  // Debugging line
                    form.setValue('fullName', fullName);
                    form.setValue('name', fullName.split('/')[1] || '');
                  }}
                />
              </FormControl>
              <FormDescription>
                e.g., https://github.com/owner/repository-name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
              <div>
                <FormLabel>Private Repository</FormLabel>
                <FormDescription>
                  Enable this for private repositories.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    setIsPrivate(value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isPrivate && (
          <FormField
            control={form.control}
            name="accessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Personal Access Token</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Required for private repositories"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide your personal access token to access private repositories.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          {initialData ? 'Update GitHub Repository' : 'Add GitHub Repository'}
        </Button>
      </form>
    </Form>
  );
}
