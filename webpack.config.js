const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public'),
  },	
  devServer: {
		static: {
		  directory: path.join(__dirname, 'build/public'),
		},
		compress: true,
		port: 8080
  	  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      }, {
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			  },
    ],
  },
  //copy static files to public folder
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'src/static', to: '' },
        ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

],

  mode: 'production',
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer"),
      "util": require.resolve("util"),
      "assert": require.resolve("assert"),
      "fs": false,
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "vm": require.resolve("vm-browserify")
    }
  },
  experiments: {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true // optional, with some bundlers/frameworks it doesn't work without
      }
};
