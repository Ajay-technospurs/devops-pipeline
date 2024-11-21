"use client"
import Header from "@/components/common/header/header";
import { useEffect, useState } from "react";
import CreateConfigDialog from "./create/create_dialog";
import { useFlow } from "@/provider/canvas_provider";
import { CustomNodeData } from "../canvas/custome_node";

export default function ConfigComponent() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="h-[40%] min-h-0 flex flex-col w-2/5 border-r">
      <Header
        title="Configuration"
        actionType="add"
        onActionClick={() => setOpen(true)}
      />
      <NodeDetailsForm />
      <div className="flex-1 min-h-0">
        <CreateConfigDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const NodeDetailsForm = () => {
  const { state, deleteNode, updateNode,dispatch } = useFlow();
  const selectedNode = state.selectedNode;
  const [nodeData, setNodeData] = useState<Partial<CustomNodeData>>({});
  const form = useForm()
  // Sync the selected node's data with local state when it changes
  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data || {});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="p-2 text-gray-500">
        Select a node to configure its properties
      </div>
    );
  }

    // Handle input change for any field dynamically
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setNodeData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleUpdateNode = () => {
      updateNode(selectedNode.id, { data: nodeData });
    };
  
    const handleDeleteNode = () => {
      deleteNode(selectedNode.id);
      dispatch({ type: "SELECT_NODE", payload: null })
    };
    
  return (
    <Card className="w-full rounded-none bg-transparent">
      <CardContent className="p-2">
        <Form {...form} >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm">Node ID:</FormLabel>
              <span className="text-sm text-muted-foreground">{selectedNode.id}</span>
            </div>

            <FormField
              name="label"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center gap-4">
                  <FormLabel className="">Label</FormLabel>
                  <FormControl className="col-span-2">
                    <Input 
                      placeholder="Enter label" 
                      {...field}
                      value={nodeData.label || ''}
                      onChange={handleChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="type"
              render={({  }) => (
                <FormItem className="grid grid-cols-3 items-center gap-4">
                  <FormLabel className="">Type</FormLabel>
                  <Select 
                    onValueChange={(value:any)=>setNodeData(prev => ({ ...prev, type: value }))}
                    value={nodeData.type || ''}
                  >
                    <FormControl className="col-span-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select node type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="branch">Branch</SelectItem>
                      <SelectItem value="converge">Converge</SelectItem>
                      <SelectItem value="simultaneous">Simultaneous</SelectItem>
                      <SelectItem value="loop">Loop</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {nodeData.type === 'branch' && (
              <FormField
                name="condition"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-4">
                    <FormLabel className="">Condition</FormLabel>
                    <FormControl className="col-span-2">
                      <Input 
                        placeholder="Enter condition" 
                        {...field}
                        value={nodeData.condition || ''}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {nodeData.type === 'loop' && (
              <FormField
                name="iterator"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-4">
                    <FormLabel className="">Iterator</FormLabel>
                    <FormControl className="col-span-2">
                      <Input 
                        placeholder="Enter iterator (e.g., i++)" 
                        {...field}
                        value={nodeData.iterator || ''}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex space-x-2">
              <Button onClick={handleUpdateNode} className="w-full">
                Update
              </Button>
              <Button 
                onClick={handleDeleteNode} 
                variant="destructive" 
                className="w-full"
              >
                Delete
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

