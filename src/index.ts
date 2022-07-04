import Koa, { Context, Next } from 'koa';

const app = new Koa();

/* app.env default:process.NODE_ENV || 'development' */

/* proxy */
app.proxy = true;

/* set cookie keys */
app.keys = ['keygrip type string'];

/* CONTEXT:  */

app.use(async (ctx: Context, next: Next) => {
  await next();
  const rt = ctx.response.get('X-Reponse-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
