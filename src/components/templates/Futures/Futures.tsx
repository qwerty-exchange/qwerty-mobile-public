import React, { memo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import tw from '@tools/tailwind';

import { Funding } from '@app/components/organisms/FuturesFunding/Funding';
import { PurchaseForm } from '@app/components/organisms/FuturesPurchaseForm/FuturesPurchaseForm';
import { FuturesOpenPositions } from '@app/components/organisms/FuturesOpenPositions/FuturesOpenPositions';
import { OpenOrders } from '@app/components/organisms/OpenOrders/OpenOrders';
import { OrderBook } from '@app/components/organisms/OrderBook/OrderBook';
import { TabList, TabPanel } from '@app/components/organisms/TopBar/TabList';
import { CryptoOperationType } from '@app/common/models/crypto';
import { QMarketType } from '@app/common/constants/enum';
import { Formik } from 'formik';

type SearchParams = {
  id: string;
  operationType: CryptoOperationType;
};

export const Futures = memo(() => {
  const { id: marketId, operationType } = useLocalSearchParams<SearchParams>();
  const marketType = QMarketType.DERIVATIVE;

  console.log(useLocalSearchParams());

  return (
    <ScrollView style={tw`flex-1 pt-5 pb-8`}>
      <PurchaseView marketId={marketId} operationType={operationType} marketType={marketType} />
      <UserPositions marketId={marketId} />
    </ScrollView>
  );
});

const TABS_HEIGHTS = {
  POSITIONS: 0,
  ORDERS: 0,
};

const UserPositions = ({ marketId }: { marketId: SearchParams['id'] }) => {
  const [tabListHeight, setTabListHeight] = useState<number>(350);

  const handleContentHeightChange = (height: number, key: string) => {
    TABS_HEIGHTS[key as keyof typeof TABS_HEIGHTS] = height;
    let maxHeight = 0;
    Object.entries(TABS_HEIGHTS).forEach(([_, value]) => {
      maxHeight = Math.max(value, maxHeight);
    });

    setTabListHeight(maxHeight + 100);
  };

  return (
    <TabList height={tabListHeight}>
      <TabPanel
        title="Positions"
        render={() => (
          <FuturesOpenPositions marketId={marketId} onContentHeight={handleContentHeightChange} />
        )}
      />
      <TabPanel
        title="Open orders"
        render={() => (
          <OpenOrders
            marketType={QMarketType.DERIVATIVE}
            marketId={marketId}
            onContentHeight={handleContentHeightChange}
          />
        )}
      />
    </TabList>
  );
};

const PurchaseView = ({
  marketId,
  marketType,
  operationType,
}: {
  marketType: QMarketType;
  marketId: SearchParams['id'];
  operationType: SearchParams['operationType'];
}) => {
  const initialValues = {
    leverage: '3',
    operationType,
    price: '',
    amount: '',
    orderType: 'Limit',
    total: '0',
  };

  return (
    <View style={tw`flex-row flex-1 px-4`}>
      <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
        {({ handleChange, values }) => (
          <PurchaseForm
            handleChange={handleChange}
            values={values}
            marketId={marketId}
            marketType={marketType}
            operationType={operationType}
          />
        )}
      </Formik>
      <View style={tw`w-2/5`}>
        <Funding marketId={marketId} />
        <OrderBook onClick={(value) => {}} marketId={marketId} marketType={marketType} />
      </View>
    </View>
  );
};
