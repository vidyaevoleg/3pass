import {FC} from 'react';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Application, Landing, Settings} from 'Pages';
import {AppProvider, WithApp} from 'Components/AppProvider/AppProvider';
import {ThemeOptions} from 'theme';

const theme = createTheme(ThemeOptions);

export const App: FC = () => {
  const st = theme;

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={<Landing />}
            />
            <Route
              path='/application'
              element={
                <WithApp>
                  <Application />
                </WithApp>
              }
            />
            <Route
              path='/settings'
              element={
                <WithApp>
                  <Settings />
                </WithApp>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppProvider>
  )
}