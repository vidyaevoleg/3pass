import {Theme} from '@mui/material';
import { colors } from 'theme';

export const useStyles = (theme: Theme) => (
  {
    paper: {
      boxShadow: 'none',
    },
    button: {
      maxWidth: '92%',
      mt: theme.spacing(1), // 8px
      mb: theme.spacing(2), // 16px
      fontSize: '1rem',
      py: '4px',
      color: `${colors.black2}`, 
      borderColor: `${colors.gray5}`, 
    },
    addIcon: {
      mr: theme.spacing(1), // 8px
    },
    menuItem: {
      pl: theme.spacing(1), // 8px
      py: theme.spacing(1), // 8px
      maxWidth: '92%',
      display: 'flex',
      alignItems: 'flex-start',
    },
    lockIcon: {
      color: `${colors.blue6}`, 
    },
    username: {
      color: `${colors.gray4}`,
    },
  }
);