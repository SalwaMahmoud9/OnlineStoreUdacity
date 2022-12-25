import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import { OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';
import tokenAuthentication from '../middlewares/tokenAuthentication'; //to use token in specified endpoints(index, show, and create)
import userAuthentication from '../middlewares/userAuthentication'; //to allow admin user only to add, update, and delete user
import { DashboardQueries } from '../services/dashboard';

const dashboardQueries = new DashboardQueries();
const userStore = new UserStore();

//get toekn by using user  ex, check valid data:
// {
//   "username": "admin",
//   "password": "12345"
// }
const login = async (req: Request, res: Response): Promise<void> => {
  const username: string | undefined = req.body.username as string;
  const password: string | undefined = req.body.password as string;
  const tokenSecret = process.env.TOKEN_SECRET as string;
  if (
    username != undefined &&
    password != undefined &&
    username != '' &&
    password != ''
  ) {
    try {
      const checkLogin = await userStore.authenticate(username, password);
      if (checkLogin != null) {
        const token = jwt.sign(
          {
            user: {
              id: checkLogin.id,
              username: checkLogin.user_name,
              role: checkLogin.role
            }
          },
          tokenSecret
        );

        res.json(token);
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

//get all users
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUsers: User[] = await userStore.index();
    res.json(newUsers);
  } catch (err) {
    res.status(500).send(err);
  }
};

//get user by id
const show = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const user: User | undefined = await userStore.show(id);

      if (user) {
        res.json(user);
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

//post user, adds a new user must send firstname, lastname, and password
// role has default user
//username has default concatenation of firstname, and lastname
const create = async (req: Request, res: Response): Promise<void> => {
  const first_name: string | undefined = req.body.first_name;
  const last_name: string | undefined = req.body.last_name;
  let user_name: string;
  user_name = '';
  let role: string;
  role = 'user';

  const password: string | undefined = req.body.password;
  try {
    //no first_name or last_name or role or password sent to edit
    if (
      !(
        'first_name' in req.body ||
        'last_name' in req.body ||
        'password' in req.body
      )
    ) {
      res.status(400).send('missing parameters');
    }
    //first_name is sent but not as a string
    else if ('first_name' in req.body && typeof first_name != 'string') {
      res.status(400).send('first_name must be a string');
    }
    //last_name is sent but not as a string
    else if ('last_name' in req.body && typeof last_name != 'string') {
      res.status(400).send('last_name must be a string');
    }
    //password is sent but not as a string
    else if ('password' in req.body && typeof password != 'string') {
      res.status(400).send('password must be a string');
    } else {
      //user_name
      if ('user_name' in req.body && typeof user_name == 'string') {
        user_name = req.body.user_name;
      } else {
        user_name = ((req.body.first_name as string) +
          req.body.last_name) as string;
      }
      if ('role' in req.body && typeof role == 'string' && role == 'admin') {
        role = req.body.role;
      }
      const newUser = await userStore.create({
        first_name: first_name as string,
        last_name: last_name as string,
        user_name: user_name,
        role: role as string,
        password: password as string
      });
      res.json(newUser);
    }
  } catch {
    res.status(400).send('bad request');
  }
};

//patch user, edit a user must send id, firstname, lastname, and password
// role has default user
//username has default concatenation of firstname, and lastname
const update = async (req: Request, res: Response): Promise<void> => {
  //ensure user is found
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const first_name: string | undefined = req.body.first_name;
      const last_name: string | undefined = req.body.last_name;
      let user_name: string;
      user_name = '';
      let role: string;
      role = 'user';
      const password: string | undefined = req.body.password;
      //no first_name or last_name or role or password sent to edit
      if (
        !(
          'first_name' in req.body ||
          'last_name' in req.body ||
          'password' in req.body
        )
      ) {
        res.status(400).send('missing parameters');
      }
      //first_name is sent but not as a string
      else if ('first_name' in req.body && typeof first_name != 'string') {
        res.status(400).send('first_name must be a string');
      }
      //last_name is sent but not as a string
      else if ('last_name' in req.body && typeof last_name != 'string') {
        res.status(400).send('last_name must be a string');
      }

      //password is sent but not as a string
      else if ('password' in req.body && typeof password != 'string') {
        res.status(400).send('password must be a string');
      } else {
        //user_name
        if ('user_name' in req.body && typeof user_name == 'string') {
          user_name = req.body.user_name;
        } else {
          user_name = ((req.body.first_name as string) +
            req.body.last_name) as string;
        }
        if ('role' in req.body && typeof role == 'string' && role == 'admin') {
          role = req.body.role;
        }
        const user = await userStore.update({
          id: id,
          first_name: first_name as string,
          last_name: last_name as string,
          user_name: user_name,
          role: role as string,
          password: password as string
        });
        res.json(user);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//delete a user must send id
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const orderStore = new OrderStore();

      const result = await orderStore.showUser(id as number);
      if (result == undefined) {
        const deleted: number | undefined = await userStore.delete(id);
        if (deleted) {
          res.sendStatus(204);
        } else {
          res.status(404).send('resource not found');
        }
      } else {
        res.status(424).send('can not delete, user is used');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};
// Add a users 5 most recent purchases to the data being sent back from the user show endpoint (/users/id)
const mostRecentPurchases = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const result = await dashboardQueries.mostRecentPurchases(id);
      res.json(result);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};
const userHandlers = (app: express.Application): void => {
  app.post('/users', create); //create without token usage
  app.post('/users/login', login);
  app.get('/users', tokenAuthentication, index); //must use token
  app.get('/users/:id', tokenAuthentication, show); //must use token
  app.patch('/users/:id', userAuthentication, tokenAuthentication, update); //update by admin users only
  app.delete('/users/:id', userAuthentication, tokenAuthentication, deleteUser); //delete by admin users only
  app.get('/mostRecentPurchases/:id', tokenAuthentication, mostRecentPurchases); //must use token
};
export default userHandlers;
