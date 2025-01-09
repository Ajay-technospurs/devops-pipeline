// blockTypes.ts
import { ReactNode } from 'react';
import { 
  SeparatorHorizontalIcon, 
  Combine, 
  SplitSquareHorizontal,
  RotateCcw,
  ChevronRight,
  Play,
  Square
} from 'lucide-react';

export interface BlockOption {
  label: string;
  id: string;
  type: string;
  variant?: string;
  value: string;
  icon?: string;
  description?: string;
  category: string;
  customIcon?: ReactNode;
}

export interface BlockCategory {
  id: string;
  label: string;
  description?: string;
  blocks: BlockOption[];
}

export const blockCategories: BlockCategory[] = [
  {
    id: 'flow-control',
    label: 'Flow Control',
    description: 'Blocks for controlling the flow of execution',
    blocks: [
      {
        label: 'Branch',
        id: 'branch-default',
        type: 'branch',
        variant: 'default',
        value: 'branch-block',
        category: 'flow-control',
        description: 'Split flow into two paths based on a condition',
        // customIcon: <SeparatorHorizontalIcon className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Branch (Alternative)',
        id: 'branch-alternative',
        type: 'branch',
        variant: 'diamond',
        value: 'branch-block-alt',
        category: 'flow-control',
        description: 'Alternative branch style with different handle positions',
        // customIcon: <SeparatorHorizontalIcon className="h-6 w-6 rotate-45" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Converge',
        id: 'converge-default',
        type: 'converge',
        variant: 'default',
        value: 'converge-block',
        category: 'flow-control',
        description: 'Merge multiple paths into one',
        // customIcon: <Combine className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Converge (Circular)',
        id: 'converge-circular',
        type: 'converge',
        variant: 'circular',
        value: 'converge-block-circular',
        category: 'flow-control',
        description: 'Circular style converge node',
        // customIcon: <Combine className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      }
    ]
  },
  {
    id: 'execution',
    label: 'Execution',
    description: 'Blocks for parallel and repeated execution',
    blocks: [
      {
        label: 'Simultaneous',
        id: 'simultaneous-default',
        type: 'simultaneous',
        variant: 'default',
        value: 'simultaneous-block',
        category: 'execution',
        description: 'Execute multiple paths in parallel',
        // customIcon: <SplitSquareHorizontal className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Simultaneous (Compact)',
        id: 'simultaneous-compact',
        type: 'simultaneous',
        variant: 'compact',
        value: 'simultaneous-block-compact',
        category: 'execution',
        description: 'Compact version of simultaneous execution',
        // customIcon: <SplitSquareHorizontal className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Loop',
        id: 'loop-default',
        type: 'loop',
        variant: 'default',
        value: 'loop-block',
        category: 'execution',
        description: 'Repeat execution in a loop',
        // customIcon: <RotateCcw className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Loop (Square)',
        id: 'loop-square',
        type: 'loop',
        variant: 'square',
        value: 'loop-block-square',
        category: 'execution',
        description: 'Square variant of loop block',
        // customIcon: <RotateCcw className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      }
    ]
  },
  {
    id: 'basic',
    label: 'Basic',
    description: 'Basic flow blocks',
    blocks: [
      {
        label: 'Block',
        id: 'block-default',
        type: 'block',
        variant: 'default',
        value: 'basic-block',
        category: 'basic',
        description: 'Standard block for basic operations',
        // customIcon: <ChevronRight className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      },
      {
        label: 'Wide Block',
        id: 'block-wide',
        type: 'block',
        variant: 'wide',
        value: 'basic-block-wide',
        category: 'basic',
        description: 'Wider block for complex operations',
        customIcon: <ChevronRight className="h-6 w-6" />,
        icon: '/assets/palette_child.svg'
      }
    ]
  }
];