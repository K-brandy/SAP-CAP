using { my.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

 entity Books as SELECT from my.Books {*,
   
    author.name as author,
    genre.name as genre,
   // businessPartners{ID, name, country, street, postal_code},
    } excluding { createdBy, modifiedBy };



    action submitOrder (book:Books:ID, amount: Integer);

     entity Business_Partners as select from my.Business_Partners{*,

 } excluding { createdBy, modifiedBy };

  }

