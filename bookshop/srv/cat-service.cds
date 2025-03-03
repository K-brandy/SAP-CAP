using { my.bookshop as my } from '../db/schema';

service CatalogService @(path:'/browse') {

    entity Visits as SELECT from my.Visits {
        key ID,
        *,
        visitors.name as visitors
    } excluding { createdAt, modifiedAt };

    action submitOrder(visit: Visits:ID, amount: Integer) returns String;

    @odata.draft.enabled
    entity Visitors as SELECT from my.Visitors { 
        *        
    } excluding { createdAt, modifiedAt };

    action assignVisitorToVisit(
        visitId: Visits:ID,
        visitorID: Visitors:ID
    ) returns Visits;

}
