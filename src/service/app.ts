import Koa from 'koa';
import Router from '@koa/router';
import * as bodyParser from 'koa-bodyparser';
import { ListingController } from './controllers/ListingController';

const app = new Koa();
const router = new Router();

const listingController = new ListingController();

router.post('/listings/generate', async (ctx) => {
  try {
    await listingController.generate(ctx);
  } catch (error: any) {
    console.error('Error in /listings/generate:', error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// @ts-ignore
app.use(bodyParser.default ? bodyParser.default() : bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
