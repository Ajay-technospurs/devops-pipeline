// CustomNode.tsx
import React, { FC, memo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { CustomNodeData, HandlePosition } from './types';
import { getNodeConfig, nodeStyles } from './config';

const CustomNode: FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CustomNodeData;
  const config = getNodeConfig(nodeData.type, nodeData.variant);
  
  const getNodeStyle = () => {
    const styleVariant = config.styleVariant || 'default';
    const variantStyles = nodeStyles.variants[styleVariant];
    
    const styles = [
      nodeStyles.base,
      selected ? variantStyles.selected : variantStyles.normal,
      variantStyles.background,
      config.className
    ];
    
    return styles.join(' ');
  };

  const getHandleStyle = (isHovered?: boolean): React.CSSProperties => ({
    background: config.styleVariant === 'alternative' 
      ? "hsl(var(--secondary))" 
      : "hsl(var(--primary))",
    width: isHovered ? "8px" : "6px",
    height: isHovered ? "8px" : "6px",
    border: "2px solid hsl(var(--background))",
    transition: "all 0.2s ease-in-out",
    zIndex: 100,
  });

  const renderNodeContent = () => (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className={config.styleVariant === 'alternative' ? 'text-secondary' : 'text-primary'}>
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

  const renderHandles = () => {
    const isHovered = nodeData.showHandles;
    
    return config.handles?.map((handle: HandlePosition) => (
      <Handle
        key={handle.id}
        id={handle.id}
        type={handle.type}
        position={Position[handle.position]}
        style={{
          ...getHandleStyle(isHovered),
          top: handle.top,
          left: handle.left,
        }}
      />
    ));
  };

  return (
    <div className={getNodeStyle()}>
      {renderHandles()}
      {renderNodeContent()}
    </div>
  );
};

export default memo(CustomNode);