
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
	    	if (req.headers['x-theme']) {
	    		if (/\//.test(req.headers['x-theme'])) {
	    			res.writeHead(404);
	    			return res.end();
	    		}
	    		var path = PATH.join(__dirname, "themes", req.headers['x-theme']);
	    		return FS.exists(path, function(exists) {
	    			if (!exists) {
		    			res.writeHead(404);
		    			return res.end();
	    			}
					return SEND(req, req._parsedUrl.pathname)
						.root(path)
						.on('error', next)
						.pipe(res);
	    		});
	    	}
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
