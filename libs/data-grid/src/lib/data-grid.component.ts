import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  scan,
  shareReplay,
  startWith,
  switchMapTo,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { MatIconRegistry } from '@angular/material/icon';

import { TranslationLoaderService } from '@pe/i18n';
import { SidebarFiltersWrapperComponent, SidebarFooterWrapperComponent } from '@pe/sidebar';

import {
  isAdditionalFilter,
  isConditionalFilter,
  PeDataGridAdditionalFilter,
  PeDataGridButtonItem,
  PeDataGridFilter,
  PeDataGridFilterItem,
  PeDataGridFilterType,
  PeDataGridFilterWithConditions,
  PeDataGridItem,
  PeDataGridLayoutType,
  PeDataGridListOptions,
  PeDataGridMultipleSelectedAction,
  PeDataGridPaginator,
  PeDataGridSingleSelectedAction,
  PeDataGridSortByAction,
  PeDataGridTheme,
} from './interface';
import { PeDataGridItemComponent } from './components/grid-item/grid-item.component';
import { PeDataGridService } from './data-grid.service.ts';
import { I18nDomains } from './constants/translations-constants';
import {
  GridAnimationProgress,
  GridAnimationStates,
  GridExpandAnimation,
  MobileSidebarAnimation,
  SidebarAnimation,
} from './data-grid.animation';
import { PeDataGridSidebarService } from './services/data-grid-sidebar.service';

@Component({
  selector: 'pe-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [SidebarAnimation, MobileSidebarAnimation, GridExpandAnimation],
})
export class PeDataGridComponent implements AfterContentInit, OnInit, OnDestroy, DoCheck {
  @ContentChildren(SidebarFiltersWrapperComponent) sidebarFilters: QueryList<SidebarFiltersWrapperComponent>;
  @ContentChild(SidebarFooterWrapperComponent) sidebarFooter: SidebarFooterWrapperComponent;
  @ContentChildren(PeDataGridItemComponent, { descendants: true }) projectedItems: QueryList<PeDataGridItemComponent>;

  @Input() items: PeDataGridItem[] = [];

  @Input() set selectedItems(ids: string[]) {
    if (ids) {
      this.dataGridService.setSelected$.next(ids);
    }
  }

  @Input() activeItemId: string;
  @Input() singleSelectedAction: PeDataGridSingleSelectedAction;
  @Input() secondSingleSelectedAction: PeDataGridSingleSelectedAction;
  @Input() multipleSelectedActions: PeDataGridMultipleSelectedAction[];
  @Input() sortByActions: PeDataGridSortByAction[];
  @Input() theme: PeDataGridTheme;
  @Input() searchPlaceholder = 'Search';
  @Input() itemsTitle = 'items';
  @Input() navbarTitle: string | SafeHtml;
  @Input() showCollectionsCountInHeader = true;
  @Input() forceDisableInitAnimation = false;

  @Input() set filters(value: PeDataGridFilterType[]) {
    if (value) {
      this.gridFilters = value;
      this.setFilters$.next();
    }
  }

  get filters(): PeDataGridFilterType[] {
    return this.gridFilters;
  }

  @Input() set displayFilters(value: boolean) {
    this.displayFilters$.next(value);
  }

  @Input() defaultLayout: PeDataGridLayoutType = PeDataGridLayoutType.Grid;
  @Input() hideLayoutSwitcher = false;
  @Input() dataListOptions: PeDataGridListOptions;
  @Input() isShowGridItemInfo: boolean;
  @Input() isShowCollectionsCounter = true;
  @Input() isShowSearch = true;
  @Input() showSidebar = true;
  @Input() hasPlatformHeader: boolean;
  @Input() totalCount = 0;
  @Input() clickableListItem: boolean;
  @Input() isFilterCreating = false;
  @Input() displayNavbar = false;
  @Input() isShowRightPaneButton = false;
  @Input() rightPaneButtons: PeDataGridButtonItem[] = [];
  

  @Input() paginator: PeDataGridPaginator;
  @Input() searchString: string;
  @Input() navbarLeftPaneButtons: PeDataGridButtonItem[] = [];
  @Input() registerIcons: (registry: MatIconRegistry) => void;

  /** @deprecated Use [filters] input array for all filter types */
  @Input() additionalFilter: PeDataGridAdditionalFilter;

  /** @deprecated Use [filters] input array for all filter types */
  @Input() filterConditions: PeDataGridFilterWithConditions[];
  @Input() enableDragAndDrop = false;
  @Input() creatingFilterParentName: string;

  @Output() readonly multipleSelectedItemsChanged = new EventEmitter<string[]>();
  @Output() readonly searchChanged = new EventEmitter<string>();
  @Output() readonly filtersChanged = new EventEmitter<PeDataGridFilterItem[] | null>();
  @Output() readonly layoutTypeChanged = new EventEmitter<PeDataGridLayoutType>();
  @Output() readonly scrollEvent = new EventEmitter<any>();
  @Output() readonly reachedPageEnd = new EventEmitter<number>();
  @Output() readonly pageSelected = new EventEmitter<number>();
  @Output() readonly chooseFilters = new EventEmitter<number>();
  @Output() readonly applyFilters = new EventEmitter<PeDataGridFilterType[]>();
  @Output() readonly itemClicked = new EventEmitter<PeDataGridFilterItem>();
  @Output() createFilter = new EventEmitter<string>();

  oldItems: PeDataGridItem[] = this.items;
  oldLength = 0;

  initAnimation = false;

  readonly items$ = this.dataGridService.items$;
  readonly selected$ = this.dataGridService.selectedItems$;
  PeDataGridLayoutType = PeDataGridLayoutType;
  GridAnimationProgress = GridAnimationProgress;

  private gridFilters: PeDataGridFilterType[];
  private readonly destroy$ = new Subject<void>();
  private readonly setFilters$ = new ReplaySubject<void>(1);
  private readonly mobileWidth = 720;
  private readonly gridAnimationStateStream$ = new BehaviorSubject<GridAnimationStates>(GridAnimationStates.Default);
  private readonly gridAnimationProgressStream$ = new Subject<GridAnimationProgress>();

  isMobile = window.innerWidth <= this.mobileWidth;
  private layoutTypeSubject$: BehaviorSubject<PeDataGridLayoutType>;

  readonly gridAnimationState$: Observable<GridAnimationStates> = this.gridAnimationStateStream$.asObservable();
  readonly gridAnimationProgress$: Observable<GridAnimationProgress> = this.gridAnimationProgressStream$.asObservable();

  readonly collectionsCount$ = merge(
    this.setFilters$.pipe(map(() => this.getCollectionsFilters())),
    this.applyFilters.pipe(map(() => this.getCollectionsFilters())),
  ).pipe(
    map(filters =>
      filters.reduce((acc, gridFilter) => {
        if (isAdditionalFilter(gridFilter)) {
          return gridFilter.filters ? [...acc, ...gridFilter.filters.filter(item => !item.toggleAllItems)] : acc;
        }

        if (!isConditionalFilter(gridFilter)) {
          return [...acc, ...gridFilter.items];
        }

        return acc;
      }, []),
    ),
    map(filters => {
      const selectedCount = filters.filter(item => item.selected).length;
      if (this.showCollectionsCountInHeader) {
        return selectedCount > 0 ? selectedCount : filters.length;
      }

      return 0;
    }),
  );

  set layoutType(value: PeDataGridLayoutType) {
    this.layoutTypeSubject$.next(value);
  }

  get layoutType(): PeDataGridLayoutType {
    return this.layoutTypeSubject$.value;
  }

  set gridAnimationProgress(value: GridAnimationProgress) {
    this.gridAnimationProgressStream$.next(value);
  }

  filtersCount$ = this.setFilters$.pipe(
    map(() => {
      let filtersCount = this.additionalFilter ? 1 : 0;
      filtersCount += this.gridFilters ? this.gridFilters.length : 0;
      filtersCount += this.filterConditions ? this.filterConditions.length : 0;
      filtersCount += this.sidebarFilters ? 1 : 0;

      return filtersCount;
    }),
    startWith(0),
    distinctUntilChanged(),
    shareReplay(1),
  );

  displayFilters$ = new ReplaySubject<boolean>(1);
  showFilters$ = merge(
    merge(this.setFilters$, this.displayFilters$, this.filtersCount$).pipe(
      switchMapTo(this.displayFilters$),
    ),
    this.dataGridSidebarService.toggleFilters$,
  ).pipe(
    withLatestFrom(this.filtersCount$),
    map(([value, count]) => count > 0 ? value : false),
    scan((acc: boolean, value: boolean | undefined) => value === undefined ? !acc : value),
    distinctUntilChanged(),
    tap(
      value => {
        this.gridAnimationStateStream$.next(value && !this.isMobile
          ? GridAnimationStates.Default : GridAnimationStates.Expanded);
        this.initAnimation = true;
      },
    ),
    shareReplay(1),
  );


  showFiltersButton$ = this.filtersCount$.pipe(map(value => value > 0));

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.isMobile = window.innerWidth <= this.mobileWidth;
    this.displayFilters = window.innerWidth > this.mobileWidth;
  }

  constructor(
    private dataGridService: PeDataGridService,
    private translationLoaderService: TranslationLoaderService,
    private iconRegistry: MatIconRegistry,
    private dataGridSidebarService: PeDataGridSidebarService,
  ) {}

  private getCollectionsFilters(): Array<PeDataGridAdditionalFilter | PeDataGridFilter> {
    if (this.gridFilters?.length) {
      const allFilters = this.gridFilters.filter(
        (gridFilter): gridFilter is PeDataGridAdditionalFilter | PeDataGridFilter => !isConditionalFilter(gridFilter),
      );
      if (this.additionalFilter) {
        allFilters.push(this.additionalFilter);
      }

      return allFilters;
    }

    return [];
  }

  ngOnInit(): void {
    this.initTranslations().subscribe();
    this.applyFilters
      .pipe(
        takeUntil(this.destroy$),
        tap(filters => {
          this.dataGridService.showReset = filters.some(filter => {
            if (isConditionalFilter(filter)) {
              return filter.conditions.some(cond => cond.selected);
            } else if (isAdditionalFilter(filter)) {
              return filter.filters?.some(f => f.selected);
            } else {
              return filter.items?.some(item => item.selected);
            }
          });
        }),
      )
      .subscribe();
    this.layoutTypeSubject$ = new BehaviorSubject<PeDataGridLayoutType>(this.defaultLayout);
    this.layoutTypeSubject$.pipe(takeUntil(this.destroy$)).subscribe(layout => {
      this.layoutTypeChanged.emit(layout);
    });
    this.dataGridService.selectedItems$.pipe(takeUntil(this.destroy$)).subscribe(selectedIds => {
      this.multipleSelectedItemsChanged.emit(selectedIds);
    });

    this.displayFilters$.next(window.innerWidth > this.mobileWidth);
    if (this.registerIcons) {
      this.registerIcons(this.iconRegistry);
    }
  }

  ngDoCheck(): void {
    if (!isEqual(this.items, this.oldItems)) {
      this.oldItems = this.items;
      this.oldLength = this.items?.length ?? 0;
      this.dataGridService.inputItems$.next(this.items);
    } else {
      const newLength = this.items?.length ?? 0;
      const old = this.oldLength;
      if (old !== newLength) {
        this.oldLength = newLength;
      }
    }
  }

  ngAfterContentInit(): void {
    this.projectedItems.changes
      .pipe(
        startWith(this.projectedItems),
        tap((components: PeDataGridItemComponent[]) =>
          components.forEach(component => {
            component.selected
              .pipe(takeUntil(merge(this.projectedItems.changes, component.destroy$, this.destroy$)))
              .subscribe(val => {
                this.dataGridService.selectItem$.next(val);
              });
          }),
        ),
        map(components => components.map(cmp => ({ ...cmp.item }))),
        takeUntil(this.destroy$),
      )
      .subscribe(items => {
        this.dataGridService.projectedItems$.next(items);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSelectedItemsChanged(selectedItem: PeDataGridItem): void {
    this.dataGridService.selectItem$.next(selectedItem);
  }

  onSearchChanged(value: string): void {
    this.resetFilters();
    this.searchChanged.emit(value);
  }

  onLayoutTypeChanged(value: PeDataGridLayoutType): void {
    this.layoutType = value;
  }

  onSelectFilters(filters: PeDataGridFilterItem[]): void {
    this.items = [];
    this.totalCount = 0;
    this.dataGridService.inputItems$.next(null);
    this.filtersChanged.emit(filters);
  }

  onToggleFilters(): void {
    this.dataGridSidebarService.toggleFilters$.next();
  }

  onApplyFilters(filters: PeDataGridFilterType[]): void {
    this.applyFilters.emit(filters);
  }

  onResetFilters(): void {
    this.resetFilters();
  }

  onHideFilters(): void {
    this.displayFilters$.next(false);
  }

  onReachedPageEnd($event: number) {
    this.reachedPageEnd.emit($event);
  }

  scrollEventFn(onBottom: any): void {
    if (onBottom) {
      this.scrollEvent.emit(onBottom);
    }
  }

  trackDataGridItem(index: number, item: PeDataGridItem): string {
    return item.id ?? item._id;
  }

  private resetFilters(): void {
    this.filters = this.filters.map(gridFilter => {
      if (isAdditionalFilter(gridFilter)) {
        gridFilter.filters?.forEach(filterItem => (filterItem.selected = false));
      } else if (isConditionalFilter(gridFilter)) {
        gridFilter.conditions.forEach(condition => (condition.selected = false));
      } else {
        gridFilter.items.forEach(item => (item.selected = false));
      }

      return { ...gridFilter };
    });

    if (this.additionalFilter && this.additionalFilter.filters) {
      this.additionalFilter.filters.forEach(filterItem => {
        filterItem.selected = false;
      });

      this.additionalFilter = { ...this.additionalFilter };
    }

    if (this.filterConditions) {
      this.filterConditions = this.filterConditions.map(gridFilter => {
        gridFilter.conditions.forEach(condition => (condition.selected = false));

        return { ...gridFilter };
      });
    }

    this.filtersChanged.emit(null);
    this.applyFilters.emit([]);
  }

  onCreateFilter(name) {
    this.createFilter.emit(name);
  }

  private initTranslations() {
    return this.translationLoaderService.loadTranslations(I18nDomains).pipe(
      catchError(err => {
        console.warn('Cant load traslations for domains', I18nDomains, err);
        return of(true);
      }),
      takeUntil(this.destroy$),
    );
  }
}
