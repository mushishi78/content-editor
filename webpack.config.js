var webpack = require("webpack");

module.exports = {
  entry: __dirname + '/src/app.js',
  output: {
    path: __dirname + '/public',
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};
