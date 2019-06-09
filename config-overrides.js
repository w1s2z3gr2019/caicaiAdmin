// const {
//     injectBabelPlugin
// } = require('react-app-rewired')
// module.exports = function override(config, env) {
//     config = injectBabelPlugin(['import', {
//         libraryName: 'antd',
//         libraryDirectory: 'es',
//         style: 'css'
//     }], config);
//     return config;
// };

const {
    override,
    fixBabelImports,
    addLessLoader,
  } = require("customize-cra");
  
  
  module.exports = override(
    fixBabelImports("import", {
      libraryName: "antd", libraryDirectory: "es", style: true // change importing css to less
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#1DA57A" }
    })
  );