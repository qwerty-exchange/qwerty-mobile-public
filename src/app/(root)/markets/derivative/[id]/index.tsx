import { useLayoutEffect } from 'react';

import { useLocalSearchParams, useNavigation } from 'expo-router';

import { useMarketSummary } from '@app/common/hooks/useExchange';
import tw from '@app/common/tools/tailwind';
import { CryptoDetailsTemplate } from '@app/components/templates/CryptoDetails/CryptoDetails';

export default function CryptoDetails() {
  const { id: marketId } = useLocalSearchParams();
  const { data: market } = useMarketSummary(marketId as string);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: market?.name,
      headerTitleStyle: tw.style('text-lg text-white font-demiBold'),
    });
  }, [marketId]);

  return <CryptoDetailsTemplate market={market} />;
}
