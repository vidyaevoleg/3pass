import { FC } from 'react';
import { ButtonProps } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export interface IButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button: FC<IButtonProps> = ({loading, color, variant, size, ...props}) => {
  return <MuiButton
    { ...props }
    size={size || 'small'}
    variant={variant || 'contained'}
    color={color || 'primary'}
    disabled={loading}
  >
    {loading ? <CircularProgress color={'inherit'} size={24} /> : props.children}
  </MuiButton>
}