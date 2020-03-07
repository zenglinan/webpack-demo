const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    mode:'production', // 开发模式
    entry: {
      main:path.resolve(__dirname,'./src/main.js'),
    },
    output: {
      filename: '[name].[hash:8].js',
      path: path.resolve(__dirname,'./dist')
    },
    module:{
      rules:[
        {
          test:/\.vue$/,
          use:['vue-loader']
        },
        {
          test:/\.js$/,
          use:[
            {
              loader: 'thread-loader',
              options: {
                workers: 3
              }
            },
            'babel-loader'
          ]
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
    plugins:[
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./public/index.html'),
        chunks: ['libs', "main"],
        filename:'index.html',
        minify: { // html 压缩
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      }),
      new vueLoaderPlugin(),
      new OptimizeCssAssetsPlugin({ // css 压缩
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
      })
    ],
    optimization: {
      splitChunks:{ // 代码分割
        chunks:'all',
        cacheGroups: {
          libs: {
            name: "libs",
            chunks: "all"
          }
        }
      },
      minimizer: [
        new TerserWebpackPlugin({
          parallel: true  // 开启多进程打包 js
        })
      ]
    },
    externals: {
      'vue': 'Vue',
    }
}
