const { nanoid } = require('nanoid');
const books = [];

const addBook = (request, h) => {
    const id = nanoid(16);
    const {
        name = null,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    
    let finished = false;
    if (pageCount === readPage) {
        finished = true;
    }
    
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    if (name === null || name === '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id
          }
        });
        response.code(201);
        return response;
    }
    
    const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
          });
    response.code(500);
    return response;
}

const getAllBook = (request, h) => {
    const temp = books.map(item => {
        const container = {};
    
        container['id'] = item.id;
        container['name'] = item.name;
        container['publisher'] = item.publisher;
    
        return container;
    });

    const { name } = request.query;
    if (name !== undefined) {
        const response = h.response({
        status: 'success',
        data: {
            books: books
            .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
            .map((it) => ({
                id: it.id,
                name: it.name,
                publisher: it.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }

    const { reading } = request.query;
    if (reading == 0) {
        const response = h.response({
            status: 'success',
            data: {
                'sedang tidak dibaca': books
                    .filter((book) => book.reading === false)
                    .map((it) => ({
                        id: it.id,
                        name: it.name,
                        publisher: it.publisher,
                    })),
                books: temp
            }
        });
        response.code(200);
        return response;
    } else if (reading == 1) {
        const response = h.response({
            status: 'success',
            data: {
                'sedang dibaca': books
                    .filter((book) => book.reading === true)
                    .map((it) => ({
                        id: it.id,
                        name: it.name,
                        publisher: it.publisher,
                    })),
                books: temp
            }
        });
        response.code(200);
        return response;
    }

    const { finished } = request.query;
    if (finished == 0) {
        const response = h.response({
            status: 'success',
            data: {
                'belum selesai dibaca': books
                    .filter((book) => book.finished === false)
                    .map((it) => ({
                        id: it.id,
                        name: it.name,
                        publisher: it.publisher,
                    })),
                books: temp
            }
        });
        response.code(200);
        return response;
    } else if (finished == 1) {
        const response = h.response({
            status: 'success',
            data: {
                'sudah selesai dibaca': books
                    .filter((book) => book.finished === true)
                    .map((it) => ({
                        id: it.id,
                        name: it.name,
                        publisher: it.publisher,
                    })),
                books: temp
            }
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: temp
        }
    });
    response.code(200);
    return response;
}

const getBookWithId = (request, h) => {
    const { bookId } = request.params;
  
    const book = books.filter((b) => b.id === bookId)[0];
  
   if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book
        }
      };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
    response.code(404);
    return response;
}

const putABook = (request, h) => {
    const { bookId } = request.params;

    const {
        name = null,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);
  
    if (name === null || name === '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

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
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      });
    response.code(404);
    return response;
}

const deleteABook = (request, h) => {
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
}

module.exports = {
    addBook,
    getAllBook,
    getBookWithId,
    putABook,
    deleteABook,
};


