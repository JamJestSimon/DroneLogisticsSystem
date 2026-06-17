// Webpack dev-server overlay intercepts pointer events even when invisible.
(function (config) {
    config.devServer = config.devServer || {};
    config.devServer.client = config.devServer.client || {};
    config.devServer.client.overlay = {
        errors: false,
        warnings: false,
        runtimeErrors: false,
    };
})(config);
