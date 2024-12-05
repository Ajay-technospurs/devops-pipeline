import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useFlow } from "@/provider/canvas_provider";

// Zod schema for global inputs
const globalInputSchema = z.object({
  globalInputs: z.array(
    z.object({
      id:z.string().optional(),
      key: z.string().min(1, { message: "Key is required" }),
      value: z.string().min(1, { message: "Value is required" }),
    })
  ),
});

const StartNodeDetailsForm = () => {
  const { state, updateNode } = useFlow();
  console.log(state, "state");
  console.log(
    state.selectedNode,
    state.selectedNode?.data,
    state.selectedNode?.data?.globalInputs,
    "inputs"
  );

  // Prepare initial form data
  const defaultValues: any = {
    globalInputs: state.selectedNode?.data?.globalInputs
      ? state.selectedNode.data.globalInputs
      : [{id:"", key: "", value: "" }],
  };

  // Initialize form with Shadcn and react-hook-form
  const form = useForm<z.infer<typeof globalInputSchema>>({
    resolver: zodResolver(globalInputSchema),
    defaultValues,
  });

  // Field array for dynamic inputs
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "globalInputs",
  });
  const handleSubmit = (data: any) => {
    const updatedNodeData = {
      ...state.selectedNode?.data,
      globalInputs: data?.formData?.globalInputs,
    };

    updateNode(state.selectedNode?.id ?? "", { data: updatedNodeData });
  };
  // Sync form when selected node changes
  useEffect(() => {
    if (state.selectedNode?.data?.globalInputs) {
      form.reset({
        globalInputs: state?.selectedNode?.data?.globalInputs
          ? (state.selectedNode.data.globalInputs as Array<any>)
          : [{ key: "", value: "" }],
      });
    }
  }, [state?.selectedNode, form]);

  // On form submission
  const onSubmit = (formData: z.infer<typeof globalInputSchema>) => {
    // Filter out empty inputs
    const filteredInputs = formData.globalInputs.filter(
      (input) => input.key.trim() !== ""
    );
     filteredInputs.map((ele)=>{ele.id=ele.key})
    // Prepare node data for submission
    const submissionData = {
      formData: {
        globalInputs: filteredInputs,
      },
    };
    console.log(submissionData, "state");

    // Use the passed handleSubmit from the parent component
    handleSubmit(submissionData);
  };

  // Render nothing if no node is selected
  if (!state?.selectedNode) {
    return (
      <div className="p-2 text-gray-500">
        Select a node to configure its properties
      </div>
    );
  }

  return (
    <Card
      title="Global Inputs"
      className="w-full rounded-none bg-transparent h-full min-h-0 flex-1"
    >
      <CardContent className="p-2 h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col h-full"
          >
            <div className="space-y-2 min-h-0 flex-1 overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name={`globalInputs.${index}.key`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter input key"
                            {...inputField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`globalInputs.${index}.value`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter input value"
                            {...inputField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-6"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-end items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ key: "", value: "" })}
                >
                  + Add Another
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="submit">Update Global Inputs</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StartNodeDetailsForm;
