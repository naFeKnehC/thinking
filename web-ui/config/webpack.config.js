const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  mode: 'development',
  output: {
    filename: 'js/[name]-[chunkhash].js', //动态名称解决线上缓存
    path: path.resolve(__dirname, '../dist'),
    clean: true,
    publicPath: '/'
  },
  devServer: {
    static: path.resolve(__dirname, '../dist'),
    port: 8887,
    open: false,
    hot: true,
    historyApiFallback: true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          }
        }
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          //style-loader
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, '../src')
              }
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      //webpack5内置图片处理
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", '.js', '.jsx', '.json', '.less', '.css'],
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    alias: {
      '@src': path.resolve(__dirname, '../src')
    }
  }
};

