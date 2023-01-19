import {ChangeEvent, FC, useCallback} from 'react';
import TextField, {StandardTextFieldProps} from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

export interface ITextInputProps extends Omit<StandardTextFieldProps, 'onChange'> {
  tooltip?: string,
  showError?: boolean,
  onChange?: (value: string) => void;
}

export const TextInput: FC<ITextInputProps> = ({
  showError,
  size,
  tooltip,
  onChange,
  ...props
}) => {

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  }, [])

  if (!!tooltip) {
   return <TextField
      {...props}
      onChange={changeHandler}
      error={showError}
      size={size || 'small'}
    />
  }

  return (
    <Tooltip open={!!tooltip} title={tooltip!} placement='top'>
      <TextField
        {...props}
        onChange={changeHandler}
        error={showError}
        size={size || 'small'}
      />
    </Tooltip>
  )
};

