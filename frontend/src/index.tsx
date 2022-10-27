import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

import * as buffer from 'buffer';

// HOTFIXES
// https://stackoverflow.com/questions/70296914/near-protocol-referenceerror-buffer-is-not-defined
(window as any).Buffer = buffer.Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
