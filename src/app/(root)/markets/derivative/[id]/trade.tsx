import { useLayoutEffect } from 'react';

import { useLocalSearchParams, useNavigation } from 'expo-router';

import { useMarketSummary } from '@app/common/hooks/useExchange';
import { HeaderTitle } from '@app/components/atoms/HeaderTitle/HeaderTitle';
import { Futures } from '@app/components/templates/Futures/Futures';

export default function Trade() {
  const { id: marketId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { data: market } = useMarketSummary(marketId as string);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle subtitle="Futures" title={market?.name} />,
      headerTitleAlign: 'center',
    });
  }, [marketId]);

  return <Futures />;
}
