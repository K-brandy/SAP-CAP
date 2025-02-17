using CatalogService as service from '../../srv/cat-service';
annotate service.Business_Partners with @(
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
                Label : 'books_ID',
                Value : books_ID,
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
    ],
);

annotate service.Business_Partners with {
    books @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Books',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : books_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'title',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'descr',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'author',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'genre',
            },
        ],
    }
};

