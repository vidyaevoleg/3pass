import {ChangeEvent, FC, useCallback, useState} from 'react';
import TextField, {StandardTextFieldProps} from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { colors } from 'theme';

export interface ITextInputProps extends Omit<StandardTextFieldProps, 'onChange'> {
  tooltip?: string,
  showError?: boolean,
  hidden?: boolean,
  onChange?: (value: string) => void;
}

export const TextInput: FC<ITextInputProps> = ({
  showError,
  size,
  hidden,
  tooltip,
  onChange,
  InputProps,
  ...props
}) => {

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  }, [])

  const [showPassword, setShowPassword] = useState(false);
  // const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  if (!!tooltip) {
   return <TextField
      {...props}
      onChange={changeHandler}
      error={showError}
      size={size || 'small'}
    />
  }

  const inputProps = { ...InputProps };

  if (hidden) {
    inputProps['endAdornment'] = (
      <InputAdornment position="end">
        <IconButton
          aria-label="password visibility"
          onClick={handleClickShowPassword}
          sx={{ color: `${colors.gray3}` }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    )
  }

  return (
    <Tooltip open={!!tooltip} title={tooltip!} placement='top'>
      <TextField
        {...props}
        onChange={changeHandler}
        error={showError}
        type={showPassword ? "password" : "text"}
        InputProps={inputProps}
        size={size || 'small'}
      />
    </Tooltip>
  )
};

