const {resolve} = require('path')
const HtmlWeboackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry:'./src/js/index.js',
    output:{
        filename:'js/built.js',
        path:resolve(__dirname,'build'),
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    //'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.less$/,
                use:[
                    //'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/\.(gif|png|jpg)$/,
                loader:'url-loader',
                options:{
                    limit:8*1024,
                    esMode:false,
                    name:'[hash:10].[ext]',
                    outputPath:"imgs"
                }
            },
            {
                test:/\.html$/,
                loader:'html-loader',
            },
            {
                exclude:/\.(html|css|less|js|gif|jpg|png)$/,
                loader:'file-loader',
                options:{
                    name:'[hash:10].[ext]',
                    outputPath:"media"
                }
            }
        ]
    },
    plugins:[
        new HtmlWeboackPlugin({
            template:'./src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename:'css/built.css'
        }),
    ],
    mode:'development',
    devServer:{
        contentBase:resolve(__dirname,'build'),
        compress:true,
        open:true,
        port:3000
    }
}