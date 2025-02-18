using { my.bookshop as my } from '../db/schema';

service CatalogService @(path:'/browse') {
    
    // Enable draft handling for the Books entity if needed (optional)
    // @odata.draft.enabled 
    entity Books as SELECT from my.Books {
        *,
        author.name as author,
        genre.name as genre
    } excluding { createdBy, modifiedBy };

    action submitOrder (book: Books:ID, amount: Integer);

    // Enable draft handling for Business_Partners entity
    @odata.draft.enabled
    entity Business_Partners as select from my.Business_Partners { 
        *        
    } excluding { createdBy, modifiedBy };
}
