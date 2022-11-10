import {Theme} from '@mui/material';

export const useStyles = (theme: Theme) => (
  {
    paper: {
      boxShadow: 'none',
    },
    menuItem: {
      pl: theme.spacing(1), // 8px
    },
  }
);