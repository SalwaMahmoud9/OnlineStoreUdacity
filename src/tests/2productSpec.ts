import supertest from 'supertest';
import app from '../server';
import { Product, ProductStore } from '../models/product';

const request = supertest(app);
const store = new ProductStore();

describe('Store Test Product Functions exist', () => {
  it('index defined', () => {
    expect(store.index).toBeDefined();
  });
  it('show defined', () => {
    expect(store.show).toBeDefined();
  });
  it('create defined', () => {
    expect(store.create).toBeDefined();
  });
  it('delete defined', () => {
    expect(store.delete).toBeDefined();
  });

  it('update defined', () => {
    expect(store.update).toBeDefined();
  });
});

describe('Store Test Product Functions work', () => {
  const firstRow: Product = {
    id: 1,
    name: 'item1',
    price: 100,
    category: 'inventory'
  };
  it('create to add product', async () => {
    const result = await store.create({
      name: 'item1',
      price: 100,
      category: 'inventory'
    });
    expect(result.id).toEqual(firstRow.id);
    expect(result.name).toEqual(firstRow.name);
    expect(String(result.price)).toEqual(String(firstRow.price));
    expect(result.category).toEqual(firstRow.category);
  });

  it('get all products', async () => {
    const result = await store.index();
    expect(result[0].id).toEqual(firstRow.id);
    expect(result[0].name).toEqual(firstRow.name);
    expect(String(result[0].price)).toEqual(String(firstRow.price));
    expect(result[0].category).toEqual(firstRow.category);
  });

  it('get product by id', async () => {
    const result = await store.show(1);
    expect(result.id).toEqual(firstRow.id);
    expect(result.name).toEqual(firstRow.name);
    expect(String(result.price)).toEqual(String(firstRow.price));
    expect(result.category).toEqual(firstRow.category);
  });

  it('update product', async () => {
    const result = await store.update({
      id: 1,
      name: 'item1Update',
      price: 200,
      category: 'service'
    });
    expect(result.id).toEqual(firstRow.id);
    expect(result.name).toEqual('item1Update');
    expect(String(result.price)).toEqual('200');
    expect(result.category).toEqual('service');
  });
  it('delete product by id', async () => {
    const result = await store.delete(2);
    expect(result).toEqual(0);
  });
});

describe('Test product endpoints responses', () => {
  let token: string;

  it('select all products', async () => {
    const tokenResponse = await request.post('/users/login').send({
      id: 1,
      username: 'admin',
      password: '12345',
      role: 'admin'
    });
    token = 'base ' + tokenResponse.body;
    const response = await request.get('/products').set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('select one product', async () => {
    const response = await request
      .get('/products/1')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('insert new product', async () => {
    const response = await request
      .post('/products')
      .send({ name: 'item2', price: 200, category: 'inventory' })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('update product', async () => {
    const response = await request
      .patch('/products/2')
      .send({ name: 'item2update', price: 250, category: 'service' })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('delete product', async () => {
    const response = await request
      .delete('/products/2')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(204);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
});
