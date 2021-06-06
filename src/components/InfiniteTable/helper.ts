import _ from 'lodash';
import { TableRowsInterface } from 'src/components/InfiniteTable';

export const createSelectionMap = (
  rows: TableRowsInterface[],
  prev: { [key: string]: boolean },
  global?: boolean
) => {
  rows.forEach((item) => {
    if (!prev.hasOwnProperty(item.id)) {
      prev[item.id] = false;
    }
  });
  return prev;
};

export const toggleAll = (prev: { [key: string]: boolean }) => {
  let clone = _.cloneDeep(prev);
  for (let key in clone) {
    clone[key] = !prev.all;
  }
  return clone;
};
