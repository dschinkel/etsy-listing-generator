import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { ListingController } from './controllers/ListingController';

const app = new Koa();
const router = new Router();

const listingController = new ListingController();

router.post('/listings/generate', (ctx) => listingController.generate(ctx));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
