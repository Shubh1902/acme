import { Checkbox } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import useStyles from 'src/components/InfiniteTable/styles';

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
    <TableRow
      className={classes.tableRow}
      style={{
        ...(checked && { backgroundColor: '#2beaff' }),
      }}
      onClick={() => {
        onClick({
          ...fields,
          id,
        });
      }}
    >
      <TableCell className={classes.tableCell}>
        <Checkbox
          onChange={() => {
            onChangeChecked(id);
          }}
          checked={selected}
          style={{
            ...(checked && { color: '#ffffff' }),
          }}
        />
      </TableCell>
      {Object.keys(fields).map((key) => (
        <TableCell
          className={classes.tableCell}
          key={key}
          style={{
            ...(typeof fields[key] === 'number' && { textAlign: 'right' }),
          }}
        >
          {fields[key]}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowData;
