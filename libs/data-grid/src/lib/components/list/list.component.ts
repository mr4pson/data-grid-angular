import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { merge, Subject } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { map, takeUntil, tap } from 'rxjs/operators';


import { PeDataGridTreeService } from '@pe/sidebar';

import {
  FilterNode,
  isSelectableItem,
  PeDataGridItem,
  PeDataGridListOptions,
  PeDataGridSelectableItem,
  PeDataGridSingleSelectedAction,
} from '../../interface';
import { PeDataGridService } from '../../data-grid.service.ts';
import { GridAnimationProgress } from '../../data-grid.animation';

interface ColumnsSizesInterface {
  title?: number;
  description?: number;
  customFields?: number[];
}

@Component({
  selector: 'pe-data-grid-list-view',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../common.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeDataListViewComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild(NgScrollbar) private readonly scrollbarRef: NgScrollbar;

  @ViewChildren('titleElem', { read: ElementRef }) titleElems: QueryList<ElementRef>;
  @ViewChildren('descriptionElem', { read: ElementRef }) descriptionElems: QueryList<ElementRef>;
  @ViewChildren('customFieldElem', { read: ElementRef }) customFieldElems: QueryList<ElementRef>;
  @ViewChildren('actionsFieldElem', { read: ElementRef }) actionsFieldElem: QueryList<ElementRef>;

  columnsSizes: ColumnsSizesInterface = {};

  @Input() set items(items: PeDataGridItem[]) {
    if (items) {
      this.gridItems = items.filter((item): item is PeDataGridSelectableItem => isSelectableItem(item));
      this.cdr.detectChanges();
      this.updateColumnSizes();
    }
  }
  get items() {
    return this.gridItems;
  }

  @Input() activeItemId: string;
  @Input() selectable: boolean;
  @Input() options: PeDataGridListOptions;
  @Input() showFilters: boolean;
  @Input() clickable: boolean;
  @Input() gridAnimationProgress: GridAnimationProgress;
  @Input() enableDragAndDrop = false;

  selectedItems: PeDataGridItem[] = [];

  @Input() set actions(actions: PeDataGridSingleSelectedAction[] | undefined) {
    this.itemActions = actions ? actions.filter(action => !!action) : [];
  }

  get actions() {
    return this.itemActions;
  }

  @Output() readonly selected = new EventEmitter<PeDataGridItem>();
  @Output() readonly scrollEvent = new EventEmitter<any>();
  @Output() readonly itemClicked = new EventEmitter<PeDataGridItem>();

  allItemsSelected$ = this.dataGridService.selectedItems$.pipe(map(items => items.length === this.gridItems.length));

  private itemActions: PeDataGridSingleSelectedAction[];
  private gridItems: PeDataGridSelectableItem[] = [];
  private readonly destroy$ = new Subject<void>();

  get isMobile(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 620px)');
  }

  constructor(
    private elementRef: ElementRef,
    private dataGridService: PeDataGridService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private treeService: PeDataGridTreeService,
  ) {}

  ngAfterViewInit(): void {
    merge(
      this.dataGridService.selectedItems$.pipe(
        tap((selectedIds) => {
          this.selectedItems = this.items.filter((item) => selectedIds.includes(item.id!));
        }),
      ),
      this.scrollbarRef.scrolled.pipe(
        tap(e => this.scrollEvent.emit(e)),
        takeUntil(this.destroy$),
      ),
    ).subscribe();
    this.updateColumnSizes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items || changes.options || changes.actions) {
      this.updateColumnSizes();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateColumnSizes();
  }

  onToggle(item: PeDataGridItem): void {
    if (this.selectable) {
      this.dataGridService.selectItem$.next(item);
    }
  }

  onBulkToggle(): void {
    if (this.selectable) {
      const items = this.gridItems.filter(item => item.selected);
      const selected = items.length === this.gridItems.length ? [] : this.gridItems.map(item => item.id);
      this.dataGridService.setSelected$.next(selected);
    }
  }

  onAction(event: MouseEvent, item: PeDataGridItem, action: PeDataGridSingleSelectedAction): void {
    event.stopPropagation();
    event.preventDefault();
    if (action.callback) {
      action.callback(item.id);
    }
  }

  getWidth(value: number | undefined): string {
    return value ? `${value}px` : `auto`;
  }

  getNameMinWidth(value: number | undefined): string {
    const hasImage = (value && this.items.some(item => !!item.image)) ? 58 : 0;
    return value ? `${value + hasImage}px` : `auto`;
  }

  getMinWidthCustomAt(index: number): string {
    return this.columnsSizes && this.columnsSizes.customFields && this.columnsSizes.customFields[index]
      ? this.getWidth(this.columnsSizes.customFields[index])
      : 'auto';
  }

  trackItem(index, item: PeDataGridItem) {
    return item.id ?? item._id;
  }

  hasItemsAtLeastOneField(field: string): boolean {
    return this.items.some(item => !!item[field]);
  }

  private updateColumnSizes(): void {
    let titleElemWidth = 50;
    if (this.titleElems) {
      this.titleElems.forEach(elem => {
        titleElemWidth = Math.max(titleElemWidth, elem.nativeElement.getBoundingClientRect().width);
      });
    }
    let descriptionElemWidth = this.options?.descriptionTitle ? 50 : 0;
    if (this.descriptionElems && this.options?.descriptionTitle) {
      this.descriptionElems.forEach(elem => {
        descriptionElemWidth = Math.max(descriptionElemWidth, elem.nativeElement.getBoundingClientRect().width);
      });
    }
    const customTitles = this.options && this.options.customFieldsTitles;
    let customFieldElemsWidth = customTitles ? customTitles.map(() => 0) : [];
    if (this.customFieldElems) {
      this.customFieldElems.forEach(elem => {
        const index = Number(elem.nativeElement.getAttribute('customfieldindex'));
        let width: number = elem.nativeElement.getBoundingClientRect().width;
        const children: HTMLCollection = elem.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
          const e: HTMLElement = children.item(i) as HTMLElement;
          width = Math.max(width, e.getBoundingClientRect().width || 0);
        }
        customFieldElemsWidth[index] = Math.max(customFieldElemsWidth[index], width);
      });
    }

    let actionFieldElemsWidth = 50;
    if (this.actionsFieldElem) {
      this.actionsFieldElem.forEach(elem => {
        actionFieldElemsWidth = Math.max(actionFieldElemsWidth, elem.nativeElement.getBoundingClientRect().width);
      });
    }

    if (this.elementRef?.nativeElement?.getBoundingClientRect().width) {
      const listContainerMargin = 20;
      const actionFieldMargin = 18;
      const checkBoxWidth = 32;
      const count =
        customFieldElemsWidth.length
        + (titleElemWidth ? 1 : 0)
        + (descriptionElemWidth ? 1 : 0)
        + (actionFieldElemsWidth ? 1 : 0);
      const width = this.elementRef.nativeElement.getBoundingClientRect().width;
      const margins = actionFieldMargin * (count - (actionFieldElemsWidth ? 1 : 0));
      const fieldWidth = actionFieldElemsWidth - (this.selectable ? checkBoxWidth : 0);
      const globalWidth = width - listContainerMargin - margins - fieldWidth;
      const buttonsWidth =  actionFieldMargin + 180;
      const totalWidth =
        titleElemWidth + descriptionElemWidth + buttonsWidth + (customFieldElemsWidth || []).reduce((a, b) => a + b, 0);
      if (totalWidth) {
        const k = globalWidth / totalWidth;
        titleElemWidth = Math.floor(titleElemWidth * k);
        descriptionElemWidth = Math.floor(descriptionElemWidth * k);
        customFieldElemsWidth = customFieldElemsWidth.map(a => Math.floor(a * k));
      }
    }

    this.columnsSizes = {
      title: titleElemWidth,
      description: descriptionElemWidth,
      customFields: customFieldElemsWidth,
    };

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
