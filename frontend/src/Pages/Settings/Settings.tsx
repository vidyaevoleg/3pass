import {FC} from 'react';
import {Layout} from 'Components/Layout';
import {Settings as SettingsComponent} from 'Components/Settings';
import {AuthProvider} from 'Components/AuthProvider';

export const Settings: FC = () => {
  return (
    <Layout>
      <AuthProvider>
        <SettingsComponent/>
      </AuthProvider>
    </Layout>
  )
}