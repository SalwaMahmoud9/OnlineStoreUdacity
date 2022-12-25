import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Test dashboard endpoints responses', () => {
  let token: string;
  it('productsInOrders', async () => {
    const tokenResponse = await request.post('/users/login').send({
      id: 1,
      username: 'admin',
      password: '12345',
      role: 'admin'
    });
    token = 'base ' + tokenResponse.body;
    const response = await request
      .get('/productsInOrders')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('mostPopularProducts', async () => {
    const response = await request
      .get('/mostPopularProducts')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('productsByCategory', async () => {
    const response = await request
      .get('/productsByCategory/complete')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('currentOrder', async () => {
    const response = await request
      .get('/ordersCurrentOrder/1')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('completedOrders', async () => {
    const response = await request
      .get('/ordersCompletedOrders/1')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('mostRecentPurchases', async () => {
    const response = await request
      .get('/mostRecentPurchases/1')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
});
