const resolve = require('path').resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const url = require('url');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const publicPath = '';

module.exports = (options = {}) => ({
  entry: {
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev
      ? 'static/js/[name].js'
      : 'static/js/[name].js?[chunkhash]',
    chunkFilename: 'static/js/[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader', 'postcss-loader']
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: ['url-loader?limit=8192&name=static/images/[hash:8].[name].[ext]']
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      name: 'My Utils Web App',
      short_name: 'Reborn',
      description: 'Reborn小工具',
      background_color: '#ffffff',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: resolve('/icon.jpeg'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        },
        {
          src: resolve('/icon.jpeg'),
          size: '1024x1024' // you can also use the specifications pattern
        },
        {
          src: resolve('/icon.jpeg'),
          size: '1024x1024',
          purpose: 'maskable'
        }
      ],
      ios: {
        'apple-mobile-web-app-title': 'AppTitle',
        'apple-mobile-web-app-status-bar-style': 'black'
      }
    }),
    new ExtractTextPlugin('static/css/styles.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: resolve(__dirname, 'src/favicon.ico')
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
      // name: 'vendor',
      // chunks: 'initial',
      // minChunks: 2
    },
    minimizer: [
      new UglifyJsPlugin({
        /* your config */
        uglifyOptions: {
          compress: true,
          ecma: 6,
          output: {
            comments: false
          },
          compress: {
            dead_code: true,
            drop_console: true
          }
        },
        sourceMap: false
      })
    ]
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve('src')
    },
    extensions: ['.js', '.json', '.css']
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
});
