import { Injectable } from '@angular/core';

import { FilterNode, TreeFilterNode } from '../interface';

@Injectable({ providedIn: 'root' })
export class PeDataGridTreeService {
  public tree: TreeFilterNode[];
  private flatData: FilterNode[];
  public getFlatData(tree: TreeFilterNode[]) {
    if (JSON.stringify(this.tree) === JSON.stringify(tree)) {
      this.flatData = [];
    }
    tree?.forEach((node) => {
      this.flatData.push({
        id: node.id,
        name: node.name,
        image: node.image,
        editing: node.editing,
        parentId: node.parentId,
        data: node.parentId,
      });
      this.getFlatData(node.children);
    });
    return this.flatData;
  }
}
