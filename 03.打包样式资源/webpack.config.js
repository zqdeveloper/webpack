/**
 webpack.config.js webpack的配置文件
  作用：指示webpack干哪些活（当你运行webpack指令时，会加载里面的配置）

  所有的构建工具都是基于nodejs平台运行的～模块化默认采用commonjs
 */
//resolve采用用来拼接绝对路径的方法
const {resolve} = require('path');

 module.exports = {
    //webpack配置
    //入口起点
    entry:'./src/index.js',
    //输出
    output:{
        //输出文件名
        filename:'built.js',
        path: resolve(__dirname,'build'),
    },
    //loader的配置
    module:{
         //详细的loader的配置
        rules:[
            {
                //匹配哪些文件
                test:/\.css$/,
                //使用哪些loader进行处理
                use:[
                    //use数组中loader执行顺序，从右到左 从上到下 依次执行
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
                    //将less文件编译成css文件
                    //需要下载less-loader和less
                    'less-loader',
                ]
            }
        ]
    },
    //Plugins的配置
    plugins:[
        //详细
    ],
    mode:'development',
    //mode:'production',
 }