import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useReactFlow } from '@xyflow/react';
import { useFlow } from '@/provider/canvas_provider';

const NodeSearch = ({  }) => {
  const [searchTerm, setSearchTerm] = useState('');
//   const reactFlow = useReactFlow();
  const {state:{nodes}}= useFlow()

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => 
      (node?.data?.label as string).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [nodes, searchTerm]);

  const handleSearch = (value:any) => {
    setSearchTerm(value);
  };

  const handleNodeSelect = (nodeId:any) => {
    const node = nodes.find(n => n.id === nodeId);
    // if (node) {
    //   reactFlow.setCenter(node.position.x, node.position.y, { duration: 800 });
    //   reactFlow.fitView({ padding: 0.2 });
    // }
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <Input
        placeholder="Search and select..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        startIcon={<Search size={16} />}
        className="w-full"
      />
      {searchTerm && (
        <div className="border rounded-md max-h-48 overflow-y-auto">
          {filteredNodes.length > 0 ? (
            filteredNodes.map(node => (
              <div 
                key={node.id}
                onClick={() => handleNodeSelect(node.id)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {node.data.label as string}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No matching nodes</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeSearch;