// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 注意require('koa-router')返回的是函数
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(bodyParser()); // 因为中间件有顺序要求，所以解析post请求的body中间件注册应该在前面

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`)
    await next();
});

// add url-route:
// 我们使用router.get('url 可以带变量', async fn) 来注册一个请求
router.get('/hello/:name', async (ctx, next) => { 
    var name = ctx.params.name; // 获取URL上的变量
    ctx.response.body = `<h1>hello, ${name}</h1>`;
});

router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
    <form action='/signin' method='post'>
        <p>name:<input name='name' value='koa'></p>
        <p>password:<input name='password' type='password'></p>
        <p><button type='submit'>submit</button></p>
    </form>`;
});

// 注册post请求, post
router.post('/signin', async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name},password:${password}!`);
    if(name === 'koa' && password === '12345'){
        ctx.response.body = `<h1>welcome, ${name}</h1>`;
    } else {
        ctx.response.body = `<h1>signin failed!</h1>
        <p><a href='/'>Try again!</a></p>`;
    }
})

app.use(router.routes());  // 注册中间件

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');