"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  Position,
  ReactFlowInstance,
  XYPosition,
  NodeTypes,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./custom_nodes/custom_node";
import { useFlow } from "@/provider/canvas_provider";
import ButtonEdge from "./custom_edge/button_edge";
import CustomControls from "./controls/custom_controls";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NodeSearch from "./search/nodes_search";
import NodeContextMenu from "./right_click/right_click_node";
import { usePanelRefs } from "@/provider/layout_provider";
import { GitHubProjectType } from "@/mongodb/model/github";
import { Octokit } from "@octokit/rest";
import Blocks from "./blocks/blocks";
import CustomSmoothStepEdge from "./custom_edge/smooth_step";
import CustomEdge from "./custom_edge/button_edge";
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
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  // bidirectional: BiDirectionalEdge,
  // selfconnecting: SelfConnectingEdge,
  buttonedge: CustomSmoothStepEdge,
  buttonedgebezier: CustomEdge,
};
const DevelopCanvas: React.FC<{
  project: GitHubProjectType;
  file?: GitHubProjectType;
}> = ({ project, file }) => {
  const {
    state,
    dispatch,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNode,
    deleteNode,
    duplicateNode,
  } = useFlow();
  const [isConnecting, setIsConnecting] = useState(false);
  const onConnectStart = () => setIsConnecting(true);
  const onConnectStop = () => setIsConnecting(false);
  useEffect(() => {
    if (isConnecting) {
    }
  }, [isConnecting]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    any,
    any
  > | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.9 });

  // Drag over handler
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
console.log(state,"state");

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

      const newNode: any = {
        id: `${item.id}-${new Date().getTime()}`,
        type: "custom",
        position,
        data: {
          label: item.label,
          id: item.id,
          type: item.type || "block",
          variant: item.variant || "default",
          schemaData: {
            label: item.label,
            id: item.id,
            type: item.type || "block",
            variant: item.variant || "default",
            inputs: {},
            outputs: {},
          },
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
  const octokit = new Octokit({
    auth: file?.token || undefined,
  });

  const fetchFileContent = async (file: GitHubProjectType) => {
    try {
      let path;
      const match = file.url.match(
        /repos\/([^/]+)\/([^/]+)\/contents\/(.+?)(\?|$)/
      );
      if (match) {
        path = match[3]; // Extract the relative path
      }
      const { data } = await octokit.repos.getContent({
        owner: file.owner,
        repo: file.repo ?? file.name,
        path: path ?? "",
      });

      const content = "content" in data ? atob(data.content) : "";
      const json = JSON.parse(content);
      setNodes(json.nodes);
      dispatch({ type: "SET_NODES", payload: json.nodes });
      setEdges(json.edges);
      dispatch({ type: "SET_EDGES", payload: json.edges });
      // setSelectedFile({ ...file, content });
    } catch (err: any) {
      // setError(err.message || "Failed to fetch file content");
    }
  };
  useEffect(() => {
    if (file && file.name) {
      fetchFileContent(file);
      //
    }
  }, [file, fetchFileContent]);
  // ReactFlow initialization
  const onInit = useCallback((instance: ReactFlowInstance<any, any>) => {
    setReactFlowInstance(instance);
  }, []);
  const onViewportChange = useCallback((newViewport: any) => {
    setViewport(newViewport);
  }, []);
  const ref = useRef(null);
  const [menu, setMenu] = useState<any>(null);
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (node.id == "start" || node.id == "end") return;
      if (!reactFlowInstance) return;

      // Get the node's bounding rectangle in the viewport
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);

      if (!nodeElement) return;

      // Get the node's bounding rectangle
      const nodeRect = nodeElement.getBoundingClientRect();

      // Get the ReactFlow container's bounding rectangle
      const flowContainer = (ref.current as any)?.getBoundingClientRect();

      setMenu({
        node: node,
        id: node.id,
        top: nodeRect.top - flowContainer.top,
        left: nodeRect.right - flowContainer.left,
        width: 152, // or dynamically calculate
      });
    },
    [reactFlowInstance]
  );
  const { getPanelRef } = usePanelRefs();
  return (
    // NodeSearch
    <>
      <ResizablePanelGroup className="h-full" direction="horizontal">
        <ResizablePanel defaultSize={100}>
          <div className="border-b h-full">
            <div
              className="h-full w-full"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <ReactFlow
                ref={ref}
                defaultViewport={{ zoom: 0.9, x: 0, y: 0 }}
                nodes={state.nodes}
                edges={state.edges}
                onPaneClick={onPaneClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(connection: Connection) => {
                  onConnect(connection);
                  onConnectStop();
                }}
                onNodeContextMenu={onNodeContextMenu}
                nodeTypes={nodeTypes}
                onConnectStart={onConnectStart}
                onInit={onInit}
                edgeTypes={edgeTypes}
                elevateEdgesOnSelect={false}
                elevateNodesOnSelect={false}
                onNodeClick={(e, node) =>
                  dispatch({ type: "SELECT_NODE", payload: node })
                }
                onMove={onViewportChange}
                minZoom={0.5} // Prevent zooming out too far
                maxZoom={2.5} // Prevent zooming in too far
                snapToGrid
                snapGrid={[15, 15]} // Align nodes to grid
                defaultEdgeOptions={{
                  type: "",
                  animated: false,
                }}
              >
                <Background gap={15} />
                <Controls
                  orientation="horizontal"
                  position="bottom-right"
                  style={{}}
                  showFitView={false}
                  showInteractive={false}
                  showZoom={false}
                  className="flex !flex-row-reverse gap-2 p-1 m-1 rounded-md left-0"
                >
                  <CustomControls project={project} />
                </Controls>
                {menu && (
                  <NodeContextMenu
                    setMenu={setMenu}
                    node={menu.node}
                    onDuplicate={duplicateNode}
                    onDelete={deleteNode}
                    menu={menu}
                  />
                )}
              </ReactFlow>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          collapsible
          collapsedSize={0}
          ref={getPanelRef("canvas-sidebar")}
          defaultSize={0}
          maxSize={30}
        >
          <ResizablePanelGroup className="h-full" direction="horizontal">
            <ResizablePanel
              collapsible
              collapsedSize={0}
              ref={getPanelRef("node-search")}
              defaultSize={50}
            >
              <NodeSearch />
            </ResizablePanel>
            <ResizablePanel
              collapsible
              collapsedSize={0}
              ref={getPanelRef("blocks")}
              defaultSize={50}
            >
              <Blocks />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default DevelopCanvas;
