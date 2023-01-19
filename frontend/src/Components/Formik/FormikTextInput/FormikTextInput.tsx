import { FC, FocusEvent, useCallback, useEffect, useState } from 'react';
import { useField } from 'formik';
import { TextInput, ITextInputProps } from 'Components/UI/TextInput';
import {FormControl, useTheme} from '@mui/material';

export interface IFormikTextInputProps extends ITextInputProps {
  name: string;
  debounce?: number | boolean;
}

export const FormikTextInput: FC<IFormikTextInputProps> = ({
  name,
  label,
  debounce = false,
  tooltip,
  onChange,
  onBlur,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const theme = useTheme();
  const { setValue } = helpers;
  const [textValue, setTextValue] = useState(field.value);
  let timeout: unknown;

  useEffect(() => {
    setTextValue(field.value);
  }, [field.value]);

  const handleChange = useCallback((value: string) => {
    setTextValue(value);

    if (debounce) {
      const debounceTime: number = typeof debounce === 'boolean' ? 750 : debounce;
      if (timeout) {
        clearTimeout(timeout as number);
      }
      timeout = setTimeout(() => {
        setValue(value);
      }, debounceTime);
    } else {
      setValue(value);
    }
    onChange && onChange(value);
  }, []);

  const handleOnBlur = (ev: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    field.onBlur(ev);
    onBlur && onBlur(field.value);
  };

  const spacing = theme.spacing(2);

  return (
    <FormControl
      sx={{ pb: spacing, display: 'block' }}
    >
      <TextInput
        {...props}
        name={name}
        onChange={handleChange}
        value={textValue}
        label={label}
        onBlur={handleOnBlur}
        tooltip={tooltip}
        helperText={meta.error}
        showError={meta.touched && !!meta.error}
      />
    </FormControl>
  );
};
