const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let plugins = [];
let basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: '[name].js' }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'index.html')
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      sassLoader: {
        includePaths: [
          "node_modules/ionicons/dist/scss"
        ]
      },
      postcss: [
        require('postcss-import')({ addDependencyTo: webpack }),
        require('postcss-url')(),
        require('postcss-custom-properties')(),
        require('postcss-nested')(),
        require('postcss-cssnext')(),
        require('postcss-browser-reporter')(),
        require('postcss-reporter')()
      ]
    }
  })
];

let devPlugins = [];

let prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true
    },
    compress: {
      screw_ie8: true
    },
    comments: false
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins = basePlugins.concat(prodPlugins);
} else { // dev or rest
  plugins = basePlugins.concat(devPlugins);
}

module.exports = {
  context: __dirname,
  devServer: {
    historyApiFallback: true
  },
  entry: {
    app: './src/index.js',
    vendor: [
      'es6-shim',
      'es6-promise',
      'react',
      'react-dom',
      'onsenui'
    ],
    scss: path.join(__dirname, 'src', 'scss', 'index.scss')
  },

  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.js?$/, include: /src/, enforce:'pre', loader: 'eslint-loader' },
      { test: /\.html$/, include: /src/, loaders: ['raw-loader'] },
      { test: /\.json$/, include: /src/, loaders: ['json-loader'] },
      { test: /\.(png|jpg|svg)$/, include: /src/, loader: 'file-loader?name=img/[ext]/[name].[ext]' },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.css$/, include: /src/, loaders: ['style-loader', 'css-loader?modules&localIdentName=[local]---[hash:base64:5]', 'postcss-loader'] },
      { test: /\.js?$/, include: /src/, loaders: ['react-hot-loader', 'babel-loader'] },
      {
        test: [
          /ionicons\.svg/, /ionicons\.eot/, /ionicons\.ttf/, /ionicons\.woff/,
          /fontawesome-webfont\.svg/, /fontawesome-webfont\.eot/, /fontawesome-webfont\.ttf/, /fontawesome-webfont\.woff/,
          /Material-Design-Iconic-Font\.svg/, /Material-Design-Iconic-Font\.eot/, /Material-Design-Iconic-Font\.ttf/, /Material-Design-Iconic-Font\.woff/, /Material-Design-Iconic-Font\.woff2/
        ], loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },

  plugins: plugins,
  resolve: {
    extensions: ['.html','.js', '.jsx', '.json', '.css', '.scss']
  }
};
