import { QMarketType } from '@app/common/constants/enum';
import { OrderHistory } from '@app/components/organisms/OrderHistory/OrderHistory';

export default function Page() {
  return (
    <>
      <OrderHistory marketType={QMarketType.DERIVATIVE} />
    </>
  );
}
