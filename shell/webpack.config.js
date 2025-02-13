/**
 * Configuration Webpack pour l'application Shell (Host Application)
 * 
 * Ce fichier configure l'application principale qui va héberger et orchestrer
 * les différents micro-frontends. En tant qu'application hôte, elle est responsable
 * de l'importation et de l'intégration des composants distants.
 * 
 * Points clés :
 * - Configuration du port de développement (3000)
 * - Déclaration des micro-frontends distants (remotes)
 * - Configuration du partage des dépendances
 * - Configuration de Babel pour la transpilation React
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const getRemoteEntryUrl = (appName) => {
  if (process.env.NODE_ENV === 'production') {
    // Replace these URLs with your actual Vercel deployment URLs
    const urls = {
      header: 'https://efrei-header-five.vercel.app',
      skeleton: 'https://efrei-skeleton.vercel.app',
      catalogue: 'https://efrei-catalogue.vercel.app',
      breadcrumb: 'https://efrei-breadcrumb.vercel.app'
    };
    return `${urls[appName]}/remoteEntry.js`;
  }
  const ports = {
    header: 3001,
    skeleton: 3002
  };
  return `http://localhost:${ports[appName]}/remoteEntry.js`;
};

module.exports = {
  entry: "./src/index.js",
  mode: process.env.NODE_ENV || "development",
  output: {
    publicPath: 'auto',
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        header: `header@${getRemoteEntryUrl('header')}`,
        skeleton: `skeleton@${getRemoteEntryUrl('skeleton')}`
      },
      shared: {
        react: { 
          singleton: true,
          requiredVersion: false,
          eager: true
        },
        "react-dom": { 
          singleton: true,
          requiredVersion: false,
          eager: true
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}; 