import { QMarketType } from '@app/common/constants/enum';
import { OpenOrders } from '@app/components/organisms/OpenOrders/OpenOrders';

export default function Page() {
  return (
    <>
      <OpenOrders marketId="1" marketType={QMarketType.DERIVATIVE} onContentHeight={() => {}} />
    </>
  );
}
