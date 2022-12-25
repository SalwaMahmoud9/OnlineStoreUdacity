import express, { Request, Response } from 'express';
import userHandlers from './handlers/users';
import productHandlers from './handlers/products';
import orderHandlers from './handlers/orders';

const app: express.Application = express();

app.use(express.json()); //instead of body parser

userHandlers(app);
productHandlers(app);
orderHandlers(app);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log(`starting app on: http://127.0.0.1:3000`);
});
export default app;
