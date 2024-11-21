export interface ProjectType {
    id?: string;
    label: string;
    url?:string,
    value: string;
    shared?: boolean;
    main?: boolean;
    children?: ProjectType[];
  }
  
  export interface PaletteType {
    id?: string;
    label: string;
    value: string;
    icon: string;
    children?: PaletteType[];
  }