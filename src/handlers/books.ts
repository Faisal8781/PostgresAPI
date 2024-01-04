import express, { Request, Response } from 'express';
import { Book, BookStore } from '../models/books';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const store = new BookStore();

const index = async (req: Request, res: Response) => {
  const books = await store.index();
  res.json(books);
};
const show = async (req: Request, res: Response) => {
  const book = await store.show(req.params.id);
  res.json(book);
};

const create = async (req: Request, res: Response) => {
  const book: Book = {
    id: req.body.id,
    title: req.body.title,
    total_pages: req.body.total_pages,
    author: req.body.author,
    summary: req.body.summary,
  };

  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  try {
    const newBook = await store.create(book);
    res.json(newBook);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const books_routes = (app: express.Application) => {
  app.get('/books', index);
  app.get('/books/:id', show);
  app.post('/books', create);
  app.delete('/books/:id', destroy);
};

export default books_routes;
