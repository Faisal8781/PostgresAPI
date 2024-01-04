import express, { Request, Response } from 'express';
import { User, Users } from '../models/users';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const { TOKEN_SECRET } = process.env;
const store = new Users();

const index = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  const users = await store.index();
  res.json(users);
};
const show = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  const user = await store.show(req.params.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user: User = {
      firstName: req.body.firstName,
      password: req.body.password,
    };
    const authUser = await store.authenticate(user.firstName, user.password);
    res.json(authUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// const destroy = async (req: Request, res: Response) => {
//   const deleted = await store.delete(req.body.id);
//   res.json(deleted);
// };

const users_routes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  //   app.delete('/authenticate/:id', destroy);
};

export default users_routes;
