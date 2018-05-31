const Logging = require('@google-cloud/logging');

var StackDriverLogger = function (config) {
    console.log(config);
    const logging = new Logging();
    const log = logging.log('asimov-deploy');
    const resource = {
        // This example targets the "global" resource for simplicity
        type: 'global'
    };
    this.log = function (logobj) {
        if (!config.featureToggles) {
            return;
        }
        if (!config.featureToggles.stackDriverLogging) {
            console.log('no stackdriver: ' + JSON.stringify(logobj));
            return;
        }
        console.log('going to log to stackdriver.');

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