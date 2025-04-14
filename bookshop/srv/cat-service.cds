using { my.bookshop as my } from '../db/schema';

service CatalogService @(path:'/browse') {

 entity Visits as SELECT from my.Visits {
        *,
        location.name as locationName,
        status.name as statusName,
        spaces.name as spaceName
    } excluding { createdBy, modifiedBy };

    action submitOrder (visit: Visits:ID, amount: Integer);

    @odata.draft.enabled
    entity Visitors as SELECT from my.Visitors {
        *        
    } excluding { createdBy, modifiedBy };

    action assignVisitorToVisit(
        visitId: Visits:ID,
        visitorID: Visitors:ID
    ) returns Visits;

    entity Location as SELECT from my.Location {
        *        
    } excluding { createdBy, modifiedBy };


    entity visitsToVisitors as SELECT from my.visitsToVisitors {
        *        
    } excluding { createdBy, modifiedBy };

    entity Status as SELECT from my.Status {
    
         *       
    } excluding { createdBy, modifiedBy };

    entity Spaces as SELECT from my.Spaces {
    
         *       
    } excluding { createdBy, modifiedBy };

    entity Feedback as select from my.Feedback {
        *
        
    } excluding {createdBy, modifiedBy};

    entity Agenda as select from my.Agenda {
        *
        
    } excluding {createdBy, modifiedBy};
    
    action createAgendaEntry(
    visitId: Visits:ID,
    visitorID: Visitors:ID
  ) returns Agenda;

    
}
