// check every query parameters
const books = require('./books');

const checkQuery = (qry) => {
  if (qry.name !== undefined || qry.reading !== undefined || qry.finished !== undefined) {
    if (qry.name !== undefined) {
      return books.filter((book) => book.name.toLowerCase().includes(qry.name.toLowerCase()));
    }
    if (qry.reading !== undefined) {
      return books.filter((book) => book.reading === (parseInt(qry.reading, 10) === 1));
    }
    if (qry.finished !== undefined) {
      return books.filter((book) => book.finished === (parseInt(qry.finished, 10) === 1));
    }
  }
  return books;
};

module.exports = { checkQuery };
