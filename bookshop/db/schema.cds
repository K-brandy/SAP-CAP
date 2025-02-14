using { Currency, managed, sap } from '@sap/cds/common';
namespace my.bookshop;

entity Books : managed {
  key ID : Integer;
  title  :  String(111);
  descr  :  String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
  businessPartners : Association to Business_Partners;

  
//Additional info
  publicationDate : Date;       
  pageCount       : Integer;        
  language        : String(50);   
  publisher       : String(111);    
  rating          : Decimal(3,2);   
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  books  : Association to many Books on books.author = $self;
  email: String;
  dateOfBirth : Date;
  nationality: String;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}

entity Business_Partners: managed{
  key ID : Integer;
  name : String;
  country : String;
  street : String;
  postal_code : String;
  books  : Association to many Books on books.businessPartners = $self;

}