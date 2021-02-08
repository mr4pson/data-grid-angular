export interface TreeFilterNode {
  id?: string;
  name: string;
  image?: string;
  editing?: boolean;
  parentId?: string;
  data?: any;
  children?: TreeFilterNode[];
}

export interface FilterNode {
  id?: string;
  name: string;
  image?: string;
  editing?: boolean;
  parentId?: string;
  data?: any;
}