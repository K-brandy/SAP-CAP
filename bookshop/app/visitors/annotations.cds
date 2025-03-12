using CatalogService as service from '../../srv/cat-service';
annotate service.Visitors with @(

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
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'company',
                Value : company,
            },
            {
                $Type : 'UI.DataField',
                Label : 'country',
                Value : country,
            },
            {
                $Type : 'UI.DataField',
                Label : 'street',
                Value : street,
            },
            {
                $Type : 'UI.DataField',
                Label : 'postal_code',
                Value : postal_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'visits_ID',
                Value : visits_ID,
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
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'company',
            Value : company,
        },
        {
            $Type : 'UI.DataField',
            Label : 'country',
            Value : country,
        },
    ],
);

// annotate service.Visitors with {
//     visits @Common.ValueList : {
//         $Type : 'Common.ValueListType',
//         CollectionPath : 'Visits',
//         Parameters : [
//             {
//                 $Type : 'Common.ValueListParameterInOut',
//                 LocalDataProperty : visits_ID,
//                 ValueListProperty : 'ID',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'visitDate',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'contact',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'purpose',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'description',
//             },
//         ],
//     }
// };

