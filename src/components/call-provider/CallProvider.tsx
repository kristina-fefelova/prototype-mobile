import React, {createContext, memo, PropsWithChildren, useCallback, useRef, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {getCallConstraints} from '@components/call-provider/utils';

const SERVER_URL = 'ws://192.168.31.62:3000';
const ICE_SERVERS = {
  iceServers: [{urls: 'stun:stun.stunprotocol.org:3478'}, {urls: 'stun:stun.l.google.com:19302'}],
};

export interface CallContextType {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  isMuted: boolean;
  onCall: () => void;
  onSwitchCamera: () => void;
  onToggleMute: () => void;
  onClose: () => void;
}

const initialValues: CallContextType = {
  localStream: undefined,
  remoteStream: undefined,
  isMuted: false,
  onCall: () => {},
  onSwitchCamera: () => {},
  onToggleMute: () => {},
  onClose: () => {},
};

const enum CallEvent {
  Join = 'join',
  Ready = 'ready',
  Answer = 'answer',
  Offer = 'offer',
  IceCandidate = 'ice-candidate',
  Connect = 'connect',
  Leave = 'leave',
}

export const CallContext = createContext(initialValues);

const handleError = (error: Error) => console.log(error);

const CallContextProvider: React.FC<PropsWithChildren> = ({children}) => {
  const socketRef = useRef<Socket>();
  const rtcConnectionRef = useRef<RTCPeerConnection>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const [isMuted, setIsMuted] = useState(false);

  const onClose = useCallback(() => {
    socketRef.current?.emit(CallEvent.Leave);
    setLocalStream(undefined);
    setRemoteStream(undefined);

    socketRef.current?.disconnect();
    rtcConnectionRef.current?.close();
    socketRef.current = undefined;
    rtcConnectionRef.current = undefined;
  }, []);

  const handleICECandidateEvent = useCallback(({candidate}: any) => {
    if (candidate) {
      socketRef.current!.emit(CallEvent.IceCandidate, {candidate});
    }
  }, []);

  const handleTrackEvent = useCallback(({stream}: any) => {
    if (stream) {
      setRemoteStream(stream);
    }
  }, []);

  const handleReadyEvent = useCallback(
    (stream: MediaStream) => {
      rtcConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);

      rtcConnectionRef.current.onicecandidate = handleICECandidateEvent;
      rtcConnectionRef.current.onaddstream = handleTrackEvent;

      rtcConnectionRef.current.addStream(stream);
      rtcConnectionRef
        .current!.createOffer({})
        .then(offer => {
          rtcConnectionRef.current!.setLocalDescription(offer as any);
          socketRef.current!.emit(CallEvent.Offer, {offer});
        })
        .catch(handleError);
    },
    [handleICECandidateEvent, handleTrackEvent],
  );

  const handleReceivedOffer = useCallback(async ({offer}: any) => {
    if (!rtcConnectionRef.current) {
      return;
    }

    await rtcConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

    rtcConnectionRef.current
      .createAnswer()
      .then((answer: any) => {
        rtcConnectionRef.current!.setLocalDescription(new RTCSessionDescription(answer));
        socketRef.current!.emit(CallEvent.Answer, {answer});
      })
      .catch(handleError);
  }, []);

  const handleAnswer = useCallback(({answer}: any) => {
    if (!rtcConnectionRef.current) {
      return;
    }

    rtcConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer)).catch(handleError);
  }, []);

  const handlerNewIceCandidateMsg = useCallback(({candidate}: any) => {
    if (!rtcConnectionRef.current) {
      return;
    }

    rtcConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(handleError);
  }, []);

  const onCall = useCallback(async () => {
    const constraints = await getCallConstraints();

    const newLocalStream = await mediaDevices.getUserMedia(constraints);

    setLocalStream(newLocalStream);

    const socket = io(SERVER_URL, {
      reconnection: true,
      autoConnect: true,
    });

    socket.on(CallEvent.Connect, () => {
      socketRef.current = socket;
      socket.emit(CallEvent.Join);
      socket.emit(CallEvent.Ready);
      handleReadyEvent(newLocalStream);
    });

    socket.on(CallEvent.Leave, onClose);
    socket.on(CallEvent.Offer, handleReceivedOffer);
    socket.on(CallEvent.Answer, handleAnswer);
    socket.on(CallEvent.IceCandidate, handlerNewIceCandidateMsg);
  }, [handleAnswer, handleReadyEvent, handleReceivedOffer, handlerNewIceCandidateMsg, onClose]);

  const onSwitchCamera = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track._switchCamera());
    }
  }, [localStream]);

  const onToggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(is => !is);
    }
  }, [localStream]);

  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        isMuted,
        onCall,
        onSwitchCamera,
        onToggleMute,
        onClose,
      }}>
      {children}
    </CallContext.Provider>
  );
};

export default memo(CallContextProvider);
