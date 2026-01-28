import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import * as dotenv from 'dotenv';
import { createListingController } from './controllers/ListingController';

dotenv.config();

const app = new Koa();
const router = new Router({ prefix: '/listings' });

const listingController = createListingController();

// Logger middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`Incoming request: ${ctx.method} ${ctx.url}`);
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      console.log(`404 at ${ctx.url} - no route matched`);
    }
  } catch (err: any) {
    console.error('SERVER ERROR:', err);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || 'Internal Server Error' };
    ctx.type = 'application/json';
  }
});

app.use(bodyParser({ jsonLimit: '50mb' }));

router.post('/generate', async (ctx) => {
  await listingController.generate(ctx);
});

router.get('/health', async (ctx) => {
  ctx.status = 200;
  ctx.body = { status: 'ok' };
});

router.post('/system-prompt', async (ctx) => {
  await listingController.getPromptPreview(ctx);
});

router.get('/templates', async (ctx) => {
  await listingController.getTemplates(ctx);
});

router.post('/templates', async (ctx) => {
  await listingController.saveTemplate(ctx);
});

// Add a GET handler just in case, returning a helpful message or redirecting
router.get('/system-prompt', async (ctx) => {
  ctx.status = 405;
  ctx.body = { error: 'Method Not Allowed. Use POST instead.' };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Catch-all for debugging 404s
app.use(async (ctx) => {
  if (ctx.status === 404) {
    console.log(`Final 404 Catch-all: ${ctx.method} ${ctx.url}`);
    ctx.body = { error: `Not Found: ${ctx.method} ${ctx.url}` };
  }
});

export default app;
