import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NodeContextMenu from './right_click_node';
import type { Node } from '@xyflow/react';

describe('NodeContextMenu', () => {
  const mockNode: Node = {
    id: 'test-node-1',
    position: { x: 0, y: 0 },
    type: 'default',
    data: { label: 'Test Node' }
  };

  const defaultProps = {
    menu: {
      top: 100,
      left: 100,
      width: 200
    },
    setMenu: jest.fn(),
    node: mockNode,
    onDelete: jest.fn(),
    onDuplicate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct positioning', () => {
    render(<NodeContextMenu {...defaultProps} />);
    
    const menu = screen.getByRole('button', { name: /delete/i }).parentElement?.parentElement;
    expect(menu).toHaveStyle({
      position: 'absolute',
      top: '100px',
      left: '100px',
      width: '200px'
    });
  });

  it('shows delete button by default', () => {
    render(<NodeContextMenu {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  it('shows duplicate button when onDuplicate prop is provided', () => {
    render(<NodeContextMenu {...defaultProps} />);
    
    const duplicateButton = screen.getByRole('button', { name: /duplicate/i });
    expect(duplicateButton).toBeInTheDocument();
    expect(duplicateButton.querySelector('svg')).toBeInTheDocument();
  });

  it('hides duplicate button when onDuplicate prop is not provided', () => {
    const propsWithoutDuplicate = {
      ...defaultProps,
      onDuplicate: undefined
    };
    
    render(<NodeContextMenu {...propsWithoutDuplicate} />);
    
    expect(screen.queryByRole('button', { name: /duplicate/i })).not.toBeInTheDocument();
  });

  it('calls onDelete with correct node id when delete is clicked', () => {
    render(<NodeContextMenu {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockNode.id);
    expect(defaultProps.setMenu).toHaveBeenCalledWith(null);
  });

  it('calls onDuplicate with correct node id when duplicate is clicked', () => {
    render(<NodeContextMenu {...defaultProps} />);
    
    const duplicateButton = screen.getByRole('button', { name: /duplicate/i });
    fireEvent.click(duplicateButton);
    
    expect(defaultProps.onDuplicate).toHaveBeenCalledWith(mockNode.id);
    expect(defaultProps.setMenu).toHaveBeenCalledWith(null);
  });

  it('closes menu when clicking outside', () => {
    render(
      <div>
        <NodeContextMenu {...defaultProps} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    
    fireEvent.mouseDown(screen.getByTestId('outside'));
    
    expect(defaultProps.setMenu).toHaveBeenCalledWith(null);
  });

  it('does not close menu when clicking inside', () => {
    render(<NodeContextMenu {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.mouseDown(deleteButton);
    
    expect(defaultProps.setMenu).not.toHaveBeenCalledWith(null);
  });

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<NodeContextMenu {...defaultProps} />);
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  it('renders with different menu positions', () => {
    const customPositions = {
      ...defaultProps,
      menu: {
        top: 200,
        left: 300,
        width: 150
      }
    };
    
    render(<NodeContextMenu {...customPositions} />);
    
    const menu = screen.getByRole('button', { name: /delete/i }).parentElement?.parentElement;
    expect(menu).toHaveStyle({
      top: '200px',
      left: '300px',
      width: '150px'
    });
  });
});