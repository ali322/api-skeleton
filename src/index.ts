import * as Koa from 'koa';
import router from './router'

const app = new Koa();

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Server running at port 3000');
});