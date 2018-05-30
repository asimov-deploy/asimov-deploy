const Logging = require('@google-cloud/logging');

var StackDriverLogger = function (config) {
    console.log(config);
    const logging = new Logging();
    const log = logging.log('asimov-deploy');
    const resource = {
        // This example targets the "global" resource for simplicity
        type: 'global'
    };
    const dd = config;
    console.log(dd);
    this.log = function (logobj) {
        if (!config.featureToggles) {
            return;
        }
        if (!config.featureToggles.stackDriverLogging) {
            console.log(JSON.stringify(logobj, null, 4));
            return;
        }
        const entry = log.entry(
            { resource: resource },
            logobj
        );
        log
            .write([entry])
            .then(() => {
                console.log(`Wrote to log`);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }


};

module.exports = {
    create: function (config) {
        return new StackDriverLogger(config);
    }
};