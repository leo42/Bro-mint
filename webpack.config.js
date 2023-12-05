const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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

],

  mode: 'production',
  experiments: {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true // optional, with some bundlers/frameworks it doesn't work without
      }
};
