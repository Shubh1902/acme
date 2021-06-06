import { Checkbox, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  createSelectionMap,
  toggleAll,
} from 'src/components/InfiniteTable/helper';
const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none',
  },
  tableRow: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    padding: '8px',
  },
  tableCell: {
    borderBottom: 'none',
    padding: '8px',
  },
}));

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
}
interface DataRowInterface {
  id: string;
  [key: string]: React.ReactNode | string | number;
  handleCheckBoxClick: Function;
  onClick: Function;
  checked: boolean;
}
const TableRowData = (props: DataRowInterface) => {
  const { id, handleCheckBoxClick, checked, onClick, ...fields } = props;
  const classes = useStyles();
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (checked !== undefined) {
      setSelected(checked);
    }
  }, [checked]);
  const onChangeChecked = (id: string) => {
    setSelected(!selected);
    handleCheckBoxClick(id);
  };
  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.tableCell}>
        <Checkbox
          onChange={() => {
            onChangeChecked(id);
          }}
          checked={selected}
        />
      </TableCell>
      {Object.keys(fields).map((key) => (
        <TableCell className={classes.tableCell} key={key}>
          {fields[key]}
        </TableCell>
      ))}
    </TableRow>
  );
};
const InfiniteTable = (props: Props) => {
  const classes = useStyles();
  const [selectionMap, setSelectionMap] = useState<{ [key: string]: boolean }>({
    all: false,
  });

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
  };
 
  return (
    <InfiniteScroll
      next={props.fetchData}
      hasMore={true}
      dataLength={props.rows.length}
      loader={<h4>Loading...</h4>}
    >
      <TableContainer component={Paper} className={classes.root}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCell}>
                <Checkbox
                  onChange={() => {
                    handleCheckBoxClick('all');
                  }}
                  checked={selectionMap.all}
                />
              </TableCell>
              {props.columns.map((col) => (
                <TableCell key={col.id} className={classes.tableCell}>
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
                onClick={() => {
                  props.onRowClick(row, index);
                }}
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
