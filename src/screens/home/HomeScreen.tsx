import React, {memo, useCallback, useContext} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';

import {CallContext} from '@components/call-provider/CallProvider';
import {ScreenName} from '@layout/types';
import {useAppNavigation} from '@layout/hooks/useAppNavigation';

const HomeScreen: React.FC = () => {
  const {navigation} = useAppNavigation();
  const {onCall} = useContext(CallContext);

  const handleCallStarted = useCallback(() => {
    onCall();
    navigation.navigate(ScreenName.Call);
  }, [onCall, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Button title={'start call'} onPress={handleCallStarted} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(HomeScreen);
