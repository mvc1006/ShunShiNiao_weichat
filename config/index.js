var path = require('path')
var glob = require('glob')

var build = {
  env: require('./prod.env'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  productionSourceMap: false,
  productionGzip: false,
  productionGzipExtensions: ['js', 'css']
}

function getEntry(globPath) {
  var entries = {},basename;

  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    entries[basename] = entry;
  });
  return entries;
}

var pages = getEntry('src/pages/**/*.html');

//入口 index: path.resolve(__dirname, '../dist/index.html')
for (var pathname in pages) {
  build[pathname] = path.resolve(__dirname, '../dist/' + pathname + '.html')
}

module.exports = {
  build:build,
  dev: {
    env: require('./dev.env'),
    host:'0.0.0.0',
    port: 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: false,
    proxyTable: {
        '/api':{
            target:'http://dev.shunshiniao.net/',
            changeOrigin:true,//允许跨域
            pathRewrite: {
                '^/api': '/'   //重写接口
              }
        }
    }
  }
}
