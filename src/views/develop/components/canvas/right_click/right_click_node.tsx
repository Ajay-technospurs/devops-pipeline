import React, { useEffect, useRef } from "react";
import { Node } from "@xyflow/react";
import { Trash2, Copy, Edit } from "lucide-react";

interface NodeContextMenuProps {
  menu: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;width?:number
  };
  setMenu: (menu: any) => void;
  node: Node;
  onDelete: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  menu,
  setMenu,
  node,
  onDelete,
  onDuplicate,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as any)
      ) {
        setMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setMenu]);

  const handleDelete = () => {
    onDelete(node.id);
    setMenu(null);
  };

  const handleDuplicate = () => {
    onDuplicate?.(node.id);
    setMenu(null);
  };

  return (
    <div 
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${menu.top}px`,
        left: `${menu.left}px`,
        width: `${menu.width}px`, // Use the width you specified
        zIndex: 1000,
      }}
      className="bg-secondary/40 border rounded-md shadow-lg overflow-hidden"
    >
      <div className="py-1">
        <button 
          onClick={handleDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          Delete
        </button>

        {onDuplicate && (
          <button 
            onClick={handleDuplicate}
            className="flex items-center w-full px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80"
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </button>
        )}
      </div>
    </div>
  );
};

export default NodeContextMenu;