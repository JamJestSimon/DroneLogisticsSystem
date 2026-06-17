let config = {
  mode: 'development',
  resolve: {
    modules: [
      "node_modules"
    ]
  },
  plugins: [],
  module: {
    rules: []
  }
};

// entry
config.entry = {
    main: [require('path').resolve(__dirname, "kotlin\\uav-logistics-system-frontend.js")]
};
config.output = {
    filename: (chunkData) => {
        return chunkData.chunk.name === 'main'
            ? "frontend.js"
            : "frontend-[name].js";
    },
    library: "frontend",
    libraryTarget: "umd",
    globalObject: "globalThis"
};
// source maps
config.module.rules.push({
        test: /\.m?js$/,
        use: ["source-map-loader"],
        enforce: "pre"
});
config.devtool = 'eval-source-map';
config.ignoreWarnings = [
    /Failed to parse source map/,
    /Accessing import\.meta directly is unsupported \(only property access or destructuring is supported\)/
]

// dev server
config.devServer = {
  "open": false,
  "port": 8081,
  "static": [
    "kotlin",
    "..\\..\\..\\..\\frontend\\build\\processedResources\\js\\main"
  ],
  "client": {
    "overlay": {
      "errors": true,
      "warnings": false
    }
  }
};

// noinspection JSUnnecessarySemicolon
;(function(config) {
    const tcErrorPlugin = require('kotlin-test-js-runner/tc-log-error-webpack');
    config.plugins.push(new tcErrorPlugin())
    config.stats = config.stats || {}
    Object.assign(config.stats, config.stats, {
        warnings: false,
        errors: false
    })
})(config);

// disable-dev-overlay.js
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



module.exports = config
