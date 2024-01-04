"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("../models/books");
const store = new books_1.BookStore();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield store.index();
    res.json(books);
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield store.show(req.params.id);
    res.json(book);
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = {
            id: req.body.id,
            title: req.body.title,
            total_pages: req.body.total_pages,
            author: req.body.author,
            summary: req.body.summary,
        };
        const newBook = yield store.create(book);
        res.json(newBook);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield store.delete(req.body.id);
    res.json(deleted);
});
const books_routes = (app) => {
    app.get('/books', index);
    app.get('/books/:id', show);
    app.post('/books', create);
    app.delete('/books/:id', destroy);
};
exports.default = books_routes;
