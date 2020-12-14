const { basename } = require('path');

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
            plugins: [
                {removeDoctype: true},
                {removeComments: true},
                {cleanupIDs: false},
                {collapseGroups: false},
                {removeEmptyContainers: true},
                { prefixIds: {
                  prefix: (node, { path }) => basename(path, '.svg'),
                  delim: '-',
                }, }
            ],
        },
      });
    },
};