import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { PeDataGridPaginator } from '../../interface';

@Component({
  selector: 'pe-data-grid-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeDataGridPaginatorComponent {
  @Input() config: PeDataGridPaginator;
  @Output() pageSelected: EventEmitter<number> = new EventEmitter<number>();
  onPageSelected(index: number): void {
    this.pageSelected.emit(index);
  }
}
