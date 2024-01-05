import { useAccount } from '../contexts/account';

import { ReactNode, useEffect } from 'react';

import { useRootNavigation, useRouter } from 'expo-router';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { subaccountId } = useAccount();
  const router = useRouter();
  const navigation = useRootNavigation();
  useEffect(() => {
    if (!navigation.isReady()) {
      return;
    }
    if (subaccountId) {
      router.replace('/home');
    } else {
      router.replace('/sign-in');
    }
  }, [router, subaccountId]);

  return <>{children}</>;
};
