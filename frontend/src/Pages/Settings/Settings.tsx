import {FC} from 'react';
import {Layout} from 'Components/Layout';
import {Auth} from 'Components/Auth';
import {Settings as SettingsComponent} from 'Components/Settings';

export const Settings: FC = () => {
  return (
    <Layout>
      <Auth>
        <SettingsComponent/>
      </Auth>
    </Layout>
  )
}