import { FormControl } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PeDataGridItem {
  id?: string;
  _id?: string;
  image?: string;
  title?: string | SafeHtml;
  subtitle?: string;
  description?: string | SafeHtml;
  /** @deprecated Use customFields[0] instead */
  customField1?: string;
  /** @deprecated Use customFields[1] instead */
  customField2?: string;
  /** @deprecated Use customFields[2] instead */
  customField3?: string;
  customFields?: (string | SafeHtml)[];
  selected?: boolean;
  actions?: PeDataGridSingleSelectedAction[];
  labels?: string[];
  snapshot?: any;
}

export interface PeDataGridSelectableItem extends PeDataGridItem {
  id: string;
}

export interface PeDataGridListOptions {
  nameTitle: string;
  descriptionTitle?: string;
  /** @deprecated Use customFieldsTitles[0] instead */
  customField1Title?: string;
  /** @deprecated Use customFieldsTitles[1] instead */
  customField2Title?: string;
  /** @deprecated Use customFieldsTitles[2] instead */
  customField3Title?: string;
  customFieldsTitles?: (string | SafeHtml)[];
  /** @deprecated Use customFieldsTitles[...] instead */
  conditionTitle?: string;
}

export interface PeDataGridMultipleSelectedAction {
  label: string;
  callback?: (selectedIds: string[]) => void;
  onlyForSingleItem?: boolean;
  appearance?: PeDataGridButtonAppearance;
  actions?: {
    label: string;
    callback: (selectedIds: string[]) => void;
  }[];
}

export interface PeDataGridSingleSelectedAction {
  label: string;
  shortLabel?: string;
  isLoading$?: Observable<boolean>;
  callback: (selectedId?: string) => void;
}

export interface PeDataGridSortByAction {
  label: string;
  callback: () => void;
  icon?: PeDataGridSortByActionIcon;
}

export interface PeDataGridPaginator {
  page: number;
  perPage: number;
  total: number;
}

export enum PeDataGridLayoutType {
  Grid = 'grid',
  List = 'list',
}

export enum PeDataGridTheme {
  Dark = 'dark',
  Default = 'default',
  Light = 'light',
}

export enum PeDataGridButtonAppearance {
  Link = 'link',
  Button = 'button',
}

export enum PeDataGridSortByActionIcon {
  Ascending = 'ascending',
  Date = 'date',
  Descending = 'descending',
  Name = 'name',
  NameContacts = 'name-contacts',
}
export interface PeSelectableDataGridItem extends PeDataGridItem {
  selected: boolean;
}

export const isSelectableItem = (value: any): value is PeSelectableDataGridItem =>
  (value as PeSelectableDataGridItem).id !== undefined;

export interface PeDataGridButtonItem {
  title: string;
  onClick?: () => void;
  children: {
    title: string;
    onClick: (e?: any) => void;
    icon?: string | SafeHtml;
    isCheckbox?: boolean;
    selected$?: Observable<boolean>;
  }[];
}
