"use client"
import React, { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  type Node,
  Position,
  ReactFlowInstance,
  XYPosition,
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
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlow();

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<any, any> | null>(null);
    const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.8 });
  console.log(
    state.nodes,
    "nodes",
    state.edges,
    reactFlowInstance?.getViewport(),
    reactFlowInstance?.getZoom()
  );

  // Drag over handler
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Drop handler
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const item = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      if (!reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode:any = {
        id: `${item.id}-${new Date().getTime()}`,
        type: "custom",
        position,
        data: {
          label: item.label,
          icon: item.icon,
          id: item.id,
          type: item.type || "block",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      // Add specific properties based on the node type
      if (item.type === "branch") newNode.data.condition = "";
      if (item.type === "loop") newNode.data.iterator = "";

      const updatedNodes = [...state.nodes, newNode];
      setNodes(updatedNodes);
      dispatch({ type: "SET_NODES", payload: updatedNodes });
    },
    [state.nodes, reactFlowInstance, setNodes, dispatch]
  );

  // ReactFlow initialization
  const onInit = useCallback((instance: ReactFlowInstance<any, any>) => {
    setReactFlowInstance(instance);
    instance.setViewport({ x: 0, y: 0, zoom: 0.8 }); // Set initial zoom level and position
  }, [viewport]);
  const onViewportChange = useCallback((newViewport:any) => {
    setViewport(newViewport);
  }, []);
  return (
    <div className="border-b h-full">
      <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={state.nodes}
          edges={state.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onMove={onViewportChange}
          minZoom={0.5} // Prevent zooming out too far
          maxZoom={2} // Prevent zooming in too far
          snapToGrid
          snapGrid={[15, 15]} // Align nodes to grid
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            type: "",
            animated: false,
          }}
        >
          <Background gap={15} />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
};



export default DevelopCanvas;
