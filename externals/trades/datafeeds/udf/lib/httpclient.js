import axios from 'axios';
export default class HttpClient {
    constructor(endpoint, options = {
        headers: {
            'Content-Type': 'application/json',
        },
    }) {
        this.config = {};
        this.client = axios.create({
            baseURL: endpoint,
            ...options,
        });
        this.config = {};
    }
    setConfig(config) {
        this.config = config;
        return this;
    }
    get(endpoint, params = {}) {
        return this.client.get(endpoint, { params, ...this.config });
    }
    post(endpoint, data = {}) {
        return this.client.post(endpoint, data, this.config);
    }
    delete(endpoint, params = {}) {
        return this.client.delete(endpoint, { params, ...this.config });
    }
}
