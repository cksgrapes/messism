var webpack            = require('gulp-webpack').webpack;
var BowerWebpackPlugin = require('bower-webpack-plugin');
var path               = require('path');

module.exports = {

    entry: {
        common: './dev/js/common.js',
        test: './dev/js/test.js'
    },

    output: {
        publicPath: '/',
        path: __dirname + './release/assets/js/',
        filename: '[name].js'
    },

    resolve: {
      root: [path.join(__dirname, "bower_components")],
      moduleDirectories: ["bower_components"],
      extensions: ["", ".js", ".coffee", ".webpack.js", ".web.js"]
    },

    plugins: [
        new BowerWebpackPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]

};
