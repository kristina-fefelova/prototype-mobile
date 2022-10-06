import {mediaDevices} from 'react-native-webrtc';

export const getCallConstraints = async () => {
  const isFrontCamera = true;
  const devices = (await mediaDevices.enumerateDevices()) as any[];
  const expectedFacing = isFrontCamera ? 'front' : 'environment';
  const videoSourceId = devices.find(({kind, facing}) => kind === 'videoinput' && facing === expectedFacing);
  const facingMode = isFrontCamera ? 'user' : 'environment';

  return {
    audio: true,
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720,
        minFrameRate: 30,
      },
      facingMode,
      optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
    },
  };
};
