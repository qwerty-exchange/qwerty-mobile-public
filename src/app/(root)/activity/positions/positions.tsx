import { FuturesOpenPositions } from '@app/components/organisms/FuturesOpenPositions/FuturesOpenPositions';

export default function Page() {
  return (
    <>
      <FuturesOpenPositions marketId="1" onContentHeight={() => {}} />
    </>
  );
}
