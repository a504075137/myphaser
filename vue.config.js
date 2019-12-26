const path = require('path');
const projectConfig = require('./project.config.js');
const JsCss2JsonPlugin = require('./JsCss2JsonPlugin');
const chalk = require('chalk');

console.log(chalk.green('项目配置：'));
console.log(chalk.green(JSON.stringify(projectConfig, null, 4)));

const resolve = dir => path.join(__dirname, './', dir);

const isProd = process.env.NODE_ENV === 'production';

const execSync = require('child_process').execSync;
const gitUserName = execSync('git config --global user.name', {
    encoding: 'utf8'
}).trim();
console.log(chalk.green('git用户名:', gitUserName));

process.env.VUE_APP_STORAGE_PREFIX = projectConfig.storagePrefix;

const genPlugins = () => {
    const plugins = [];
    isProd && plugins.push(new JsCss2JsonPlugin());
    return plugins;
};

module.exports = {
    publicPath: (isProd && projectConfig.outputToSvn) ? projectConfig.cdnUrl : '/',
    outputDir: projectConfig.outputToSvn ? projectConfig.svnDir[gitUserName] : 'dist/',
    assetsDir: 'static',

    filenameHashing: true,
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,

    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: !isProd,
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        // 提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容。
        extract: isProd,
        // 开启 CSS source maps?
        sourceMap: !isProd,
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // webpack配置
    // 简单的配置方式
    configureWebpack: () => ({
        name: `${projectConfig.projectName}`,
        resolve: {
            alias: {
                '@': resolve('src'),
                '@imgs': resolve('src/assets/imgs'),
                '@audios': resolve('src/assets/audios'),
                '@less': resolve('src/assets/less'),
                '@utils': resolve('src/utils'),
                '@views': resolve('src/views'),
                '@styles': resolve('src/styles'),
                '@mixin': resolve('src/mixin'),
                '@c': resolve('src/components'),
                '@directive': resolve('src/directive'),
                '@game': resolve('src/game'),
                '@pip': resolve('src/assets/pip'),
            }
        },
        plugins: genPlugins()
    }),
    // 链式操作
    chainWebpack: config => {
        // webpack-html-plugin
        config.plugin('html')
            .tap(args => {
                // 定义html文件中需要用到的一些数据
                const htmlParams = {
                    production: isProd,
                    title: projectConfig.title,
                    baiduUrl: projectConfig.baiduUrl,
                    forceHttps: projectConfig.forceHttps
                };
                Object.assign(args[0], htmlParams);
                // 不注入js和css，调试模式需要注入
                args[0].inject = !isProd;
                return args;
            });
        config.module.rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 1 }));
    },
    // 第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                './src/styles/less/*.less',
            ]
        }
    }
};
