export class DataPulseProvider {
    constructor(historyProvider, updateFrequency) {
        this.requestsPending = 0;
        this.subscribers = {};
        this.subscribers = {};
        this.requestsPending = 0;
        this.historyProvider = historyProvider;
        setInterval(this.updateData.bind(this), updateFrequency);
    }
    subscribeBars(symbolInfo, resolution, newDataCallback, listenerGuid) {
        if (this.subscribers[listenerGuid]) {
            return;
        }
        this.subscribers[listenerGuid] = {
            lastBarTime: null,
            listener: newDataCallback,
            resolution,
            symbolInfo
        };
    }
    unsubscribeBars(listenerGuid) {
        delete this.subscribers[listenerGuid];
    }
    updateData() {
        if (this.requestsPending > 0) {
            return;
        }
        this.requestsPending = 0;
        for (const listenerGuid in this.subscribers) {
            this.requestsPending += 1;
            this.updateDataForSubscriber(listenerGuid)
                .then(() => {
                this.requestsPending -= 1;
            })
                .catch((_error) => {
                this.requestsPending -= 1;
            });
        }
    }
    updateDataForSubscriber(listenerGuid) {
        const subscriptionRecord = this.subscribers[listenerGuid];
        const rangeEndTime = parseInt((Date.now() / 1000).toString());
        const rangeStartTime = rangeEndTime - periodLengthSeconds(subscriptionRecord.resolution, 10);
        return this.historyProvider
            .getBars(subscriptionRecord.symbolInfo, subscriptionRecord.resolution, {
            from: rangeStartTime.toString(),
            to: rangeEndTime.toString(),
            countBack: 2,
            firstDataRequest: false
        })
            .then((result) => {
            this.onSubscriberDataReceived(listenerGuid, result);
        });
    }
    onSubscriberDataReceived(listenerGuid, result) {
        if (!this.subscribers[listenerGuid]) {
            return;
        }
        const bars = result.bars;
        if (bars.length === 0) {
            return;
        }
        const lastBar = bars[bars.length - 1];
        const subscriptionRecord = this.subscribers[listenerGuid];
        if (subscriptionRecord.lastBarTime !== null &&
            lastBar.time < subscriptionRecord.lastBarTime) {
            return;
        }
        const isNewBar = subscriptionRecord.lastBarTime !== null &&
            lastBar.time > subscriptionRecord.lastBarTime;
        if (isNewBar) {
            if (bars.length < 2) {
                throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
            }
            const previousBar = bars[bars.length - 2];
            subscriptionRecord.listener(previousBar);
        }
        subscriptionRecord.lastBarTime = lastBar.time;
        subscriptionRecord.listener(lastBar);
    }
}
export const periodLengthSeconds = (resolution, requiredPeriodsCount) => {
    let daysCount = 0;
    if (resolution === 'D' || resolution === '1D') {
        daysCount = requiredPeriodsCount;
    }
    else if (resolution === 'M' || resolution === '1M') {
        daysCount = 31 * requiredPeriodsCount;
    }
    else if (resolution === 'W' || resolution === '1W') {
        daysCount = 7 * requiredPeriodsCount;
    }
    else {
        daysCount = (requiredPeriodsCount * parseInt(resolution)) / (24 * 60);
    }
    return daysCount * 24 * 60 * 60;
};
