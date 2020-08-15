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
                test:/\.(git|png|jpg)$/,
                loader:'url-loader',
                options:{
                    limit:8*1024,
                    esModel:false,
                    name:'[hash:10].[ext]'
                }
            },
            {
                //打包其它资源（除了html/js/css资源以外的资源）
                exclude:/\.(css|js|html)$/,
                loader:'file-loader',
                options:{
                    name:'[hash:4].[ext]'
                }
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
            template:'./src/index.html',
        })
    ],
    mode:'development'
}