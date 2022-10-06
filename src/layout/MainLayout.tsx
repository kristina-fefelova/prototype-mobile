import React from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';

import StackNavigator from '@layout/StackNavigator';
import {ScreenName} from '@layout/types';

const MainLayout = () => {
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);

  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator initialRouteName={ScreenName.Home} />
    </NavigationContainer>
  );
};

export default MainLayout;
