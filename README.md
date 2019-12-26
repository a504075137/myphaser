# project-template

## 脚手架使用说明

### 保存自动格式化配置
vscode配置
```json
"eslint.autoFixOnSave": true,
"eslint.validate": [
    "javascript",
    "javascriptreact",
    {
        "language": "vue",
        "autoFix": true
    }
],
```
安装插件：
1. eslint
2. Beautify


### 安装
1. 下载项目代码
2. 执行**yarn**安装依赖
3. 修改**project.config.js**里的配置
4. 执行**yarn serve**运行项目
5. 执行**yarn compress**可压缩图片（需要配置tinypng的key），不要经常使用，不然次数很快就用完了，一般发布项目时再使用
6. 执行**yarn build**打包项目


### 生成页面
1. view（页面）
根目录下执行**yarn new view**
输入文件名和中文名（中文名百度统计用到），一路回车即可，文件生成在src/views目录下

    一行命令**yarn new view test 测试页面**

2. dialog（弹窗）
根目录下执行**yarn new view**
输入文件名和中文名（中文名百度统计用到），一路回车即可，文件生成在src/components/dialog/instances目录下

    一行命令**yarn new dialog test 测试弹窗页面**



### 页面写法（一定要看，涉及到自动生成路由！！！）
#### 基础路由
假设**views**的目录结构如下：
```
views/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```
那么，自动生成的路由配置如下：
```
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'views/index.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'views/user/index.vue'
    },
    {
      name: 'user-one',
      path: '/user/one',
      component: 'views/user/one.vue'
    }
  ]
}
```
#### 动态路由
定义带参数的动态路由，需要创建对应的以下划线作为前缀的 Vue 文件 或 目录。

以下目录结构：
```
views/
--| test/
-----| _t/
--------| a.vue
--------| index.vue
--| users/
-----| _id.vue
--| index.vue
```
生成对应的路由配置表为：
```
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'views/index.vue'
    },
    {
      name: 'users-id',
      path: '/users/:id',
      component: 'views/users/_id.vue'
    },
    {
      name: 'test-t',
      path: '/test/:t',
      component: 'views/test/_t/index.vue'
    },
    {
      name: 'test-t-a',
      path: '/test/:t/a',
      component: 'views/test/_t/a.vue'
    }
  ]
}
```
#### 嵌套路由
创建内嵌子路由，你需要添加一个 Vue 文件，同时添加一个与该文件同名的目录用来存放子视图组件。

假设文件结构如：
```
views/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```
自动生成的路由配置如下：
```
router: {
  routes: [
    {
      path: '/users',
      component: 'views/users.vue',
      children: [
        {
          path: '',
          component: 'views/users/index.vue',
          name: 'users'
        },
        {
          path: ':id',
          component: 'views/users/_id.vue',
          name: 'users-id'
        }
      ]
    }
  ]
}
```
#### 动态嵌套路由
这个应用场景比较少见，但是仍然支持：在动态路由下配置动态子路由。
假设文件结构如下：
```
views/
--| category/
-----| _subCategory/
--------| _id.vue
--------| index.vue
-----| _subCategory.vue
-----| index.vue
--| category.vue
--| index.vue
```
生成对应的路由配置表为：
```
router: {
  routes: [
    {
      path: '/',
      component: 'pages/index.vue',
      name: 'index'
    },
    {
      path: '/category',
      component: 'pages/category.vue',
      children: [
        {
          path: '',
          component: 'pages/category/index.vue',
          name: 'category'
        },
        {
          path: ':subCategory',
          component: 'pages/category/_subCategory.vue',
          children: [
            {
              path: '',
              component: 'pages/category/_subCategory/index.vue',
              name: 'category-subCategory'
            },
            {
              path: ':id',
              component: 'pages/category/_subCategory/_id.vue',
              name: 'category-subCategory-id'
            }
          ]
        }
      ]
    }
  ]
}
```