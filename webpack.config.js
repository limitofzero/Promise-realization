const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {
    console.log(env);

    const webpackAnalyzer = new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true
    });

    return {
        entry: './src/index.js',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                inject: false
            }),
            webpackAnalyzer
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        options: {
                            useTranspileModule: true,
                            forceIsolatedModules: true,
                            useCache: true,
                            useBabel: true,
                            "babelOptions": {
                                "babelrc": false, /* Important line */
                                "presets": [
                                    [
                                        "@babel/preset-env",
                                        {
                                            "targets": {/*"ie": "11", */"chrome": "69"},
                                            "modules": false,
                                            "forceAllTransforms": false,
                                        }
                                    ]
                                ]
                            },
                            reportFiles: ['src/**/*.{ts,tsx}'],
                            babelCore: '@babel/core',
                            useCache: false
                        },
                        loader: 'awesome-typescript-loader'
                    },
                    include: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')]
                }
            ],
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ],
        }
    }
};
