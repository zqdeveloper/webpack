const {resolve} = require('path')

const HtmlWebPackPlugin =  require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpaclPlugin  = require('optimize-css-assets-webpack-plugin')
//定义nodejs的环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'development';
//复用loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-lodaer',
    {
        //还需要在package.json中定义browserslist
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: () => [
                require('postcss-preset-env')()
            ]
        }
    }
]
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname,'build')
    },
    module: {
        rules:[
            {
                test:/\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.less$/,
                use: [...commonCssLoader,'less-loader']
            },
            //正常来讲，一个文件只能被一个loader处理；
            //当一个文件要被多个loader处理，那么一定要指定loader的执行先后顺序；
            // 先执行eslint再执行babel
            {
                //在package.json中来添加eslintConfig --> airbnb
                test:/\.js$/,
                exclude: '/node_modules',
                loader: 'eslint-loader',
                //优先执行
                enforce:'pre',
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                loader: 'babel-loader',
                options: {
                    presets:[
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns:'usage',
                                corejs: {version:3},
                                targets: {
                                    chrome: '60',
                                    firefox: '50'
                                }
                            }

                        ]
                    ]
                }
            },
            {
                test:/\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8*1024,
                    //使用来html-loader一定要关闭url-loader的esModel
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                exclude:/\.(js|css|less|html|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename:'css/built.css'
        }),
        new OptimizeCssAssetsWebpaclPlugin()
    ],
    mode: 'production'
}