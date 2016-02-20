const tests = require('./tests.json');
const casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
});

const host = 'http://localhost:1358/';
casper.start(host, function() {
    tests.forEach(function(test) {
        test.fixtures.forEach(function(fixture) {
            casper.thenOpen(host + '?component=' + test.name + '&fixture=' + fixture +'&fullScreen=true', function () {
                const fileName = [test.name, fixture, casper.cli.get('renderer'), 'png'].join('.');
                this.captureSelector('_screenshots/' + fileName, '[class^="component-playground__preview"] > *');
            });
        });
    });
});

casper.run();
