import Koa from 'koa';
import Router from '@koa/router';
import * as bodyParser from 'koa-bodyparser';
import * as dotenv from 'dotenv';
import { ListingController } from './controllers/ListingController';

dotenv.config();

const app = new Koa();
const router = new Router();

const listingController = new ListingController();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    console.error('SERVER ERROR:', err);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || 'Internal Server Error' };
    ctx.type = 'application/json';
  }
});

// @ts-ignore
app.use(bodyParser.default ? bodyParser.default({ jsonLimit: '10mb' }) : bodyParser({ jsonLimit: '10mb' }));

router.post('/listings/generate', async (ctx) => {
  await listingController.generate(ctx);
});
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
