import {useNavigation} from '@react-navigation/native';

import {ScreenName, Navigation, ScreenNavigationProp} from '@layout/types';

let last = 0;

export const useAppNavigation = () => {
  const actual = useNavigation<ScreenNavigationProp>();

  const navigation: Navigation = {
    backWithLock: actual.goBack,
    canGoBack: actual.canGoBack,
    goBack: actual.goBack,
    navigate: actual.navigate,
    popToTop: actual.popToTop,
    push: (name: ScreenName, params?: {[key: string]: any}) => {
      const now = Date.now();

      if (now - last > 500) {
        actual.push(name);
      }

      last = now;
    },
  };

  return {navigation};
};
