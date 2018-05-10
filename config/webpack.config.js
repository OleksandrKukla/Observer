const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(env, options) {
    const isProduction = options.mode === "production";

    const config = {
        context: path.join(__dirname, "../src"),
        entry: "./Observer",
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "none" : "source-map",

        resolve: {
            extensions: [".js", ".jsx", ".css"]
        },

        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'Observer.js',
            publicPath: '/'
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        name: "commons",
                        chunks: "all",
                        minSize: 0,
                        minChunks: 2
                    }
                }
            }
        },

        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                },
                {
                    test: /\.(jpg|png|svg)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 25000,
                    },
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: "App",
                hash: true,
                template: path.resolve(__dirname, "../src/index.html")
            }),

            new ExtractTextPlugin("[name].css")
        ],

        devServer: {
            contentBase: "./dist",
            historyApiFallback: true
        }
    };

    return config;
};
