import { Theme } from '@mui/material';
import { colors } from 'theme';

export const useStyles = (theme: Theme) => (
  {
    boxWebsite: {
      display: 'flex', 
      flexDirection: 'row'
    },
    lockIcon: {
      pt: '20px', 
      pr: theme.spacing(1), // 8px 
      color: `${colors.blue6}`
    },
    frameLock: {
      width: '568px',
      "& .MuiFormLabel-root": {
        color: 'primary.gray',
        fontSize: '22px',
        pt: '3px',
        pl: '2px'
      },
      "& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
        color: 'primary.gray',
      },
      '& .MuiInputBase-input': {
        fontSize: '22px',
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(1), // 8px
      }
    },
    typography: {
      color: `${colors.gray4}`, 
      fontSize: '14px'
    },
    frame: {
      width: '600px',
      "& .MuiFormLabel-root": {
        color: 'primary.gray',
        pt: '2px',
        pl: '2px'
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(1), // 8px
      }
    },
    boxPassword: {
      display: 'flex', 
      flexDirection: 'row'
    },
    framePassword: {
      width: '544px',
      "& .MuiFormLabel-root": {
        color: 'primary.gray',
        pt: '2px',
        pl: '2px'
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(1), // 8px
      }
    },
    eyeIcon: {
      color: `${colors.gray3}`
    },
    keyIconButton: {
      minWidth: '40px', 
      height: '40px', 
      mt: theme.spacing(1), // 8px 
      ml: theme.spacing(2), // 16px 
      background: `${colors.gray7}`, 
      p: 0
    },
    keyIcon: {
      color: `${colors.black3}`
    },
    cancelButton: {
      mt: theme.spacing(3), // 24px 
      width: '80px', 
      height: '32px', 
      background: `${colors.white}`, 
      color: `${colors.black2}`, 
      border: `1px solid ${colors.gray5}`, 
      textTransform: 'none', 
      fontSize: '14px'
    },
    saveButton: {
      mt: theme.spacing(3), // 24px  
      ml: theme.spacing(1), // 8px 
      width: '65px', 
      height: '32px', 
      background: `${colors.blue6}`, 
      textTransform: 'none', 
      fontSize: '14px'
    }
  }
);