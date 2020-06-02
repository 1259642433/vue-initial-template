const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = 'production'.includes(process.env.NODE_ENV)

const SpritesmithPlugin = require('webpack-spritesmith')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: '/',
  outputDir: process.env.outputDir || 'dist',
  assetsDir: 'assets',
  lintOnSave: false,
  productionSourceMap: !IS_PROD,
  parallel: require('os').cpus().length > 1,
  pwa: {}, // PWA 插件
  pluginOptions: {}, // 第三方插件
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8888,
    https: false,
    // hot:true,
    // hotOnly: false,
    overlay: { // 错误、警告在页面弹出
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'localhost',
        changeOrigin: true, // 开启代理
        ws: true, // 是否启用websockets
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  css: {
    extract: IS_PROD, // css分离,与HMR不兼容
    sourceMap: !IS_PROD,
    loaderOptions: {
      sass: {
        prependData: '@import "@a/scss/frame.scss";'
      }
    },
    requireModuleExtension: true
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@a', resolve('src/assets'))
      .set('@c', resolve('src/components'))
      .set('@v', resolve('src/views'))
    if (IS_PROD) {
      // 作用：压缩图片
      // 测试：图片总大小14.2143736mb,
      // 引入前项目打包后dist文件夹大小为14.3639479mb，引入后dist文件夹大小为4.5201283mb
      // 压缩比达30%,图片资源大小减少了十分之七
      // PS:建议cnpm安装, npm因为墙的原因可能安装不上一些依赖
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false }
          // webp: { quality: 75 } 大大减少体积，但在ios存在兼容问题，不用
        })
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境配置...
      console.log(config.optimization)
      config.mode = 'production'
      // confuse 内置terser插件？修改为何不生效？
      // console.log(config.optimization.minimizer)
      // 去除console.log
      // config.optimization.minimizer[0].terserOptions = {
      //   compress: {
      //     drop_console: true,
      //     pure_funcs: ['console.log']
      //   }
      // }
      // TODO 等待后续测试是否生效
      // 配置splitChunks(webpack4内置), 将公用组件，样式等等提取出来,减少打包体积
      config.optimization.splitChunks = {
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          elementUI: {
            name: 'elementui',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: 'all',
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
          echarts: {
            name: 'chunk-echarts',
            test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            chunks: 'all',
            priority: 4,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
      config.resolve.modules = ['node_modules', './src/assets/img']
      const Plugins = [
      // 作用：将散落的小图icon之类的组合生成雪碧图，减少浏览器请求次数，加快页面加载速度
      // 使用方法：@import'@a/scss/sprite.scss'
      // <div class="icon icon-每个小图的名字"></div>
        new SpritesmithPlugin({
          src: {
            cwd: resolve('./src/assets/img/icons'),
            glob: '*.png'
          },
          target: {
            image: resolve('./src/assets/img/sprite.png'),
            css: [
              [resolve('./src/assets/scss/sprite.scss'), {
              // 引用自己的模板
                format: 'function_based_template'
              }]
            ]
          },
          customTemplates: {
            function_based_template: templateFunction
          },
          apiOptions: {
            cssImageRef: '~sprite.png'
          },
          spritesmithOptions: {
            padding: 20
          }
        }),
        // 打包分析
        new BundleAnalyzerPlugin(
          {
            analyzerMode: 'server',
            analyzerHost: 'localhost',
            analyzerPort: 10000,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: false,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
          }
        ),
        // 打包gzip压缩
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]', // 旧版本为assets，现为filename
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.jpg$/,
          threshold: 10240,
          // deleteOriginalAssets: true, // 删除源文件
          minRatio: 0.8
        })
      ]
      // 打包优化，去除console.log
      config.optimization.minimizer.push(new UglifyJsPlugin({
        sourceMap: false,
        // 开启多线程提高打包速度, 默认并发运行数：os.cpus().length - 1
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] // 生产环境自动删除console
          },
          warnings: false
        }
      }))
      config.plugins = [...config.plugins, ...Plugins]
    } else if (process.env.NODE_ENV === 'development') {
      // 开发环境配置...
      config.mode = 'development'
    } else {
      // 其他...
      config.mode = 'none'
    }
  }
}

var templateFunction = function (data) {
  var shared = '.icon { background-image: url(I);background-size: Wpx Hpx;}'.replace('I', data.sprites[0].image).replace('W', data.spritesheet.width)
    .replace('H', data.spritesheet.height)

  var perSprite = data.sprites.map(function (sprite) {
    return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
      .replace('N', sprite.name)
      .replace('W', sprite.width)
      .replace('H', sprite.height)
      .replace('X', sprite.offset_x)
      .replace('Y', sprite.offset_y)
  }).join('\n')

  return shared + '\n' + perSprite
}
