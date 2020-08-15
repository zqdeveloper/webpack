import '../css/iconfont.css'
import '../css/index.less'
import '../css/index.css'
import print from './print'

function add(x,y)
{
    return x+y;
}

console.log(add(1,5));

if(module.hot) {
    //一旦modeule.hot为true,说明了开启了HMR功能.-->让HMR功能代码生效
    module.hot.accept('./print.js',function(){
        //方法会监听print.js文件的变化，一旦发生变化，其它默认不会重新打包构建。
        //会执行后面的回调函数
        print();
    })
}