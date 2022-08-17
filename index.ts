import { Application, Router } from 'https://deno.land/x/oak@v10.6.0/mod.ts';

const categories = [
  { id: 1, name: 'Deno' },
  { id: 2, name: 'Oak' },
  { id: 3, name: 'Deno + Oak' },
];

const router = new Router();

router.get('/', (ctx) => {
  ctx.response.body = categories;
});

router.post('/', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;

  if (!body.name || typeof body.name !== 'string' || body.name.length < 3) {
    ctx.response.status = 400;
    ctx.response.body = 'Invalid name';
    return;
  }

  const newCategory = {
    id: categories.length + 1,
    name: body.name,
  };

  categories.push(newCategory);

  ctx.response.body = newCategory;
});

router.get('/:id', (ctx) => {
  const id = ctx.params.id;

  if (isNaN(parseInt(id))) {
    ctx.response.status = 400;
    ctx.response.body = 'Param should be a number';
    return;
  }

  const category = categories.find((c) => c.id === parseInt(id));

  if (!category) {
    ctx.response.status = 404;
    ctx.response.body = 'Category not found';
    return;
  }

  ctx.response.body = category;
});

router.put('/:id', async (ctx) => {
  const id = ctx.params.id;

  if (isNaN(parseInt(id))) {
    ctx.response.status = 400;
    ctx.response.body = 'Param should be a number';
    return;
  }

  const category = categories.find((c) => c.id === parseInt(id));

  if (!category) {
    ctx.response.status = 404;
    ctx.response.body = 'Category not found';
    return;
  }

  const body = await ctx.request.body({ type: 'json' }).value;

  if (!body.name || typeof body.name !== 'string' || body.name.length < 3) {
    ctx.response.status = 400;
    ctx.response.body = 'Invalid name';
    return;
  }

  category.name = body.name;

  ctx.response.body = category;
});

router.delete('/:id', (ctx) => {
  const id = ctx.params.id;

  if (isNaN(parseInt(id))) {
    ctx.response.status = 400;
    ctx.response.body = 'Param should be a number';
    return;
  }

  const category = categories.find((c) => c.id === parseInt(id));

  if (!category) {
    ctx.response.status = 404;
    ctx.response.body = 'Category not found';
    return;
  }

  const categoryIndex = categories.indexOf(category);
  categories.splice(categoryIndex, 1);

  ctx.response.body = category;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
