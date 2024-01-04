import express, { Request, Response } from 'express';
import { Product, ProductCart } from '../models/products';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const store = new ProductCart();

const index = async (req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};
const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  //@ts-ignore
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  };

  try {
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const byCategory = async (req: Request, res: Response) => {
  const products = await store.byCategory(req.body.category);
  res.json(products);
};

const products_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.delete('/products/:id', destroy);
  app.get('/category', byCategory);
};

export default products_routes;
