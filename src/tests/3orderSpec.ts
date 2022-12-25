import supertest from 'supertest';
import app from '../server';
import { Order, OrderStore } from '../models/order';

const request = supertest(app);
const store = new OrderStore();

describe('Store Test Order Functions exist', () => {
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

describe('Store Test Order Functions work', () => {
  const firstRow: Order = {
    id: 1,
    status: 'active',
    user_id: 1
  };
  it('create to add order', async () => {
    const result = await store.create({ status: 'active', user_id: 1 });
    expect(result.id).toEqual(firstRow.id);
    expect(result.status).toEqual(firstRow.status);
    expect(String(result.user_id)).toEqual(String(firstRow.user_id));
  });

  it('get all orders', async () => {
    const result = await store.index();
    expect(result[0].id).toEqual(firstRow.id);
    expect(result[0].status).toEqual(firstRow.status);
    expect(String(result[0].user_id)).toEqual(String(firstRow.user_id));
  });

  it('get order by id', async () => {
    const result = await store.show(1);
    expect(result.id).toEqual(firstRow.id);
    expect(result.status).toEqual(firstRow.status);
    expect(String(result.user_id)).toEqual(String(firstRow.user_id));
  });

  it('update order', async () => {
    const result = await store.update({
      id: 1,
      status: 'complete',
      user_id: 1
    });
    expect(result.id).toEqual(firstRow.id);
    expect(result.status).toEqual('complete');
    expect(String(result.user_id)).toEqual('1');
  });
  it('delete order by id', async () => {
    const result = await store.delete(2);
    expect(result).toEqual(0);
  });
});

describe('Test order endpoints responses', () => {
  let token: string;
  it('select all orders', async () => {
    const tokenResponse = await request.post('/users/login').send({
      id: 1,
      username: 'admin',
      password: '12345',
      role: 'admin'
    });
    token = 'base ' + tokenResponse.body;
    const response = await request.get('/orders').set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('select one order', async () => {
    const response = await request.get('/orders/1').set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('insert new order', async () => {
    const response = await request
      .post('/orders')
      .send({ status: 'active', user_id: 1 })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('add product in order', async () => {
    const response = await request
      .post('/orders/1/products')
      .send({ quantity: 1, product_id: 1 })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('update order', async () => {
    const response = await request
      .patch('/orders/2')
      .send({ status: 'complete', user_id: 1 })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('delete order', async () => {
    const response = await request
      .delete('/orders/2')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(204);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
});
