using { my.bookshop as my } from '../db/schema';

service CatalogService @(path:'/browse') {

    entity Visits as SELECT from my.Visits {
        
        *,
    
    } excluding { createdBy, modifiedBy };

    action submitOrder (visit: Visits:ID, amount: Integer);


    @odata.draft.enabled
    entity Visitors as select from my.Visitors { 
        *        
    } excluding { createdBy, modifiedBy };
    action assignBusinessPartnerToVisit(
        visitId:Visits:ID,
        visitorID: Visitors:ID


        ) returns Visits;
}
