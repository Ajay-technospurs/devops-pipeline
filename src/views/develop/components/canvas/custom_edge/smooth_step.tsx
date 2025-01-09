import React from "react";
import {
  SmoothStepEdge,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";
import { useFlow } from "@/provider/canvas_provider";

export default function CustomSmoothStepEdge({
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

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => {
      const updatedEdges = edges.filter((edge) => edge.id !== id);
      dispatch({ type: "SET_EDGES", payload: updatedEdges });
      return updatedEdges;
    });
  };

  // Enhanced edge style
  const defaultStyle = {
    strokeWidth: 2,
    stroke: "white",
    ...style,
  };

  return (
    <>
      <SmoothStepEdge
        id={id}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        sourcePosition={sourcePosition}
        targetPosition={targetPosition}
        style={defaultStyle}
        markerEnd={markerEnd}
        
        // className="react-flow__edge-path hover:stroke-2"
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${(sourceY + targetY) / 2}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            className="rounded-full w-5 h-5 mt-[-2px] bg-input hover:bg-primary font-bold flex items-center justify-center text-red-600 hover:text-white text-sm"
            onClick={onEdgeClick}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
