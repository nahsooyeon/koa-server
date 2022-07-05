import Koa, { Context, Next } from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

/* app.env default:process.NODE_ENV || 'development' */

/* proxy */
app.proxy = true;

/* set cookie keys */
app.keys = ['keygrip type string'];

/* CONTEXT:  */

/* middleware 사용할 때는 app.use(middleware) */

/* app.context 는 ctx의 프로토타입이다. 원하는 메서드나 프로퍼티를 추가하고 싶을 때 유용하다. */
/* Koa context 는 웹 어플리케이션과 API 를 쓰는데 도움이 되는 많은 매서드들을 제공하는 단일 객체에 노드의 요청과 응답을 캡슐화한다. */

app.use(async (ctx: Context, next: Next) => {
  /* ctx: Context 인스턴스 */
  /* ctx.req : node 요청객체 ctx.res : node 응답 객체 */
  /* ctx.request: koa 요청 객체 ctx.response:Koa의 응답 객체 */
  await next();
  const rt = ctx.response.get('X-Reponse-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);

  /* koa의 응답처리 우회는 지원되지 않는다. 다음 노드 속성은 사용하지 않도록 한다. */
  /* 
    res.statusCode
    res.writeHead()
    res.write()
    res.end() */
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

/*  response  */

router.get('/', (ctx, next) => {
  ctx.body = '홈';
});

router.get('/about', (ctx, next) => {
  ctx.body = '소개';
});

router.get('/about/:name', (ctx, next) => {
  const { name } = ctx.params; // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.params 안에 설정됩니다.
  ctx.body = name + '의 소개';
});

/* router 적용 */
app.use(router.routes());
app.use(router.allowedMethods());

/* 에러 핸들링 */
/* 커스텀 에러 핸들링 로직을 실행하기 위해서, 'error'라는 이벤트 리스너를 추가할 수 있다. */
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
  /* 에러가 req/res 주기 안에 있고 클라이언트에 응답하는 것이 불가능하다면, context 인스턴스 또한 전달된다.. */
});
/* 에러 핸들링을 하고싶지 않다면 app.silent = true 로 설정한다. */

/* 에러가 발생했지만 여전히 클라이언트에 응답하는 것이 가능하다면, koa 는 500 Internal Server Error 500 으로 응답할 것이다. */

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
