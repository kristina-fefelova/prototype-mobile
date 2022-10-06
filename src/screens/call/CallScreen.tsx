import React, {memo, useCallback, useContext, useEffect} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import {RTCView} from 'react-native-webrtc';

import Loading from '@components/loading/Loading';
import IconButton from '@components/icon-button/IconButton';
import {CallContext} from '@components/call-provider/CallProvider';
import {useAppNavigation} from '@layout/hooks/useAppNavigation';
import {ScreenName} from '@layout/types';

const {width, height} = Dimensions.get('window');

const icons = {
  Mute: require('../../assets/images/mute.png'),
  Unmute: require('../../assets/images/unmute.png'),
  EndCall: require('../../assets/images/end-call.png'),
  ChangeCamera: require('../../assets/images/change-camera.png'),
};

const CallScreen: React.FC = () => {
  const {localStream, remoteStream, isMuted, onToggleMute, onClose, onSwitchCamera} = useContext(CallContext);
  const {navigation} = useAppNavigation();

  const handleCallClosed = useCallback(() => {
    onClose();
    navigation.navigate(ScreenName.Home);
  }, [navigation, onClose]);

  useEffect(() => {
    return handleCallClosed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {remoteStream && (
        // @ts-ignore
        <RTCView style={styles.remoteStream} streamURL={remoteStream.toURL()} objectFit="cover" />
      )}
      {localStream && (
        <View style={styles.myStreamWrapper}>
          <RTCView
            // @ts-ignore
            style={styles.myStream}
            objectFit="cover"
            streamURL={localStream.toURL()}
            zOrder={1}
          />
        </View>
      )}
      {!remoteStream && <Loading />}
      <View style={styles.iconsWrapper}>
        <IconButton icon={icons.ChangeCamera} iconColor={'white'} backgroundColor="gray" onPress={onSwitchCamera} />
        <IconButton
          icon={isMuted ? icons.Unmute : icons.Mute}
          iconColor="white"
          backgroundColor={isMuted ? 'red' : 'gray'}
          onPress={onToggleMute}
        />
        <IconButton icon={icons.EndCall} iconColor={'#fff'} backgroundColor="red" onPress={handleCallClosed} />
      </View>
    </SafeAreaView>
  );
};

export default memo(CallScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  myStream: {
    height: height * 0.4,
    width: width * 0.4,
  },
  myStreamWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'black',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
  },
  remoteStream: {
    width: '100%',
    height: '100%',
  },
  iconsWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});
