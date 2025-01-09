// types.ts
import { ReactNode } from 'react';

export interface HandlePosition {
  id: string;
  top?: string;
  left?: string;
  type: 'source' | 'target';
  position: 'Left' | 'Right' | 'Top' | 'Bottom';
}

export interface NodeConfig {
  icon: ReactNode;
  className: string;
  shape?: 'rounded' | 'circular';
  handles?: HandlePosition[];
  styleVariant?: 'default' | 'alternative';
}

export interface NodeTypeConfig {
  [key: string]: {
    variants: {
      [key: string]: NodeConfig;
    };
  };
}

export interface CustomNodeData {
  icon?: ReactNode;
  label: string;
  type: string;
  variant?: string;
  condition?: string;
  iterator?: string;
  showHandles?: boolean;
  schemaData?: Record<string, any>;
}