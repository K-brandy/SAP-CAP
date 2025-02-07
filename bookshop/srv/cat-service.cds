using { my.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  @readonly entity Books as SELECT from my.Books {*,
   
    author.name as author,
    genre.name as genre
    } excluding { createdBy, modifiedBy };

    action submitOrder (book:Books:ID, amount: Integer);
  }

