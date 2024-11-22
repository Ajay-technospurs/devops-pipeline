import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Define the schema using zod
const projectSchema = z.object({
  label: z.string().min(1, "Project name is required"),
  url: z.string().min(1, "File path/URL is required").url("Invalid URL format"),
  value: z.string().optional(),
  main: z.boolean().optional().default(false),
  shared: z.boolean().optional().default(false),
  children:z.any().optional().default([])
});

// Infer the TypeScript type from the schema
type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      label: "",
      url: "",
    },
  });
  const onSubmit = async (data: ProjectFormData) => {
    data.value = data.label;

    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();
      console.log("Project created:", result);
      toast({
        title: "Project created successfully",
        description: data.label,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setOpen(false);
      reset(); // Reset form after submission
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[60px]">
          <div className="space-y-[20px]">
            <label
              htmlFor="projectName"
              className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Project Name
            </label>
            <Controller
              name="label"
              control={control}
              render={({ field }) => (
                <Input
                  id="projectName"
                  placeholder="Enter Project Name"
                  {...field}
                  className="w-full"
                  disabled={loading}
                />
              )}
            />
            {errors.label && (
              <p className="text-sm text-red-500">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-[20px]">
            <label
              htmlFor="filePath"
              className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              File Path / URL
            </label>
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <Input
                  id="url"
                  placeholder="Enter Project File Path / URL"
                  {...field}
                  className="w-full"
                  disabled={loading}
                />
              )}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="flex-1 hover:bg-background"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <Loader size="sm" color="border-primary-foreground" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
