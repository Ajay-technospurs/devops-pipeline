import React, { FC } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export interface CustomNodeData {
  icon: React.ReactNode;
  label: string;
  type?: "block" | "branch" | "converge" | "simultaneous" | "loop";
  condition?: string;
  iterator?: string;
}

type CustomNodeProps = NodeProps<CustomNodeData>;

const CustomNode: FC<CustomNodeProps> = ({ data, selected }) => {
  // Determine node style based on type
  const getNodeStyle = () => {
    const baseStyles = "relative rounded-lg p-3 border min-w-[120px]";
    const selectedStyles = selected ? "shadow-lg shadow-blue-500/50" : "";

    // Common styles for all node types using the light blue theme
    switch (data.type) {
      case "branch":
        return `${baseStyles} ${selectedStyles} bg-primary border-primary/400`;
      case "converge":
        return `${baseStyles} ${selectedStyles} bg-primary border-primary/400 rounded-full`;
      case "simultaneous":
        return `${baseStyles} ${selectedStyles} bg-primary border-primary/400`;
      case "loop":
        return `${baseStyles} ${selectedStyles} bg-primary border-primary/400`;
      default:
        return `${baseStyles} ${selectedStyles} bg-primary border-primary/400`;
    }
  };

  // Render different content based on node type
  const renderNodeContent = () => {
    switch (data.type) {
      case "branch":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-white">{data.icon}</div>
            <div className="text-xs text-white">{data.label}</div>
            <input
              type="text"
              placeholder="Condition"
              className="w-full text-xs bg-cyan-600/50 border border-cyan-400/30 rounded px-2 py-1 text-white placeholder-cyan-200/70"
              value={data.condition || ""}
              onChange={(e) => {
                console.log("Condition changed:", e.target.value);
              }}
            />
            <div className="flex justify-between w-full text-[10px] text-white/70">
              <span>True ➡️</span>
              <span>False ➡️</span>
            </div>
          </div>
        );

      case "loop":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-white">{data.icon}</div>
            <div className="text-xs text-white">{data.label}</div>
            <input
              type="text"
              placeholder="Iterator (item in items)"
              className="w-full text-xs bg-cyan-600/50 border border-cyan-400/30 rounded px-2 py-1 text-white placeholder-cyan-200/70"
              value={data.iterator || ""}
              onChange={(e) => {
                console.log("Iterator changed:", e.target.value);
              }}
            />
          </div>
        );

      case "simultaneous":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-white">{data.icon}</div>
            <div className="text-xs text-white">{data.label}</div>
            <div className="text-[10px] text-white/70">Parallel Execution</div>
          </div>
        );

      case "converge":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-white">{data.icon}</div>
            <div className="text-xs text-white">{data.label}</div>
            <div className="text-[10px] text-white/70">Merge Point</div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center">
            <div className="text-2xl text-white">{data.icon}</div>
            <div className="text-xs mt-1 text-white">{data.label}</div>
          </div>
        );
    }
  };

  // Render different handles based on node type
  const renderHandles = () => {
    switch (data.type) {
      default:
        return (
          <>
            <Handle
              type="target"

              position={Position.Left}
              className=""
              style={{...handlerStyle,transform:"rotate(45deg) translate(-3px, -2px)"}}
            />
            <Handle
              type="source"
              position={Position.Right}
              className=""
              style={{...handlerStyle,transform:"rotate(45deg) translate(-3px, -3px)"}}
            />
            <Handle
              type="target"
              position={Position.Top}
              className=""
              style={handlerStyle}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              className=""
              style={handlerStyle}
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

export default CustomNode;
const handlerStyle = {
  background: "hsl(var(--primary-foreground))",
  borderRadius: "0px",
  transform: "rotate(45deg)",
  border: "none",
  width: "6px",
  height: "6px",
  minWidth: "0px",
  minHeight: "0px",
};
