import { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHeaderHeight } from '@react-navigation/elements';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Typography } from '@app/components/atoms/Typography/Typography';
import { TextInput } from '@app/components/molecules/Form/TextInput/TextInput';
import { SearchSVG } from '@assets/icons';
import { Button } from '@components/atoms/Button/Button';
import tw from '@tools/tailwind';

export interface HeaderRightProps {
  onSearch: () => void;
}

export interface HeaderSearchProps {
  text: string;
  onChangeTextSearch: any;
  onCancelSearch: () => void;
  onBlurSearch: (textInput: string) => void;
  headerHeight: number;
  topInsets: number;
}

const HeaderRight = ({ onSearch }: HeaderRightProps) => {
  return (
    <View style={tw`justify-center`}>
      <Button
        icon={{ svg: SearchSVG, size: 18, stroke: tw.color('secondary2') }}
        style={tw`border-0`}
        transparent
        onPress={onSearch}
      />
    </View>
  );
};

const HeaderSearch = ({
  headerHeight,
  topInsets,
  text,
  onChangeTextSearch,
  onCancelSearch,
  onBlurSearch,
}: HeaderSearchProps) => {
  const [textInput, setTextInput] = useState(text);
  useEffect(() => {
    onChangeTextSearch(textInput);
  }, [textInput]);

  return (
    <View
      style={tw.style('px-4', {
        height: headerHeight,
        paddingTop: topInsets,
      })}>
      <View style={tw`flex-1 flex-row items-center`}>
        <View style={tw`flex-1`}>
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            icon={{ svg: SearchSVG }}
            placeholder="Search for asset"
            autoFocus
            onBlur={() => onBlurSearch(textInput)}
          />
        </View>
        <Button
          style={tw`border-0 ml-4`}
          transparent
          onPress={() => {
            setTextInput('');
            onCancelSearch();
          }}>
          <Typography style={tw`text-primary`}>Cancel</Typography>
        </Button>
      </View>
    </View>
  );
};

export const useHeaderSearch = (navigation: StackNavigationProp<any, 'Home'>) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');

  const header = () => (
    <HeaderSearch
      onCancelSearch={onCancelSearch}
      onBlurSearch={onBlurSearch}
      headerHeight={headerHeight}
      topInsets={insets.top}
      text={searchText}
      onChangeTextSearch={setSearchText}
    />
  );

  const onSearch = () => {
    navigation.setOptions({
      header,
      headerTitleAlign: 'left',
      headerBackground: undefined,
      // headerShown: false,
      // header,
    });
  };

  const onBlurSearch = (value) => {
    if (!value) {
      navigation.setOptions({
        header: undefined,
        headerTitleAlign: 'left',
        headerBackground: () => <View style={{ backgroundColor: tw.color('background') }} />,
        headerRight: () => <HeaderRight onSearch={onSearch} />,
      });
    }
  };

  const onCancelSearch = () => {
    setSearchText('');
    navigation.setOptions({
      header: undefined,
      headerTitleAlign: 'left',
      headerBackground: () => <View style={{ backgroundColor: tw.color('background') }} />,
      headerRight: () => <HeaderRight onSearch={onSearch} />,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: undefined,
      headerTitleAlign: 'left',
      headerBackground: () => <View style={{ backgroundColor: tw.color('background') }} />,
      headerRight: () => <HeaderRight onSearch={onSearch} />,
    });
  }, []);

  return { searchText };
};
