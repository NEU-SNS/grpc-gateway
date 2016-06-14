const Browser = require('zombie');

Browser.localhost('localhost', 3000);

describe('Visits example page', function() {
	const browser = new Browser();
	before(function(done) {
		browser.visit("/index.html", done);
	});

	it('should be successful', function() {
		browser.assert.success();
	});
	it('should show echo back from gRPC service', function() {
		browser.assert.text('#echoBack', 'foo');
	});
});
