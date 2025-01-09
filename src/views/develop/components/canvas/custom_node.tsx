import React, { FC, memo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { ChevronRight, Split, RotateCw, Combine, Play, Square } from "lucide-react";

export interface CustomNodeData {
  icon?: React.ReactNode;
  label: string;
  type?: "block" | "branch" | "converge" | "simultaneous" | "loop" | "start" | "end";
  condition?: string;
  iterator?: string;
  showHandles?: boolean;
  schemaData?: Record<string, any>;
}

const CustomNode: FC<NodeProps> = ({ data, selected }) => {
  const nodeData: CustomNodeData = data as unknown as CustomNodeData;

  const getNodeConfig = () => {
    const configs = {
      block: {
        icon: <ChevronRight className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
      },
      branch: {
        icon: <Split className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
      },
      converge: {
        icon: <Combine className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
      },
      simultaneous: {
        icon: <Split className="w-6 h-6 rotate-90" />,
        className: "w-40 min-h-20 rounded-lg",
      },
      loop: {
        icon: <RotateCw className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
      },
      start: {
        icon: <Play className="w-6 h-6" />,
        className: "w-40 h-16 rounded-full",
      },
      end: {
        icon: <Square className="w-6 h-6" />,
        className: "w-40 h-16 rounded-full",
      },
    };

    return configs[nodeData.type || "block"];
  };

  const config = getNodeConfig();

  const getNodeStyle = () => {
    const baseStyles = "relative border-2 min-h-0 h-20 flex flex-col items-center justify-center p-1 transition-all duration-200";
    const selectedStyles = selected 
      ? "border-primary shadow-lg ring-2 ring-primary/30" 
      : "border-border hover:border-primary/50";
    const bgStyles = "bg-background";
    
    return `${baseStyles} ${selectedStyles} ${bgStyles} ${config.className}`;
  };

  const renderNodeContent = () => {
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="text-primary">
          {nodeData.icon || config.icon}
        </div>
        <div className="text-sm font-medium text-center">
          {nodeData.label}
        </div>
        {nodeData.condition && (
          <div className="text-xs text-muted-foreground mt-1 px-2 py-1 bg-muted rounded-md w-full text-center">
            {nodeData.condition}
          </div>
        )}
      </div>
    );
  };

  const getHandleStyle = (isHovered?: boolean): React.CSSProperties => ({
    background: "hsl(var(--primary))",
    width: isHovered ? "8px" : "6px",
    height: isHovered ? "8px" : "6px",
    border: "2px solid hsl(var(--background))",
    transition: "all 0.2s ease-in-out",
    zIndex: 100,
  });

  const renderHandles = () => {
    const isHovered = nodeData.showHandles;
    const handlePositions = {
      branch: {
        outputs: [
          { id: 'a', top: '30%' },
          { id: 'b', top: '70%' }
        ]
      },
      converge: {
        inputs: [
          { id: 'a', top: '30%' },
          { id: 'b', top: '70%' }
        ]
      },
      simultaneous: {
        outputs: [
          { id: 'a', top: '30%' },
          { id: 'b', top: '70%' }
        ]
      }
    };

    switch (nodeData.type) {
      case "branch":
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
            />
            {handlePositions.branch.outputs.map((output) => (
              <Handle
                key={output.id}
                type="source"
                position={Position.Right}
                id={output.id}
                style={{
                  ...getHandleStyle(isHovered),
                  top: output.top,
                }}
              />
            ))}
          </>
        );

      case "converge":
        return (
          <>
            {handlePositions.converge.inputs.map((input) => (
              <Handle
                key={input.id}
                type="target"
                position={Position.Left}
                id={input.id}
                style={{
                  ...getHandleStyle(isHovered),
                  top: input.top,
                }}
              />
            ))}
            <Handle
              type="source"
              position={Position.Right}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
            />
          </>
        );

      case "simultaneous":
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
            />
            {handlePositions.simultaneous.outputs.map((output) => (
              <Handle
                key={output.id}
                type="source"
                position={Position.Right}
                id={output.id}
                style={{
                  ...getHandleStyle(isHovered),
                  top: output.top,
                }}
              />
            ))}
          </>
        );

      case "loop":
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              id="loop"
              style={{
                ...getHandleStyle(isHovered),
                left: '50%',
              }}
            />
          </>
        );

      case "start":
        return (
          <Handle
            type="source"
            position={Position.Right}
            style={{
              ...getHandleStyle(isHovered),
              top: '50%',
            }}
          />
        );

      case "end":
        return (
          <Handle
            type="target"
            position={Position.Left}
            style={{
              ...getHandleStyle(isHovered),
              top: '50%',
            }}
          />
        );

      default:
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              style={{
                ...getHandleStyle(isHovered),
                top: '50%',
              }}
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