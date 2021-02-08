import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { I18nModule } from '@pe/i18n';
import { PeSidebarModule } from '@pe/sidebar';
import { PeFiltersModule } from '@pe/filters';

import {
  PeDataGridArrowDownIconComponent,
  PeDataGridChevronDownIconComponent,
  PeDataGridImageIconComponent,
  PeDataGridLayoutTypeIconComponent,
  PeDataGridListLayoutIconComponent,
  PeDataGridNodeIconComponent,
  PeDataGridPlusIconComponent,
  PeDataGridSearchIconComponent,
  PeDataGridSidebarCollectionTypeIconComponent,
  PeDataGridSidebarFiltersIconsComponent,
  PeDataGridSidebarGreyIconComponent,
  PeDataGridSidebarWhiteIconComponent,
  PeDataGridSortByAscendingIconComponent,
  PeDataGridSortByDateIconComponent,
  PeDataGridSortByDescendingIconComponent,
  PeDataGridSortByIconComponent,
  PeDataGridSortByNameIconComponent,
} from './icons';
import { PeDataGridComponent } from './data-grid.component';
import { PeDataGridPaginatorComponent } from './components/paginator/paginator.component';
import { PeDataListViewComponent } from './components/list/list.component';
import { PeDataGridMaterialComponent } from './material/material.component';
import { PeDataGridViewComponent } from './components/grid-view/grid-view.component';
import { PeDataGridItemComponent } from './components/grid-item/grid-item.component';
import { PeDataGridSelectedMarkComponent } from './components/selected-mark/selected-mark.component';
import { PeDataGridService } from './data-grid.service.ts';
import { PeDataGridColumnsIconComponent } from './icons/columns-icon';
import { PeDataGridTreeArrowIconComponent } from './icons/tree-arrow.icon';
import { PeDataGridSidebarIconComponent } from './icons/sidebar.icon';
import { PeDataGridSmallCloseIconComponent } from './icons/small-close.icon';
// import { PebRendererModule } from '@pe/builder-renderer';

const icons = [
  PeDataGridSidebarCollectionTypeIconComponent,
  PeDataGridSidebarFiltersIconsComponent,
  PeDataGridSidebarGreyIconComponent,
  PeDataGridSidebarWhiteIconComponent,
  PeDataGridSearchIconComponent,
  PeDataGridSortByAscendingIconComponent,
  PeDataGridSortByDateIconComponent,
  PeDataGridSortByDescendingIconComponent,
  PeDataGridSortByIconComponent,
  PeDataGridSortByNameIconComponent,
  PeDataGridLayoutTypeIconComponent,
  PeDataGridListLayoutIconComponent,
  PeDataGridPlusIconComponent,
  PeDataGridArrowDownIconComponent,
  PeDataGridChevronDownIconComponent,
  PeDataGridColumnsIconComponent,
  PeDataGridTreeArrowIconComponent,
  PeDataGridSidebarIconComponent,
  PeDataGridSmallCloseIconComponent,
  PeDataGridNodeIconComponent,
  PeDataGridImageIconComponent,
];

const exports = [
  PeDataGridComponent,
  PeDataGridItemComponent,
  PeDataGridNodeIconComponent,
];

export const i18n = I18nModule.forRoot();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTreeModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    NgScrollbarModule,
    NgxDaterangepickerMd,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    DragDropModule,
    PeSidebarModule,
    PeFiltersModule,
    i18n,
    MatCheckboxModule,
    // PebRendererModule,
  ],
  declarations: [
    ...icons,
    PeDataGridMaterialComponent,
    PeDataGridPaginatorComponent,
    PeDataListViewComponent,
    PeDataGridViewComponent,
    PeDataGridSelectedMarkComponent,
    ...exports,
  ],
  exports: [...exports],
  providers: [PeDataGridService],
})
export class PeDataGridModule {}
