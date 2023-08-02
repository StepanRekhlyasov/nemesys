export type graphType = 'BasedOnLeftMostItemDate' | 'BasedOnEachItemDate';
export interface SeriesType {
  name: string;
  data: (number | string)[];
  type: string;
}
