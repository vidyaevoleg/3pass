import { Theme } from '@mui/material';
import { colors } from 'theme';

export const useStyles = (theme: Theme) => (
  {
    // Header:
    appHeaderBar: {
      boxShadow: 'none', 
      pl: 0,
      mb: '-9px',
      border: `1px solid ${colors.gray2}`, 
      backgroundColor: `${colors.gray2}`,
    },
    toolbar: {
      pl: 0,
    },
    gridContainer: {
      height: theme.spacing(8), // 64px
    },
    boxLogo: {
      height: theme.spacing(3), // 24px
      pt: '20px', 
      pl: theme.spacing(1), // 8px
    },
    boxSearch: {
      pt: '12px', 
      pl: '27px', 
      pb: '12px', 
      maxWidth: 584, 
      '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(1), // 8px
      },
    },
    boxNear: {
      height: theme.spacing(8), // 64px
    },
    boxProfile: {
      pl: theme.spacing(1), // 8px
    },
    // HeaderBottomBar:
    appBottomBar: {
      boxShadow: 'none', 
      pl: 0, 
      pt: 0, 
      border: `1px solid ${colors.gray2}`, 
      backgroundColor: `${colors.gray2}`,
    },
    box: {
      borderRight: `1px solid ${colors.gray2}`,
      display: 'flex', 
      height: theme.spacing(8), 
    },
    gridIcon: {
      color: `${colors.gray3}`,
    },
    text: {
      pl:'10px', 
      width: '116px',
    },
    expandMoreIcon: {
      pl: '10px',
      color: `${colors.gray4}`,
    },
  }
);