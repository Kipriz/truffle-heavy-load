const _ = require("lodash");

module.exports = {
    assertEvent: function (contract, filter) {
        return new Promise((resolve, reject) => {
            const event = contract[filter.event]();
            event.watch();
            event.get((error, logs) => {
                const log = _.filter(logs, filter);
                if (!_.isEmpty(log)) {
                    resolve(log);
                } else {
                    reject(Error(`Failed to find filtered event for ${filter.event}`));
                }
            });
            event.stopWatching();
        });
    },

    eventLogger: function (web3) {
        return function (error, log) {
            switch (log.event) {
                case 'Transfer':
                    console.log(`Transfer(${log.args.target}, ${log.args.index}, ${web3.fromWei(log.args.amount, "ether")} <${log.args.amount}>, ${log.args.msg})`);
                    break;
                case 'BuyTicket':
                    console.log(`BuyTicket(${log.args.participant})`);
                    break;
                default:
                    console.log(`Event: ${log.event}`);
            }
        }
    }
};