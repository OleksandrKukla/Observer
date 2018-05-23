const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function(env, options) {
    const isProduction = options.mode === "production";

    const config = {
        context: path.join(__dirname, "../src"),
        entry: "./index",
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "none" : "source-map",

        resolve: {
            extensions: [".js"]
        },

        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'index.js',
            publicPath: '/'
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: "App",
                hash: true,
                template: path.resolve(__dirname, "../src/index.html")
            }),
        ],

        devServer: {
            contentBase: "./dist"
        }
    };

    return config;
};
