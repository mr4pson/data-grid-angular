export interface PeDataGridFilter {
  title: string;
  items: PeDataGridFilterItem[];
  /** @deprecated Use `expanded` instead */
  active?: boolean;
  expanded?: boolean;
  icon?: string;
  type?: 'checkbox' | 'radio';
}

export interface PeDataGridFilterItem {
  title: string;
  key: string;
  image?: string;
  selected?: boolean;
}

export interface PeDataGridAdditionalFilterItem extends PeDataGridFilterItem {
  /** items with toggleAllItems not counted as collections */
  toggleAllItems?: boolean;
}

export interface PeDataGridAdditionalFilter {
  label: string;
  buttonLabel?: string;
  allItemsLabel?: string;
  expandable?: boolean;
  expanded?: boolean;
  filters?: PeDataGridAdditionalFilterItem[];
  labelCallback: () => void;
  buttonCallback?: () => void;
  allItemsLabelCallback?: () => void;
  allItemsLabelActive?: boolean;
  labelActive?: boolean;
  labelIcon?: string;
}

export interface PeDataGridFilterConditionField {
  label: string;
  inputValue?: string | number | Date | Date[]; // Date[] is for date range TODO Remave to `value`
  rangeMode?: boolean; // For now only for datepicker
  options?: {
    label: string,
    value: string,
  }[];
}

export interface PeDataGridFilterCondition {
  conditionLabel: string;
  conditionValue: string;
  conditionFields: PeDataGridFilterConditionField[];
  selected?: boolean;
}

export interface PeDataGridApplyFilterCondition {
  filter: {
    filterName: string;
    type?: PeDataGridFilterConditionType | FilterConditionType;
  };
  condition: PeDataGridFilterCondition;
}

export interface PeDataGridFilterWithConditions {
  filterName: string;
  filterKey: string;
  expanded?: boolean;
  type?: PeDataGridFilterConditionType | FilterConditionType;
  conditions: PeDataGridFilterCondition[];
  applyFilter: (data: PeDataGridApplyFilterCondition) => any;
  icon?: string;
}

export type PeDataGridFilterType = PeDataGridFilter | PeDataGridAdditionalFilter | PeDataGridFilterWithConditions;

export enum PeDataGridAvailableFilterType {
  Filter,
  AdditionalFilter,
  ConditionalFilter,
}

export enum PeDataGridFilterConditionType {
  Text = 'text',
  Number = 'number',
  Select = 'select',
  Date = 'date',

  /** @deprecated use Text instead */
  Default = 'default',
}

/** @deprecated Use PeDataGridFilterConditionType instead */
export enum FilterConditionType {
  Default = 'default',
  Date = 'date',
}

export const isConditionalFilter = (value: any): value is PeDataGridFilterWithConditions =>
  (value as PeDataGridFilterWithConditions).conditions !== undefined;

export const isAdditionalFilter = (value: any): value is PeDataGridAdditionalFilter =>
  (value as PeDataGridAdditionalFilter).labelCallback !== undefined;
