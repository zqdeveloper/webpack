# 1.打包样式资源
1. loader名称: css-loader和style-loader、less、less-loader
2. 安装方式:  ```npm i css-loader  style-loader less less-loader -D```
3. 配置方式:
  ```
{
    //匹配哪些文件
    test:/\.css$/,
    //使用哪些loader进行处理
    use:[
        //use数组中loader执行顺序，从右到左 从下到上 依次执行
        //创建style标签将js中的样式资源插入进去，添加到head中生效
        'style-loader',
        //将css文件一字符串的形式变成一个commonjs模块加载到js中，里面内容是样式字符串
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
```

# 2. 打包HTML资源
1. 插件名称:html-webpack-plugin
2. 安装命令:  ```npm i html-webpack-plugin -D```
3. 插件引入:
```const HtmlWebpackPlugin = require('html-webpack-plugin')```
4. 插件配置:
```
  new HtmlWebpackPlugin({
      //复制‘./src/index.html’文件，并自动引入打包输出的所有资源
      template:'./src/index.html'
  }),
```

# 3. 打包图片资源
1. 处理图片
1.1 loader:    url-loader和file-loader
1.2 安装命令:   ```npm i url-loader  file-loader -D```
1.2 配置方式:
```
{
     test:/\.(jpg|png|gif)$/,
     //下载url-loader file-loader
     loader: 'url-loader',
     options:{
         //图片大小小于8kb，就会被base64处理
         //优点：减少请求数量（减轻服务器压力）
         //缺点: 图片体积会更大，（文件请求速度更慢）
         limit:8*1024,
         //问题:因为url-loader默认使用es6模块化解析,而html-loader引入图片是commonjs
         //解析时会出问题:[object module]
         //解决:关闭url-loader的es6模块化，使用commonjs解析
         esModel:false,
         //[hash:10]取图片的hash的前10位
         //ext:取文件原来的扩展名
         name:'[hash:10].[ext]'
     }
},
  ```
2. 处理html中的img引用的图片资源
2.1 loader名称：html-loader
2.2 安装命令: ```npm i html-loader -D```
2.2 配置方式:
```
{
    test:/\.html$/,
    //处理html文件的img图片（负责引入img,从而能被url-loader进行处理）
    loader:'html-loader'
}
```
# 4.打包其它资源
1. loader名称: file-loader
2. 安装命令: ```npm i file-loader -D```
2. 配置方式:
```
{
   //打包其它资源（除了html/js/css资源以外的资源）
   exclude:/\.(css|js|html)$/,
   loader:'file-loader',
   options:{
       name:'[hash:4].[ext]'
   }
}
```

# 5. DevServer
1. 插件： webpack-dev-server
2. 安装命令: ```npm i webpack-dev-server -D```
1. 配置方式:
```
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
```

# 6. 开发环境配置:
```
const {resolve} = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
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
        open:true
    }
}
```

# 7. 提取css成单独文件
1. 插件名成:  mini-css-extract-plugin
2. 安装命令: ```npm i mini-css-extract-plugin```
2. 插件引入： const MiniCssExtractPlugin = require('mini-css-extract-plugin')
3. 插件配置:
```
 new MiniCssExtractPlugin({
    //打包名称和路径
    filename:'css/built.css'
}),
```
4. 同时修改loader中的style为MiniCssExtractPlugin的loader,如下:
```
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
    ]
},
```

# 8. css兼容性处理
1. loader名称: postcss-loader
2. 安装命令: ```npm i postcss-loader -D```
2. 需要结合css loader一起使用
3. 配置方式:
```
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
```
4. 同时需要在packages.json中增加的配置如下:
```
 "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
```
5. 要使其在开发环境中生效，需要设置node环境为developement,在webpack.config.js中设置：
```
  process.env.NODE_ENV = 'development'
```

# 9. 压缩css
1. 所用的插件: optimize-css-assets-webpack-plugin
2. 安装命令:  ```npm i  optimize-css-assets-webpack-plugin -D```
3. 插件引入：  const OptimizeCssAssetsWebpaclPlugin  = require('optimize-css-assets-webpack-plugin')
4. 配置方式::
```
  new OptimizeCssAssetsWebpaclPlugin()
```

# 10. js语法检查
1. 插件名称: eslint-loader、eslint 、eslint-config-airbnb-base 、 eslint-plugin-import
2. 安装命令: ``npm i eslint eslint-loader eslint-config-airbnb-base eslint-plugin-import -D``
3. 配置：
3.1 规则中使用:
```
 /**
  * 语法检查： eslint-loader ,eslint-loader依赖eslint
  *  注意：只检查自己写的源代码，第三库是不用检查的
  *  设置检查规则： 
  *   package.json中eslintConfig中配置
  *       airbnb --> eslint-config-airbnb-base eseslint-plugin-import
  */
 {
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,//排除node_modules
      options: {
          fix: true
      }
 }
```
3.2 在package.json中增加:
```
"eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    }
  }
```

# 11.js 兼容性处理
1. 所用的loader: babel-loader @babel/preset-env @babel/core
2. 安装命令: ```npm i babel-loader @babel/preset-env @babel/core -D```
3. 配置:
```
/**
 * js兼容性处理: babel-loader @babel/preset-env @babel/core
 *      1. 基本js兼容性处理---> @bebel/preset-env
 *             问题: 只能转换基本语法，如promise不能转换
 *      2. 全部js兼容性处理--> @babel/polyfill
 */
{
    test:/\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
        //预设 ：babel做怎么样的兼容性处理
        presets: ['@babel/preset-env']
    }
}
```
4. @babel/polyfill 的使用
5. 下载: ``` npm i @babel/polyfill -D ```
6. 引用： 在入口js源代码里面使用import 引入:
``` import '@babel/polyfill'  ```
问题： 我只需要解决部分兼容性问题，但是会把所有的兼容性处理全部引入，体积太大
7. 按需加载 需要做兼容性处理的就做: 按需加载 ---> core-js
7.1 安装：```npm i core-js -D```
7.2 配置:
```
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
```

# 12.js压缩
只需要把mode修改为production即可

# 13.html压缩
使用HtmlWebpackPlugin即可，如下:
```
new HtmlWebpackPlugin({
    template: './src/index.html',
    minify:{
      //移出空格
      collapseWhitespace: true,
      //移除注释
      removeComments: true
    }
})
```

# 14. 生产环境配置
```
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
                exclude: /node_modules/,
                loader: 'eslint-loader',
                //优先执行
                enforce:'pre',
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
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
```

# 15. 开发环境优化
```

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
```

# 16.source-map
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

# 17. oneof
在roles种使用oneof,需要注意事项: 
* 一下loader只会匹配一个
* 注意:不能让两个loader处理同一种类型的文件
* 正常来讲，一个文件只能被一个loader处理；
* 当一个文件要被多个loader处理，那么一定要指定loader的执行先后顺序；
* 先执行eslint再执行babel
代码如下：
```
rules:[
     {
         //在package.json中来添加eslintConfig --> airbnb
         test:/\.js$/,
         exclude: /node_modules/,
         loader: 'eslint-loader',
         //优先执行
         enforce:'pre',
         options: {
             fix: true
         }
     },
     {
         //一下loader只会匹配一个
         //注意:不能让两个loader处理同一种类型的文件
         oneof: [
             {
                 test:/\.css$/,
                 use: [...commonCssLoader]
             },
             {
                 test: /\.less$/,
                 use: [...commonCssLoader,'less-loader']
             },
             //正常来讲，一个文件只能被一个loader处理；
        /当一个文件要被多个loader处理，那么一定要指定loa  行先后顺序；
             // 先执行eslint再执行babel
             {
                 test: /\.js$/,
                 exclude: /node_modules/,
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
                /使用来html-loader一定要关闭url-loader的e l
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
     }
]
```

# 18.缓存
1. 在babel-loader中开启缓存
```
{
    test: /\.js$/,
    exclude: /node_modules/,
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
        ],
        //开启babel缓存
        //第二次构建时，会读取之前的缓存
        cacheDirectory: true
    }
},
```

2. 文件缓存
3. 