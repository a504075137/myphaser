const path = require('path');
const fs = require('fs');
const tinify = require('tinify');
const chalk = require('chalk');
const md5 = require('md5');

const lockFilePath = 'scripts/tinypng/lock.json';
let lockFileJson = {};
if (fs.existsSync(lockFilePath)) {
    lockFileJson = fs.readFileSync(lockFilePath);
    lockFileJson = JSON.parse(lockFileJson.toString());
}

const tinifyKey = '';
if (tinifyKey === '') {
    console.log(chalk.red('请先在scripts/tinypng/index.js中配置tinypng的key，如果没有key，请前往【https://tinypng.com/developers】申请'));
    return;
}
tinify.key = tinifyKey;
let tinifyLeft = 0; // 剩余压缩次数
let filePathList = []; // 待压缩图片路径列表
const imgRootPath = 'src/assets/imgs'; // 图片根目录
const compressMaxLen = 10; // 压缩并发量(同时压缩图片数量)
const reg = /\.(jpeg|jpg|png)$/; // 只能压缩jpg或png格式图片

function findImg(root) {
    const files = fs.readdirSync(root);
    let list = [];
    for (let file of files) {
        const filePath = path.join(root, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            list = list.concat(findImg(filePath));
        } else if (reg.test(file)) {
            list.push(filePath);
        } else {
            console.log(chalk.red(`${filePath}不能压缩`));
        }
    }
    return list;
}

function compress() {
    return new Promise((resolve, reject) => {
        if (filePathList.length <= 0) {
            resolve(0);
            return;
        } else {
            const filePath = filePathList.pop();
            const content = fs.readFileSync(filePath);
            const hash = md5(content);
            if (lockFileJson[filePath] != hash) {
                const fileSize = fs.statSync(filePath).size;
                if (tinifyLeft <= 0) {
                    console.log(chalk.red('当前key的剩余可用数已用尽，请更换key重试！'));
                    resolve(1);
                    return;
                }
                tinifyLeft--;
                console.log(chalk.green(`开始压缩图片：${filePath}`));
                tinify.fromBuffer(content).toBuffer((err, resultData) => {
                    if (err) {
                        console.log(chalk.red(`${filePath}--压缩失败：${err.message}`));
                        return;
                    }
                    fs.writeFileSync(filePath, resultData);
                    lockFileJson[filePath] = md5(resultData);
                    let compressFileSize = fs.statSync(filePath).size;
                    console.log(chalk.green(`${filePath} ${(fileSize / 1024).toFixed(2)}kb 压缩成功 ${(compressFileSize / 1024).toFixed(2)}kb ${((compressFileSize - fileSize) * 100 / fileSize).toFixed(1)}%`));
                    resolve(1);
                });
            } else {
                console.log(chalk.green(`图片：${filePath}已压缩过`));
                resolve(1);
            }
        }
    });
}

function filter() {
    console.log(chalk.green('开始筛选图片'));
    filePathList = findImg(imgRootPath);
    console.log(chalk.green(`筛选图片完成，开始压缩图片，并发：${compressMaxLen}`));
    const total = filePathList.length;
    let current = 0;
    let left = Math.max(total - compressMaxLen, 0);
    const len = Math.min(left + compressMaxLen, compressMaxLen);
    if (len === 0) {
        console.log(chalk.green('没有图片，不需要压缩'));
        return;
    }
    function start() {
        compress().then((loadCount) => {
            current += loadCount;
            if (current == total) {
                fs.writeFileSync(lockFilePath, JSON.stringify(lockFileJson, null, 4));
                console.log(chalk.green('图片压缩完成'));
                return;
            }
            if (loadCount === 1) {
                start();
            }
        });
    }
    for (let i = 0; i < len; ++i) {
        start();
    }
}

console.log(chalk.green('开始认证tinypng key'));
tinify.validate((err) => {
    if (err) {
        console.log(chalk.red(err.message));
        return;
    }
    console.log(chalk.green('认证成功！'));
    tinifyLeft = +tinify.compressionCount || 0;
    if (tinifyLeft <= 0) {
        console.log(chalk.red('当前key的剩余可用数已用尽，请更换key重试！'));
        return;
    }
    console.log(chalk.green(`当前key剩余可用数为 ${tinifyLeft}`));
    filter();
});