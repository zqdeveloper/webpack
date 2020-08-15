const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname,'build'),
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify:{
              //移出空格
              collapseWhitespace: true,
              //移除注释
              removeComments: true
            }
        })
    ],
    // 
    mode: 'development'
}