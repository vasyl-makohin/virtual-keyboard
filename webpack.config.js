const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/js/app.js',
    styles: './src/sass/styles.scss',
  },
  devServer: {
    static: './dist',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: 'Virtual Keyboard',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        description: 'Virtual Keyboard',
        author: 'Vasyl Makohin',
        themeColor: '#ffffff',
        prop1: {
          property: 'og:title',
          content: 'Virtual Keyboard',
        },
        prop2: {
          property: 'og:type',
          content: 'website',
        },
        prop3: {
          property: 'og:description',
          content: 'Virtual Keyboard',
        },
      },
      favicon: './src/img/favicon/favicon-32x32.png',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
