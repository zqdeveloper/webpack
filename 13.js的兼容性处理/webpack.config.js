const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname,'build'),
    },
    module:{
        rules:[
            /**
             * js兼容性处理: babel-loader @babel/preset-env @babel/core
             *      1. 基本js兼容性处理---> @bebel/preset-env
             *             问题: 只能转换基本语法，如promise不能转换
             *      2. 全部js兼容性处理--> @babel/polyfill
             *              问题: 只需要解决部分兼容行性问题，但是将所有的兼容性代码全部引入，体积太大了
             *      3. 需要做兼容性处理的就做: 按需加载 ---> core-js
             */
            {
                test:/\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    //预设 ：babel做怎么样的兼容性处理
                    // 预设：指示babel做怎么样的兼容性处理
                    presets: [
                      [
                        '@babel/preset-env',
                        {
                          // 按需加载
                          useBuiltIns: 'usage',
                          // 指定core-js版本
                          corejs: {
                            version: 3
                          },
                          // 指定兼容性做到哪个版本浏览器
                          targets: {
                            chrome: '60',
                            firefox: '60',
                            ie: '9',
                            safari: '10',
                            edge: '17'
                          }
                        }
                      ]
                    ]
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'development'
}