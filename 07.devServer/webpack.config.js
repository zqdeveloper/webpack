const {resolve} = require('path')

const HtmlWebPackPlugin = require('html-webpack-plugin') 

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'built.js',
        path:resolve(__dirname,'build')
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
                    'less-loader'
                ]
            },
            {
                test:/\.html$/,
                loader:'html-loader'
            },
            {
                test:/\.(gif|png|jpg)$/,
                loader:'url-loader',
                options:{
                    limit:8*1024,
                    esModel:false,
                    name:'[hash:10].[ext]'
                }
            },
            {
                //打包其它资源（除了html/js/css资源以外的资源）
                exclude:/\.(css|js|html|less|gif|png|jpg)$/,
                loader:'file-loader',
                options:{
                    name:'[hash:10].[ext]'
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
    //开发服务器devServer:用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    //特点:只会在内存中编译打包，不会有任何输出
    //启动devServer指令为:npx webpack-dev-server
    devServer:{
        //项目路径
        contentBase:resolve(__dirname,'build'),
        //启动gzip压缩
        compress:true,
        //端口号
        port:3000,
        //自动打开浏览器
        open:true,
    }
}