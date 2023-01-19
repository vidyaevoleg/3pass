import {FC} from 'react';
import {Layout} from 'Components/Layout';
import {Application as ApplicationComponent} from 'Components/Application';
import {AuthProvider} from 'Components/AuthProvider';

export const Application: FC = () => {
  return (
    <Layout>
      <AuthProvider>
        <ApplicationComponent/>
      </AuthProvider>
    </Layout>
  )
}