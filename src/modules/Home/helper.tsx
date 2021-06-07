import { Box } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { TableRowsInterface } from 'src/components/InfiniteTable';
import { DataResponse } from 'src/modules/Home';

export const createRowData = (data: DataResponse[]): TableRowsInterface[] => {
  return data.map((entry) => ({
    id: entry.id.toString(),
    logo: (
      <Box display="flex" alignItems="center">
        <img
          src={entry.thumbnailUrl}
          style={{
            height: '30px',
            width: '30px',
          }}
        ></img>
      </Box>
    ),
    title: entry.title,
  }));
};

export const createDebouceFn = (fn: any, wait: number) => {
  return _.debounce(fn, wait);
};
