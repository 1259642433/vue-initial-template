const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = 'production'.includes(process.env.NODE_ENV)

const SpritesmithPlugin = require('webpack-spritesmith')

module.exports = {
  publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : '/',
  outputDir: process.env.outputDir || 'dist',
  assetsDir: 'assets',
  lintOnSave: false,
  productionSourceMap: false,
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
    sourceMap: false,
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
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境配置...
      config.mode = 'production'
    } else if (process.env.NODE_ENV === 'debug') {
      // 测试环境修改配置...
      config.mode = 'debug'
    } else {
      // 开发环境配置...
      config.mode = 'development'
    }
    config.resolve.modules = ['node_modules', './src/assets/img']
    const Plugins = [
      // 作用：将散落的小图icon之类的组合生成雪碧图，减少浏览器请求次数，加快页面加载速度
      // 使用方法：@import'@a/scss/sprite.scss'
      // <span class="icon icon-每个小图的名字"></sapn>
      new SpritesmithPlugin({
        src: {
          // 目标小图标，需要整合的小图片的老巢。
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
      })
    ]
    config.plugins = [...config.plugins, ...Plugins]
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
