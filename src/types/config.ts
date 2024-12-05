// Custom drag type
export const DRAG_TYPES = {
    GLOBAL_INPUT: 'globalInput',
    OUTPUT:"output"
  };
  
  export interface GlobalInput {
    id: string;
    key: string;
    value: string;
    type:string
  }