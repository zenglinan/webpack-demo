const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = smp.wrap({
  mode: "production",
  devtool: "source-map",
  entry: {
    "index": ["@babel/polyfill", "./src/index.js"],
    "search": "./src/search.js"
  },
  output: {
    filename: '[name]_[hash:8].js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ["last 2 version", ">1%"]
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: 'img/[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/template/index.template.html'),
      filename: 'index.html',
      chunks: ['index', "libs"]
    }),
    new HtmlWebpackPlugin({
      filename: 'search.html',
      chunks: ['search', "libs"]
    }),
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin() 开启打包体积分析
  ],
  optimization: {
    splitChunks:{
      chunks:'all',
      cacheGroups: {
        libs: {
          name: "libs",
          chunks: "all"
        }
      }
    }
  },
  devServer: {
    contentBase: './dist',
    hot: true
  }
})