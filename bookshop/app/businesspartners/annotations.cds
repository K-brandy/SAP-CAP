using CatalogService as service from '../../srv/cat-service';
annotate service.Business_Partners with @(
    
    UI.SelectionFields : [
        name,
        ID,
        country,
    ],

 
     
    UI.FieldGroup #GeneratedGroup : {
        
        
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Country',
                Value : country,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Street',
                Value : street,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Postal Code',
                Value : postal_code,
        
            },

        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [


        {
            $Type : 'UI.DataField',
            Label : 'ID',
            Value : ID,
            
        },
        {
            $Type : 'UI.DataField',
            Label : 'Name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Country',
            Value : country,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Street',
            Value : street,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Postal Code',
            Value : postal_code,
        },
    ],
);

// annotate service.Business_Partners with {
//     books @Common.ValueList : {
//         $Type : 'Common.ValueListType',
//         CollectionPath : 'Books',
//         Parameters : [
//             {
//                 $Type : 'Common.ValueListParameterInOut',
//                 LocalDataProperty : books_ID,
//                 ValueListProperty : 'ID',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'title',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'descr',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'author',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'genre',
//             },
//         ],
//     }
// };

