const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(10);

  function isFinished() {
    if (pageCount === readPage) {
      return true;
    }

    return false;
  }

  const finished = isFinished();

  const insertedAt = new Date().toISOString();

  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (name !== undefined) {
    if (readPage <= pageCount) {
      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });

        response.code(201);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan!',
      });

      response.code(500);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });

  response.code(400);
  return response;
};

const getAllBooksHandler = (request) => {
  const { reading, finished, name } = request.query;

  const bookIsReadingTrue = books.filter((book) => book.reading === true);
  const bookIsReadingFalse = books.filter((book) => book.reading === false);
  const bookIsFinishedTrue = books.filter((book) => book.finished === true);
  const bookIsFinishedFalse = books.filter((book) => book.finished === false);

  if (reading === '1') {
    return ({
      status: 'success',
      data: {
        books: bookIsReadingTrue.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
  }

  if (reading === '0') {
    return ({
      status: 'success',
      data: {
        books: bookIsReadingFalse.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
  }

  if (finished === '1') {
    return ({
      status: 'success',
      data: {
        books: bookIsFinishedTrue.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
  }

  if (finished === '0') {
    return ({
      status: 'success',
      data: {
        books: bookIsFinishedFalse.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
  }

  if (name !== undefined) {
    const nameCase = name.toUpperCase();

    return ({
      status: 'success',
      data: {
        books: books.filter((book) => book.name.toUpperCase().includes(nameCase)).map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
  }

  return ({
    status: 'success',
    data: {
      books: books.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      })),
    },
  });
};

const getBookDetails = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((buku) => buku.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name !== undefined) {
    if (readPage <= pageCount) {
      const index = books.findIndex((book) => book.id === bookId);
      if (index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
        };
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });

      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookDetails, editBookByIdHandler, deleteBookByIdHandler,
};
