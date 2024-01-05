import { useCallback, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';

import { useRouter } from 'expo-router';

import useMarketPriceFormatter from '@app/common/hooks/useMarketPriceFormatter';
import { Spinner } from '@app/components/atoms/Spinner/Spinner';
import { Typography } from '@app/components/atoms/Typography/Typography';
import { ColumnTab } from '@app/components/molecules/ColumnTab/ColumnTab';
import { RowLabel } from '@app/components/molecules/RowLabel/RowLabel';
import { BottomButtons } from '@app/components/organisms/CryptoDetailsBottomButtons';
import { OrderBookPage } from '@app/components/organisms/CryptoDetailsOrderBookPage';
import { TabList, TabPanel } from '@app/components/organisms/TopBar/TabList';
import { TradeHistory } from '@app/components/organisms/TradeHistory/TradeHistory';
import type { CryptoOperationType } from '@models/crypto';
import tw from '@tools/tailwind';

export const CryptoDetailsTemplate = ({ market }) => {
  const router = useRouter();
  const onPressBottomButton = (type: CryptoOperationType) => {
    router.push({
      pathname: `/markets/${market.type}/[id]/trade`,
      params: { id: market.id, market, operationType: type },
    });
  };

  if (!market) {
    return null;
  }

  return (
    <View style={tw`flex-1 mt-2`}>
      <ScrollView style={tw`flex-1`}>
        <TokenMarketSummary market={market} />
        <TokenChart tokenSymbol={market.symbol} marketType={market.type} />
        <TabList height={350}>
          <TabPanel
            title="Order book"
            render={() => <OrderBookPage marketId={market.id} marketType={market.type} />}
          />
          <TabPanel
            title="Trade history"
            render={() => <TradeHistory marketId={market.id} marketType={market.type} />}
          />
        </TabList>
      </ScrollView>
      <BottomButtons onPress={onPressBottomButton} />
    </View>
  );
};

const TokenChart = ({ tokenSymbol, marketType }) => {
  const ref = useRef<WebView>();
  const [isReady, setIsReady] = useState(false);

  const onMessage = useCallback(
    (data) => {
      const msg = JSON.parse(data);
      switch (msg.type) {
        case 'onInit':
          ref.current.postMessage(
            JSON.stringify({ type: 'init', value: { type: marketType, symbol: tokenSymbol } })
          );
          break;
        case 'onDataLoaded':
          setIsReady(true);
          break;
      }
    },
    [ref]
  );

  const handleChangeInterval = useCallback(
    (interval) => {
      ref.current.postMessage(
        JSON.stringify({
          type: 'change-interval',
          value: interval,
        })
      );
    },
    [ref]
  );

  const columns = {
    '1': '1m',
    '60': '1H',
    D: '1D',
    '30D': '1M',
  };
  const [currentInterval, setCurrentInterval] = useState('60');

  return (
    <View>
      {!isReady ? (
        <View style={tw`absolute top-1/2 left-1/2 m--6`}>
          <Spinner height={48} color={tw.color('primary')} />
        </View>
      ) : (
        <></>
      )}

      <View style={tw.style({ width: wp(100), height: wp(100), opacity: isReady ? 1 : 0 })}>
        <View style={tw`ml-4`}>
          <ColumnTab
            type="simple"
            columns={[...Object.values(columns)]}
            onChange={(value) => {
              const key = Object.keys(columns).find((key) => columns[key] === value);
              setCurrentInterval(key);
              handleChangeInterval(key);
            }}
            value={columns[currentInterval]}
          />
        </View>
        <WebView
          ref={ref}
          nestedScrollEnabled
          scrollEnabled={false}
          allowFileAccessFromFileURLs
          domStorageEnabled
          allowFileAccess
          allowUniversalAccessFromFileURLs
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={() => true}
          onMessage={(e: { nativeEvent: { data?: string } }) => onMessage(e.nativeEvent.data)}
          source={{
            uri: `https://unruffled-bhaskara-5ba50f.netlify.app/index3.html`,
          }}
          style={tw.style({ width: wp(100), height: wp(100) })}
        />
      </View>
    </View>
  );
};

const TokenMarketSummary = ({ market }) => {
  const formatter = useMarketPriceFormatter(market.id, market.type);

  return (
    <>
      <View style={tw`flex-1 px-4 mb-1`}>
        <Typography size="2xl" style="font-demiBold">
          {Number(market.price).toFixed(Math.abs(formatter.priceTensMultiplier))}{' '}
          {market.name.split(' ')[0].split('/')[1]}{' '}
        </Typography>
      </View>
      <View style={tw`flex-row mb-4 px-4`}>
        <RowLabel style={tw`mr-4`} title="H:" subtitle={market?.priceHigh} />
        <RowLabel style={tw`mr-4`} title="L:" subtitle={market?.priceLow} />
        <RowLabel style={tw`mr-4`} title="Volume:" subtitle={market?.volumeFormat} />
      </View>
    </>
  );
};
