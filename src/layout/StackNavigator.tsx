import React, {memo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ScreenName} from '@layout/types';
import HomeScreen from '@screens/home/HomeScreen';
import CallScreen from '@screens/call/CallScreen';

const Stack = createStackNavigator();

const StackComponent: React.FC<{
  initialRouteName: ScreenName;
}> = ({initialRouteName}) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{gestureEnabled: true, headerShown: false}}>
      <Stack.Screen name={ScreenName.Home} component={HomeScreen} />
      <Stack.Screen name={ScreenName.Call} component={CallScreen} />
    </Stack.Navigator>
  );
};

export default memo(StackComponent);
