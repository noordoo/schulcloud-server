/* eslint-disable global-require */
const logger = require('../../../src/logger/');

// This test is conditionalized. Travis runs both hydra and proxy/mock server
// local computer will only run mock server


describe('oauth2 service', function oauthTest() {
	this.timeout(10000);
	if (process.env.OAUTH_URL) {
		logger.info('running BOTH hydra and mock server test');
		require('./hydra');
		require('./mock');
	} else {
		logger.info('running only mock server test.');
		require('./mock');
	}
});
