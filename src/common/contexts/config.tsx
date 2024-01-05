import { createContext, useContext, useState } from 'react';

import { CosmosCryptoSecp256k1Keys } from '@injectivelabs/core-proto-ts';
import { Network, NetworkEndpoints, getNetworkEndpoints } from '@injectivelabs/networks';
import { SignerDetails, createAny } from '@injectivelabs/sdk-ts';

const ConfigContext = createContext(
  {} as { appConfig: AppConfig; changeEnvironment: (appConfig: AppConfig) => void }
);

interface AppConfig {
  metadata: string;

  injectiveNetworkEndpoints: NetworkEndpoints;
  chainId: string;

  feePayer: string;
  feePayerSignerDetails: SignerDetails;
  feeRecipient: string;

  txEndpoint: string;
  txMemo: string;
}

const PROD: AppConfig = {
  metadata: 'https://qwerty-mobile-config.vercel.app/',
  injectiveNetworkEndpoints: getNetworkEndpoints(Network.Mainnet),
  chainId: 'injective-1',

  feePayer: 'inj14wp0pj2ty55kmvu7xpz7glask7tvpf5anss9ay',
  feePayerSignerDetails: {
    pubKey: createAny(
      CosmosCryptoSecp256k1Keys.PubKey.encode(
        CosmosCryptoSecp256k1Keys.PubKey.create({
          key: Buffer.from('Al61J56a1nfnP+C8gIkq31m18gQqb5CS0Sws60eMTsB+', 'base64'),
        })
      ).finish(),
      '/cosmos.crypto.secp256k1.PubKey'
    ),
    accountNumber: 21642,
    sequence: 1,
  },
  feeRecipient: 'inj1xefevqpwr97me59jmkg8mf5auqcf5vgtz7kc85',

  txEndpoint: 'https://hammerhead-app-2-9urh6.ondigitalocean.app',
  txMemo: 'QWERTY.EXCHANGE Mobile',
};

export const ConfigProvider = ({ children }) => {
  const [appConfig, setAppConfig] = useState(PROD);

  return (
    <ConfigContext.Provider value={{ appConfig, changeEnvironment: setAppConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

export const Config: AppConfig = PROD;
