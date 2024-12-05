"use client";
import Header from "@/components/common/header/header";
import { useEffect, useRef, useState } from "react";
import CreateConfigDialog from "./create/create_dialog";
import { useFlow } from "@/provider/canvas_provider";
import { CustomNodeData } from "../canvas/custome_node";

export default function ConfigComponent() {
  const [open, setOpen] = useState<boolean>(false);
  const { state } = useFlow();
  return (
    <div className=" min-h-0 flex flex-col h-full border-r w-full">
      <Header
        title="Configuration"
        actionType="info"
        // onActionClick={() => setOpen(true)}
      />

      {(state?.selectedNode?.data?.label !== "Start") &&(
        <NodeDetailsForm />
      )} 
      {(state?.selectedNode?.data?.label === "Start")&& (
        <StartNodeDetailsForm />
      )}
      <div className="">
        <CreateConfigDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}

const CustomInputWidget = (props: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value); // Call only when the value changes
  };

  return (
    <Input
      type="text"
      value={props.value || ""}
      onChange={handleChange}
      placeholder={props.placeholder}
      className="w-full"
      onBlur={(e) => props.onBlur(e.target.value)} // To trigger validation or other effects
    />
  );
};

const CustomSelectWidget = (props: any) => (
  <Select
    value={props.value || ""}
    onValueChange={(value) => props.onChange(value)}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={props.placeholder} />
    </SelectTrigger>
    <SelectContent>
      {props.options.enumOptions.map((option: any) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const CustomArrayField = (props: any) => {
  const { formData, onChange } = props;

  const handleAddClick = () => {
    onChange([...(formData || []), ""]);
  };

  const handleRemove = (index: number) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    onChange(updatedData);
  };

  const handleChange = (index: number, value: string) => {
    const updatedData = [...formData];
    updatedData[index] = value;
    onChange(updatedData);
  };

  return (
    <div className="space-y-2">
      {formData?.map((item: string, index: number) => (
        <div key={index} className="flex items-center space-x-2 pr-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-grow"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => handleRemove(index)}
          >
            <X className="h-4 w-4 primary-foreground" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddClick}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4 hover:primary-foreground" /> Add Object
        Key
      </Button>
    </div>
  );
};

const customUiSchema = {
  "ui:submitButtonOptions": {
    props: {
      className: "hidden",
    },
  },
  label: {
    "ui:widget": "text",
  },
  type: {
    "ui:widget": "select",
  },
  condition: {
    "ui:widget": "text",
  },
  inputs: {
    connectionName: {
      "ui:widget": "text",
    },
    bucketARN: {
      "ui:widget": "text",
    },
    region: {
      "ui:widget": "text",
    },
  },
  outputs: {
    objectKeys: {
      "ui:field": "ArrayField",
    },
  },
};

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Form, { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StartNodeDetailsForm from "./start/start";
import { useDrop } from "react-dnd";

import { DRAG_TYPES, GlobalInput } from "@/types/config";

const NodeDetailsForm = () => {
  const { state, deleteNode, updateNode, dispatch } = useFlow();
  const selectedNode = state.selectedNode;
  const [nodeData, setNodeData] = useState<Partial<CustomNodeData>>(
    selectedNode?.data ?? ({} as CustomNodeData)
  );
  const formRef = useRef<Form<any>>(null);
  console.log(selectedNode, "selectedNode");

  // Sync the selected node's data with local state when it changes
  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data || {});
    }
  }, [selectedNode]);
  const [, drop] = useDrop(() => ({
    accept: [DRAG_TYPES.GLOBAL_INPUT],
    drop: (item: GlobalInput) => {
      console.log("Dropped item:", item);

      setNodeData((prev) => {
        if (item.type === "global-input") {
          const schemaData = { ...(prev?.schemaData || { inputs: {} }) };
      
          schemaData.inputs = {
            ...schemaData.inputs,
            [item.key]: item.value,
          };
      
          return {
            ...prev,
            schemaData,
          };
        }
        return prev;
      });
    },
  }));
  if (!selectedNode) {
    return (
      <div className="p-2 text-gray-500">
        Select a node to configure its properties
      </div>
    );
  }
  const handleSubmit = (data: IChangeEvent<Record<string, any>, any, any>) => {
    const updatedNodeData = {
      ...nodeData,
      schemaData: data?.formData,
      label: data?.formData?.title || nodeData.label || "Unnamed Node",
    };

    updateNode(selectedNode.id, { data: updatedNodeData });
  };

  // Merge default node configuration with JSON Schema form data

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
        enum: [
          "block",
          "branch",
          "converge",
          "simultaneous",
          "loop",
          "start",
          "end",
        ],
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
  console.log(nodeData.schemaData, "schemadata item");

  

  return (
    <Card
      ref={drop as any}
      className="w-full rounded-none bg-transparent h-full min-h-0 flex-1"
    >
      <CardContent className="p-2 h-full">
        <div className="flex flex-col space-y-2 h-full">
          <div className="flex-1 space-y-2 min-h-0 overflow-y-auto">
            <Form
              ref={formRef}
              schema={defaultSchema}
              validator={validator as any}
              formData={nodeData?.schemaData || {}}
              onSubmit={handleSubmit}
              uiSchema={customUiSchema}
              widgets={{
                TextWidget: CustomInputWidget,
                SelectWidget: CustomSelectWidget,
              }}
              fields={{
                ArrayField: CustomArrayField,
              }}
              liveValidate={false}
            />
          </div>

          <div className="flex space-x-2 justify-end">
            <Button
              type="submit"
              onClick={() => {
                if (formRef.current) {
                  (formRef.current as any).submit();
                }
              }}
              size={"sm"}
              className=""
            >
              Update
            </Button>
            {selectedNode?.data?.label !== "Start" &&
              selectedNode?.data?.label !== "End" && (
                <Button
                  size={"sm"}
                  onClick={handleDeleteNode}
                  variant="destructive"
                  className=""
                >
                  Delete
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
