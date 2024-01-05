import { HistoryProvider } from './history-provider';
import { DataPulseProvider } from './data-pulse-provider';
import { ChronosApiProvider } from './chronos-provider';
export const extractField = (data, field, arrayIndex) => {
    const value = data[field];
    return Array.isArray(value) ? value[arrayIndex] : value;
};
export const defaultConfiguration = () => {
    return {
        exchanges: [],
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: [
            '1',
            '3',
            '5',
            '15',
            '30',
            '60',
            '120',
            '240',
            '360',
            '1D',
            '1W'
        ],
        supports_marks: false,
        supports_timescale_marks: false
    };
};
/**
 * This class implements interaction with UDF-compatible datafeed.
 * See UDF protocol reference at https://github.com/tradingview/charting_library/wiki/UDF
 */
export class Datafeed {
    constructor(datafeedURL, updateFrequency = 10 * 1000) {
        this.configuration = defaultConfiguration();
        this.chronosProvider = new ChronosApiProvider(datafeedURL);
        this.historyProvider = new HistoryProvider(datafeedURL);
        this.dataPulseProvider = new DataPulseProvider(this.historyProvider, updateFrequency);
        this.configurationReadyPromise = this.requestConfiguration().then(() => {
            this.setupWithConfiguration(defaultConfiguration());
        });
    }
    onReady(callback) {
        this.configurationReadyPromise.then(() => {
            callback(this.configuration);
        });
    }
    getQuotes(_symbols, _onDataCallback, _onErrorCallback) {
        throw new Error('Quotes not supported');
    }
    subscribeQuotes(_symbols, _fastSymbols, _onRealtimeCallback, _listenerGuid) {
        throw new Error('Quotes not supported');
    }
    unsubscribeQuotes(_listenerGuid) {
        throw new Error('Quotes not supported');
    }
    getMarks(_symbolInfo, _from, _to, _onDataCallback, _resolution) {
        throw new Error('Marks not supported');
    }
    getTimescaleMarks(_symbolInfo, _from, _to, _onDataCallback, _resolution) {
        throw new Error('Marks not supported');
    }
    getServerTime(_callback) {
        if (!this.configuration.supports_time) {
            return;
        }
        throw new Error('Marks not supported');
    }
    searchSymbols(_userInput, _exchange, _symbolType, _onResult) {
        throw new Error('Symbol search not supported');
    }
    resolveSymbol(symbolName, onResolve, onError, _extension) {
        function onResultReady(symbolInfo) {
            onResolve(symbolInfo);
        }
        if (this.configuration.supports_group_request) {
            throw new Error('Inconsistent configuration (symbols storage)');
        }
        if (!this.configuration.supports_group_request) {
            const params = {
                symbol: symbolName
            };
            this.chronosProvider
                .getSymbol(params.symbol)
                .then((response) => {
                if (response.s !== undefined) {
                    onError('Something happened. The symbol was not found');
                }
                else {
                    onResultReady(response);
                }
            })
                .catch((_error) => {
                onError('Something happened. The symbol was not found');
            });
        }
    }
    getBars(symbolInfo, resolution, from, to, onResult, onError) {
        const periodObject = {
            from,
            to
        };
        this.historyProvider
            .getBars(symbolInfo, resolution, periodObject)
            .then((result) => {
            onResult(result.bars, result.meta);
        })
            .catch(onError);
    }
    subscribeBars(symbolInfo, resolution, onTick, listenerGuid) {
        this.dataPulseProvider.subscribeBars(symbolInfo, resolution, onTick, listenerGuid);
    }
    unsubscribeBars(listenerGuid) {
        this.dataPulseProvider.unsubscribeBars(listenerGuid);
    }
    requestConfiguration() {
        return this.chronosProvider.getConfig().catch((_reason) => {
            return null;
        });
    }
    setupWithConfiguration(configurationData) {
        this.configuration = configurationData;
        if (configurationData.exchanges === undefined) {
            configurationData.exchanges = [];
        }
        if (!configurationData.supports_search &&
            !configurationData.supports_group_request) {
            throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
        }
    }
}
