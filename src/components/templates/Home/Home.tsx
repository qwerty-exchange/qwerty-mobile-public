import { Dimensions, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { Typography } from '@components/atoms/Typography/Typography';
import { CryptoCoinIcon } from '@components/molecules/CryptoCoinIcon/CryptoCoinIcon';
import { BalanceWidget } from '@components/organisms/BalanceWidget/BalanceWidget';
import { useUserAccountBalance, useMarkets } from '@hooks/useExchange';
import tw from '@tools/tailwind';

const carouselItems = [
  { img: require('@assets/images/banner0.png') },
  {
    link: 'https://forms.gle/9ZsBE5HZyJPnnLC3A',
    img: require('@assets/images/banner1.png'),
  },
];

export const HomeTemplate = () => {
  const { data } = useUserAccountBalance();
  const markets = useMarkets();

  const width = Dimensions.get('window').width;
  const router = useRouter();
  const onSelectRow = (row: any) => {
    router.push('/markets/spot/' + row.id);
  };

  return (
    <ScrollView style={tw`flex-1 px-4 `}>
      <BalanceWidget balance={data?.summary?.totalBalance} />
      <Carousel
        loop
        autoFillData={false}
        autoPlay
        autoPlayInterval={5000}
        width={width}
        style={tw`h-54 rounded-md mb-4 mt-4 ml--4`}
        data={carouselItems}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!item.link}
            delayLongPress={300}
            onLongPress={() => WebBrowser.openBrowserAsync(item.link)}>
            <Image
              style={tw`max-w-full max-h-full rounded-md`}
              resizeMode="contain"
              source={item.img}
            />
          </TouchableOpacity>
        )}
      />
      <View>
        <Typography style="text-white font-bold mb-2">Top Market</Typography>
        {markets.data?.spot?.slice(0, 3).map((token: any) => {
          return <TokenPanel key={token.id} onPress={() => onSelectRow(token)} token={token} />;
        })}
      </View>
      <View style={tw`justify-center flex-row`}>
        <Image style={tw`w-20`} resizeMode="contain" source={require('@assets/images/logo.png')} />
      </View>
    </ScrollView>
  );
};

const TokenPanel = ({ token, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={tw`bg-shade1 rounded-md p-6 flex-row gap-4 mb-2`}>
      <CryptoCoinIcon coin={token.name.split('/')[0].toUpperCase()} style={tw`mr-2 mt-1 h-6 w-6`} />
      <View style={tw`flex-row justify-between grow`}>
        <View>
          <Typography style={tw`text-white font-medium text-sm`}>{token.name}</Typography>
          <Typography style={tw`text-tertiary text-xs`}>{token.volumeFormat}</Typography>
        </View>
        <View>
          <Typography style={tw`text-white font-bold text-[14px] text-right`}>
            ${token.price}
          </Typography>
          <Typography
            style={tw`text-white text-right text-${token.priceChange > 0 ? 'green' : 'danger'}`}>
            {token.priceChange} %
          </Typography>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
