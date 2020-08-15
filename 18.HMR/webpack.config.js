
/**
 * HMR: hot module replacement 热模块替换/模块热替换
 *  作用： 一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块）
 *      极大提升构建速度
 *      
 *      样式文件 ：可以使用HMR功能：因为style-loader内部实现了～
 *      js文件：默认没有HMR功能--->需要修改js代码，添加支持HMR功能的代码
 *             注意:HMR功能对js的处理，只能处理非入口js文件的其它文件
 *      HTML文件: 默认也不能使用HMR功能，同时导致HTML不能热更新了～（不用做HMR功能）
 *              解决: 修改entry入口，入口html也引入
 */
const {resolve} = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: ['./src/js/index.js','./src/index.html'],
    output:{
        filename:'js/built.js',
        path:resolve(__dirname,'build'),
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test:/\.(gif|png|jpg)$/,
                loader:'url-loader',
                options:{
                    limit:8*1024,
                    esModel:false,
                    name:'[hash:10].[ext]',
                    outputPath:"imgs"
                }
            },
            {
                test:/\.html$/,
                loader:'html-loader'
            },
            {
                exclude:/\.(less|gif|png|jpg|html|css|js)$/,
                loader:'file-loader',
                options:{
                    name:'[hash:10].[ext]',
                    outputPath:"media"
                }
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
            template:'./src/index.html',
        })
    ],
    mode:'development',
    devServer:{
        contentBase:resolve(__dirname,'build'),
        compress:true,
        port:3000,
        open:true,
        //开启HMR功能
        //当修改了webpack配置，新配置要想生效，必须要重启webpack服务
        hot: true
    }
}