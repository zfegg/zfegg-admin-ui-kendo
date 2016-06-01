module.exports = {
    server: {
        middleware: {
            // overrides the second middleware default with new settings
            1: function (req, rsp, next) {
                if (req.url.indexOf("/src/data") === 0) {
                    req.method = 'GET';
                    rsp.setHeader("Content-Type","application/json");
                }

                next();
            }
        }
    }
};
