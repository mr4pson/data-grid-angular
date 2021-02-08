# Data grid

## Installation

```typescript
  npm install
```

## Usage

Module:

```typescript

@NgModule({
  imports: [PeDataGridModule],
})
export class PeModule {}
```

Template:

```html
<pe-data-grid
  [items]="data.products"
  [selectedItems]="selected$ | async"
  [multipleSelectedActions]="multipleSelectedActions"
  [sortByActions]="sortByActions"
  [singleSelectedAction]="singleSelectedAction"
  (multipleSelectedItemsChanged)="onSelectedItemsChanged($event)"
  (searchChanged)="onSearchChanged($event)"
></pe-data-grid>
```

Component:

```typescript
import {
  PeDataGridMultipleSelectedAction,
  PeDataGridSingleSelectedAction,
  PeDataGridSortByAction,
} from '@pe/data-grid';

  
@Component({
  selector: 'pe-component',
  templateUrl: './pe-component.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeComponent {
  multipleSelectedActions:  PeDataGridMultipleSelectedAction[] = [
    {
      label: 'Select all',
      callback: (ids: string[]) => console.log('select all')
    },
    {
      label: 'Deselect all',
      callback: (ids: string[]) => console.log('deselect all')
    },
    {
      label: 'Duplicate',
      callback: (ids: string[]) => console.log('duplicate action'),
    },
    {
      label: 'Add to Collection',
      actions: [
        {
          label: 'Collection 1',
          callback: (ids: string[]) => console.log('add to collection 1'),
        },
        {
          label: 'Collection 2',
          callback: (ids: string[]) => console.log('add to collection 2'),
        },
      ],
    },
    {
      label: 'Delete',
      callback: (ids: string[]) => console.log('delete action'),
    },
  ];

  singleSelectedAction: PeDataGridSingleSelectedAction = {
    label: 'Open',
    callback: (id: string) => console.log(id, ' selected'),
  };

  sortByActions: PeDataGridSortByAction[] = [
    {
      label: 'Name',
      callback: () => console.log('sort by name'),
    },
    {
      label: 'Price: Ascending',
      callback: () => console.log('sort by price: asc'),
    },
    {
      label: 'Price: Descending',
      callback: () => console.log('sort by price des'),
    },
    {
      label: 'Date',
      callback: () => console.log('sort by date'),
    },
  ];

  onSelectedItemsChanged(ids: string[]) {}

  onSearchChanged(query: string) {}
}

```
