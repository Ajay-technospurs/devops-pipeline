"use client";
// src/components/Designer/FlowContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  Dispatch,
} from "react";
import {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
  MarkerType,
} from "@xyflow/react";
import { MonitorStop, Play } from "lucide-react";

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  history: Array<{ nodes: Node[]; edges: Edge[] }>;
  currentStep: number;
  selectedNode: Node | null;
}

type FlowAction =
  | { type: "SET_NODES"; payload: Node[] }
  | { type: "SET_EDGES"; payload: Edge[] }
  | { type: "SELECT_NODE"; payload: Node | null }
  | { type: "UNDO" }
  | { type: "REDO" };

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' } },
// ];
const initialNodes = [
  {
    id: "start", // Unique identifier for the Start node
    type: "custom", // Input type node
    data: { id:"start",label: "Start",type:"start", value: "Start", icon: <Play className="primary-foreground" /> }, // Label for the node
    position: { x: 50, y: 200 }, // Position on the canvas
  },
  {
    id: "end", // Unique identifier for the End node
    type: "custom", // Output type node
    data: {id:"data", label: "End",type:"end", value: "End", icon: <MonitorStop className="primary-foreground" /> }, // Label for the node
    position: { x: 1000, y: 200 }, // Position on the canvas
  },
];
// Initialize state
const initialState: FlowState = {
  nodes: initialNodes,
  edges: [],
  history: [],
  currentStep: -1,
  selectedNode: null,
};


const flowReducer = (state: FlowState, action: FlowAction): FlowState => {
  switch (action.type) {
    case "SET_NODES":
      return {
        ...state,
        nodes: action.payload,
        history: [
          ...state.history.slice(0, state.currentStep + 1),
          { nodes: action.payload, edges: state.edges },
        ],
        currentStep: state.currentStep + 1,
      };
    case "SET_EDGES":
      return {
        ...state,
        edges: action.payload,
        history: [
          ...state.history.slice(0, state.currentStep + 1),
          { nodes: state.nodes, edges: action.payload },
        ],
        currentStep: state.currentStep + 1,
      };
    case "SELECT_NODE":
      return {
        ...state,
        selectedNode: action.payload,
      };
    case "UNDO":
      if (state.currentStep > 0) {
        const previousState = state.history[state.currentStep - 1];
        return {
          ...state,
          nodes: previousState.nodes,
          edges: previousState.edges,
          currentStep: state.currentStep - 1,
        };
      }
      return state;
    case "REDO":
      if (state.currentStep < state.history.length - 1) {
        const nextState = state.history[state.currentStep + 1];
        return {
          ...state,
          nodes: nextState.nodes,
          edges: nextState.edges,
          currentStep: state.currentStep + 1,
        };
      }
      return state;
    default:
      return state;
  }
};
const FlowContext = createContext<{
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  getPreviousNodes:(nodeId:string)=>Node[],
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId:string) => void;
  updateNode: (nodeId: string, newData: Partial<Node>) => void;
  onConnect: (connection: Connection) => void;
} | null>(null);
interface FlowProviderProps {
  children: ReactNode;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const sourceNode = state.nodes.find((n) => n.id === params.source);
      const targetNode = state.nodes.find((n) => n.id === params.target);

      if (params.source === params.target) return;

      let newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: "buttonedge",
        deletable:true,
        markerEnd:{
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          // color: '#FF0072',
        }
      };

      if (sourceNode?.data.type === "branch") {
        const existingConnections = state.edges.filter(
          (edge) => edge.source === params.source
        );

        if (existingConnections.length >= 2) return;

        newEdge = {
          ...newEdge,
          label: existingConnections.length === 0 ? "true" : "false",
          animated: false,
          style: {
            stroke: existingConnections.length === 0 ? "#22c55e" : "#ef4444",
          },
          labelStyle: {
            fill: existingConnections.length === 0 ? "#22c55e" : "#ef4444",
          },
        };
      }

      if (targetNode?.data.type === "converge") {
        newEdge = {
          ...newEdge,
          animated: true,
          style: { stroke: "#3b82f6" },
        };
      }

      setEdges((prevEdges) => {
        const connectionExists = prevEdges.some(
          (edge) =>
            edge.source === params.source && edge.target === params.target
        );
        if (connectionExists) return prevEdges;

        const edges = addEdge(newEdge, prevEdges);
        dispatch({ type: "SET_EDGES", payload: edges });
        return edges;
      });
    },
    [setEdges, state.nodes, state.edges]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      dispatch({ type: "SET_NODES", payload: nodes });
    },
    [nodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      dispatch({ type: "SET_EDGES", payload: edges });
    },
    [edges, onEdgesChange]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = state.nodes.filter((node) => node.id !== nodeId);
      const updatedEdges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      dispatch({ type: "SET_NODES", payload: updatedNodes });
      dispatch({ type: "SET_EDGES", payload: updatedEdges });
    },
    [state.nodes, state.edges, setEdges, setNodes]
  );

  const updateNode = useCallback(
    (nodeId: string, newData: Partial<Node>) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...newData } : node
      );
      setNodes(updatedNodes);
      dispatch({ type: "SET_NODES", payload: updatedNodes });
    },
    [state.nodes, setNodes]
  );
  const getPreviousNodes = (nodeId:string):Node[] => {
    const userNodes = state.nodes?.filter((ele)=>ele.id !=="start" && ele.id !=="end");
    if(edges.length==0){
      const currentIndex = userNodes?.findIndex((ele)=>ele.id==nodeId);
      if(currentIndex == 0 || currentIndex==-1){
        return []
      }
      return userNodes.slice(currentIndex -1,currentIndex)
    }

    // Filter edges where the current node is the target
    const incomingEdges = state.edges.filter(edge => edge.target === nodeId);
  
    // Get the source IDs from the incoming edges
    const previousNodeIds = incomingEdges.map(edge => edge.source);
  
    // Map the IDs to actual node objects
    const previousNodes = userNodes.filter(node => previousNodeIds.includes(node.id));
    
    return previousNodes;
  };

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = state.nodes.find(node => node.id === nodeId);
      
      if (!nodeToDuplicate) return;

      // Generate a unique ID for the new node
      const newNodeId = `${nodeToDuplicate.id}-copy-${Date.now()}`;

      // Create a new node with slightly offset position
      const duplicatedNode: Node = {
        ...nodeToDuplicate,
        id: newNodeId,
        position: {
          x: nodeToDuplicate.position.x + 100,
          y: nodeToDuplicate.position.y + 100
        },
        data: {
          ...nodeToDuplicate.data,
          label: `${nodeToDuplicate.data.label || 'Node'}`,
        }
      };

      // Add the new node to the existing nodes
      const updatedNodes = [...state.nodes, duplicatedNode];
      
      setNodes(updatedNodes);
      dispatch({ type: "SET_NODES", payload: updatedNodes });

      return duplicatedNode;
    },
    [state.nodes, setNodes]
  );

  const reorderNodes = useCallback(
    (nodeIds: string[]) => {
      // Validate that all provided nodeIds exist
      const validNodeIds = nodeIds.filter(id => 
        state.nodes.some(node => node.id === id)
      );

      // Create a new array of nodes in the specified order
      const reorderedNodes = validNodeIds.map(id => 
        state.nodes.find(node => node.id === id)!
      );

      // Add any remaining nodes that weren't in the specified order
      const remainingNodes = state.nodes.filter(
        node => !validNodeIds.includes(node.id)
      );

      const updatedNodes = [...reorderedNodes, ...remainingNodes];
      
      setNodes(updatedNodes);
      dispatch({ type: "SET_NODES", payload: updatedNodes });
    },
    [state.nodes, setNodes]
  );

  const findNodesByType = useCallback(
    (type: string) => {
      return state.nodes.filter(node => node.data.type === type);
    },
    [state.nodes]
  );

  const resetFlow = useCallback(() => {
    // Reset to initial state, removing all user-created nodes
    const initialNodes = state.nodes.filter(
      node => node.id === 'start' || node.id === 'end'
    );
    const initialEdges: Edge[] = [];

    setNodes(initialNodes);
    setEdges(initialEdges);
    dispatch({ type: "SET_NODES", payload: initialNodes });
    dispatch({ type: "SET_EDGES", payload: initialEdges });
  }, [state.nodes, setNodes, setEdges]);

  const validateFlow = useCallback(() => {
    // Basic flow validation
    const startNode = state.nodes.find(node => node.id === 'start');
    const endNode = state.nodes.find(node => node.id === 'end');

    // Check if there's a path from start to end
    const hasValidPath = () => {
      if (!startNode || !endNode) return false;

      const visited = new Set<string>();
      const queue = [startNode.id];

      while (queue.length > 0) {
        const currentNodeId = queue.shift()!;
        
        if (currentNodeId === endNode.id) return true;

        if (visited.has(currentNodeId)) continue;
        visited.add(currentNodeId);

        // Find outgoing edges from current node
        const outgoingEdges = state.edges.filter(
          edge => edge.source === currentNodeId
        );

        // Add target nodes to queue
        queue.push(
          ...outgoingEdges.map(edge => edge.target)
        );
      }

      return false;
    };

    return {
      hasStart: !!startNode,
      hasEnd: !!endNode,
      hasValidPath: hasValidPath(),
      nodeCount: state.nodes.length,
      edgeCount: state.edges.length
    };
  }, [state.nodes, state.edges]);

  return (
    <FlowContext.Provider
      value={{
        state,
        dispatch,
        setNodes,
        setEdges,
        onNodesChange: handleNodesChange,
        onEdgesChange: handleEdgesChange,
        onConnect,
        deleteNode,
        updateNode,
        duplicateNode,
        getPreviousNodes,
        // reorderNodes,
        // findNodesByType,
        // resetFlow,
        // validateFlow
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};
