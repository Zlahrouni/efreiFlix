const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const isProd = process.env.NODE_ENV === 'production';
const prodUrl = 'https://efrei-fiche-produit.vercel.app/';

module.exports = {
  entry: './src/index.js',
  mode: process.env.NODE_ENV || "development",
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? prodUrl : 'auto'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: 3005,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
  },  
  plugins: [
    new ModuleFederationPlugin({
      name: 'ficheProduit',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductDetails': './src/ProductDetails.js',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
      },
    }),
    
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}; 