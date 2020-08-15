//import '@babel/polyfill'

function add(x, y) {
  return x + y;
}
console.log(add(4, 5));

const add2 = (x ,y) => x + y;

const promise = new Promise(resolve =>{
  setTimeout(()=>{
    console.log("定时器执行完了~");
    resolve();
  },1000);
})
