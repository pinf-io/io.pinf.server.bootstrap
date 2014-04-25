
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs-extra");
const EXPRESS = require("express");
const SEND = require("send");


var PORT = process.env.PORT || 8080;

exports.main = function(callback) {
	try {

	    var app = EXPRESS();

	    app.configure(function() {
	        app.use(EXPRESS.logger());
	        app.use(EXPRESS.cookieParser());
	        app.use(EXPRESS.bodyParser());
	        app.use(EXPRESS.methodOverride());
	        app.use(app.router);
	    });


	    app.get("/favicon.ico", function (req, res, next) {
	    	return res.end();
	    });

	    app.get(/^\//, function (req, res, next) {
			return SEND(req, req._parsedUrl.pathname)
				.root(PATH.join(__dirname, "www"))
				.on('error', next)
				.pipe(res);
	    });

		var server = app.listen(PORT);

		console.log("Listening at: http://localhost:" + PORT);

	    return callback(null, {
	        server: server
	    });
	} catch(err) {
		return callback(err);
	}
}

if (require.main === module) {
	return exports.main(function(err) {
		if (err) {
			console.error(err.stack);
			process.exit(1);
		}
		// Keep server running.
	});
}
