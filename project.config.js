module.exports = {
    projectName: "24-project-template", // 项目名
    title: "网页标题", // 网页标题
    storagePrefix: "24project", // localstorage的key前缀，用于项目的区分，避免同域名下的不同项目混淆了
    outputToSvn: false, // 是否输出到svn地址
    svnDir: {
        akaziki: "/Users/xiao/SVN/dingzhi/project-template/game/",
        CodeBear: '/Users/codebear/codebear/24/dingzhi/project-template/game/'
    },
    cdnUrl: '//res.cdn.24haowan.com/dingzhi/project-template/game/', // cdn地址
    baiduUrl: '' ,// 百度统计链接
    forceHttps:false
};
