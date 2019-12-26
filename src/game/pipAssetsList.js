export default [
    // {
    //     key: 'fish0',
    //     type: 'img',
    //     url: require('@pip/fish1.png')
    // },
    // {
    //     key: 'fish1',
    //     type: 'img',
    //     url: require('@pip/fish2.png')
    // },
    {
        key: 'box',
        type: 'img',
        url: require('@pip/box.png')
    },
    {
        key: 'fish',
        type: 'group',
        children: [
            {
                key: 'fish0',
                type: 'img',
                url: require('@pip/fish1.png')
            },
            {
                key: 'fish1',
                type: 'img',
                url: require('@pip/fish2.png')
            },

        ]
    },

    //
];