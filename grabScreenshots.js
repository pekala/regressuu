const logger = require('./logger');
const exec = require('child_process').exec;

module.exports = function () {
    logger.log('component tree generated', 'components');
    logger.log('saving screenshots for webkit...', 'webkit');
    const casperWebkit = new Promise((resolve, reject) => {
        exec('npm run casper-webkit', (casperError, stdout) => {
            if (casperError) {
                reject(casperError + stdout);
            }
            logger.log('screenshots for webkit done', 'webkit');
            resolve();
        });
    });

    logger.log('saving screenshots for gecko...', 'gecko');
    const casperGecko = new Promise((resolve, reject) => {
        exec('npm run casper-gecko', (casperError, stdout) => {
            if (casperError) {
                reject(casperError + stdout);
            }
            logger.log('screenshots for gecko done', 'gecko');
            resolve();
        });
    });

    Promise.all([casperWebkit, casperGecko])
    .then(() => {
        logger.log('Success!');
        process.exit();
    })
    .catch((errors) => {
        logger.error(errors);
        process.exit();
    });
};
