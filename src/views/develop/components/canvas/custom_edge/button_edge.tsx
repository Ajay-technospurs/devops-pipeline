import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { useFlow } from "@/provider/canvas_provider";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges, dispatch } = useFlow();
  
  // Add curvature for better edge paths
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.2, // Add slight curve for better visibility
  });

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => {
      const data = edges.filter((edge) => edge.id !== id);
      dispatch({ type: "SET_EDGES", payload: data });
      return data;
    });
  };

  // Enhanced edge style
  const defaultStyle = {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))',
    ...style,
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={defaultStyle}
        className="react-flow__edge-path hover:stroke-2"
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button
            className="rounded-full w-5 h-5 bg-primary hover:bg-primary/80 flex items-center justify-center text-primary-foreground text-sm"
            onClick={onEdgeClick}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}