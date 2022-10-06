import type {CompositeNavigationProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

export enum ScreenName {
  Home = 'home',
  Call = 'call',
}

export type ScreenParams = {
  [ScreenName.Home]: undefined;
  [ScreenName.Call]: undefined;
};

export type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ScreenParams>,
  StackNavigationProp<ScreenParams>
>;

export interface Navigation
  extends Pick<ScreenNavigationProp, 'canGoBack' | 'goBack' | 'navigate' | 'popToTop' | 'push'> {
  backWithLock: () => void;
}
