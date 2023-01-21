import {FC, useCallback} from 'react';
import {Formik, FormikConfig, FormikHelpers, FormikValues} from 'formik';

type IProps<T> = Omit<FormikConfig<T>, 'onSubmit'> & {
  enableReinitialize?: boolean;
  onSubmit?: (values: FormikValues, formikHelpers: FormikHelpers<T>) => void | Promise<void> | Promise<FormikValues>;
};

export const FormikForm = <T extends FormikValues,>(props: IProps<T>) => {
  const { onSubmit, initialValues, enableReinitialize = true, ...other} = props;

  const handleSubmit = useCallback((values: FormikValues, formikHelpers: FormikHelpers<T>) => {
      if (onSubmit) {
        const submitResult = onSubmit(values, formikHelpers);

        if (submitResult instanceof Promise) {
          submitResult.finally(() => {
            formikHelpers.setSubmitting(false);
          });
        } else {
          formikHelpers.setSubmitting(false);
        }
      }
    },
    [onSubmit]
  );

  return (
    <Formik {...other} initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={enableReinitialize}>
      {(formik) => (
        <>
          {
            other.children
          }
        </>
      )}
    </Formik>
  );
}
