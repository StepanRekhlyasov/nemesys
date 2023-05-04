import { QueryOrderByConstraint } from 'firebase/firestore';
import { ConstraintsType } from 'src/shared/utils/utils';

export interface Pagination {
  rowsPerPage: number;
  order: QueryOrderByConstraint
  path: string
  constraints?: ConstraintsType
}

export interface PaginationExposedMethods {
  refreshPage: () => Promise<void>,
  setConstraints: (c: ConstraintsType) => void,
  queryFirstPage: () => Promise<void>;
}
