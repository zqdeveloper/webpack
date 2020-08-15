
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
    },
    devtool: 'source-map'
}

/*
    source-map: 一种提供源代码到构建后代码映射技术（如构建后代码出错了，通过映射关系可以追踪源代码的错误）
    [inline-|hidden-|eval-][nosources-][cheap-[module-]]souce-map

    inline-source-map: 内联
        只生成一个内联source-map
        错误代码准确信息和源代码准确位置

    hidden-source-map: 外部
        能够提示到错误的错误原因，但是没有错误位置，不能追踪到源代码的错误，只能提示到构建后代码的错误位置

    eval-source-map: 内联，
        每一个文件都生成对应的source-map,都在eval
        错误代码准确信息和源代码准确位置
        多了一个hash值

    nosources-source-map: 外部
        能够提示到错误的错误原因，但是没有任何源代码信息

    cheap-source-map: 外部
        错误代码准确信息和源代码准确位置，但是错误位置只精确到行，不精确到列

    cheap-module-source-map: 外部
        错误代码准确信息和源代码准确位置，但是错误位置只精确到行，不精确到列
        会将loader和source map加入

    source-map：外部
        错误代码准确信息和源代码准确位置

    内联和外部的区别：1.外部生成了文件，内联是没有的；2.内联构建速度更快

    开发环境：速度快，调试更友好
        速度快(eval>inline>cheap>...)
            eval-cheap-source-map
            eval-source-map
        调试更友好
            source-map
            cheap-module-source-map
            cheap-source-map
        
            -->eval-source-map /eval-cheap-module-sourcemap
    生产环境：源代码要不要隐藏？调试要不要更友好
        内联会让代码体积非常大，所以再生产环境不用内联
        nosources-source-map 全部隐藏
        hidden-source-map   只隐藏源代码，会提示构建后代码错误

        -->source-map /cheap-module-source-map
 */