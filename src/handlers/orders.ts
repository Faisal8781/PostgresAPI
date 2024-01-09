import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import dotenv from 'dotenv';

dotenv.config();
const store = new OrderStore();

const index = async (req: Request, res: Response) => {
  const orders = await store.index();
  res.json({
    data: orders,
    message: 'Orders retrived successfully',
  });
};
const show = async (req: Request, res: Response) => {
  try {
    const orders = await store.show(req.params.id);
    res.json({ data: orders, message: 'Orders retrived successfully' });
  } catch (err) {
    res.json(err);
  }
};
const update = async (req: Request, res: Response) => {
  try {
    const orders = await store.update(req.body.status, req.params.id);
    res.json({ data: orders, message: 'Order updated succefully' });
  } catch (err) {
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  //@ts-ignore

  const order: Order = {
    status: req.body.status,
    user_id: req.body.user_id,
  };

  try {
    const newOrder = await store.create(order);
    res.json({
      data: { ...newOrder },
      message: 'Order Created Successfully',
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json({
      data: deleted,
      message: 'Order deleted successfully',
    });
  } catch (err) {
    res.json(err);
  }
};

const orders_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.patch('/orders/:id', update);
  app.delete('/orders/:id', destroy);
};

export default orders_routes;
