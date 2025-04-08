using { managed, sap } from '@sap/cds/common';
namespace my.bookshop;

entity Visits : managed {
    key ID : Integer;
    visitDate : DateTime;
    duration: String;  
    status : Association to Status on status.ID = statusID;
    contact : String;
    purpose : String;
    location : Association to Location on location.ID=locationID;
    visitors : Association to many visitsToVisitors on visitors.visitID = ID;
    description: String;
    spaces: Association to Spaces on spaces.ID=spaceID;
    statusID: Integer;
    locationID: Integer;
    spaceID:Integer;
    feedback: Association to many Feedback on feedback.visits = $self;
}


entity visitsToVisitors : managed {
  key visitID : Integer;
  key visitorID : Integer;
  visit : Association to Visits on visit.ID = visitID;
  visitor : Association to Visitors on visitor.ID = visitorID;
}

entity Visitors : managed {
    key ID : Integer;
    name : String;
    email: String;
    phone: Integer;
    company: String;
    country : String;
    street : String;
    postal_code : String;
    visits:Association to visitsToVisitors on visits.visitorID=ID;
    visits_ID:Integer;
    agenda: Association to Visitors on agenda.ID=agendaID;
    agendaID: Integer; 
}

 entity Agenda {
    key ID         : Integer;
    visitorID      : Integer;
    topic          : String;
    description    : String;
    outcome        : String;
    visitors       : Association to many Visitors on visitors.visits_ID = ID;
 }

entity Location : managed {
    key ID : Integer;
    name : String;
    address : String;
    postalCode : String;
    country : String;
    visits : Association to many Visits on visits.location = $self;
    spaces: Association to many Spaces on spaces.locationID = ID;
}

entity Spaces : managed {
    key ID : Integer;
    name: String;
    type: String;
    capacity: Integer;
    availability: Boolean;
    visits: Association to many Visits on visits.spaces = $self;
    location: Association to Location on location.ID = locationID;
    locationID: Integer

}
entity Status : managed {
    key ID : Integer;
    name : String;
    visits : Association to many Visits on visits.status = $self;
}
entity Feedback {
    key ID         : UUID;
    feedback       : String;
    rating         : Integer;
    visitID        : Integer;
    visits :  Association to Visits on visits.ID=visitID;

}