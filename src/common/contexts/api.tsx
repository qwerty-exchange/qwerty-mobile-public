import { createContext, useContext, useMemo } from 'react';

import {
  IndexerGrpcDerivativesApi,
  IndexerGrpcExplorerApi,
  IndexerGrpcMetaApi,
  IndexerGrpcSpotApi,
} from '@injectivelabs/sdk-ts';

import { useConfig } from './config';

interface Props {
  indexerGrpcSpotApi: IndexerGrpcSpotApi;
  indexerGrpcDerivativesApi: IndexerGrpcDerivativesApi;
  indexerGrpcExplorerApi: IndexerGrpcExplorerApi;
  indexerGrpcMetaApi: IndexerGrpcMetaApi;
}

const ApiContext = createContext({} as Props);

export const ApiProvider = ({ children }) => {
  const { appConfig } = useConfig();

  const api = useMemo(() => {
    return {
      indexerGrpcSpotApi: new IndexerGrpcSpotApi(appConfig.injectiveNetworkEndpoints.indexer),
      indexerGrpcDerivativesApi: new IndexerGrpcDerivativesApi(
        appConfig.injectiveNetworkEndpoints.indexer
      ),
      indexerGrpcExplorerApi: new IndexerGrpcExplorerApi(
        appConfig.injectiveNetworkEndpoints.indexer
      ),
      indexerGrpcMetaApi: new IndexerGrpcMetaApi(appConfig.injectiveNetworkEndpoints.indexer),
    } as Props;
  }, [appConfig]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);
