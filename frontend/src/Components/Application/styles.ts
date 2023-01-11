import { Theme } from '@mui/material';
import { colors } from 'theme';

export const useStyles = (theme: Theme) => (
  {
    gridContainer: {
      border: `1px solid ${colors.gray2}`, 
      borderTop: 0, 
      pl: '19px',
      display: 'flex',
      alignItems: 'center',
    },
    gridItemsList: {
      borderRight: `1px solid ${colors.gray2}`,
    },
    paper: {
      boxShadow: 'none',
    },
    box: {
      p: theme.spacing(3), // 24px
    },
    typography: {
      textAlign: 'center', 
      color: `${colors.gray4}`,
    },
  }
);