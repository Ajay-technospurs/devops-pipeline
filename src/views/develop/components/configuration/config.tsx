"use client";
import Header from "@/components/common/header/header";
import { useEffect, useState } from "react";
import CreateConfigDialog from "./create/create_dialog";
import { useFlow } from "@/provider/canvas_provider";
import { CustomNodeData } from "../canvas/custome_node";

export default function ConfigComponent() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className=" min-h-0 flex flex-col w-2/5 border-r">
      <Header
        title="Configuration"
        actionType="add"
        onActionClick={() => setOpen(true)}
      />
      <NodeDetailsForm />
      <div className="">
        <CreateConfigDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Form, { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const NodeDetailsForm = () => {
  const { state, deleteNode, updateNode, dispatch } = useFlow();
  const selectedNode = state.selectedNode;
  const [nodeData, setNodeData] = useState<Partial<CustomNodeData>>(selectedNode?.data??{} as CustomNodeData);

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

  // Merge default node configuration with JSON Schema form data
  const handleSubmit = (data: IChangeEvent<Record<string, any>, any, any>) => {
    const updatedNodeData = {
      ...nodeData,
      schemaData: data?.formData,
      label: data?.formData?.title || nodeData.label || "Unnamed Node",
    };

    updateNode(selectedNode.id, { data: updatedNodeData });
  };

  const handleDeleteNode = () => {
    deleteNode(selectedNode.id);
    dispatch({ type: "SELECT_NODE", payload: null });
  };

  // Default schema if no schema is provided
  const defaultSchema: RJSFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Node Configuration",
    type: "object",
    properties: {
      label: {
        type: "string",
        title: "Label",
      },
      type: {
        type: "string",
        title: "Type",
        enum: ["block", "branch", "converge", "simultaneous", "loop","start","end"],
      },
      condition: {
        type: "string",
        title: "Condition",
      },
      iterator: {
        type: "string",
        title: "Iterator",
      },
      inputs: {
        type: "object",
        title: "Inputs",
        properties: {
          connectionName: {
            type: "string",
            title: "Connection Name",
          },
          bucketARN: {
            type: "string",
            title: "Bucket ARN",
          },
          region: {
            type: "string",
            title: "Region",
          },
        },
        required: ["connectionName", "bucketARN", "region"],
      },
      outputs: {
        type: "object",
        title: "Outputs",
        properties: {
          objectKeys: {
            type: "array",
            title: "Object Keys",
            items: {
              type: "string",
            },
          },
        },
      },
    },
    required: ["label", "type", "inputs"],
  };

  return (
    <Card className="w-full rounded-none bg-transparent h-full min-h-0 flex-1">
      <CardContent className="p-2 h-full">
        <div className="flex flex-col space-y-2 h-full">
          <div className="flex-1 space-y-2 min-h-0 overflow-y-auto">
            <Form
              schema={defaultSchema}
              validator={validator as any}
              formData={nodeData.schemaData || {}}
              onSubmit={handleSubmit}
              uiSchema={{
                "ui:submitButtonOptions": {
                  props: {
                    className: "hidden", // Hide default submit button
                  },
                },
              }}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" form="root" size={"sm"} className="w-full">
              Update
            </Button>
            <Button
            size={"sm"}
              onClick={handleDeleteNode}
              variant="destructive"
              className="w-full"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
