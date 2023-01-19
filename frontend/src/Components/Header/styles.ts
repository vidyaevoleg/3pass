import {Theme} from '@mui/material';

export const useStyles = (theme: Theme) => (
  {
    root: {
      px: theme?.spacing(2),
      py: theme?.spacing(1),
      boxShadow: theme.shadows[0]
    }
  }
);