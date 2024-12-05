export interface LineChartMultipleData {
  monthName: string;
  firstTimeCompaniesCount: number;
  newCompaniesCount: number;
  oldCompaniesCount: number;
  allCompaniesCount: number; // todo: rename this
}

export type RangeType = '1' | '2-3' | '4-5' | '6-7' | '8-12';

export interface BarChartSimpleDataItem {
  range: RangeType;
  count: number;
  fill: string;
}
