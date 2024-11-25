import React, { FC } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

interface CustomNodeData {
  icon: React.ReactNode;
  label: string;
  type?: 'block' | 'branch' | 'converge' | 'simultaneous' | 'loop';
  condition?: string;
  iterator?: string;
}

type CustomNodeProps = NodeProps<CustomNodeData>;

const CustomNode: FC<CustomNodeProps> = ({ data, selected, isConnectable }) => {
  // Determine node shape and style based on type
  const getNodeShape = () => {
    switch (data.type) {
      case 'branch':
        return 'rounded-r-lg';
      case 'converge':
        return 'rounded-full';
      case 'simultaneous':
        return 'rounded-t-lg rounded-b-lg';
      case 'loop':
        return 'rounded-l-lg';
      default:
        return 'rounded-lg';
    }
  };

  const getNodeStyle = () => {
    const baseStyles = 'relative p-4 border min-w-[160px] h-[100px]';
    const selectedStyles = selected ? 'shadow-lg shadow-primary/50' : '';
    return `${baseStyles} ${selectedStyles} bg-primary border-secondary ${getNodeShape()}`;
  };

  const renderNodeContent = () => {
    return (
      <div className="flex flex-col items-center justify-between h-full">
        <div className="text-2xl text-primary-foreground">{data.icon}</div>
        <div className="text-sm text-primary-foreground font-medium">{data.label}</div>
        {data.type === 'branch' && (
          <input
            type="text"
            placeholder="Condition"
            className="w-full text-xs bg-secondary/50  rounded px-2 py-1 text-primary-foreground placeholder-secondary/70"
            value={data.condition || ''}
            onChange={(e) => console.log('Condition changed:', e.target.value)}
          />
        )}
        {data.type === 'loop' && (
          <input
            type="text"
            placeholder="Iterator (item in items)"
            className="w-full text-xs bg-secondary/50  rounded px-2 py-1 text-primary-foreground placeholder-secondary/70"
            value={data.iterator || ''}
            onChange={(e) => console.log('Iterator changed:', e.target.value)}
          />
        )}
      </div>
    );
  };

  const renderHandles = () => {
    const handleStyle = {
      background: 'hsl(var(--primary-foreground))',
      borderRadius: '0px',
      transform: 'rotate(45deg)',
      width: '6px',
      height: '6px',
    };

    switch (data.type) {
      case 'branch':
        return (
          <Handle
            type="source"
            position={Position.Right}
            style={handleStyle}
            isConnectable={isConnectable}
          />
        );
      case 'loop':
        return (
          <Handle
            type="target"
            position={Position.Left}
            style={handleStyle}
            isConnectable={isConnectable}
          />
        );
      default:
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              style={handleStyle}
              isConnectable={isConnectable}
            />
            <Handle
              type="source"
              position={Position.Right}
              style={handleStyle}
              isConnectable={isConnectable}
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
