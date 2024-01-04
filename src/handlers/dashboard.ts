import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';
import jwt from 'jsonwebtoken';
const dashboard_routes = (app: express.Application) => {
  app.get('/products_in_orders/:id', productsInOrders);
  app.post('/order/:id/product', addProduct);
  app.get('/complete_orders/:id', completedOrderperUser);
  app.get('/all_orders/:id', OrdersperUser);
  app.get('/most_common_product', mostfiveCommonProduct);
  app.get('/quantity_product_order/:id', quantityOfProductOnOrder);
};

const dashboard = new DashboardQueries();

const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const productId: string = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);

  try {
    const addedProduct = await dashboard.addProduct(
      quantity,
      orderId,
      productId
    );
    res.json(addedProduct);
  } catch (err) {
    console.log(err);
    res.json(err);
    res.status(400);
  }
};

const completedOrderperUser = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  const userWithOrder = await dashboard.completedOrderperUser(req.params.id);
  res.json(userWithOrder);
};

const OrdersperUser = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  const userWithOrder = await dashboard.OrdersperUser(req.params.id);
  res.json(userWithOrder);
};

const productsInOrders = async (req: Request, res: Response) => {
  const productsOrders = await dashboard.productsInOrders(req.params.id);
  res.json(productsOrders);
};

const mostfiveCommonProduct = async (req: Request, res: Response) => {
  const fiveMostExpensive = await dashboard.mostfiveCommonProduct();
  res.json(fiveMostExpensive);
};

const quantityOfProductOnOrder = async (req: Request, res: Response) => {
  const quantityOfProductOnOrder = await dashboard.quantityOfProductOnOrder(
    req.params.id,
    req.body.productId
  );
  res.json(quantityOfProductOnOrder);
};
export default dashboard_routes;
