const {resolve} = require('path')
const HtmlWeboackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//设置nodejs环境变量
process.env.NODE_ENV = 'development'
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
                    'css-loader',
                    /**
                     * css兼容性处理：postcss-->postcss-loader postcss-preset-env
                     * 
                     * 帮助postcss找到package.json中brewlist里面的配置，通过配置加载指定的css兼容性样式
                     * 
                     *  "browserslist":{
                     *      //开发环境-->设置node环境变量：process.env.NODE_ENV = development
                            "development":[
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                            ],
                            "production":[
                            ">0.2%",
                            "not dead",
                            "not_op_mini all"
                            ]
                        }
                     */
                    //使用loader的默认配置
                    //‘postcss-loader’
                    {
                        loader:'postcss-loader',
                        options:{
                            ident:'postcss',
                            plugins: () => [
                                //postcss的插件
                                require('postcss-preset-env')()
                            ]
                        }
                    }
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