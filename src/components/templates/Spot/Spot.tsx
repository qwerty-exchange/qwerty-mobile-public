import { memo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import tw from '@tools/tailwind';
import { useLocalSearchParams } from 'expo-router';

import { OpenOrders } from '@app/components/organisms/OpenOrders/OpenOrders';
import { SpotPurchaseForm } from '@app/components/organisms/SpotPurchaseForm/SpotPurchaseForm';
import { OrderBook } from '@app/components/organisms/OrderBook/OrderBook';
import { TabList, TabPanel } from '@app/components/organisms/TopBar/TabList';
import { CryptoOperationType } from '@app/common/models/crypto';
import { QMarketType } from '@app/common/constants/enum';
import { Formik } from 'formik';

type SearchParams = {
  id: string;
  operationType: CryptoOperationType;
};

export const Spot = memo(() => {
  const { id: marketId, operationType } = useLocalSearchParams<SearchParams>();
  const marketType = QMarketType.SPOT;

  return (
    <ScrollView style={tw`flex-1 pt-5 pb-8`}>
      <PurchaseView marketId={marketId} operationType={operationType} marketType={marketType} />
      <UserPositions marketType={marketType} marketId={marketId} />
    </ScrollView>
  );
});

const UserPositions = ({
  marketType,
  marketId,
}: {
  marketId: SearchParams['id'];
  marketType: QMarketType;
}) => {
  const [tabListHeight, setTabListHeight] = useState<number>(300);
  const handleContentHeightChange = (height: number) => {
    setTabListHeight(height + 100);
  };

  return (
    <TabList height={tabListHeight}>
      <TabPanel
        title="Open orders"
        render={() => (
          <OpenOrders
            marketType={QMarketType.SPOT}
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
          <SpotPurchaseForm
            values={values}
            handleChange={handleChange}
            marketId={marketId}
            marketType={marketType}
            operationType={operationType}
          />
        )}
      </Formik>
      <View style={tw`w-2/5`}>
        <OrderBook onClick={() => {}} marketId={marketId} marketType={marketType} />
      </View>
    </View>
  );
};
