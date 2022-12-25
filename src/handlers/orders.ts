import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { ProductStore } from '../models/product';
import { User, UserStore } from '../models/user';
import tokenAuthentication from '../middlewares/tokenAuthentication'; //to use token in specified endpoints(index, show, and create)
import userAuthentication from '../middlewares/userAuthentication'; //to allow admin user only to add, update, and delete user
import jwt_decode from 'jwt-decode';
import { DashboardQueries } from '../services/dashboard';

const dashboardQueries = new DashboardQueries();
const orderStore = new OrderStore();

//get all orders
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrders: Order[] = await orderStore.index();
    res.json(newOrders);
  } catch (err) {
    res.status(500).send(err);
  }
};

//get order by id
const show = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const order: Order | undefined = await orderStore.show(id);

      if (order) {
        res.json(order);
      } else {
        res.status(404).send('resource not found');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//post order, adds a new order must send status, user_id
const create = async (req: Request, res: Response): Promise<void> => {
  const status: string | undefined = req.body.status;
  const user_id: number | undefined = req.body.user_id;
  const token = (req.headers.authorization as string).split(' ')[1];

  type userOfUser = { user: User };
  const getUser: userOfUser = jwt_decode(token);
  if ((getUser.user as User).id == user_id) {
    //  user of token is the user for order
    try {
      //no status or user_id sent to edit
      if (!('status' in req.body || 'user_id' in req.body)) {
        res.status(400).send('missing parameters');
      }
      //status is sent but not as a string
      else if (
        'status' in req.body &&
        (typeof status != 'string' ||
          !(status == 'active' || status == 'complete'))
      ) {
        res
          .status(400)
          .send('status must be a string and has value active or complete');
      }
      //user_id is sent but not as a number
      else if ('user_id' in req.body && typeof user_id != 'number') {
        res.status(400).send('user_id must be a number');
      } else {
        const userStore = new UserStore();
        const result = await userStore.show(user_id as number);
        if (result != undefined && result.id && result.id == user_id) {
          if (
            ((await orderStore.showOrderStatus(user_id)) == 0 &&
              status == 'active') ||
            status == 'complete'
          ) {
            const newOrder = await orderStore.create({
              status: status as string,
              user_id: user_id as number
            });
            res.json(newOrder);
          } else {
            res.status(406).send('You can not add more than one active order');
          }
        } else {
          res.status(400).send('user_id not found');
        }
      }
    } catch {
      res.status(400).send('bad request');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
};

//patch order, edit order must send status, user_id
const update = async (req: Request, res: Response): Promise<void> => {
  //ensure order is found
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const status: string | undefined = req.body.status;
      const user_id: number | undefined = req.body.user_id;
      type userOfUser = { user: User };
      const token = (req.headers.authorization as string).split(' ')[1];

      const getUser: userOfUser = jwt_decode(token);
      if ((getUser.user as User).id == user_id) {
        //  user of token is the user for order
        //no status or user_id sent to edit
        if (!('status' in req.body || 'user_id' in req.body)) {
          res.status(400).send('missing parameters');
        }
        //status is sent but not as a string
        else if (
          'status' in req.body &&
          (typeof status != 'string' ||
            !(status == 'active' || status == 'complete'))
        ) {
          res
            .status(400)
            .send('status must be a string and has value active or complete');
        }
        //user_id is sent but not as a number
        else if ('user_id' in req.body && typeof user_id != 'number') {
          res.status(400).send('user_id must be a number');
        } else {
          const userStore = new UserStore();
          const result = await userStore.show(user_id as number);
          if (result && result.id == user_id) {
            const numOfUsers = await orderStore.showOrderStatus(
              user_id as number,
              id as number
            );
            if (
              (numOfUsers == 0 && status == 'active') ||
              status == 'complete'
            ) {
              const order = await orderStore.update({
                id: id,
                status: status as string,
                user_id: user_id as number
              });
              res.json(order);
            } else {
              res
                .status(406)
                .send('You can not add more than one active order');
            }
          } else {
            res.status(400).send('user_id not found');
          }
        }
      } else {
        res.status(401).send('Unauthorized');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//delete order
const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const result = await orderStore.showOrder(id as number);
      if (result == undefined) {
        const deleted: number | undefined = await orderStore.delete(id);
        if (deleted) {
          res.sendStatus(204);
        } else {
          res.status(404).send('resource not found');
        }
      } else {
        res.status(424).send('can not delete, order is used');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//post order`s products
const addProduct = async (req: Request, res: Response): Promise<void> => {
  const quantity: number | undefined = req.body.quantity;
  const product_id: number | undefined = req.body.product_id;
  const order_id: number = parseInt(req.params.id as string);
  if (order_id) {
    try {
      //no quantity  or product_id sent to edit
      if (!('quantity' in req.body || 'product_id' in req.body)) {
        res.status(400).send('missing parameters');
      }
      //quantity is sent but not as a number
      else if ('quantity' in req.body && typeof quantity != 'number') {
        res.status(400).send('quantity must be a number');
      }
      //product_id is sent but not as a number
      else if ('product_id' in req.body && typeof product_id != 'number') {
        res.status(400).send('product_id must be a number');
      } else {
        const resultOrder = await orderStore.show(order_id);
        const productStore = new ProductStore();
        const resultProduct = await productStore.show(product_id as number);

        if (
          resultOrder != undefined &&
          resultOrder.id &&
          resultOrder.id == order_id &&
          resultProduct != undefined &&
          resultProduct.id &&
          resultProduct.id == product_id
        ) {
          const newOrder = await orderStore.addProduct(
            Number(quantity),
            Number(order_id),
            Number(product_id)
          );
          res.json(newOrder);
        } else {
          res.status(400).send('order_id or product_id not found');
        }
      }
    } catch {
      res.status(400).send('bad request');
    }
  } else {
    res.sendStatus(404);
  }
};

// - Current Order by user (args: user id)[token required]
const currentOrder = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const result = await dashboardQueries.currentOrder(id);
      res.json(result);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

// - [OPTIONAL] Completed Orders by user (args: user id)[token required]
const completedOrders = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const result = await dashboardQueries.completedOrders(id);
      res.json(result);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

const orderHandlers = (app: express.Application): void => {
  app.post('/orders', tokenAuthentication, create); //must use token
  app.post('/orders/:id/products', tokenAuthentication, addProduct); //must use token
  app.get('/orders', tokenAuthentication, index); //must use token
  app.get('/orders/:id', tokenAuthentication, show); //must use token
  app.patch('/orders/:id', userAuthentication, tokenAuthentication, update); //update by admin users only
  app.delete(
    '/orders/:id',
    userAuthentication,
    tokenAuthentication,
    deleteOrder
  ); //delete by admin users only
  app.get('/ordersCurrentOrder/:id', tokenAuthentication, currentOrder); //must use token
  app.get('/ordersCompletedOrders/:id', tokenAuthentication, completedOrders); //must use token
};
export default orderHandlers;
