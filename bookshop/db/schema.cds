using { managed, sap } from '@sap/cds/common';
namespace my.bookshop;

entity Visits : managed {
    key ID : Integer;
    visitDate : DateTime;   
    status : Association to Status;
    contact : String;
    purpose : String;
    location : Association to Location;
    visitors : Association to many Visitors on visitors.visits = $self;
    description: String;
}

entity Location : managed {
    key ID : Integer;
    name : String;
    address : String;
    postalCode : String;
    country : String;
    visits : Association to many Visits on visits.location = $self;
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
    spaces: Association to Spaces;
}

entity Spaces : managed {
    key ID : Integer;
    name: String;
    type: String;
    capacity: Integer;
    availability: Boolean;
    visitors: Association to many Visitors on visitors.spaces = $self;
}
