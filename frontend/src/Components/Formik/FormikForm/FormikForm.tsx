import { useCallback } from 'react';
import {Formik, FormikConfig, FormikHelpers } from 'formik';

type IProps<T> = Omit<FormikConfig<T>, 'onSubmit'> & {
  enableReinitialize?: boolean;
  onSubmit?: (values: any, formikHelpers: FormikHelpers<any>) => void | Promise<any>;
};

export function FormikForm<T>({
    onSubmit,
    enableReinitialize = true,
    initialValues,
    ...other
  }: IProps<T>) {

  const handleSubmit = useCallback(
    (values: any, formikHelpers: FormikHelpers<any>) => {
      if (onSubmit) {
        const submitResult = onSubmit(values, formikHelpers);

        // @ts-ignore: to detect that a promise is returned from `omSubmit`
        if (submitResult && submitResult.__proto__.then) {
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
    <Formik {...other} initialValues={initialValues as any} onSubmit={handleSubmit} enableReinitialize={enableReinitialize}>
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
