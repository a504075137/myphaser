import Vue from 'vue';
import Router from 'vue-router';
import { requireAll } from '@utils/func';

const routers = [];
const dict = {};

// 生成字典树
const pushToDict = (root, kList, data)=> {
    const key = kList.shift();
    if (!root.hasOwnProperty(key)) {
        root[key] = {
            routeName: key
        };
    }
    if (kList.length === 0) {
        root[key].routeData = data;
    } else {
        pushToDict(root[key], kList, data);
    }
};

requireAll(require.context('./views', true, /.+\.vue$/))
    .forEach(item=> {
        let pathName = item.path.split('.')[1].split('/');
        pushToDict(dict, pathName.slice(1), item.data.default);
    });

// 字典树转路由
const getRouter = (root, list, name, path)=> {
    let pName = root.routeName;
    if (pName.indexOf('_') === 0) {
        pName = ':' + pName.slice(1);
    }
    if (name.indexOf(':') === 0) {
        name = name.slice(1);
    }
    let routeName = root.routeName;
    let component = root.routeData;
    delete root.routeName;
    delete root.routeData;
    let route = {};
    let useDir = true;
    if (!component && root.index) {
        component = root.index.routeData;
        delete root.index;
    }
    if (component) {
        useDir = false;
        if (routeName === 'index') {
            name += (name === '' ? '' : '-') + routeName;
        } else if(routeName.indexOf('_') === 0) {
            name += (name === '' ? '' : '-') + routeName.slice(1);
            path += ((path === '' || path === '/') ? ':' : '/:') + routeName.slice(1);
        } else {
            name += (name === '' ? '' : '-') + routeName;
            path += ((path === '' || path === '/') ? '' : '/') + routeName;
        }
        const meta = {
            cn: name,
        };
        Object.assign(meta, component.meta);
        route = {
            name,
            path,
            children: [],
            meta,
            component
        };
        list.push(route);
    }
    for(let key in root) {
        getRouter(root[key], useDir ? list : route.children, useDir ? pName : name, useDir ? `/${pName}` : '');
        if (route.children && route.children.length > 0) {
            delete route.name;
        } else {
            delete route.children;
        }
    }
    if (route.children && route.children.length > 0) {
        delete route.name;
    } else {
        delete route.children;
    }
    return list;
};
// console.log(dict);
for (let key in dict) {
    routers.push(...getRouter(dict[key], [], '', '/'));
}
console.log(routers);

Vue.use(Router);

const router = new Router({routes: [...routers]});

router.beforeEach((to, from, next) => {
    let config = {};
    if (window.baidu) {
        from.name && window.baidu('page', `leave_${from.name}`, `离开${from.meta.cn}`);
        to.name && window.baidu('page', `enter_${to.name}`, `进入${to.meta.cn}`);
    }
    if (!Vue.$bus.ready && to.path !== '/' && !to.meta.noload) {
        config = {
            path: '/',
            replace: true
        };
    }
    next(config);
});

export default router;