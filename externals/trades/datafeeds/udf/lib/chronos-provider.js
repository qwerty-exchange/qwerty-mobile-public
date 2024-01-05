import HttpClient from './HttpClient';
export class ChronosApiProvider {
    constructor(endpoint) {
        this.getSpotConfig = async () => {
            return await this.client.get('config');
        };
        this.getDerivativesConfig = async () => {
            return await this.client.get('config');
        };
        this.getSpotSymbol = async (symbol) => {
            return await this.client.get(`symbols?symbol=${encodeURI(symbol)}`);
        };
        this.getDerivativesSymbol = async (symbol) => {
            return await this.client.get(`symbols?symbol=${encodeURI(symbol)}`);
        };
        this.getSpotBars = async ({ symbol, from, to, firstDataRequest, countBack, resolution }) => {
            let endpoint = `history?symbol=${encodeURI(symbol)}`;
            if (resolution) {
                endpoint += `&resolution=${resolution}`;
            }
            if (from) {
                endpoint += `&from=${from}`;
            }
            if (to) {
                endpoint += `&to=${to}`;
            }
            if (countBack) {
                endpoint += `&countBack=${countBack}`;
            }
            if (firstDataRequest) {
                endpoint += `&firstDataRequest=${firstDataRequest}`;
            }
            return await this.client.get(endpoint);
        };
        this.getDerivativeBars = async ({ symbol, from, to, firstDataRequest, countBack, resolution }) => {
            let endpoint = `history?symbol=${encodeURI(symbol)}`;
            if (resolution) {
                endpoint += `&resolution=${resolution}`;
            }
            if (from) {
                endpoint += `&from=${from}`;
            }
            if (to) {
                endpoint += `&to=${to}`;
            }
            if (countBack) {
                endpoint += `&countBack=${countBack}`;
            }
            if (firstDataRequest) {
                endpoint += `&firstDataRequest=${firstDataRequest}`;
            }
            return await this.client.get(endpoint);
        };
        this.client = new HttpClient(endpoint);
        this.isSpot = endpoint.includes('spot');
    }
    async getConfig() {
        const { data } = await (this.isSpot
            ? this.getSpotConfig()
            : this.getDerivativesConfig());
        return data;
    }
    async getSymbol(symbol) {
        const { data } = await (this.isSpot
            ? this.getSpotSymbol(symbol)
            : this.getDerivativesSymbol(symbol));
        return data;
    }
    async getBars({ symbol, from, to, firstDataRequest, countBack, resolution }) {
        const { data } = await (this.isSpot
            ? this.getSpotBars({
                symbol,
                from,
                firstDataRequest,
                countBack,
                to,
                resolution
            })
            : this.getDerivativeBars({
                symbol,
                from,
                firstDataRequest,
                countBack,
                to,
                resolution
            }));
        return data;
    }
}
