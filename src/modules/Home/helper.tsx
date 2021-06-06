import {
  TableColumnsInterface,
  TableRowsInterface,
} from 'src/components/InfiniteTable';
import { DataResponse } from 'src/modules/Home';

export const createData = (
  data: DataResponse[]
): {
  rows: TableRowsInterface[];
  columns: TableColumnsInterface[];
} => {
  return {
    rows: createRowData(data),
    columns: createColumnData(data),
  };
};

const createRowData = (data: DataResponse[]): TableRowsInterface[] => {
  return data.map((entry) => ({
    id: entry.id.toString(),
    title: (
      <>
        <img
          src={entry.thumbnailUrl}
          style={{
            height: '20px',
            width: '20px',
          }}
        ></img>
        <span>{entry.title}</span>
      </>
    ),
  }));
};

const createColumnData = (data: DataResponse[]): TableColumnsInterface[] => {
  return [
    {
      id: '1',
      label: 'Title',
    },
  ];
};
