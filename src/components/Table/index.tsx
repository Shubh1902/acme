import { Checkbox, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as _ from 'lodash';
import React, { useState } from 'react';
const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none',
  },
}));

interface Props {
  columns: {
    id: string;
    label: string;
    numeric?: boolean;
    width?: string;
  }[];
  rows: { id: string; [key: string]: React.ReactNode | string | number }[];
  onRowClick: Function;
  onSelectionChange: Function;
}
interface TableRowInterface {
  id: string;
  [key: string]: React.ReactNode | string | number;
  handleCheckBoxClick: Function;
  checked: boolean;
}
const TableRowData = (props: TableRowInterface) => {
  const { id, handleCheckBoxClick, checked, ...fields } = props;
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={checked}
          onChange={() => {
            handleCheckBoxClick(id);
          }}
        />
      </TableCell>
      {Object.keys(fields).map((key) => (
        <TableCell key={key}>{fields[key]}</TableCell>
      ))}
    </TableRow>
  );
};
const TableComponent = (props: Props) => {
  const classes = useStyles();
  const [selectionMap, setSelectionMap] = useState<{ [key: string]: boolean }>(
    Object.assign(
      {},
      ...props.rows.map((key) => ({
        [key.id]: false,
      })),
      {
        all: false,
      }
    )
  );

  const handleCheckBoxClick = (id: string) => {
    if (id === 'all') {
      setSelectionMap((prev) => {
        let obj = _.cloneDeep(prev);
        Object.keys(obj).forEach((key) => {
          obj[key] = !obj['all'];
        });
        return obj;
      });
    } else {
      setSelectionMap((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };
  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={selectionMap['all']}
                onChange={() => {
                  handleCheckBoxClick('all');
                }}
              />
            </TableCell>
            {props.columns.map((col) => (
              <TableCell key={col.id}>
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
  );
};
export default TableComponent;
