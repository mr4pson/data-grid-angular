import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { takeUntil, tap } from 'rxjs/operators';
import { merge, ReplaySubject, Subject } from 'rxjs';

import { PeDataGridTreeService } from '@pe/sidebar';

import { FilterNode, PeDataGridItem, PeDataGridSingleSelectedAction, PeDataGridTheme } from '../../interface';
import { PeDataGridItemComponent } from '../grid-item/grid-item.component';
import { PeDataGridService } from '../../data-grid.service.ts';

@Component({
  selector: 'pe-data-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeDataGridViewComponent implements AfterViewInit, OnDestroy {

  @ViewChild(NgScrollbar) private readonly scrollbarRef: NgScrollbar;

  /** If items are projected content they available only in AfterViewInit */
  readonly setItems$ = new ReplaySubject<PeDataGridItem[]>(1);

  @Input() set items(items: PeDataGridItem[]) {
    if (items) {
      this.lastScrollPosition = this.scrollPosition;
      this.setItems$.next(items);
    }
  }
  get items() {
    return this.gridItems;
  }
  @Input() projectedItems: QueryList<PeDataGridItemComponent>;

  @Input() set actions(actions: PeDataGridSingleSelectedAction[] | undefined) {
    this.itemActions = actions ? actions.filter(action => !!action) : [];
  }

  get actions() {
    return this.itemActions;
  }

  @Input() theme: PeDataGridTheme;

  @Input() isShowGridItemInfo = false;
  @Input() selectable = false;

  @Input() enableDragAndDrop = false;

  selectedItems: PeDataGridItem[] = [];

  /** @Deprecated use `labels` input on grid item component or content projection instead */
  @Input() activeItemId: string;

  @Output() readonly selected = new EventEmitter<PeDataGridItem>();
  @Output() readonly scrollEvent = new EventEmitter<any>();
  @Output() reachedPage = new EventEmitter<number>();

  page = 1;

  private itemActions: PeDataGridSingleSelectedAction[];
  private gridItems: PeDataGridItem[] = [];
  private readonly destroy$ = new Subject<void>();
  private lastScrollPosition = 0;
  private scrollPosition = 0;

  constructor(
    private treeService: PeDataGridTreeService,
    private dataGridService: PeDataGridService,
  ) {}

  ngAfterViewInit(): void {
    merge(
      this.dataGridService.selectedItems$.pipe(
        tap((selectedIds) => {
          this.selectedItems = this.items.filter((item) => selectedIds.includes(item.id!));
        }),
      ),
      this.setItems$.pipe(
        tap(items => {
          const oldSelectedItemsCount = this.gridItems.filter(item => item.selected)?.length;
          const newSelectedItemsCount = items.filter(item => item.selected)?.length;
          if (this.projectedItems.length) {
            this.projectedItems.forEach((component, index) => {
              component.item = items[index];
              if (component.selectable === undefined) {
                component.selectable = this.selectable;
              }
              component.changeDetectorRef.detectChanges();
            });
          } else {
            if (this.gridItems.length === 0 || newSelectedItemsCount === oldSelectedItemsCount) {
              this.gridItems = items;
            } else {

              this.gridItems.forEach((item) => {
                item.selected = items.find(itemChild => itemChild.id === item.id)?.selected;
              });
              // this.gridItems = this.gridItems.map(item => ({
              //   ...item,
              //   selected: items.find(itemChild => itemChild.id === item.id)?.selected}),
              // );
            }
          }
        }),
        takeUntil(this.destroy$),
      ),
      this.scrollbarRef.updated.pipe(
        tap(() => this.scrollbarRef.scrollTo({ top: this.lastScrollPosition, duration: 0 })),
        takeUntil(this.destroy$),
      ),
      this.scrollbarRef.updated.pipe(
        tap(() => this.scrollbarRef.scrollTo({ top: this.lastScrollPosition, duration: 0 })),
        takeUntil(this.destroy$),
      ),
      this.scrollbarRef.scrolled.pipe(
        tap(e => {
          this.scrollEvent.emit(e);
          this.scrollPosition = this.scrollbarRef.viewport.scrollTop;
        }),
        takeUntil(this.destroy$),
      ),
      this.scrollbarRef.verticalScrolled.pipe(
        tap((e: any) => {
          const max = e.target.scrollHeight;
          if ((e.target.scrollTop + e.target.offsetHeight) === e.target.scrollHeight) {
            this.page = this.page + 1;
            this.reachedPage.emit(this.page);
          }
        }),
      ),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onItemSelected(selectedItem: PeDataGridItem): void {
    if (this.selectable) {
      this.selected.emit(selectedItem);
    }
  }

  getMultipleDropListConnections(): string[] {
    const flatData: FilterNode[] = this.treeService.getFlatData(this.treeService.tree);
    return flatData.map((node) => ( 'drop-list' + node.id ));
  }

  getSelectedItems(item): PeDataGridItem[] {
    const dragedItem = this.selectedItems.find(selectedtem => selectedtem.id === item.id);
    return this.selectedItems.length > 0
      ? (!dragedItem ? this.selectedItems.concat(item) : this.selectedItems)
      : this.selectedItems.concat(item);
  }

  getFileName(fileSrc: string): string {
    if (!fileSrc) {
      return 'File';
    }
    const parts = fileSrc.split('/');
    return parts[parts.length - 1];
  }
}
