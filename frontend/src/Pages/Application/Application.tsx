import {FC} from 'react';
import {Layout} from 'Components/Layout';
import {Auth} from 'Components/Auth';
import {Application as ApplicationComponent} from 'Components/Application';

export const Application: FC = () => {
  return (
    <Layout>
      <Auth>
        <ApplicationComponent/>
      </Auth>
    </Layout>
  )
}