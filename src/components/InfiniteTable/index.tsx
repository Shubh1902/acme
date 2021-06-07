import { Checkbox } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  createSelectionMap,
  toggleAll
} from 'src/components/InfiniteTable/helper';
import useStyles from 'src/components/InfiniteTable/styles';
import TableRowData from 'src/components/InfiniteTable/TableRow';

export interface TableColumnsInterface {
  id: string;
  label: string;
  numeric?: boolean;
  width?: string;
}
export interface TableRowsInterface {
  id: string;
  [key: string]: React.ReactNode | string | number;
}

interface Props {
  columns: TableColumnsInterface[];
  rows: TableRowsInterface[];
  onRowClick: Function;
  onSelectionChange: Function;
  fetchData: any;
  hasMore:boolean
}

const InfiniteTable = (props: Props) => {
  const classes = useStyles();
  const [selectionMap, setSelectionMap] = useState<{ [key: string]: boolean }>({
    all: false,
  });
  const selectionRef = useRef(false);

  useEffect(() => {
    if (props.rows.length) {
      setSelectionMap((prev) => {
        return createSelectionMap(props.rows, prev);
      });
    }
  }, [props.rows]);

  const handleCheckBoxClick = (id: string) => {
    if (id === 'all') {
      setSelectionMap((prev) => {
        return toggleAll(prev);
      });
    } else {
      setSelectionMap((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
    selectionRef.current = true;
  };

  useEffect(() => {
    if (selectionRef.current) {
      props.onSelectionChange(selectionMap);
    }
  }, [selectionMap]);

  return (
    <InfiniteScroll
      next={props.fetchData}
      hasMore={props.hasMore}
      dataLength={props.rows.length}
      loader={<h4>Loading...</h4>}
    >
      <TableContainer component={Paper} className={classes.root}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell
                className={classes.tableHeadCell}
                style={{
                  backgroundColor: '#f0f8ff',
                }}
              >
                <Checkbox
                  onChange={() => {
                    handleCheckBoxClick('all');
                  }}
                  checked={selectionMap.all}
                />
              </TableCell>
              {props.columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={classes.tableHeadCell}
                  style={{
                    width: col.width ? col.width : 'unset',
                    backgroundColor: '#f0f8ff',
                  }}
                >
                  <h4>{col.label}</h4>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, index) => (
              <TableRowData
                {...row}
                key={row.id}
                onClick={props.onRowClick}
                handleCheckBoxClick={handleCheckBoxClick}
                checked={selectionMap[row.id]}
              ></TableRowData>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};
export default InfiniteTable;
