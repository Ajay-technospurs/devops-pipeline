import React, { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  type Node,
  type Edge,
  Connection,
  addEdge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./custome_node";
import { useFlow } from "@/provider/canvas_provider";

interface FlowNode extends Node {
  data: {
    label: string;
    icon?: React.ReactNode;
    id: string;
    type?: "block" | "branch" | "converge" | "simultaneous" | "loop";
    condition?: string;
    iterator?: string;
  };
}

// Custom node types mapping
const nodeTypes = {
  custom: CustomNode,
};

const DevelopCanvas: React.FC = () => {
  const {
    state,
    dispatch,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlow();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  console.log(state.nodes, "nodes", state.edges);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Enhanced drop handler with flow-specific node types
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const item = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode: FlowNode = {
        id: `${item.id}-${new Date().getTime()}`,
        type: "custom",
        position,
        data: {
          label: item.name,
          icon: item.icon,
          id: item.id,
          type: item.type || "block",
        },
      };

      // Add specific properties based on node type
      switch (item.type) {
        case "branch":
          newNode.data.condition = "";
          newNode = {
            ...newNode,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          };
          break;
        case "loop":
          newNode.data.iterator = "";
          break;
        case "converge":
          newNode = {
            ...newNode,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          };
          break;
        case "simultaneous":
          newNode = {
            ...newNode,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          };
          break;
      }

      const updatedNodes = [...state.nodes, newNode];
      setNodes(updatedNodes);
      dispatch({ type: "SET_NODES", payload: updatedNodes });
    },
    [state.nodes, reactFlowInstance, setNodes, dispatch]
  );

  return (
    <div className="border-b h-full">
      <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={state.nodes}
          edges={state.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onNodeClick={(_, node) =>
            dispatch({ type: "SELECT_NODE", payload: node })
          }
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[15, 15]}
          fitView
          defaultEdgeOptions={{
            type: "",
            animated: false,
            

          }}
        >
          <Background />
          <Controls position={"bottom-right"} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default DevelopCanvas;
