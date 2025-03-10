using { managed, sap } from '@sap/cds/common';
namespace my.bookshop;

entity Visits : managed {
    key ID : Integer;
    visitDate : DateTime;   
    status : Association to Status on status.ID = statusID;
    contact : String;
    purpose : String;
    location : Association to Location on location.ID=locationID;
    visitors : Association to many Visitors on visitors.visits = $self;
    description: String;
    spaces: Association to Spaces on spaces.ID=spaceID;
    statusID: Integer;
    locationID: Integer;
    spaceID:Integer;
   
}

entity Location : managed {
    key ID : Integer;
    name : String;
    address : String;
    postalCode : String;
    country : String;
    visits : Association to many Visits on visits.location = $self;
    spaces: Association to Spaces on spaces.ID=spaceID;
    spaceID: Integer
}

entity Spaces : managed {
    key ID : Integer;
    name: String;
    type: String;
    capacity: Integer;
    availability: Boolean;
    visits: Association to many Visits on visits.spaces = $self;
    location: Association to many Location on location.spaces = $self;
    locationID: Integer

}
entity Status : managed {
    key ID : Integer;
    name : String;
    visits : Association to many Visits on visits.status = $self;


}

entity Visitors : managed {
    key ID : Integer;
    name : String;
    email: String;
    company: String;
    country : String;
    street : String;
    postal_code : String;
    visits : Association to Visits;
   
}


