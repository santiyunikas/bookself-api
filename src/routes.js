const {
    addBook,
    getAllBook,
    getBookWithId,
    putABook,
    deleteABook
} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookWithId
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: putABook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteABook
    }
];

module.exports = routes;