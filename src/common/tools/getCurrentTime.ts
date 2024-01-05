import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { IndexerGrpcMetaApi } from '@injectivelabs/sdk-ts';

let init = false;
let delta = 0;

// todo: Remove
const indexerGrpcMetaApi = new IndexerGrpcMetaApi(getNetworkEndpoints(Network.Mainnet).indexer);

export const getCurrentTime = () => {
  if (!init) {
    init = true;
    indexerGrpcMetaApi.fetchInfo().then(
      (res) => {
        delta = new Date().getTime() - Number(res.serverTime);
      },
      () => (init = false)
    );
  }
  return new Date().getTime() + delta;
};
