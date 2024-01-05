import Toast from 'react-native-toast-message';

import { useQueryClient } from '@tanstack/react-query';

import { useFeedback } from '@app/components/organisms/Feedback/Feedback';
import { wait } from '@tools/common';

type Fun = (...args: any) => any;
export const useChainOperation = <T extends Fun>(callback: T): T => {
  const feedback = useFeedback();
  const queryClient = useQueryClient();
  const chainOperation = async (args: any) => {
    feedback.setVisible(true);
    try {
      await callback(args);
      wait(200).then(() => queryClient.refetchQueries({ queryKey: ['market-orders', 'balance'] }));
    } catch (error) {
      console.log(error); //TODO
      Toast.show({
        type: 'info',
        text1: 'Something went wrong',
        position: 'bottom',
      });
    }

    feedback.setVisible(false);
  };

  return chainOperation as T;
};
