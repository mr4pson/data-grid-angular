import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';

import {
  PeDataGridButtonItem,
  PeDataGridComponent,
  PeDataGridFilter,
  PeDataGridFilterType,
  PeDataGridItem,
  PeDataGridMultipleSelectedAction,
  PeDataGridSidebarService,
  PeDataGridSingleSelectedAction,
  TreeFilterNode,
} from '@pe/data-grid';
import { MenuSidebarFooterData } from '@pe/sidebar/interface';
// import { PeHeaderInfoService } from '@pe/header-info';

@Component({
  selector: 'nx-data-grid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject();
  private showSidebarStream$ = new BehaviorSubject<boolean>(true);

  @ViewChild('dataGridComponent') set setDataGrid(dataGrid: PeDataGridComponent) {
    if (dataGrid?.showFilters$) {
      dataGrid.showFilters$.subscribe(value => {
        if (value !== this.showSidebarStream$.value) {
          this.showSidebarStream$.next(value);
        }
      });
    }
  }

  categories = [];
  activeItemId = '1';

  showSidebar$ = this.showSidebarStream$.asObservable();
  isFilterCreating = false;

  set showSidebar(value: boolean) {
    this.showSidebarStream$.next(value);
  }

  loadingItemIdStream$: BehaviorSubject<string> = new BehaviorSubject(null);
  loadingItemId$: Observable<string> = this.loadingItemIdStream$.asObservable();

  filters: PeDataGridFilterType[] = [
    // {
    //   label: 'test',
    //   labelCallback: () => {},
    // } as PeDataGridAdditionalFilter,
    {
      title: 'Albums',
      items: [
        {
          key: '1',
          title: 'Test',
          image: './assets/icons/album-icon-filter@3x.png',
        },
        {
          key: '2',
          title: 'Test',
          image: './assets/icons/album-icon-filter@3x.png',
        },
      ],
    },
    {
      title: 'Color',
      items: [
        {
          key: '21sdgf',
          image: './assets/icons/album-icon-filter@3x.png',
          title: 'Red',
        },
        {
          key: '21sdgf',
          image: './assets/icons/album-icon-filter@3x.png',
          title: 'Green',
        },
      ],
    },
  ];

  toggleLabel = 'Toggle label';

  treeLabel = 'Tree filter';
  treeHeaderActive = false;
  treeData: TreeFilterNode[] = [
    {
      id: '1',
      name: 'Album folder',
      parentId: null,
      image: '/assets/themes/preview_1.jpg',
      children: [
        {
          id: '2',
          parentId: '1',
          name: 'Sub folder',
          children: [
            {
              id: '3',
              parentId: '2',
              name: 'Sub-sub folder',
              children: [
                {
                  id: '4',
                  parentId: '3',
                  name: 'Sub-sub-sub folder',
                  children: [
                    {
                      id: '5',
                      parentId: '4',
                      name: 'Sub-sub-sub-sub folder',
                      children: [
                        {
                          id: '6',
                          parentId: '5',
                          name: 'Sub-sub-sub-sub-sub folder',
                          children: [
                            {
                              id: '7',
                              parentId: '6',
                              name: 'Sub-sub-sub-sub-sub-sub folder',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: '8',
          parentId: '1',
          name: 'childnode2',
        },
      ],
    },
    {
      id: '12',
      parentId: null,
      name: 'node2',
      children: [
        {
          id: '9',
          parentId: '12',
          name: 'childnode12',
        },
        {
          id: '11',
          parentId: '12',
          name: 'childnode22',
        },
      ],
    },
  ];

  treeData2: TreeFilterNode[] = [
    {
      id: '1',
      name: 'Test folder',
      parentId: null,
      image: '/assets/themes/preview_1.jpg',
      children: [
        {
          id: '2',
          parentId: '1',
          name: 'Sub folder',
          children: [],
        },
      ],
    },
  ];

  sidebarFooterData: MenuSidebarFooterData = {
    headItem: {
      title: 'Category',
    },
    menuItems: [
      { title: 'New category', onClick: () => {
        this.categories.push({ title: 'gsfd', tree: [], editMode: true });
      } },
      { title: 'Rename', onClick: () => this.treeData[1].children[0].editing = true },
    ],
  };

  formGroup = this.fb.group({
    tree: [[]],
    toggle: [false],
  });

  singleSelectedAction: PeDataGridSingleSelectedAction = {
    label: 'Open',
    callback: (id: string) => {
      console.log(id);
      this.loadingItemIdStream$.next(id);
      setTimeout(() => {
        this.loadingItemIdStream$.next(null);
      }, 1000);
    },
  };

  secondSingleSelectedAction: PeDataGridSingleSelectedAction = {
    label: 'Get',
    callback: (data: string) => {
      console.log(data);
    },
  };

  gridOptions = {
    nameTitle: 'Some Title',
    customFieldsTitles: ['Custom title 1', 'Custom title 2', 'Custom title 3'],
  };

  items: PeDataGridItem[] = [];

  rightPaneButtons: PeDataGridButtonItem[] = [
    {
      title: 'Button 1',
      onClick: () => {
        console.log('gassdf');
      },
      children: [],
    },
    {
      title: 'Button 2',
      onClick: () => {
        console.log('gassdf');
      },
      children: [],
    }
  ];


  refreshSubject$ = new BehaviorSubject(true);
  readonly refresh$ = this.refreshSubject$.asObservable();
  private treeControl: NestedTreeControl<TreeFilterNode>;

  constructor(
    private fb: FormBuilder,
    private dataGridSidebarService: PeDataGridSidebarService,
    // private headerInfoService: PeHeaderInfoService,
  ) {}

  multipleSelectedActions: PeDataGridMultipleSelectedAction[] = [
    {
      label: 'Choose action',
      actions: [
        {
          label: 'Add to Album',
          callback: (ids: string[]) => {},
        },
        {
          label: 'Edit album',
          callback: (ids: string[]) => {},
        },
      ],
    },
  ];

  onBranchCreate(name, category) {
    category.title = name;
  }

  onFilterCreate(name) {
    this.isFilterCreating = false;
    const albums = this.filters[0] as PeDataGridFilter;
    albums.items = [
      ...albums.items,
      {
        key: '3',
        title: name,
        image: './assets/icons/album-icon-filter@3x.png',
      },
    ]
  }

  onToggleSidebar() {
    this.dataGridSidebarService.toggleFilters$.next();
  }

  generateItems() {
    for (let i = 0; i < 10; i++) {
      this.items.push({
        id: i.toString(),
        title: 'New Title',
        image: 'https://payevertesting.blob.core.windows.net/images/08251fd2-209e-443a-9f3d-cf7f6195f6db-256x256bb.jpg',
        customFields: ['Description', 'Some very looooooong field !!!!!!!!!', 'Short info'],
        actions: [
          {
            ...this.singleSelectedAction,
            isLoading$: this.loadingItemId$.pipe(
              map((id) => (id === i.toString())),
            ),
          },
          this.secondSingleSelectedAction,
        ],
      });
    }
  }

  ngOnInit() {
    // this.headerInfoService.setConfig({
    //   title: 'Your trial ends in 14 days. Upgrade now to get the most of your studio. Pick a plan >',
    //   url: '',
    //   visible: false,
    // });

    // setTimeout(() => {
    //   this.headerInfoService.changeHeaderInfoVisibility();
    // }, 2000);
    this.generateItems();
    setTimeout(() => {
      this.dataGridSidebarService.toggleFilters$.next();
    });

    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap((treeForm) => {
          if (treeForm.tree.length > 0) {
            this.sidebarFooterData = {
              headItem: {
                title: treeForm.tree[0]?.name,
              },
              menuItems: [
                { title: 'Rename', onClick: () => {
                  const currentTreeItem = this.treeData.find(
                    (treeItem: TreeFilterNode) => treeItem.id === '1',
                  );
                  currentTreeItem.editing = true;
                } },
                { title: 'Upload files' },
                { title: 'Move' },
                { title: 'Settings' },
                { title: 'Add New Album', onClick: () => {
                    if (!this.formGroup.value.tree[0].children) {
                      this.formGroup.value.tree[0].children = [];
                    }
                    this.formGroup.value.tree[0].children.push({
                      id: '123',
                      name: '',
                    });
                    this.treeControl.expand(this.formGroup.value.tree[0]);
                    this.refreshSubject$.next(true);
                  },
                },
                { title: 'Delete' },
              ],
            };
          } else {
            this.showAlbumsMenu();
          }
        }),
      )
      .subscribe();
  }

  onCreateTreeControl(treeControl) {
    this.treeControl = treeControl;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onRenameNode(node: TreeFilterNode) {
    console.log(node);
  }

  onCreateNode(node: TreeFilterNode) {
    console.log(node);
  }

  onAlbumsClick() {
    this.treeHeaderActive = !this.treeHeaderActive;
    this.showAlbumsMenu();
  }

  showAlbumsMenu() {
    if (this.treeHeaderActive) {
      this.sidebarFooterData = {
        headItem: {
          title: 'Albums',
        },
        menuItems: [
          { title: 'Rename', onClick: () => {} },
          { title: 'Add New Album', onClick: () => {
              this.treeData.push({
                id: '123',
                name: '',
              });
              this.refreshSubject$.next(true);
            },
          },
          { title: 'Delete' },
        ],
      };
    } else if (!this.treeHeaderActive && this.formGroup.value.tree.length === 0) {
      this.sidebarFooterData = {
        headItem: {
          title: 'Category',
        },
        menuItems: [
          { title: 'Add', onClick: () => this.isFilterCreating = true },
          { title: 'Rename', onClick: () => this.treeData[1].children[0].editing = true },
          { title: 'Delete' },
        ],
      };
    }
  }

  onDragAndDropChange({ data, section }) {
    console.log(data, section);
  }
  onSearchChanged(searchString: string) {
    console.log(searchString);
  }
}
