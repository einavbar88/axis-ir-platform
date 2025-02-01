import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AxisProvider } from './store/AxisContext';
import { Router } from './Router';

function App() {
  return (
    <BrowserRouter>
      <AxisProvider>
        <Router />
      </AxisProvider>
    </BrowserRouter>
  );
}

export default App;
