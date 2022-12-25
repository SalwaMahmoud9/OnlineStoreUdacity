import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { OrderStore } from '../models/order';
import tokenAuthentication from '../middlewares/tokenAuthentication'; //to use token in specified endpoints(index, show, and create)
import userAuthentication from '../middlewares/userAuthentication'; //to allow admin user only to add, update, and delete user
import { DashboardQueries } from '../services/dashboard';

const dashboardQueries = new DashboardQueries();
const productStore = new ProductStore();

//get all products
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProducts: Product[] = await productStore.index();
    res.json(newProducts);
  } catch (err) {
    res.status(500).send(err);
  }
};

//get product by id
const show = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const product: Product | undefined = await productStore.show(id);

      if (product) {
        res.json(product);
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

//post product, adds a new product must send name, price
// category optional
const create = async (req: Request, res: Response): Promise<void> => {
  const name: string | undefined = req.body.name;
  const price: number | undefined = req.body.price;
  let category: string;
  category = '';
  try {
    //category
    if ('category' in req.body && typeof category == 'string') {
      category = req.body.category;
    }
    //no name or price sent to edit
    if (!('name' in req.body || 'price' in req.body)) {
      res.status(400).send('missing parameters');
    }
    //name is sent but not as a string
    else if ('name' in req.body && typeof name != 'string') {
      res.status(400).send('name must be a string');
    }
    //price is sent but not as a number
    else if ('price' in req.body && typeof price != 'number') {
      res.status(400).send('price must be a number');
    } else {
      const newProduct = await productStore.create({
        name: name as string,
        price: price as number,
        category: category
      });
      res.json(newProduct);
    }
  } catch {
    res.status(400).send('bad request');
  }
};
//patch product, edit a product must send name, price
// category optional
const update = async (req: Request, res: Response): Promise<void> => {
  //ensure product is found
  const id: number = parseInt(req.params.id as string);

  if (id) {
    try {
      const name: string | undefined = req.body.name;
      const price: number | undefined = req.body.price;
      let category: string;
      category = '';

      //category
      if ('category' in req.body && typeof category == 'string') {
        category = req.body.category;
      }
      //no name or price sent to edit
      if (!('name' in req.body || 'price' in req.body)) {
        res.status(400).send('missing parameters');
      }
      //name is sent but not as a string
      else if ('name' in req.body && typeof name != 'string') {
        res.status(400).send('name must be a string');
      }
      //price is sent but not as a number
      else if ('price' in req.body && typeof price != 'number') {
        res.status(400).send('price must be a number');
      } else {
        const product = await productStore.update({
          id: id,
          name: name as string,
          price: price as number,
          category: category
        });
        res.json(product);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//delete a product must send id
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const orderStore = new OrderStore();

      const result = await orderStore.showProduct(id as number);
      if (result == undefined) {
        const deleted: number | undefined = await productStore.delete(id);
        if (deleted) {
          res.sendStatus(204);
        } else {
          res.status(404).send('resource not found');
        }
      } else {
        res.status(424).send('can not delete, product is used');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};
// - [OPTIONAL] Top 5 most popular products
const mostPopularProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await dashboardQueries.mostPopularProducts();
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

// - [OPTIONAL] Products by category (args: product category)
const productsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category: string = req.params.category;
  if (category && category != '') {
    try {
      const result = await dashboardQueries.productsByCategory(category);
      res.json(result);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};
// Get all products that have been included in orders
const productsInOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await dashboardQueries.productsInOrders();
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};
const productHandlers = (app: express.Application): void => {
  app.post('/products', tokenAuthentication, create); //must use token,create by admin users only
  app.get('/products', index); //must use token
  app.get('/products/:id', show); //must use token
  app.patch('/products/:id', userAuthentication, tokenAuthentication, update); //update by admin users only
  app.delete(
    '/products/:id',
    userAuthentication,
    tokenAuthentication,
    deleteProduct
  ); //delete by admin users only
  app.get('/mostPopularProducts', tokenAuthentication, mostPopularProducts); //must use token
  app.get(
    '/productsByCategory/:category',
    tokenAuthentication,
    productsByCategory
  ); //must use token
  app.get('/productsInOrders', tokenAuthentication, productsInOrders); //must use token
};
export default productHandlers;
