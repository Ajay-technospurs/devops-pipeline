"use client"
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useFlow } from "@/provider/canvas_provider";
import { usePanelRefs } from "@/provider/layout_provider";

const NodeSearch = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");
  //   const reactFlow = useReactFlow();
  const {
    state: { nodes },
    dispatch,
    reactFlowProps,
  } = useFlow();
  const { collapsePanel } = usePanelRefs();
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) =>
      (node?.data?.label as string)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [nodes, searchTerm]);

  const handleSearch = (value: any) => {
    setSearchTerm(value);
  };

  const handleNodeSelect = (nodeId: any) => {
    const node = nodes.find((n) => n.id === nodeId);
    dispatch({ type: "SELECT_NODE", payload: node ?? null });
    collapsePanel("node-search");
    const bounds = reactFlowProps.getNodesBounds([node?.id ?? ""]);
    reactFlowProps.fitBounds(bounds, { duration: 300, padding: 2 });
  };

  return (
    <div className="w-full max-w-md space-y-2 p-2 h-full min-h-0 flex flex-col">
      <Input
        placeholder="Search and select..."
        value={searchTerm}
        autoFocus
        onChange={(e) => handleSearch(e.target.value)}
        startIcon={<Search size={16} />}
        className="w-full"
      />
      {searchTerm && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => handleNodeSelect(node.id)}
                className="p-2 hover:bg-secondary/40 cursor-pointer"
              >
                {node.data.label as string}
              </div>
            ))
          ) : (
            <div className="p-2 text-primary-foreground">No matching nodes</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeSearch;
