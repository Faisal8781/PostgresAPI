import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const store = new OrderStore();

const index = async (req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};
const show = async (req: Request, res: Response) => {
  const orders = await store.show(req.params.id);
  res.json(orders);
};
const update = async (req: Request, res: Response) => {
  const orders = await store.update(req.body.status, req.params.id);
  res.json('Order updated succefully');
};

const create = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  try {
    //@ts-ignore
    const order: Order = {
      status: req.body.status,
      user_id: req.body.user_id,
    };
    const newOrder = await store.create(order);
    // var token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
// const destroy = async (req: Request, res: Response) => {
//   const deleted = await store.delete(req.body.id);
//   res.json(deleted);
// };

const orders_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.put('/orders/:id', update);
  //   app.delete('/authenticate/:id', destroy);
};

export default orders_routes;
