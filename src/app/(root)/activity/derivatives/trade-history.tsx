import { QMarketType } from '@app/common/constants/enum';
import { UserTradeHistory } from '@app/components/molecules/UserTradeHistory/UserTradeHistory';

export default function Page() {
  return (
    <>
      <UserTradeHistory marketType={QMarketType.DERIVATIVE} />
    </>
  );
}
