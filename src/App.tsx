import React from 'react';

import CallContextProvider from '@components/call-provider/CallProvider';
import MainLayout from '@layout/MainLayout';

const App = () => {
  return (
    <CallContextProvider>
      <MainLayout />
    </CallContextProvider>
  );
};

export default App;
