import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import * as path from 'path';
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

app.use(serve(path.join(process.cwd(), 'src', 'assets')));
app.use(serve(path.join(process.cwd(), 'assets')));

router.post('/generate', async (ctx) => {
  await listingController.generate(ctx);
});

router.post('/generate/single', async (ctx) => {
  await listingController.generateSingle(ctx);
});

router.get('/health', async (ctx) => {
  ctx.status = 200;
  ctx.body = { status: 'ok' };
});

router.post('/system-prompt', async (ctx) => {
  await listingController.getPromptPreview(ctx);
});

router.get('/prompt-versions', async (ctx) => {
  await listingController.getPromptVersions(ctx);
});

router.get('/edit-prompt-versions', async (ctx) => {
  await listingController.getEditPromptVersions(ctx);
});

router.post('/edit-prompt-versions', async (ctx) => {
  await listingController.saveEditPromptVersion(ctx);
});

router.delete('/edit-prompt-versions/:name', async (ctx) => {
  await listingController.removeEditPromptVersion(ctx);
});

router.get('/templates', async (ctx) => {
  await listingController.getTemplates(ctx);
});

router.post('/templates', async (ctx) => {
  await listingController.saveTemplate(ctx);
});

router.delete('/templates/:name', async (ctx) => {
  await listingController.removeTemplate(ctx);
});

router.delete('/images', async (ctx) => {
  await listingController.deleteImage(ctx);
});

router.post('/archive', async (ctx) => {
  await listingController.archive(ctx);
});

router.post('/save-image', async (ctx) => {
  await listingController.saveGeneratedImage(ctx);
});

router.get('/archived-uploads', async (ctx) => {
  await listingController.getArchivedUploads(ctx);
});

router.get('/shop-id', async (ctx) => {
  await listingController.getShopId(ctx);
});

router.post('/push-to-etsy', async (ctx) => {
  await listingController.publish(ctx);
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
