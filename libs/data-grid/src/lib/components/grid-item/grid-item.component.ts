import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

import { isSelectableItem, PeDataGridItem, PeDataGridSingleSelectedAction, PeDataGridTheme } from '../../interface';

@Component({
  selector: 'pe-data-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeDataGridItemComponent implements AfterViewInit, OnDestroy {

  @ViewChild('projectedContent') projectedContent: ElementRef;

  @Input() item: PeDataGridItem;
  @Input() actions: PeDataGridSingleSelectedAction[];
  @Input() isShowGridItemInfo = false;
  @Input() selectable;
  @Input() set labels(value: string | string[]) {
    this.itemLabels = Array.isArray(value) ? value : [value];
  }
  get labels() {
    return this.itemLabels;
  }
  @Input() theme: PeDataGridTheme;

  @Output() selected = new EventEmitter<PeDataGridItem>();

  destroy$ = new Subject<void>();
  hasProjectedContent = false;
  gridThemes = PeDataGridTheme;

  private itemLabels: string[] = [];

  get isSelectable(): boolean {
    return this.selectable !== false && isSelectableItem(this.item);
  }

  @HostListener('click') onSelect() {
    if (this.isSelectable) {
      this.selected.emit(this.item);
    }
  }

  constructor(public changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    if (this.projectedContent) {
      const content = this.projectedContent.nativeElement as HTMLElement;
      this.hasProjectedContent = content.childElementCount > 0;
      if (this.hasProjectedContent) {
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onAction(event: MouseEvent, action: PeDataGridSingleSelectedAction) {
    event.stopPropagation();
    event.preventDefault();
    if (action.callback) {
      isSelectableItem(this.item) ? action.callback(this.item.id) : action.callback();
    }
  }
}
