const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const Webpack = require('webpack')
module.exports = smp.wrap({
    mode:'development', // 开发模式
    devtool: "source-map",
    entry: {
      main:path.resolve(__dirname,'./src/main.js'),
    },
    output: {
      filename: '[name].[hash:8].js',      // 打包后的文件名称
      path: path.resolve(__dirname,'./dist')  // 打包后的目录
    },
    module:{
      rules:[
        {
          test:/\.vue$/,
          use:['vue-loader']
        },
        {
          test:/\.js$/,
          use:{
            loader:'babel-loader'
          }
        },
        {
          test:/\.css$/,
          use: ['vue-style-loader','css-loader',{
            loader:'postcss-loader',
            options:{
              plugins:[require('autoprefixer')]
            }
          }]
        },
        {
          test:/\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader:'postcss-loader',
              options:{
                plugins:[require('autoprefixer')]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('dart-sass')
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
    resolve:{
      alias:{
        'vue$':'vue/dist/vue.runtime.esm.js',
        ' @':path.resolve(__dirname,'../src')
      },
      extensions:['*','.js','.json','.vue']
    },
    devServer:{
      port:3000,
      hot:true,
      contentBase:'../dist'
    },
    plugins:[
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./public/index.html'),
        filename:'index.html'
      }),
      new vueLoaderPlugin(),
      new Webpack.HotModuleReplacementPlugin()
    ]
})
