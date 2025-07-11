/**
 * Handler
 * Author: Wildan Aqlis
 */

const { nanoid } = require('nanoid');
const books = require('./books');

// ✅ Tambah Buku
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary,
    publisher, pageCount, readPage,
    finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.find((book) => book.id === id);

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

// ✅ Tampilkan semua buku (dengan query support)
const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading === '0' || reading === '1') {
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === (reading === '1')
    );
  }

  if (finished === '0' || finished === '1') {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === '1')
    );
  }

  const responseBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: responseBooks,
    },
  }).code(200);
};

// ✅ Ambil detail buku by ID
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.find((b) => b.id === id);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book,
    },
  }).code(200);
};

// ✅ Edit buku by ID
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  books[index] = {
    ...books[index],
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
    finished: pageCount === readPage,
    updatedAt: new Date().toISOString(),
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

// ✅ Hapus buku by ID
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
