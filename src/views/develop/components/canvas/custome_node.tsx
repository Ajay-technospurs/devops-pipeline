import React, { FC, memo } from "react";
import {
  Handle,
  NodeProps,
  NodeTypes,
  Position,
  XYPosition,
} from "@xyflow/react";
import Image from "next/image";
export interface CustomNodeData {
  icon?: React.ReactNode;
  label: string;
  type?:
    | "block"
    | "branch"
    | "converge"
    | "simultaneous"
    | "loop"
    | "start"
    | "end";
  condition?: string;
  iterator?: string;
  showHandles?: boolean;
  schemaData?: Record<string, any>;
}

const CustomNode: FC<NodeProps> = ({ data, selected }) => {
  const nodeData: CustomNodeData = data as unknown as CustomNodeData;
  const getNodeShape = () => {
    switch (nodeData.type) {
      case "branch":
        return "transform rounded-md rotate-45 min-w-[100px] aspect-square";
      case "converge":
        return "rounded-full min-w-[160px] aspect-square flex items-center justify-center";
      case "start":
      case "end":
        return "rounded-[100vw] min-w-[160px]";
      default:
        return "rounded-md min-w-[160px]";
    }
  };

  const getNodeStyle = () => {
    const baseStyles = `relative border flex items-center justify-center p-2 custom-node group`;
    const selectedStyles = selected ? "shadow-lg shadow-primary/50" : "";
    return `${baseStyles} ${selectedStyles} bg-primary border-secondary ${getNodeShape()}`;
  };

  const renderNodeContent = () => {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full ${
          data?.type === "branch" ? "rotate-[-45deg]" : ""
        }`}
      >
        {nodeData.icon ? (
          <div className="text-lg text-primary-foreground">{renderIcon(nodeData.icon)}</div>
        ) : (
          <Image
            style={{ marginRight: "4px" }}
            src={`/assets/palette_child_light.svg`}
            width={40}
            height={40}
            alt={nodeData.label}
          />
        )}
        <div className="text-xs text-primary-foreground font-medium">
          {nodeData.label}
        </div>
        {nodeData.condition && (
          <div className="text-xs text-muted-foreground">
            {nodeData.condition}
          </div>
        )}
      </div>
    );
  };
  const renderIcon = (icon:any) => {
    if (typeof icon === "string") {
        return icon; // Render string or emoji
    } else if (React.isValidElement(icon)) {
        return icon; // Render valid React element
    } else {
        return <Image
        style={{ marginRight: "4px" }}
        src={`/assets/palette_child_light.svg`}
        width={40}
        height={40}
        alt={nodeData.label}
      />; // Fallback for unsupported types
    }
};
  const renderHandles = () => {
    const handleStyle: React.CSSProperties = {
      background: "hsl(var(--primary-foreground))",
      borderRadius: "50%",
      width: "6px",
      height: "6px",
      transition: "opacity 0.2s ease-in-out",
      opacity: 1,
    };

    const hoverHandleStyle: React.CSSProperties = {
      background: "hsl(var(--primary-foreground))",
      borderRadius: "50%",
      width: "6px",
      height: "6px",
      transition: "opacity 0.2s ease-in-out",
      opacity: 1,
    };

    switch (nodeData.type) {
      case "branch":
        return (
          <Handle
            type="source"
            position={Position.Right}
            className=""
            style={data?.showHandles ? hoverHandleStyle : handleStyle}
          />
        );
      case "loop":
        return (
          <Handle
            type="target"
            position={Position.Left}
            className=""
            style={data?.showHandles ? hoverHandleStyle : handleStyle}
          />
        );
      default:
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              className=""
              style={data?.showHandles ? hoverHandleStyle : handleStyle}
            />
            <Handle
              type="source"
              position={Position.Right}
              className=""
              style={data?.showHandles ? hoverHandleStyle : handleStyle}
            />
          </>
        );
    }
  };

  return (
    <div className={getNodeStyle()}>
      {renderHandles()}
      {renderNodeContent()}
    </div>
  );
};

export default memo(CustomNode);
