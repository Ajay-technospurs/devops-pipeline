// nodeConfig.ts
import { ChevronRight, Split, RotateCw, Combine, Play, Square } from "lucide-react";
import { NodeTypeConfig } from './types';

export const nodeConfigs: NodeTypeConfig = {
  block: {
    variants: {
      default: {
        icon: <ChevronRight className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'output', type: 'source', position: 'Right', top: '50%' }
        ]
      },
      wide: {
        icon: <ChevronRight className="w-6 h-6" />,
        className: "w-60 min-h-20 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'output', type: 'source', position: 'Right', top: '50%' }
        ],
        styleVariant: 'alternative'
      }
    }
  },
  branch: {
    variants: {
      default: {
        icon: <Split className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'a', type: 'source', position: 'Right', top: '30%' },
          { id: 'b', type: 'source', position: 'Right', top: '70%' }
        ]
      },
      diamond: {
        icon: <Split className="w-6 h-6 rotate-45" />,
        className: "w-32 min-h-20 rounded-lg rotate-45 aspect-square *:rotate-[-45deg]",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '100%' },
          { id: 'a', type: 'source', position: 'Top' },
          { id: 'b', type: 'source', position: 'Right' }
        ]
      },
      alternative: {
        icon: <Split className="w-6 h-6 rotate-45" />,
        className: "w-40 min-h-20 rounded-full",
        shape: 'circular',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'a', type: 'source', position: 'Right', top: '20%' },
          { id: 'b', type: 'source', position: 'Right', top: '80%' }
        ],
        styleVariant: 'alternative'
      }
    }
  },
  converge: {
    variants: {
      default: {
        icon: <Combine className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'a', type: 'target', position: 'Left', top: '30%' },
          { id: 'b', type: 'target', position: 'Left', top: '70%' },
          { id: 'output', type: 'source', position: 'Right', top: '50%' }
        ]
      },
      circular: {
        icon: <Combine className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-full",
        shape: 'circular',
        handles: [
          { id: 'a', type: 'target', position: 'Left', top: '30%' },
          { id: 'b', type: 'target', position: 'Left', top: '70%' },
          { id: 'output', type: 'source', position: 'Right', top: '50%' }
        ],
        styleVariant: 'alternative'
      }
    }
  },
  simultaneous: {
    variants: {
      default: {
        icon: <Split className="w-6 h-6 rotate-90" />,
        className: "w-40 min-h-20 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'a', type: 'source', position: 'Right', top: '30%' },
          { id: 'b', type: 'source', position: 'Right', top: '70%' }
        ]
      },
      compact: {
        icon: <Split className="w-6 h-6 rotate-90" />,
        className: "w-32 min-h-16 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'a', type: 'source', position: 'Right', top: '35%' },
          { id: 'b', type: 'source', position: 'Right', top: '65%' }
        ],
        styleVariant: 'alternative'
      }
    }
  },
  loop: {
    variants: {
      default: {
        icon: <RotateCw className="w-6 h-6" />,
        className: "w-40 min-h-20 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'output', type: 'source', position: 'Right', top: '50%' },
          { id: 'loop', type: 'source', position: 'Bottom', left: '50%' }
        ]
      },
      square: {
        icon: <RotateCw className="w-6 h-6" />,
        className: "w-40 h-40 rounded-lg",
        shape: 'rounded',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' },
          { id: 'output', type: 'source', position: 'Right', top: '50%' },
          { id: 'loop', type: 'source', position: 'Bottom', left: '50%' }
        ],
        styleVariant: 'alternative'
      }
    }
  },
  start: {
    variants: {
      default: {
        icon: <Play className="w-6 h-6" />,
        className: "w-40 h-16 rounded-full",
        shape: 'circular',
        handles: [
          { id: 'output', type: 'source', position: 'Right', top: '50%' }
        ]
      },
      pill: {
        icon: <Play className="w-6 h-6" />,
        className: "w-32 h-12 rounded-full",
        shape: 'circular',
        handles: [
          { id: 'output', type: 'source', position: 'Right', top: '50%' }
        ],
        styleVariant: 'alternative'
      }
    }
  },
  end: {
    variants: {
      default: {
        icon: <Square className="w-6 h-6" />,
        className: "w-40 h-16 rounded-full",
        shape: 'circular',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' }
        ]
      },
      compact: {
        icon: <Square className="w-6 h-6" />,
        className: "w-32 h-12 rounded-full",
        shape: 'circular',
        handles: [
          { id: 'input', type: 'target', position: 'Left', top: '50%' }
        ],
        styleVariant: 'alternative'
      }
    }
  }
};

export const getNodeConfig = (type: string, variant: string = 'default') => {
  return nodeConfigs[type]?.variants[variant] || nodeConfigs.block.variants.default;
};

export const nodeStyles = {
  base: "relative border-2 min-h-0 flex flex-col items-center justify-center p-1 transition-all duration-200",
  variants: {
    default: {
      selected: "border-primary shadow-lg ring-1 ring-primary/30",
      normal: "border-border hover:border-primary/50",
      background: "bg-background"
    },
    alternative: {
      selected: "border-secondary shadow-lg ring-1 ring-secondary/30",
      normal: "border-border hover:border-secondary/50",
      background: "bg-secondary/20"
    },
    diamond: {
      selected: "border-secondary shadow-lg ring-1 ring-secondary/30",
      normal: "border-border hover:border-secondary/50",
      background: "bg-background rotate-45"
    }
  }
};