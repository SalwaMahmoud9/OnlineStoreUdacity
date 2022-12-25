import supertest from 'supertest';
import app from '../server';
import { User, UserStore } from '../models/user';

const request = supertest(app);
const store = new UserStore();

describe('Store Test User Functions exist', () => {
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

describe('Store Test User Functions work', () => {
  const firstRow: User = {
    id: 1,
    first_name: 'admin2',
    last_name: 'admin2',
    user_name: 'admin2',
    role: 'admin',
    password: '123'
  };
  it('create to add user', async () => {
    const result = await store.create({
      first_name: 'admin2',
      last_name: 'admin2',
      user_name: 'admin2',
      role: 'admin',
      password: '123'
    });
    expect(result.id).toEqual(firstRow.id);
    expect(result.first_name).toEqual(firstRow.first_name);
    expect(result.last_name).toEqual(firstRow.last_name);
    expect(result.user_name).toEqual(firstRow.user_name);
    expect(result.role).toEqual(firstRow.role);
    expect(result.password).not.toEqual(firstRow.password);
    expect(result.password).not.toEqual('');
  });

  it('get all users', async () => {
    const result = await store.index();

    expect(result[0].id).toEqual(firstRow.id);
    expect(result[0].first_name).toEqual(firstRow.first_name);
    expect(result[0].last_name).toEqual(firstRow.last_name);
    expect(result[0].user_name).toEqual(firstRow.user_name);
    expect(result[0].role).toEqual(firstRow.role);
    expect(result[0].password).not.toEqual(firstRow.password);
    expect(result[0].password).not.toEqual('');
  });

  it('get user by id', async () => {
    const result = await store.show(1);
    // expect(result).toEqual(firstRow);
    expect(result.id).toEqual(firstRow.id);
    expect(result.first_name).toEqual(firstRow.first_name);
    expect(result.last_name).toEqual(firstRow.last_name);
    expect(result.user_name).toEqual(firstRow.user_name);
    expect(result.role).toEqual(firstRow.role);
    expect(result.password).not.toEqual(firstRow.password);
    expect(result.password).not.toEqual('');
  });

  it('update user', async () => {
    const result = await store.update({
      id: 1,
      first_name: 'admin',
      last_name: 'admin',
      user_name: 'admin',
      role: 'admin',
      password: '12345'
    });
    // expect(result).toEqual({id:1, first_name:'admin',last_name:'admin',user_name:'admin',role:'admin',password:'12345'});
    expect(result.id).toEqual(firstRow.id);
    expect(result.first_name).toEqual('admin');
    expect(result.last_name).toEqual('admin');
    expect(result.user_name).toEqual('admin');
    expect(result.role).toEqual('admin');
    expect(result.password).not.toEqual('12345');
    expect(result.password).not.toEqual('');
  });
  it('delete user by id', async () => {
    const result = await store.delete(2);
    expect(result).toEqual(0);
  });
});

describe('Test user endpoints responses', () => {
  let token: string;
  it('select all users', async () => {
    const tokenResponse = await request.post('/users/login').send({
      id: 1,
      username: 'admin',
      password: '12345',
      role: 'admin'
    });
    token = 'base ' + tokenResponse.body;
    const response = await request.get('/users').set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is defined
    expect(response.body).toBeDefined();
  });
  it('select one user', async () => {
    const response = await request.get('/users/1').set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('insert new user', async () => {
    const response = await request
      .post('/users')
      .send({
        first_name: 'user',
        last_name: 'user',
        user_name: 'user',
        role: 'user',
        password: '123'
      })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('update user', async () => {
    const response = await request
      .patch('/users/2')
      .send({
        first_name: 'user2',
        last_name: 'user2',
        user_name: 'user2',
        role: 'admin',
        password: '1234'
      })
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(200);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
  it('delete user', async () => {
    const response = await request
      .delete('/users/2')
      .set('Authorization', token);
    //status check
    expect(response.status).toBe(204);
    // body`s type is object
    expect(typeof response.body).toEqual('object');
    // body is notNull
    expect(response.body).not.toBeNull();
  });
});
