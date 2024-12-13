import React, { useEffect } from 'react';
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
import { GitHubProjectType } from '@/mongodb/model/github';

export function GitHubRepositoryForm({ initialData = null, onSuccess }:{initialData?:any | null,onSuccess?:Function}) {
  const { syncRepository, updateRepository } = useRepositorySync();

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
      forks: 0
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data:any) => {
    try {
      let repositoryData = { ...data };

      // Fetch additional repository details if creating
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
        };
      }

      // Sync or update repository
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

      // Reset form and notify parent component
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="owner/repository-name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue('name', e.target.value.split('/')[1] || '');
                    form.setValue('url', `https://github.com/${e.target.value}`);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter in format: username/repository-name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Private Repository</FormLabel>
                <FormDescription>
                  Check if this is a private repository
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Personal Access Token</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Optional for private repositories"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Required for accessing private repositories and fetching details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? 'Update GitHub Repository' : 'Add GitHub Repository'}
        </Button>
      </form>
    </Form>
  );
}
