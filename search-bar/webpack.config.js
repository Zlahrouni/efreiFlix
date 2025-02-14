const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'search_bar',
      filename: 'remoteEntry.js',
      exposes: {
        './SearchBar': './src/index',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
      },
    }),
  ],
}; 