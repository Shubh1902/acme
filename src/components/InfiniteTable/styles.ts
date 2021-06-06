import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none',
  },
  tableRow: {
    padding: '3px',
  },
  tableCell: {
    padding: '3px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  tableHeadCell: {
    padding: '3px',
  },
}));
export default useStyles;
