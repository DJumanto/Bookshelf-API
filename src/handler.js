/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');
const { checkQuery } = require('./queryChecker');

const indexHandler = (req, res) => {
  const response = res.response({
    status: 200,
    message: 'this is index',
    data: {
      notes: 'HELLOO',
    },
  });
  response.code(200);
  return response;
};

const addNewBook = (req, res) => {
  // get and set all needed data from payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // if name is undefined, then send bad request
  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // if readPage is more than pageCount, send bad value
  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // check if the book is successfully added
  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  // send code 500 if book is failed to added
  const response = res.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (req, res) => {
  //  send empty erray if books length is equal to 0
  if (books.length === 0) {
    const response = res.response({
      status: 'success',
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }

  // query parameters
  const { name, reading, finished } = req.query;

  const bookTemp = checkQuery({ name, reading, finished });
  const bookDatas = [];

  bookTemp.forEach((book) => {
    const { id, name, publisher } = book;
    bookDatas.push({ id, name, publisher });
  });

  // send all books if books length is more than 0
  const response = res.response({
    status: 'success',
    data: {
      books: bookDatas,
    },
  });

  response.code(200);
  return response;
};

const getBookById = (req, res) => {
  const { bookId } = req.params;
  const book = books.filter((b) => b.id === bookId)[0];

  // if the book bookId is undefined, send code 404
  if (book === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // else, send the book data
  const response = res.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBookById = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);

  // if the book id is undefined, send code 404
  if (index === -1) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // laod all bopok data from payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  // if client didn't send name, send error message
  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // if readPage is higher then pageCount, send error message
  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // if there is no error, update the book
  const updatedAt = new Date().toISOString();
  const finished = (pageCount === readPage);

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    updatedAt,
    finished,
    reading,
    pageCount,
    readPage,
  };

  // send success message after all information has been fullfiled
  const response = res.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookById = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);
  // if the book id is undefined, send code 404
  if (index === -1) {
    const response = res.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = res.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  indexHandler,
  addNewBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
