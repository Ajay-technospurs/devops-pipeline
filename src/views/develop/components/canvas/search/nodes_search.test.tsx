import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NodeSearch from './nodes_search';
import { useFlow } from '@/provider/canvas_provider';
import { usePanelRefs } from '@/provider/layout_provider';
import type { Node, Edge, Connection } from '@xyflow/react';
import { ImperativePanelHandle } from 'react-resizable-panels';

// Explicitly type and mock the hooks
jest.mock('@/provider/canvas_provider', () => ({
  useFlow: jest.fn()
}));

jest.mock('@/provider/layout_provider', () => ({
  usePanelRefs: jest.fn()
}));

// Type the mocked hooks
const mockUseFlow = useFlow as jest.MockedFunction<typeof useFlow>;
const mockUsePanelRefs = usePanelRefs as jest.MockedFunction<typeof usePanelRefs>;

// Mock sample data
const mockNodes = [
    { id: '1', data: { label: 'Test Node 1' } },
    { id: '2', data: { label: 'Test Node 2' } },
    { id: '3', data: { label: 'Different Node' } },
] as unknown as Node[];

const mockReactFlowProps = {
  getNodesBounds: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
  fitBounds: jest.fn(),
};

describe('NodeSearch', () => {
  const mockDispatch = jest.fn();
  const mockCollapsePanel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations with proper typing
    mockUseFlow.mockReturnValue({
        state: {
            nodes: mockNodes,
            edges: [],
            history: [],
            currentStep: 0,
            selectedNode: null
        },
        dispatch: mockDispatch,
        reactFlowProps: mockReactFlowProps as any,
        setNodes: jest.fn(),
        setEdges: jest.fn(),
        onNodesChange: jest.fn(),
        onEdgesChange: jest.fn(),
        onConnect: jest.fn(),
        getPreviousNodes: function (nodeId: string): Node[] {
            throw new Error('Function not implemented.');
        },
        deleteNode: function (nodeId: string): void {
            throw new Error('Function not implemented.');
        },
        duplicateNode: function (nodeId: string): void {
            throw new Error('Function not implemented.');
        },
        updateNode: function (nodeId: string, newData: Partial<Node>): void {
            throw new Error('Function not implemented.');
        }
    });

    mockUsePanelRefs.mockReturnValue({
        collapsePanel: mockCollapsePanel,
        expandPanel: jest.fn(),
        togglePanel: jest.fn(),
        getPanelRef: function (id: string): React.RefObject<ImperativePanelHandle> {
            throw new Error('Function not implemented.');
        }
    });
  });

  it('renders search input correctly', () => {
    render(<NodeSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search and select...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveFocus();
  });

  it('filters nodes based on search term', async () => {
    render(<NodeSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search and select...');
    await userEvent.type(searchInput, 'Test');

    const nodeResults = screen.getAllByText(/Test Node/);
    expect(nodeResults).toHaveLength(2);
    expect(screen.queryByText('Different Node')).not.toBeInTheDocument();
  });

  it('shows "No matching nodes" when no results found', async () => {
    render(<NodeSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search and select...');
    await userEvent.type(searchInput, 'NonExistent');

    expect(screen.getByText('No matching nodes')).toBeInTheDocument();
  });

  it('handles node selection correctly', async () => {
    render(<NodeSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search and select...');
    await userEvent.type(searchInput, 'Test');

    const firstNode = screen.getByText('Test Node 1');
    fireEvent.click(firstNode);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_NODE',
      payload: mockNodes[0]
    });
    expect(mockCollapsePanel).toHaveBeenCalledWith('node-search');
    expect(mockReactFlowProps.getNodesBounds).toHaveBeenCalledWith(['1']);
    expect(mockReactFlowProps.fitBounds).toHaveBeenCalledWith(
      { x: 0, y: 0, width: 100, height: 100 },
      { duration: 300, padding: 2 }
    );
  });

  it('handles case-insensitive search', async () => {
    render(<NodeSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search and select...');
    await userEvent.type(searchInput, 'test');

    const nodeResults = screen.getAllByText(/Test Node/);
    expect(nodeResults).toHaveLength(2);
  });

  it('doesnt show results container when search is empty', () => {
    render(<NodeSearch />);
    
    mockNodes.forEach(node => {
      expect(screen.queryByText(node.data.label as string)).not.toBeInTheDocument();
    });
  });
});