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
    boxMaxHeight: {
      minHeight: 'calc(100vh - 128px - 4px)',
    },
    paper: {
      boxShadow: 'none',
    },
    box: {
      position: 'absolute', 
      top: '130px', 
      pt: theme.spacing(3), // 24px
      pl: theme.spacing(3), // 24px
    },
    box2: {
      display: 'flex',
      justifyContent: 'center',
    },
    typography: {
      textAlign: 'center', 
      color: `${colors.gray4}`,
    },
  }
);