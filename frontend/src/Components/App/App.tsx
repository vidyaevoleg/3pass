import {FC} from 'react';
import {Auth} from 'Components/Auth';
import {Main} from 'Components/Main';
import {Layout} from 'Components/Layout';

export const App: FC = () => {
  return (
    <Layout>
      <Auth>
        <Main/>
      </Auth>
    </Layout>
  )
}