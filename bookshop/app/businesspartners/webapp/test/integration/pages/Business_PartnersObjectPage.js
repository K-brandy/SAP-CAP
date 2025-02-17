sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'ns.businesspartners',
            componentId: 'Business_PartnersObjectPage',
            contextPath: '/Business_Partners'
        },
        CustomPageDefinitions
    );
});