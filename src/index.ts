import Koa from "koa";

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hellow World";
});

app.listen(3000);