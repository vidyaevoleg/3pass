import { FC } from 'react';
import { useFormikContext } from 'formik';
import { Button, IButtonProps } from 'Components/UI/Button';

interface IProps extends IButtonProps {}

export const FormikSubmit: FC<IProps> = ({
  children,
  color = 'primary',
  variant = 'contained',
  type = 'submit',
  onClick,
  loading,
  disabled,
  ...props
}) => {
  const formik = useFormikContext();

  return (
    <Button
      {...props}
      color={color}
      type={type}
      variant={variant}
      disabled={!formik.isValid || disabled}
      loading={loading || formik.isSubmitting}
      onClick={onClick || formik.submitForm}
    >
      {children}
    </Button>
  );
};