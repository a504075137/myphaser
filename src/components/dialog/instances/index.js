import {
    requireAll
} from '@utils/func.js';

const dialogs = requireAll(require.context('./', true, /^((?!Base).)*\.vue$/))
    .reduce((acm, item) => {
        const Module = item.data;
        const options = Module.default;
        const name = item.path.slice(2).replace('/', '-').slice(0, -4);
        options.inheritAttrs = options.inheritAttrs || false;
        acm[name] = options;
        return acm;
    }, {});

export default dialogs;