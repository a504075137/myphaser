const {notEmpty} = require('../util.js');

module.exports = {
    description: 'generate a view',
    prompts: [{
        type: 'input',
        name: 'name',
        message: '弹窗文件名',
        validate: notEmpty('name')
    },
    {
        type: 'input',
        name: 'cn',
        message: '弹窗中文名',
        validate: notEmpty('cn')
    }],
    actions: (data) => {
        const name = '{{name}}';
        const cn = '{{cn}}';
        const actions = [
            {
                type: 'add',
                path: `src/components/dialog/instances/${name}.vue`,
                templateFile: 'scripts/plop-templates/dialog/index.hbs',
                data: {
                    name,
                    cn
                }
            }
        ];

        return actions;
    }
};