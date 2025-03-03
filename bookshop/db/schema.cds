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
  visitors : Association to Visitors;

  
//Additional info
  publicationDate : Date;       
  pageCount       : Integer;        
  language        : String(50);   
  publisher       : String(111);    
  rating          : Decimal(3,2);   
}

entity Visitors: managed {
  
  key ID : Integer;
  name : String;
  country : String;
  street : String;
  postal_code : String;
  visits  : Association to Visits;
}
