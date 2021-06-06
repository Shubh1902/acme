import _ from 'lodash';
import { TableRowsInterface } from 'src/components/InfiniteTable';

export const createSelectionMap = (
  rows: TableRowsInterface[],
  prev: { [key: string]: boolean }
) => {
  let clone = _.cloneDeep(prev);
  for (let key in clone) {
    if (!rows.find((row) => row.id === key)) {
      clone[key] = false;
    }
  }
  rows.forEach((item) => {
    if (!clone.hasOwnProperty(item.id)) {
      clone[item.id] = false;
    }
  });

  return clone;
};

export const toggleAll = (prev: { [key: string]: boolean }) => {
  let clone = _.cloneDeep(prev);
  for (let key in clone) {
    clone[key] = !prev.all;
  }
  return clone;
};
