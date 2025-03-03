using {  managed, sap } from '@sap/cds/common';
namespace my.bookshop;

entity Visits : managed {
  key ID : Integer;
  visitorName  :  String(111);
  visitDate  :  DateTime;
  email : String;
  contact  : Integer;
  purpose  : Integer;
  location  : String(111);
  visitors : Association to many Visitors on visitors.visits = $self;
  
}




entity Visitors: managed {
  
  key ID : Integer;
  name : String;
  country : String;
  street : String;
  postal_code : String;
  visits  : Association to Visits;
}
