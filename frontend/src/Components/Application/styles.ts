import { Theme } from '@mui/material';
import { colors } from 'theme';

export const useStyles = (theme: Theme) => (
  {
    gridContainer: {
      border: `1px solid ${colors.gray2}`, 
      borderTop: 0, 
      pl: '19px',
    },
    gridItemsList: {
      borderRight: `1px solid ${colors.gray2}`,
    },
    paper: {
      boxShadow: 'none',
    },
    box: {
      p: '20px',
    },
  }
);