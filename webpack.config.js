const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  publicPath: path.join(__dirname, 'assets')
}

module.exports = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'A-Frame boilerplate',
      template: `${PATHS.app}/index.html`
    }),
    new HtmlWebpackPlugin({
      title: 'Coordinates',
      myPageHeader: 'coordinates',
      template: './src/lessons/1-coordinates.html',
      inject: 'head',
      filename: 'lessons/1-coordinates.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Rotation',
      myPageHeader: 'rotation',
      template: './src/lessons/2-rotation.html',
      inject: 'head',
      filename: 'lessons/2-rotation.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Primitives',
      myPageHeader: 'primitives',
      template: './src/lessons/4-primitives.html',
      inject: 'head',
      filename: 'lessons/4-primitives.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Sky',
      myPageHeader: 'sky',
      template: './src/lessons/3-sky.html',
      inject: 'head',
      filename: 'lessons/3-sky.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Materials',
      myPageHeader: 'materials',
      template: './src/lessons/5-materials.html',
      inject: 'head',
      filename: 'lessons/5-materials.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Story board template',
      myPageHeader: 'story-board-template',
      template: './src/lessons/story-board-template.html',
      inject: 'head',
      filename: 'lessons/story-board-template.html'
    }),
    new HtmlWebpackPlugin({
      title: '360 template',
      myPageHeader: '360-template',
      template: './src/360-template/360-template.html',
      inject: 'head',
      filename: '360-template/360-template.html'
    }),
    new HtmlWebpackPlugin({
      title: 'distance 3d space',
      myPageHeader: 'distance-3d-space',
      template: './src/lessons/distance-3d-space.html',
      inject: 'head',
      filename: 'lessons/distance-3d-space.html'
    }),
    new HtmlWebpackPlugin({
      title: '360 example',
      myPageHeader: '360-example',
      template: './src/lessons/360-example.html',
      inject: 'head',
      filename: 'lessons/360-example.html'
    }),
    new HtmlWebpackPlugin({
      title: 'screens flat',
      myPageHeader: 'screens-flat',
      template: './src/lessons/screens-flat.html',
      inject: 'head',
      filename: 'lessons/screens-flat.html'
    }),
    new HtmlWebpackPlugin({
      title: 'screens curved',
      myPageHeader: 'screens-curved',
      template: './src/lessons/screens-curved.html',
      inject: 'head',
      filename: 'lessons/screens-curved.html'
    }),
    new HtmlWebpackPlugin({
      title: 'screens focused',
      myPageHeader: 'screens-focused',
      template: './src/lessons/screens-focused.html',
      inject: 'head',
      filename: 'lessons/screens-focused.html'
    }),
    new HtmlWebpackPlugin({
      title: 'screens surrounding',
      myPageHeader: 'screens-surrounding',
      template: './src/lessons/screens-surrounding.html',
      inject: 'head',
      filename: 'lessons/screens-surrounding.html'
    }),
    new HtmlWebpackPlugin({
      title: 'boilerplate example',
      myPageHeader: 'boilerplate-example',
      template: './src/lessons/boilerplate-example.html',
      inject: 'head',
      filename: 'lessons/boilerplate-example.html'
    }),
    new HtmlWebpackPlugin({
      title: 'perspective',
      myPageHeader: 'perspective',
      template: './src/lessons/perspective.html',
      inject: 'head',
      filename: 'lessons/perspective.html'
    })
  ],
  devServer: {
    overlay: {
      errors: true,
      warnings: false
    },
    contentBase: [path.resolve(__dirname, 'src')]
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitwarning: true
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      }
    ]
  }
}
